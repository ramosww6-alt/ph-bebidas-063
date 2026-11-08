import React, { useState, useEffect } from 'react';
import { Product, CategoryId } from '../types/adega';
import { CATEGORIES } from '../data/initialCatalog';
import { User as FirebaseUser, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import {
  addProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  uploadProductImageToStorage,
  subscribeOrders,
  updateOrderStatusInFirestore,
  FirestoreOrderRecord,
} from '../firebase/firestoreService';
import {
  X,
  Settings,
  Plus,
  Edit2,
  Lock,
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Camera,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Database,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  currentUser?: FirebaseUser | null;
}

const PRESET_IMAGES = [
  { label: 'Cervejas Geladas', path: '/src/assets/images/cerveja_trincando_grid_1793883750481.jpg' },
  { label: 'Banner Balada', path: '/src/assets/images/hero_adega_bebidas_1793883749865.jpg' },
  { label: 'Kit Whisky', path: '/src/assets/images/combo_whisky_kit_1793883751151.jpg' },
  { label: 'Gin & Vodkas', path: '/src/assets/images/destilados_gin_vodka_1793883751112.jpg' },
  { label: 'Vinhos & Espumantes', path: '/src/assets/images/vinhos_nacionais_importados_1793883751799.jpg' },
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  currentUser,
}) => {
  const isOwnerAdmin = Boolean(currentUser && currentUser.email === 'ramosww6@gmail.com');
  const isAuthenticated = isOwnerAdmin;
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Firestore Live Orders
  const [orders, setOrders] = useState<FirestoreOrderRecord[]>([]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      const unsubscribe = subscribeOrders((liveOrders) => {
        setOrders(liveOrders);
      });
      return () => unsubscribe();
    }
  }, [isOpen, isAuthenticated]);

  // Form state for creating or editing product
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'cervejas',
    price: 9.90,
    volume: '330ml',
    description: '',
    image: '/src/assets/images/cerveja_trincando_grid_1793883750481.jpg',
    isGelada: true,
    stockStatus: 'in_stock',
  });



  // Image Upload handler via File Input
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('A imagem é muito grande. Escolha uma imagem de até 8MB.');
        return;
      }
      setSelectedFile(file);

      // Local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Por favor, informe o nome e o preço da bebida.');
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = formData.image || '/src/assets/images/cerveja_trincando_grid_1793883750481.jpg';

      // 1. Upload image to Firebase Storage if a file was selected or data URL
      if (selectedFile) {
        imageUrl = await uploadProductImageToStorage(selectedFile, formData.name);
      } else if (formData.image && formData.image.startsWith('data:')) {
        imageUrl = await uploadProductImageToStorage(formData.image, formData.name);
      }

      if (editingProductId) {
        // Updating existing item in Firestore
        const existing = products.find((p) => p.id === editingProductId);
        if (existing) {
          const updated: Product = {
            ...existing,
            name: formData.name,
            category: (formData.category as CategoryId) || existing.category,
            price: Number(formData.price),
            volume: formData.volume || existing.volume,
            description: formData.description || existing.description,
            image: imageUrl,
            isGelada: formData.isGelada ?? existing.isGelada,
            stockStatus: (formData.stockStatus as any) || existing.stockStatus,
          };

          await updateProductInFirestore(updated);
          onUpdateProduct(updated);
          alert(`Bebida "${updated.name}" atualizada no Firestore com sucesso!`);
        }
        setEditingProductId(null);
      } else {
        // Creating new item in Firestore
        const newProductData: Omit<Product, 'id'> = {
          name: formData.name,
          category: (formData.category as CategoryId) || 'cervejas',
          description: formData.description || 'Bebida cadastrada no Firebase Firestore.',
          price: Number(formData.price),
          volume: formData.volume || '1 Unidade',
          image: imageUrl,
          isGelada: !!formData.isGelada,
          stockStatus: (formData.stockStatus as any) || 'in_stock',
        };

        const id = await addProductToFirestore(newProductData);
        onAddProduct({ ...newProductData, id });
        alert(`Nova bebida "${newProductData.name}" cadastrada no Firestore!`);
      }

      // Reset form
      setFormData({
        name: '',
        category: 'cervejas',
        price: 9.90,
        volume: '330ml',
        description: '',
        image: '/src/assets/images/cerveja_trincando_grid_1793883750481.jpg',
        isGelada: true,
        stockStatus: 'in_stock',
      });
      setSelectedFile(null);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Ocorreu um erro ao salvar o produto no Firebase.');
    } finally {
      setIsUploading(false);
    }
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setSelectedFile(null);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      volume: p.volume,
      description: p.description,
      image: p.image,
      isGelada: p.isGelada,
      stockStatus: p.stockStatus,
    });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setSelectedFile(null);
    setFormData({
      name: '',
      category: 'cervejas',
      price: 9.90,
      volume: '330ml',
      description: '',
      image: '/src/assets/images/cerveja_trincando_grid_1793883750481.jpg',
      isGelada: true,
      stockStatus: 'in_stock',
    });
  };

  const handleToggleStock = async (product: Product) => {
    const nextStatus = product.stockStatus === 'in_stock' ? 'out_of_stock' : 'in_stock';
    const updated = { ...product, stockStatus: nextStatus as any };
    try {
      await updateProductInFirestore(updated);
      onUpdateProduct(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProductFirestore = async (productId: string, name: string) => {
    if (confirm(`Remover "${name}" permanentemente do banco Firebase?`)) {
      try {
        await deleteProductFromFirestore(productId);
        if (onDeleteProduct) onDeleteProduct(productId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, status: 'pendente' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado') => {
    try {
      await updateOrderStatusInFirestore(orderId, status);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-zinc-950 border border-amber-500/40 rounded-2xl p-4 sm:p-6 text-white max-h-[92vh] flex flex-col justify-between shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 gold-glow">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-display text-white flex items-center gap-2">
                PAINEL FIRESTORE · PH BEBIDAS <span className="text-xs bg-amber-500 text-zinc-950 font-mono font-extrabold px-2 py-0.5 rounded">REAL DB</span>
              </h2>
              <p className="text-[11px] text-amber-400 font-medium">Gestão em tempo real de estoque, imagens e pedidos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <div className="py-12 max-w-sm mx-auto text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Acesso Exclusivo do Proprietário</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              O painel administrativo é protegido e de uso exclusivo da conta <span className="font-mono text-amber-400 font-bold">ramosww6@gmail.com</span>.
            </p>
            {currentUser ? (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
                Logado como <strong>{currentUser.email}</strong>. Esta conta não possui privilégios de administrador.
              </div>
            ) : null}
            <button
              onClick={async () => {
                try {
                  await signInWithPopup(auth, googleProvider);
                } catch (err) {
                  console.error(err);
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-extrabold text-xs rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Entrar com Conta do Proprietário (Google)</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            
            {/* Tabs Header */}
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'products'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Estoque & Imagens Firebase ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'orders'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pedidos em Tempo Real ({orders.length})</span>
              </button>
            </div>

            {activeTab === 'products' ? (
              /* TAB 1: PRODUCTS & FIREBASE STORAGE */
              <div className="space-y-6">
                
                {/* Create/Edit Product Form with Storage Uploader */}
                <form onSubmit={handleSaveProduct} className="p-4 sm:p-5 bg-zinc-900 border border-amber-500/30 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <h3 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      {editingProductId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {editingProductId ? 'Editar Bebida & Firebase Storage' : 'Cadastrar Bebida no Firestore + Storage'}
                    </h3>
                    {editingProductId && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-xs text-zinc-400 hover:text-white underline"
                      >
                        Cancelar Edição
                      </button>
                    )}
                  </div>

                  {/* Photo Upload Section */}
                  <div className="space-y-3 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                    <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-amber-400" /> Foto da Bebida (Upload Direto no Firebase Storage)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Photo Preview */}
                      <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 bg-zinc-900 rounded-xl border border-zinc-800 h-32 relative group">
                        {formData.image ? (
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-center text-zinc-600">
                            <ImageIcon className="w-8 h-8 mx-auto" />
                            <span className="text-[10px]">Sem foto</span>
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 text-[9px] bg-zinc-950/90 text-amber-400 px-1.5 py-0.5 rounded border border-zinc-700">
                          Pré-visualização
                        </span>
                      </div>

                      {/* Photo Upload Options */}
                      <div className="sm:col-span-8 space-y-2">
                        {/* File Input button */}
                        <div>
                          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-all shadow-md">
                            <Upload className="w-4 h-4" />
                            <span>Enviar Foto para o Firebase Storage</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileUpload}
                              className="hidden"
                            />
                          </label>
                          <p className="text-[10px] text-zinc-500 mt-1">
                            A foto é enviada para o storageBucket do Firebase (`astral-ion-vlczw.firebasestorage.app`).
                          </p>
                        </div>

                        {/* Image URL fallback */}
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-0.5">Ou cole a URL / Link da Foto:</label>
                          <input
                            type="text"
                            placeholder="https://exemplo.com/foto.jpg"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white font-mono placeholder-zinc-600"
                          />
                        </div>

                        {/* Presets */}
                        <div>
                          <label className="block text-[10px] text-zinc-500 mb-1">Ou escolha um Preset:</label>
                          <div className="flex flex-wrap gap-1.5">
                            {PRESET_IMAGES.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setFormData({ ...formData, image: preset.path })}
                                className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-400 border border-zinc-700"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400">Nome da Bebida *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Cerveja Spaten Latão 473ml"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400">Categoria *</label>
                      <select
                        value={formData.category}
                        onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                      >
                        {CATEGORIES.filter((c) => c.id !== 'todos').map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400">Preço (R$) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="7.99"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400">Volume / Embalagem *</label>
                      <input
                        type="text"
                        placeholder="Ex: 350ml, 1 Litro, Pack 6 un"
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400">Descrição Curta</label>
                    <input
                      type="text"
                      placeholder="Ex: Cerveja puro malte estupidamente gelada."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isUploading ? 'Enviando ao Firebase...' : editingProductId ? 'Salvar Alterações no Firestore' : 'Cadastrar no Firebase Firestore'}</span>
                    </button>
                  </div>
                </form>

                {/* Firestore Inventory List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Produtos no Banco Firestore ({products.length})</span>
                    <span className="text-[10px] text-amber-400">Sincronização em Tempo Real</span>
                  </h3>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-zinc-700"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={p.image && p.image.trim() !== '' ? p.image : undefined}
                            alt={p.name}
                            className="w-10 h-10 object-contain bg-zinc-950 rounded-lg p-0.5 shrink-0 border border-zinc-800"
                            referrerPolicy="no-referrer"
                          />
                          <div className="overflow-hidden">
                            <div className="font-bold text-white truncate">{p.name}</div>
                            <div className="text-[11px] text-zinc-400 font-mono">
                              R$ {p.price.toFixed(2)} · {p.volume}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => startEditProduct(p)}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40 flex items-center gap-1 transition-colors"
                          >
                            <Camera className="w-3 h-3" />
                            <span>Editar</span>
                          </button>

                          <button
                            onClick={() => handleToggleStock(p)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                              p.stockStatus === 'in_stock'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-red-500/20 text-red-400 border border-red-500/40'
                            }`}
                          >
                            {p.stockStatus === 'in_stock' ? 'Em Estoque' : 'Esgotado'}
                          </button>

                          <button
                            onClick={() => handleDeleteProductFirestore(p.id, p.name)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg"
                            title="Excluir do Firestore"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* TAB 2: LIVE ORDERS IN FIRESTORE */
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                  <span>PEDIDOS RECEBIDOS NO FIRESTORE ({orders.length})</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Sincronização em tempo real ativa
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-2">
                    <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
                    <p className="text-xs text-zinc-400">Nenhum pedido recebido ainda no banco de dados.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                          <div>
                            <span className="font-mono font-bold text-amber-400 text-sm">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[11px] text-zinc-400 ml-2">
                              {new Date(ord.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-white font-mono">
                              R$ {ord.grandTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
                          <div>
                            <span className="text-zinc-500 block">Cliente:</span>
                            <strong className="text-white">{ord.customerName}</strong> ({ord.phone})
                          </div>
                          <div>
                            <span className="text-zinc-500 block">Endereço de Entrega:</span>
                            <span>{ord.street}, Nº {ord.number} - {ord.neighborhood}</span>
                          </div>
                        </div>

                        <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-[11px] text-zinc-400">
                          <span className="font-bold text-amber-400 block mb-1">Itens Comprados:</span>
                          {ord.itemsSummary || 'Bebidas diversas'}
                        </div>

                        {/* Status Change Selector */}
                        <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                          <span className="text-zinc-400">Status no Firestore:</span>
                          <select
                            value={ord.status}
                            onChange={(e: any) => handleUpdateStatus(ord.id, e.target.value)}
                            className="px-3 py-1.5 bg-zinc-950 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                          >
                            <option value="pendente">⏳ Pendente</option>
                            <option value="em_preparo">🍺 Em Preparo</option>
                            <option value="saiu_para_entrega">🛵 Saiu p/ Entrega</option>
                            <option value="entregue">✅ Entregue</option>
                            <option value="cancelado">❌ Cancelado</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
