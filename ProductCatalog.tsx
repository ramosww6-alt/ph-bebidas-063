import React, { useState, useMemo } from 'react';
import { Product, CategoryId } from '../types/adega';
import { CATEGORIES } from '../data/initialCatalog';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, Snowflake, Flame, RefreshCw, Sparkles, X, Tag } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  cartItemsMap: Record<string, number>;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onEditPhoto?: (product: Product) => void;
}

const POPULAR_SEARCH_CHIPS = ['Heineken', 'Red Label', 'Gelo de Coco', 'Absolut', 'Corona', 'Tanqueray', 'Red Bull'];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  cartItemsMap,
  onAddToCart,
  onUpdateQuantity,
  onEditPhoto,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyGeladas, setOnlyGeladas] = useState(false);
  const [onlyPromos, setOnlyPromos] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'name'>('default');

  // Filter & Sort Logic (Matches Name, Description, Category Name & Category ID)
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter (if selected via category tabs)
        if (selectedCategory !== 'todos' && p.category !== selectedCategory) {
          return false;
        }

        // Geladas filter
        if (onlyGeladas && !p.isGelada) {
          return false;
        }

        // Promo filter
        if (onlyPromos && !p.isPromo) {
          return false;
        }

        // Search query filter (matches product name, description, category name & category id)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCategoryId = p.category.toLowerCase().includes(q);
          
          // Match against category display name as well
          const catObj = CATEGORIES.find((c) => c.id === p.category);
          const matchCategoryName = catObj ? catObj.name.toLowerCase().includes(q) : false;

          return matchName || matchDesc || matchCategoryId || matchCategoryName;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        // Default: best sellers and promos first
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, onlyGeladas, onlyPromos, sortBy]);

  return (
    <section id="catalog" className="py-12 bg-zinc-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Flame className="w-4 h-4 fill-amber-500" />
              ESTOQUE 100% DISPONÍVEL NO 063
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white mt-1">
              CARDÁPIO DE <span className="gold-gradient-text">BEBIDAS GELADAS</span>
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Pesquise qualquer bebida pelo nome, marca ou filtre pelas categorias da adega.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-800 shrink-0">
            <span className="text-amber-400 font-extrabold text-sm">{filteredProducts.length}</span> bebidas encontradas
          </div>
        </div>

        {/* PROMINENT SEARCH BAR & FILTER CONTROLS */}
        <div className="space-y-3 bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 gold-glow">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Interactive Search Input Box */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 flex items-center gap-1.5 pointer-events-none">
                <Search className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por nome ou categoria (ex: Heineken, Whisky, Gelo de Coco, Vodka)..."
                className="w-full pl-12 pr-24 py-3.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
              />

              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 border border-zinc-700"
                >
                  <X className="w-3.5 h-3.5" /> Limpar
                </button>
              ) : (
                <span className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 pointer-events-none">
                  Filtragem rápida
                </span>
              )}
            </div>

            {/* Filter Toggles & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Geladas Only Toggle */}
              <button
                onClick={() => setOnlyGeladas(!onlyGeladas)}
                className={`px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  onlyGeladas
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-sm shadow-cyan-500/20'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                <Snowflake className={`w-3.5 h-3.5 ${onlyGeladas ? 'animate-pulse text-cyan-400' : ''}`} />
                <span>Só Geladas</span>
              </button>

              {/* Promos Only Toggle */}
              <button
                onClick={() => setOnlyPromos(!onlyPromos)}
                className={`px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  onlyPromos
                    ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-sm shadow-amber-500/20'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Ofertas</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-zinc-300 focus:outline-none font-medium py-1.5 cursor-pointer pr-1"
                >
                  <option value="default" className="bg-zinc-900 text-white">Relevância / Populares</option>
                  <option value="price_asc" className="bg-zinc-900 text-white">Menor Preço</option>
                  <option value="price_desc" className="bg-zinc-900 text-white">Maior Preço</option>
                  <option value="name" className="bg-zinc-900 text-white">Nome (A-Z)</option>
                </select>
              </div>

            </div>

          </div>

          {/* Quick Search Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/60">
            <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3 text-amber-400" /> Mais buscados:
            </span>
            {POPULAR_SEARCH_CHIPS.map((chip) => {
              const isSelected = searchQuery.toLowerCase() === chip.toLowerCase();
              return (
                <button
                  key={chip}
                  onClick={() => setSearchQuery(isSelected ? '' : chip)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400 shadow-sm'
                      : 'bg-zinc-950/80 text-zinc-300 border-zinc-800 hover:border-amber-500/50 hover:text-amber-400'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

        </div>

        {/* Category Tabs / Segmented Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span>{cat.name}</span>
                {cat.badge && (
                  <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-extrabold ${
                    isActive ? 'bg-zinc-950 text-amber-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Search / Filter Status Banner if active */}
        {(searchQuery || onlyGeladas || onlyPromos || selectedCategory !== 'todos') && (
          <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-400">Filtros ativos:</span>
              {searchQuery && (
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-white font-mono">
                  Busca: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== 'todos' && (
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-white font-mono">
                  Categoria: {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                </span>
              )}
              {onlyGeladas && (
                <span className="bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-mono">
                  🧊 Só Geladas
                </span>
              )}
              {onlyPromos && (
                <span className="bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-mono">
                  🏷️ Em Oferta
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
                setOnlyGeladas(false);
                setOnlyPromos(false);
              }}
              className="text-amber-400 hover:underline font-bold text-xs shrink-0 ml-2"
            >
              Limpar Todos
            </button>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(idx * 45, 400)}ms` }}
              >
                <ProductCard
                  product={product}
                  quantityInCart={cartItemsMap[product.id] || 0}
                  onAddToCart={onAddToCart}
                  onUpdateQuantity={onUpdateQuantity}
                  onEditPhoto={onEditPhoto}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-zinc-900/50 border border-zinc-800 rounded-3xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-zinc-800 flex items-center justify-center text-amber-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">Nenhuma bebida encontrada</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Não encontramos resultados para a busca por <strong className="text-amber-400">"{searchQuery}"</strong>. Tente buscar por outros termos como "Heineken", "Whisky", "Gelo" ou limpe os filtros.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
                setOnlyGeladas(false);
                setOnlyPromos(false);
              }}
              className="py-2.5 px-5 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Resetar Pesquisa e Filtros
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
