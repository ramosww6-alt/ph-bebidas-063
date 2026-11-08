import React, { useState, useEffect } from 'react';
import { CartItem, DeliveryZone, OrderDetails } from '../types/adega';
import { DELIVERY_ZONES } from '../data/initialCatalog';
import { CustomerProfileData } from './CustomerModal';
import { createOrderInFirestore } from '../firebase/firestoreService';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  Copy,
  Check,
  CreditCard,
  QrCode,
  DollarSign,
  MapPin,
  Sparkles,
  CheckCircle2,
  Clock,
  Receipt,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  User,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  customerProfile: CustomerProfileData;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  onOpenCustomerModal?: () => void;
  onOrderCompleted?: (orderNumber: string, grandTotal: number, itemsCount: number, customerName: string, phone: string, summaryText: string) => void;
}

interface CompletedReceipt {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  neighborhood: string;
  items: CartItem[];
  paymentMethod: 'pix' | 'cartao_entrega' | 'dinheiro';
  cashChangeFor?: string;
  subtotal: number;
  deliveryFee: number;
  pixDiscount: number;
  grandTotal: number;
  estimatedTime: string;
  notes?: string;
  whatsappUrl: string;
  createdAt: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  customerProfile,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedZone,
  onSelectZone,
  onOpenCustomerModal,
  onOrderCompleted,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    customerName: customerProfile.name || '',
    phone: customerProfile.phone || '',
    neighborhood: selectedZone.name,
    street: '',
    number: '',
    complement: '',
    paymentMethod: 'pix',
    cashChangeFor: '',
    notes: '',
  });

  // Sync profile when opened or profile changes
  useEffect(() => {
    if (customerProfile.name) {
      setOrderDetails((prev) => ({
        ...prev,
        customerName: prev.customerName || customerProfile.name,
        phone: prev.phone || customerProfile.phone,
      }));
    }
  }, [customerProfile, isOpen]);

  const [copiedPix, setCopiedPix] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedReceipt | null>(null);
  const [isCustomNeighborhood, setIsCustomNeighborhood] = useState(false);
  const [customNeighborhoodText, setCustomNeighborhoodText] = useState('');

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= selectedZone.minFreeFee && selectedZone.minFreeFee > 0;
  const deliveryFee = isFreeDelivery ? 0 : selectedZone.fee;

  // 5% discount for Pix
  const pixDiscount = orderDetails.paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const grandTotal = subtotal + deliveryFee - pixDiscount;

  const pixKeyMock = '063.phbebidas.pix@gmail.com';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKeyMock);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) return;
    if (!orderDetails.customerName.trim() || !orderDetails.street.trim()) {
      alert('Por favor, preencha seu nome e o endereço de entrega.');
      return;
    }

    // Format WhatsApp Message
    const itemsFormatted = cartItems
      .map((item) => {
        if (item.isCustomCombo && item.comboTitle) {
          return `• 1x ${item.comboTitle} - R$ ${item.product.price.toFixed(2)}`;
        }
        return `• ${item.quantity}x ${item.product.name} (${item.product.volume}) - R$ ${(
          item.product.price * item.quantity
        ).toFixed(2)}`;
      })
      .join('\n');

    const paymentText =
      orderDetails.paymentMethod === 'pix'
        ? '⚡ PIX (com 5% de desconto)'
        : orderDetails.paymentMethod === 'cartao_entrega'
        ? '💳 Cartão de Crédito/Débito na Entrega'
        : `💵 Dinheiro na Entrega${orderDetails.cashChangeFor ? ` (Troco para R$ ${orderDetails.cashChangeFor})` : ''}`;

    const finalNeighborhood = isCustomNeighborhood && customNeighborhoodText.trim()
      ? customNeighborhoodText.trim()
      : selectedZone.name;

    const orderNum = `#PH-${Math.floor(100000 + Math.random() * 900000)}`;

    const textMessage = `
🚨 *NOVO PEDIDO ${orderNum} - PH BEBIDAS 063* 🚨

👤 *Cliente:* ${orderDetails.customerName}
📱 *Telefone:* ${orderDetails.phone || 'Não informado'}
📍 *Bairro:* ${finalNeighborhood}
🏠 *Endereço:* ${orderDetails.street}, Nº ${orderDetails.number}${
      orderDetails.complement ? ` (${orderDetails.complement})` : ''
    }

🍺 *ITENS DO PEDIDO:*
${itemsFormatted}

🛵 *Entrega:* ${finalNeighborhood} (${selectedZone.estimatedMinutes}) - ${
      deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`
    }
💳 *Forma de Pagamento:* ${paymentText}
${pixDiscount > 0 ? `🎁 *Desconto Pix (5%):* - R$ ${pixDiscount.toFixed(2)}\n` : ''}
💰 *TOTAL FINAL:* R$ ${grandTotal.toFixed(2)}

${orderDetails.notes ? `📝 *Observação:* ${orderDetails.notes}` : ''}
----------------------------------------
_Enviado pelo App Oficial PH BEBIDAS 063_
    `.trim();

    const encoded = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/5563992155758?text=${encoded}`;

    // Create completed order receipt record
    const receipt: CompletedReceipt = {
      orderNumber: orderNum,
      customerName: orderDetails.customerName,
      phone: orderDetails.phone,
      address: `${orderDetails.street}, Nº ${orderDetails.number}${orderDetails.complement ? ` (${orderDetails.complement})` : ''}`,
      neighborhood: selectedZone.name,
      items: [...cartItems],
      paymentMethod: orderDetails.paymentMethod,
      cashChangeFor: orderDetails.cashChangeFor,
      subtotal,
      deliveryFee,
      pixDiscount,
      grandTotal,
      estimatedTime: selectedZone.estimatedMinutes,
      notes: orderDetails.notes,
      whatsappUrl,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    // Save order record to Firebase Firestore (and automatically reduce stock!)
    createOrderInFirestore(
      {
        orderNumber: orderNum,
        customerId: customerProfile.name || 'cliente_anonimo',
        customerName: orderDetails.customerName,
        customerEmail: customerProfile.phone || '',
        phone: orderDetails.phone || customerProfile.phone || '',
        neighborhood: finalNeighborhood,
        street: orderDetails.street,
        number: orderDetails.number,
        complement: orderDetails.complement || '',
        itemsSummary: itemsFormatted,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        deliveryFee,
        pixDiscount,
        grandTotal,
        paymentMethod: orderDetails.paymentMethod,
        notes: orderDetails.notes || '',
        status: 'pendente',
        estimatedTime: selectedZone.estimatedMinutes,
        createdAt: new Date().toISOString(),
      },
      cartItems
    ).catch((err) => console.error('Firestore order saving error:', err));

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Notify loyalty program of completed order
    if (onOrderCompleted) {
      const summaryText = cartItems.map((i) => i.product.name).slice(0, 2).join(', ') + (cartItems.length > 2 ? '...' : '');
      onOrderCompleted(
        orderNum,
        grandTotal,
        cartItems.reduce((acc, item) => acc + item.quantity, 0),
        orderDetails.customerName,
        orderDetails.phone,
        summaryText
      );
    }

    // 1. Set completion receipt modal screen
    setCompletedOrder(receipt);

    // 2. Clear items from cart!
    onClearCart();
  };

  const handleCloseReceiptAndReset = () => {
    setCompletedOrder(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-2 sm:pl-8">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-amber-500/30 text-white flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90 gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
                {completedOrder ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <ShoppingBag className="w-5 h-5" />}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-base sm:text-lg font-extrabold font-display text-white truncate">
                  {completedOrder ? 'Confirmação do Pedido' : 'Seu Carrinho'}
                </h2>
                <p className="text-xs text-amber-400 font-medium truncate">PH BEBIDAS 063 Delivery</p>
              </div>
            </div>

            {/* HIGHLY VISIBLE CLOSE BUTTON */}
            <button
              onClick={completedOrder ? handleCloseReceiptAndReset : onClose}
              className="py-2 px-3 text-xs font-bold text-amber-400 hover:text-zinc-950 bg-amber-500/10 hover:bg-amber-400 border border-amber-500/40 rounded-xl transition-all flex items-center gap-1.5 shadow-md shrink-0 active:scale-95"
              title="Fechar Carrinho"
              aria-label="Fechar Carrinho"
            >
              <X className="w-4 h-4 font-extrabold stroke-[2.5]" />
              <span className="text-xs font-bold">Fechar</span>
            </button>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* VIEW A: COMPLETED ORDER CONFIRMATION RECEIPT */}
            {completedOrder ? (
              <div className="space-y-6 animate-in zoom-in-95 duration-300">
                
                {/* Success Banner */}
                <div className="text-center p-6 bg-gradient-to-b from-emerald-950/60 to-zinc-900 border border-emerald-500/40 rounded-2xl space-y-3 shadow-lg">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/50 shadow-md animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {completedOrder.orderNumber}
                    </span>
                    <h3 className="text-xl font-black font-display text-white mt-2">
                      PEDIDO REALIZADO COM SUCESSO!
                    </h3>
                    <p className="text-xs text-emerald-300 mt-1">
                      O seu pedido foi enviado para a gerência da adega PH e os itens já foram retirados do carrinho.
                    </p>
                  </div>
                </div>

                {/* Status & ETA */}
                <div className="p-4 bg-zinc-900 border border-amber-500/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> Tempo Estimado de Chegada:
                    </span>
                    <span className="font-mono text-white bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                      {completedOrder.estimatedTime}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-300 flex items-center gap-1.5 pt-1 border-t border-zinc-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span>Status: Bebidas separadas e trincando de geladas no {completedOrder.neighborhood}</span>
                  </div>
                </div>

                {/* Payment Confirmation Box */}
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white border-b border-zinc-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-amber-400" /> Detalhes do Pagamento
                    </span>
                    <span className="text-amber-400 font-mono font-bold text-sm">
                      R$ {completedOrder.grandTotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Forma Escolhida:</span>
                      <span className="font-bold text-white uppercase">
                        {completedOrder.paymentMethod === 'pix'
                          ? '⚡ Pix (com 5% de Desconto)'
                          : completedOrder.paymentMethod === 'cartao_entrega'
                          ? '💳 Cartão na Entrega'
                          : `💵 Dinheiro${completedOrder.cashChangeFor ? ` (Troco R$ ${completedOrder.cashChangeFor})` : ''}`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-400">Endereço de Entrega:</span>
                      <span className="font-medium text-right max-w-[200px] truncate">{completedOrder.address}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-zinc-400">Cliente:</span>
                      <span className="font-bold text-white">{completedOrder.customerName}</span>
                    </div>
                  </div>

                  {/* Pix Copy Area if Pix payment */}
                  {completedOrder.paymentMethod === 'pix' && (
                    <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl space-y-2 text-xs mt-2">
                      <div className="flex items-center justify-between font-bold text-amber-300">
                        <span>Copiar Chave Pix:</span>
                        <button
                          type="button"
                          onClick={handleCopyPix}
                          className="px-2.5 py-1 bg-amber-500 text-zinc-950 rounded font-bold hover:bg-amber-400 flex items-center gap-1"
                        >
                          {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedPix ? 'Copiado!' : 'Copiar Pix'}
                        </button>
                      </div>
                      <div className="font-mono text-zinc-300 text-[11px] break-all bg-zinc-950 p-2 rounded border border-zinc-800">
                        {pixKeyMock}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ordered Items Receipt Breakdown */}
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider pb-1 border-b border-zinc-800">
                    Resumo dos Itens Comprados ({completedOrder.items.length})
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs pr-1">
                    {completedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-zinc-300">
                        <span className="truncate max-w-[220px]">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="font-mono text-zinc-400">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Buttons */}
                <div className="space-y-2 pt-2">
                  <a
                    href={completedOrder.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-zinc-950 shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-zinc-950" />
                    <span>Reabrir Conversa no WhatsApp de PH</span>
                  </a>

                  <button
                    onClick={handleCloseReceiptAndReset}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Fazer Novo Pedido de Bebidas</span>
                  </button>
                </div>

              </div>
            ) : cartItems.length === 0 ? (
              /* VIEW B: EMPTY CART */
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white font-display">Seu carrinho está vazio</h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Adicione cervejas geladas, combos de whisky ou gelo de coco para continuar.
                </p>
                <button
                  onClick={onClose}
                  className="py-2.5 px-6 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Ver Cardápio Gelado
                </button>
              </div>
            ) : (
              /* VIEW C: ACTIVE CART FORM */
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                    <span>ITENS ADICIONADOS ({cartItems.length})</span>
                    <button
                      onClick={onClearCart}
                      className="text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Limpar
                    </button>
                  </div>

                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-zinc-900 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={item.product.image && item.product.image.trim() !== '' ? item.product.image : undefined}
                            alt={item.product.name}
                            className="w-12 h-12 object-contain bg-zinc-950 rounded-lg p-1 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-white truncate">
                              {item.product.name}
                            </h4>
                            <div className="text-[11px] text-zinc-400 font-mono">
                              R$ {item.product.price.toFixed(2)} {item.product.volume && `· ${item.product.volume}`}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold font-mono text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-amber-400 hover:text-amber-300"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-zinc-500 hover:text-red-400 p-1"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Form */}
                <form onSubmit={handleSendWhatsAppOrder} className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> Dados de Entrega em Araguaína
                    </span>
                    {onOpenCustomerModal && (
                      <button
                        type="button"
                        onClick={onOpenCustomerModal}
                        className="text-[11px] text-amber-300 hover:underline font-bold flex items-center gap-1"
                      >
                        {customerProfile.isIdentified ? <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> : <User className="w-3.5 h-3.5" />}
                        <span>{customerProfile.isIdentified ? `Identificado: ${customerProfile.name}` : 'Salvar Meu Nome'}</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João da Silva"
                      value={orderDetails.customerName}
                      onChange={(e) => setOrderDetails({ ...orderDetails, customerName: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(63) 99215-5758"
                        value={orderDetails.phone}
                        onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-zinc-400">
                          Bairro *
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsCustomNeighborhood(!isCustomNeighborhood)}
                          className="text-[10px] text-amber-400 font-bold hover:underline"
                        >
                          {isCustomNeighborhood ? '📋 Ver Lista' : '✍️ Digitar Bairro'}
                        </button>
                      </div>

                      {isCustomNeighborhood ? (
                        <input
                          type="text"
                          required
                          placeholder="Digite seu bairro em Araguaína..."
                          value={customNeighborhoodText}
                          onChange={(e) => setCustomNeighborhoodText(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-amber-500/50 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                        />
                      ) : (
                        <select
                          value={selectedZone.id}
                          onChange={(e) => {
                            const z = DELIVERY_ZONES.find((dz) => dz.id === e.target.value);
                            if (z) {
                              onSelectZone(z);
                              setOrderDetails({ ...orderDetails, neighborhood: z.name });
                            }
                          }}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                        >
                          {DELIVERY_ZONES.map((z) => (
                            <option key={z.id} value={z.id} className="bg-zinc-900 text-white">
                              {z.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Rua / Avenida *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Rua 104 Sul"
                        value={orderDetails.street}
                        onChange={(e) => setOrderDetails({ ...orderDetails, street: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="105"
                        value={orderDetails.number}
                        onChange={(e) => setOrderDetails({ ...orderDetails, number: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Forma de Pagamento
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: 'pix' })}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          orderDetails.paymentMethod === 'pix'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <QrCode className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                        <span className="text-[11px] block">Pix (5% OFF)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: 'cartao_entrega' })}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          orderDetails.paymentMethod === 'cartao_entrega'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                        <span className="text-[11px] block">Cartão Na Entrega</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: 'dinheiro' })}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          orderDetails.paymentMethod === 'dinheiro'
                            ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <DollarSign className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                        <span className="text-[11px] block">Dinheiro</span>
                      </button>
                    </div>

                    {orderDetails.paymentMethod === 'pix' && (
                      <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between font-bold text-amber-300">
                          <span>Chave Pix da Adega:</span>
                          <button
                            type="button"
                            onClick={handleCopyPix}
                            className="px-2 py-1 bg-amber-500 text-zinc-950 rounded font-bold hover:bg-amber-400 flex items-center gap-1"
                          >
                            {copiedPix ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copiedPix ? 'Copiado!' : 'Copiar Pix'}
                          </button>
                        </div>
                        <div className="font-mono text-zinc-300 text-[11px] break-all bg-zinc-950 p-1.5 rounded border border-zinc-800">
                          {pixKeyMock}
                        </div>
                      </div>
                    )}

                    {orderDetails.paymentMethod === 'dinheiro' && (
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">
                          Precisa de troco para quanto?
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Troco para R$ 100,00"
                          value={orderDetails.cashChangeFor}
                          onChange={(e) => setOrderDetails({ ...orderDetails, cashChangeFor: e.target.value })}
                          className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Observação / Ponto de Referência
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Entregar estupidamente gelada! Portão marrom."
                      value={orderDetails.notes}
                      onChange={(e) => setOrderDetails({ ...orderDetails, notes: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
                    />
                  </div>

                  {/* Order Financial Summary */}
                  <div className="pt-4 border-t border-zinc-800 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal das Bebidas:</span>
                      <span className="font-mono text-white">R$ {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-zinc-400">
                      <span>Taxa de Entrega ({selectedZone.name}):</span>
                      <span className="font-mono text-amber-400 font-bold">
                        {deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>

                    {pixDiscount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Desconto Pix (5%):</span>
                        <span className="font-mono">- R$ {pixDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-baseline pt-2 border-t border-zinc-800 text-sm font-bold text-white">
                      <span>TOTAL A PAGAR:</span>
                      <span className="text-xl font-black font-mono text-amber-400">
                        R$ {grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Submit WhatsApp Button */}
                  <button
                    type="submit"
                    className="w-full py-4 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    <MessageCircle className="w-5 h-5 fill-zinc-950 transition-transform duration-200 group-hover:scale-110" />
                    <span>FINALIZAR PEDIDO NO WHATSAPP</span>
                  </button>
                </form>
              </>
            )}

          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 text-center text-[10px] text-zinc-500">
            PH BEBIDAS 063 · Entrega garantida e bebidas estupidamente geladas.
          </div>

        </div>
      </div>
    </div>
  );
};
