import React from 'react';
import { ShoppingBag, Flame, Sparkles, Trophy, MapPin, UserCheck, User } from 'lucide-react';
import { CustomerProfileData } from './CustomerModal';

interface MobileNavProps {
  cartCount: number;
  cartTotal: number;
  customerProfile: CustomerProfileData;
  onOpenCart: () => void;
  onOpenCustomerModal: () => void;
  onScrollTo: (sectionId: string) => void;
  activeSection?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  cartCount,
  cartTotal,
  customerProfile,
  onOpenCart,
  onOpenCustomerModal,
  onScrollTo,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-amber-500/30 py-2 px-3 shadow-2xl gold-glow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        
        {/* Customer Profile Tab */}
        <button
          onClick={onOpenCustomerModal}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-amber-400 active:scale-95 transition-all py-1 px-1.5"
        >
          {customerProfile.isIdentified ? (
            <UserCheck className="w-5 h-5 text-emerald-400" />
          ) : (
            <User className="w-5 h-5 text-amber-400" />
          )}
          <span className="truncate max-w-[50px] text-zinc-200">
            {customerProfile.isIdentified ? customerProfile.name.split(' ')[0] : 'Meu Nome'}
          </span>
        </button>

        {/* Cardápio */}
        <button
          onClick={() => onScrollTo('catalog')}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-amber-400 active:scale-95 transition-all py-1 px-1.5"
        >
          <Flame className="w-5 h-5 text-amber-500" />
          <span>Cardápio</span>
        </button>

        {/* Combos */}
        <button
          onClick={() => onScrollTo('combos')}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-amber-400 active:scale-95 transition-all py-1 px-1.5"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Combos</span>
        </button>



        {/* Delivery */}
        <button
          onClick={() => onScrollTo('delivery')}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-amber-400 active:scale-95 transition-all py-1 px-1.5"
        >
          <MapPin className="w-5 h-5 text-amber-500" />
          <span>Entrega</span>
        </button>

        {/* Floating Cart Primary Mobile Action */}
        <button
          onClick={onOpenCart}
          className="relative py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 active:scale-90 transition-all shrink-0"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>Pedido</span>
          {cartCount > 0 && (
            <span
              key={cartCount}
              className="bg-zinc-950 text-amber-400 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-black border border-amber-500/40 animate-cart-pop"
            >
              {cartCount}
            </span>
          )}
        </button>

      </div>
    </div>
  );
};
