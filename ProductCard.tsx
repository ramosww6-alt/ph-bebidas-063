import React, { useState } from 'react';
import { Product } from '../types/adega';
import { Plus, Minus, ShoppingBag, Snowflake, Check, AlertCircle, Camera } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onEditPhoto?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onEditPhoto,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    onAddToCart(product, 1);
    setTimeout(() => setIsAdding(false), 400);
  };

  const isOutOfStock = product.stockStatus === 'out_of_stock';

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 hover:border-amber-500/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 transform-gpu hover:-translate-y-1 flex flex-col justify-between">
      
      {/* Product Image Area */}
      <div className="relative h-48 sm:h-52 w-full bg-zinc-950 overflow-hidden flex items-center justify-center p-3">
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 items-center">
          {product.isGelada && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-md shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Snowflake className="w-3 h-3 text-cyan-400 animate-pulse" />
              Gelada
            </span>
          )}
          {product.badge && (
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500 text-zinc-950 uppercase tracking-wider shadow-sm transition-transform duration-200 group-hover:scale-105">
              {product.badge}
            </span>
          )}
        </div>

        {/* Volume badge & Edit Photo quick trigger */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {onEditPhoto && (
            <button
              onClick={() => onEditPhoto(product)}
              className="p-1.5 rounded-lg bg-zinc-900/90 text-amber-400 hover:bg-amber-500 hover:text-zinc-950 border border-zinc-700 transition-all duration-200 active:scale-90"
              title="Trocar Foto da Bebida"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-900/90 text-zinc-300 border border-zinc-700 backdrop-blur-md">
            {product.volume}
          </span>
        </div>

        {/* Image / Neutral Placeholder */}
        {product.image && product.image.trim() !== '' && !imageError ? (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain transform-gpu transition-transform duration-500 ease-out group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/60 text-zinc-500 space-y-2 p-4 rounded-xl border border-zinc-800/60">
            <Camera className="w-8 h-8 text-zinc-600 stroke-[1.5]" />
            <span className="text-[11px] text-zinc-400 font-medium text-center">Foto Real em Breve</span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="px-3 py-1.5 bg-red-900/90 text-red-200 text-xs font-bold rounded-lg border border-red-500/40 flex items-center gap-1 shadow-md">
              <AlertCircle className="w-3.5 h-3.5" /> Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-zinc-800/80 flex items-end justify-between">
          <div>
            {product.originalPrice && (
              <span className="text-xs text-zinc-500 line-through font-mono block">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
            <div className="text-base sm:text-lg font-black font-mono text-amber-400 tracking-tight transition-transform duration-200 group-hover:translate-x-0.5">
              R$ {product.price.toFixed(2)}
            </div>
          </div>

          {/* Action button or quantity stepper */}
          {isOutOfStock ? (
            <button
              disabled
              className="py-2 px-3 text-xs font-medium text-zinc-600 bg-zinc-800 rounded-xl cursor-not-allowed"
            >
              Indisponível
            </button>
          ) : quantityInCart > 0 ? (
            <div className="flex items-center gap-1.5 bg-zinc-800 border border-amber-500/40 rounded-xl p-1 shadow-sm transition-all duration-200">
              <button
                onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 text-amber-400 hover:bg-amber-500 hover:text-zinc-950 font-bold transition-all duration-200 active:scale-85"
                title="Diminuir"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-bold font-mono text-white animate-scale-up">
                {quantityInCart}
              </span>
              <button
                onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 font-bold transition-all duration-200 active:scale-85 shadow-sm"
                title="Aumentar"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className={`relative py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all duration-200 active:scale-90 flex items-center gap-1.5 shadow-md ${
                isAdding
                  ? 'bg-emerald-500 text-zinc-950 scale-95 shadow-emerald-500/25'
                  : 'bg-amber-500 hover:bg-amber-400 hover:shadow-amber-500/20 hover:-translate-y-0.5 text-zinc-950 shadow-amber-500/10'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5 animate-bounce" />
                  <span>Adicionado!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                  <span>Adicionar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
