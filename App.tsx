import React, { useState, useEffect } from 'react';
import { Product, CartItem, DeliveryZone, UserLoyaltyProfile, OrderHistoryRecord } from './types/adega';
import { INITIAL_PRODUCTS, DELIVERY_ZONES } from './data/initialCatalog';
import { auth } from './firebase/config';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { subscribeProducts } from './firebase/firestoreService';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ComboBuilder } from './components/ComboBuilder';
import { DeliveryCalculator } from './components/DeliveryCalculator';
import { AdegaInfoSection } from './components/AdegaInfoSection';
import { ReviewsSection } from './components/ReviewsSection';
import { CartDrawer } from './components/CartDrawer';
import { AdminModal } from './components/AdminModal';
import { AgeGateModal } from './components/AgeGateModal';
import { CustomerModal, CustomerProfileData } from './components/CustomerModal';
import { AuthModal } from './components/AuthModal';
import { MobileNav } from './components/MobileNav';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';

export default function App() {
  // Firebase Auth user state
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer');

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const isAdmin = user.email === 'ramosww6@gmail.com';
        setUserRole(isAdmin ? 'admin' : 'customer');
        // Auto update customer profile name if authenticated
        setCustomerProfile((prev) => ({
          ...prev,
          name: user.displayName || user.email?.split('@')[0] || prev.name,
          isIdentified: true,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Customer Profile State (Name, Phone, Neighborhood)
  const [customerProfile, setCustomerProfile] = useState<CustomerProfileData>(() => {
    try {
      const saved = localStorage.getItem('adega_ph_063_customer');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: '',
      phone: '',
      neighborhood: 'Setor Central',
      isIdentified: false,
    };
  });

  // Store products state (synced with Firebase Firestore in real-time)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('adega_ph_063_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Subscribe to Firebase Firestore /products collection
  useEffect(() => {
    const unsubscribe = subscribeProducts((liveProducts) => {
      setProducts(liveProducts);
    });
    return () => unsubscribe();
  }, []);

  // Cart items state with local storage fallback
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('adega_ph_063_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Loyalty Profile state with local storage fallback
  const [loyaltyProfile, setLoyaltyProfile] = useState<UserLoyaltyProfile>(() => {
    try {
      const saved = localStorage.getItem('adega_ph_063_loyalty');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      customerName: customerProfile.name || 'Cliente VIP 063',
      phone: customerProfile.phone || '(63) 99215-5758',
      totalPoints: 350, // Initial welcome bonus points!
      tierName: 'Prata',
      orderHistory: [
        {
          id: 'ord-init-1',
          orderNumber: '#PH-812049',
          date: 'Ontem',
          itemsCount: 3,
          totalAmount: 189.90,
          pointsEarned: 240,
          status: 'entregue',
          summaryText: 'Kit Ostentação: Black Label + 4 Red Bull',
        },
      ],
      redeemedRewards: [],
    };
  });

  // Selected delivery zone state
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[0]);

  // Drawer / Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync customer profile to local storage
  useEffect(() => {
    localStorage.setItem('adega_ph_063_customer', JSON.stringify(customerProfile));
  }, [customerProfile]);

  // Sync products to local storage
  useEffect(() => {
    localStorage.setItem('adega_ph_063_products', JSON.stringify(products));
  }, [products]);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('adega_ph_063_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync loyalty to local storage
  useEffect(() => {
    localStorage.setItem('adega_ph_063_loyalty', JSON.stringify(loyaltyProfile));
  }, [loyaltyProfile]);

  // Cart total items count & price sum
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Cart mapping for product card quantity buttons (item.product.id -> count)
  const cartItemsMap = cartItems.reduce((acc, item) => {
    if (!item.isCustomCombo) {
      acc[item.product.id] = (acc[item.product.id] || 0) + item.quantity;
    }
    return acc;
  }, {} as Record<string, number>);

  // Handlers
  const handleSaveCustomerProfile = (newProfile: CustomerProfileData) => {
    setCustomerProfile(newProfile);
    setLoyaltyProfile((prev) => ({
      ...prev,
      customerName: newProfile.name,
      phone: newProfile.phone || prev.phone,
    }));
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => !item.isCustomCombo && item.product.id === product.id);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          id: `item-${product.id}-${Date.now()}`,
          product,
          quantity,
        },
      ];
    });
  };

  const handleAddCustomCombo = (comboTitle: string, comboItems: Product[], totalPrice: number) => {
    const comboProduct: Product = {
      id: `custom-combo-${Date.now()}`,
      name: comboTitle,
      category: 'combos',
      description: comboItems.map((i) => i.name).join(' + '),
      price: totalPrice,
      volume: 'Combo Especial',
      image: comboItems[0]?.image || '/src/assets/images/combo_whisky_kit_1793883751151.jpg',
      isGelada: true,
      stockStatus: 'in_stock',
      badge: 'PERSONALIZADO',
    };

    setCartItems((prev) => [
      ...prev,
      {
        id: `combo-${Date.now()}`,
        product: comboProduct,
        quantity: 1,
        isCustomCombo: true,
        comboTitle,
        comboDetails: comboItems.map((i) => i.name),
      },
    ]);

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemIdOrProductId: string, newQty: number) => {
    setCartItems((prev) => {
      if (newQty <= 0) {
        return prev.filter((item) => item.id !== cartItemIdOrProductId && item.product.id !== cartItemIdOrProductId);
      }
      return prev.map((item) => {
        if (item.id === cartItemIdOrProductId || item.product.id === cartItemIdOrProductId) {
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddProduct = (created: Product) => {
    setProducts((prev) => [created, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleEditPhotoTrigger = (product: Product) => {
    setIsAdminOpen(true);
  };

  const handleOrderCompleted = (
    orderNumber: string,
    grandTotal: number,
    itemsCount: number,
    customerName: string,
    phone: string,
    summaryText: string
  ) => {
    const pointsEarned = Math.floor(grandTotal) + (itemsCount >= 3 ? 50 : 0);

    setLoyaltyProfile((prev) => {
      const newTotal = prev.totalPoints + pointsEarned;
      let newTier: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante' = 'Bronze';
      if (newTotal >= 1200) newTier = 'Diamante';
      else if (newTotal >= 700) newTier = 'Ouro';
      else if (newTotal >= 300) newTier = 'Prata';

      const newRecord: OrderHistoryRecord = {
        id: `ord-${Date.now()}`,
        orderNumber,
        date: 'Hoje',
        itemsCount,
        totalAmount: grandTotal,
        pointsEarned,
        status: 'entregue',
        summaryText: summaryText || 'Pedido de Bebidas Geladas',
      };

      return {
        ...prev,
        customerName: customerName || prev.customerName,
        phone: phone || prev.phone,
        totalPoints: newTotal,
        tierName: newTier,
        orderHistory: [newRecord, ...prev.orderHistory],
      };
    });
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Age Verification Gate */}
      <AgeGateModal />

      {/* Firebase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        userRole={userRole}
      />

      {/* Customer Profile Identification Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        profile={customerProfile}
        onSaveProfile={handleSaveCustomerProfile}
      />

      {/* Header Bar */}
      <Header
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        customerProfile={customerProfile}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onScrollTo={scrollToSection}
      />

      {/* Main Page Layout */}
      <main className="flex-1">
        <Hero
          customerProfile={customerProfile}
          onExploreCatalog={() => scrollToSection('catalog')}
          onOpenComboBuilder={() => scrollToSection('combos')}
          onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
        />

        <ProductCatalog
          products={products}
          cartItemsMap={cartItemsMap}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onEditPhoto={handleEditPhotoTrigger}
        />

        <ComboBuilder
          products={products}
          onAddCustomCombo={handleAddCustomCombo}
        />

        <DeliveryCalculator
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          cartSubtotal={cartSubtotal}
        />



        <AdegaInfoSection />

        <ReviewsSection />
      </main>

      {/* Slide-over Shopping Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        customerProfile={customerProfile}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Store Manager Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        currentUser={currentUser}
      />

      {/* Discreet Floating WhatsApp Action */}
      <FloatingWhatsApp />

      {/* Mobile Sticky App Bar */}
      <MobileNav
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        customerProfile={customerProfile}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
        onScrollTo={scrollToSection}
      />

      {/* Footer */}
      <Footer onScrollTo={scrollToSection} />
    </div>
  );
}
