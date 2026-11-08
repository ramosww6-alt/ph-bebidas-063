import React from 'react';
import { ShoppingBag, Sparkles, MessageCircle, Settings, MapPin, UserCheck, User, LogIn, ShieldCheck } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { CustomerProfileData } from './CustomerModal';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  customerProfile: CustomerProfileData;
  currentUser: FirebaseUser | null;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenCustomerModal: () => void;
  onOpenAuthModal: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  customerProfile,
  currentUser,
  onOpenCart,
  onOpenAdmin,
  onOpenCustomerModal,
  onOpenAuthModal,
  onScrollTo,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-zinc-950/90 border-b border-amber-500/20">
      {/* Top Delivery Ticker Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-zinc-950 text-xs font-bold py-1 px-4 text-center flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-zinc-950 animate-pulse" />
        <span>ENTREGA EXPRESSA EM ARAGUAÍNA / 063 · FIRESTORE CONECTADO EM TEMPO REAL!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Wordmark & Logo */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); onScrollTo('hero'); }}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 group"
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-500 gold-glow group-hover:scale-105 transition-transform">
            <img
              src="/assets/aistudio/Screenshot_2026-11-05-09-59-57-996_com.instagram.android_448cfc35.jpg"
              alt="PH BEBIDAS 063 Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black font-display tracking-tight text-white flex items-center gap-1">
              PH BEBIDAS <span className="gold-gradient-text">063</span>
            </div>
            <div className="text-[10px] sm:text-xs text-amber-400 font-medium tracking-wide">
              ADEGA & DELIVERY 24H
            </div>
          </div>
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-zinc-300">
          <button
            onClick={() => onScrollTo('catalog')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            🍺 Cardápio Gelado
          </button>
          <button
            onClick={() => onScrollTo('combos')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-amber-400 font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Monte Seu Combo
          </button>

          <button
            onClick={() => onScrollTo('delivery')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            Taxa de Entrega
          </button>
          <button
            onClick={() => onScrollTo('sobre')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            📍 Nossa Adega
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Auth + Profile + Cart + Admin) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Firebase Authentication Login Button */}
          <button
            onClick={onOpenAuthModal}
            title={currentUser ? `Autenticado: ${currentUser.email}` : 'Entrar com Firebase Auth'}
            className="py-1.5 px-2.5 sm:px-3 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 bg-zinc-900 border-amber-500/40 text-amber-300 hover:bg-zinc-800"
          >
            {currentUser ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="max-w-[70px] sm:max-w-[100px] truncate text-white">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-amber-400" />
                <span className="hidden xs:inline">Entrar</span>
              </>
            )}
          </button>

          {/* Customer Identification Badge */}
          <button
            onClick={onOpenCustomerModal}
            title={customerProfile.isIdentified ? `Cliente: ${customerProfile.name} - Clique para alterar` : 'Identificar-se'}
            className="hidden sm:flex py-1.5 px-2.5 sm:px-3 text-xs font-bold rounded-xl border transition-all items-center gap-1.5 whitespace-nowrap shrink-0 bg-zinc-900 border-amber-500/30 text-amber-300 hover:bg-zinc-800 hover:border-amber-400"
          >
            {customerProfile.isIdentified ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="max-w-[80px] sm:max-w-[120px] truncate text-white">
                  {customerProfile.name}
                </span>
                <span className="text-[10px] text-amber-400 font-normal hidden xs:inline">(Editar)</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400">Meu Nome</span>
              </>
            )}
          </button>

          {/* Admin toggle icon */}
          <button
            onClick={onOpenAdmin}
            title="Painel de Gerência Firestore"
            className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* WhatsApp Direct link */}
          <a
            href="https://wa.me/5563992155758?text=Ol%C3%A1%20PH%20Bebidas!%20Gostaria%20de%20fazer%20um%20pedido%20de%20bebidas."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 py-2 px-3 text-xs font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 rounded-xl hover:bg-emerald-600/30 transition-all whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-500/20" />
            <span>Zap 063</span>
          </a>

          {/* Primary Cart Trigger Button */}
          <button
            onClick={onOpenCart}
            className="relative py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-zinc-950 rounded-xl shadow-md hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-200 flex items-center gap-2 whitespace-nowrap shrink-0 group"
          >
            <ShoppingBag className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span className="hidden xs:inline">Meu Pedido</span>
            {cartCount > 0 && (
              <span
                key={cartCount}
                className="bg-zinc-950 text-amber-400 font-extrabold text-[11px] px-2 py-0.5 rounded-full border border-amber-500/40 animate-cart-pop"
              >
                {cartCount}
              </span>
            )}
            {cartTotal > 0 && (
              <span className="font-extrabold text-zinc-950 border-l border-zinc-900/40 pl-2">
                R$ {cartTotal.toFixed(2)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
