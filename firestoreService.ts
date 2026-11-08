import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadString, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from './config';
import { Product, CartItem, OrderDetails } from '../types/adega';
import { INITIAL_PRODUCTS } from '../data/initialCatalog';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// PRODUCTS SERVICES
// -------------------------------------------------------------

export function subscribeProducts(onUpdate: (products: Product[]) => void) {
  const productsRef = collection(db, 'products');
  let isSeeding = false;

  return onSnapshot(
    productsRef,
    async (snapshot) => {
      if (snapshot.empty) {
        onUpdate(INITIAL_PRODUCTS);
        if (!isSeeding) {
          isSeeding = true;
          try {
            await seedInitialProducts();
          } catch (e) {
            console.warn('Seeding notice:', e);
          } finally {
            isSeeding = false;
          }
        }
        return;
      }

      const products: Product[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          category: data.category || 'cervejas',
          description: data.description || '',
          price: Number(data.price) || 0,
          originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
          volume: data.volume || '',
          image: data.image || '',
          isGelada: Boolean(data.isGelada),
          isPromo: Boolean(data.isPromo),
          isBestSeller: Boolean(data.isBestSeller),
          stockStatus: data.stockStatus || 'in_stock',
          stockQuantity: typeof data.stockQuantity === 'number' ? data.stockQuantity : 50,
          badge: data.badge || '',
        };
      });

      onUpdate(products);
    },
    (error) => {
      console.warn('Firestore products onSnapshot warning (using local fallback):', error);
      onUpdate(INITIAL_PRODUCTS);
    }
  );
}

function cleanUndefined(obj: any): any {
  const cleaned: any = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
}

export async function seedInitialProducts() {
  try {
    const batch = writeBatch(db);
    INITIAL_PRODUCTS.forEach((product) => {
      const docRef = doc(db, 'products', product.id);
      batch.set(
        docRef,
        cleanUndefined({
          ...product,
          stockQuantity: 50,
          createdAt: new Date().toISOString(),
        })
      );
    });
    await batch.commit();
  } catch (error) {
    console.warn('Could not seed initial catalog into Firestore:', error);
  }
}

export async function addProductToFirestore(product: Omit<Product, 'id'>) {
  const newRef = doc(collection(db, 'products'));
  const id = newRef.id;

  try {
    await setDoc(
      newRef,
      cleanUndefined({
        ...product,
        id,
        stockQuantity: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `products/${id}`);
    throw error;
  }
}

export async function updateProductInFirestore(product: Product) {
  try {
    const docRef = doc(db, 'products', product.id);
    await updateDoc(
      docRef,
      cleanUndefined({
        ...product,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `products/${product.id}`);
    throw error;
  }
}

export async function deleteProductFromFirestore(productId: string) {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    throw error;
  }
}

// -------------------------------------------------------------
// FIREBASE STORAGE IMAGE UPLOAD
// -------------------------------------------------------------

export async function uploadProductImageToStorage(fileOrDataUrl: File | string, productName: string): Promise<string> {
  try {
    const filename = `product_${Date.now()}_${productName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const storageRef = ref(storage, `products/${filename}`);

    if (typeof fileOrDataUrl === 'string') {
      // Data URL upload
      await uploadString(storageRef, fileOrDataUrl, 'data_url');
    } else {
      // File upload
      await uploadBytes(storageRef, fileOrDataUrl);
    }

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    // Return original string if data URL or fallback
    if (typeof fileOrDataUrl === 'string') return fileOrDataUrl;
    throw error;
  }
}

// -------------------------------------------------------------
// ORDERS & AUTOMATIC STOCK DECREMENT
// -------------------------------------------------------------

export interface FirestoreOrderRecord {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
  itemsSummary: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  pixDiscount: number;
  grandTotal: number;
  paymentMethod: string;
  notes?: string;
  status: 'pendente' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
  estimatedTime: string;
  createdAt: string;
}

export async function createOrderInFirestore(
  orderData: Omit<FirestoreOrderRecord, 'id'>,
  cartItems: CartItem[]
): Promise<string> {
  const orderRef = doc(collection(db, 'orders'));
  const orderId = orderRef.id;

  try {
    // 1. Create order record reliably
    await setDoc(
      orderRef,
      cleanUndefined({
        ...orderData,
        id: orderId,
        createdAt: new Date().toISOString(),
      })
    );

    // 2. Decrement stock if authorized (admin checkout or test orders)
    const isOwnerAdmin = auth.currentUser?.email === 'ramosww6@gmail.com';
    if (isOwnerAdmin) {
      try {
        const batch = writeBatch(db);
        for (const item of cartItems) {
          if (!item.isCustomCombo && item.product.id) {
            const prodRef = doc(db, 'products', item.product.id);
            const prodSnap = await getDoc(prodRef);

            if (prodSnap.exists()) {
              const currentStock = prodSnap.data().stockQuantity || 50;
              const newStock = Math.max(0, currentStock - item.quantity);
              const newStatus = newStock === 0 ? 'out_of_stock' : newStock <= 5 ? 'low_stock' : 'in_stock';

              batch.update(
                prodRef,
                cleanUndefined({
                  stockQuantity: newStock,
                  stockStatus: newStatus,
                  updatedAt: new Date().toISOString(),
                })
              );
            }
          }
        }
        await batch.commit();
      } catch (stockError) {
        console.warn('Stock update skipped in checkout:', stockError);
      }
    }

    return orderId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
    throw error;
  }
}

export function subscribeOrders(onUpdate: (orders: FirestoreOrderRecord[]) => void) {
  const ordersRef = collection(db, 'orders');
  return onSnapshot(
    ordersRef,
    (snapshot) => {
      const orders: FirestoreOrderRecord[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          orderNumber: d.orderNumber || docSnap.id,
          customerId: d.customerId || 'anon',
          customerName: d.customerName || 'Cliente',
          customerEmail: d.customerEmail || '',
          phone: d.phone || '',
          neighborhood: d.neighborhood || '',
          street: d.street || '',
          number: d.number || '',
          complement: d.complement || '',
          itemsSummary: d.itemsSummary || '',
          items: d.items || [],
          subtotal: Number(d.subtotal) || 0,
          deliveryFee: Number(d.deliveryFee) || 0,
          pixDiscount: Number(d.pixDiscount) || 0,
          grandTotal: Number(d.grandTotal) || 0,
          paymentMethod: d.paymentMethod || 'pix',
          notes: d.notes || '',
          status: d.status || 'pendente',
          estimatedTime: d.estimatedTime || '20-30 min',
          createdAt: d.createdAt || new Date().toISOString(),
        };
      });

      // Sort newest first
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(orders);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'orders');
    }
  );
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: 'pendente' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado'
) {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(
      docRef,
      cleanUndefined({
        status: newStatus,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    throw error;
  }
}

// -------------------------------------------------------------
// USER PROFILE FIRESTORE SYNC
// -------------------------------------------------------------

export async function saveUserProfileToFirestore(userId: string, data: { displayName?: string; email?: string; phone?: string; role?: 'customer' | 'admin' }) {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      cleanUndefined({
        uid: userId,
        ...data,
        updatedAt: new Date().toISOString(),
      }),
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
  }
}
