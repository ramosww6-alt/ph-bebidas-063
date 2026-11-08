import React, { useState } from 'react';
import { Product, ComboBuilderSelection } from '../types/adega';
import { Sparkles, Check, ShoppingBag, RefreshCw, Zap } from 'lucide-react';

interface ComboBuilderProps {
  products: Product[];
  onAddCustomCombo: (comboTitle: string, comboItems: Product[], totalPrice: number) => void;
}

export const ComboBuilder: React.FC<ComboBuilderProps> = ({ products, onAddCustomCombo }) => {
  const [selection, setSelection] = useState<ComboBuilderSelection>({});

  // Bottles available (whiskies or destilados)
  const bottles = products.filter((p) => p.category === 'whiskies' || p.category === 'destilados');
  // Mixers available (gelo_acomp)
  const mixers = products.filter((p) => p.category === 'gelo_acomp' && p.name.toLowerCase().includes('red bull') || p.name.toLowerCase().includes('monster') || p.name.toLowerCase().includes('coca'));
  // Ice available
  const ices = products.filter((p) => p.category === 'gelo_acomp' && p.name.toLowerCase().includes('gelo'));
  // Extra snacks/tabacaria
  const extras = products.filter((p) => p.category === 'tabacaria' || p.name.toLowerCase().includes('petisco'));

  // Calculate sum and combo discount
  const rawTotal =
    (selection.bottle?.price || 0) +
    (selection.mixer?.price || 0) +
    (selection.ice?.price || 0) +
    (selection.snack?.price || 0);

  // 10% combo discount
  const discountAmount = rawTotal > 0 ? rawTotal * 0.1 : 0;
  const comboPrice = rawTotal - discountAmount;

  const handleFinishCombo = () => {
    if (!selection.bottle) return;

    const items: Product[] = [];
    if (selection.bottle) items.push(selection.bottle);
    if (selection.mixer) items.push(selection.mixer);
    if (selection.ice) items.push(selection.ice);
    if (selection.snack) items.push(selection.snack);

    const comboTitle = `Kit Personalizado Adega PH (${selection.bottle.name})`;
    onAddCustomCombo(comboTitle, items, comboPrice);

    // Reset selection
    setSelection({});
  };

  return (
    <section id="combos" className="py-12 bg-zinc-900/60 border-y border-zinc-800 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            MONTE SEU KIT PERSONALIZADO
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            CRIE SEU COMBO COM <span className="gold-gradient-text">10% DE DESCONTO</span>
          </h2>
          <p className="text-sm text-zinc-400">
            Combine sua garrafa favorita com energético, gelo de coco saborizado e ganhe desconto automático no kit!
          </p>
        </div>

        {/* Builder Steps Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Steps Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Escolha a Garrafa */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-bold text-xs flex items-center justify-center">1</span>
                  Escolha a Garrafa Principal (Whisky, Vodka ou Gin)
                </h3>
                {selection.bottle && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Selecionado
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {bottles.slice(0, 6).map((b) => {
                  const isSelected = selection.bottle?.id === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelection({ ...selection, bottle: b })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{b.name}</div>
                      <div className="text-xs font-mono text-amber-400 font-extrabold mt-1">
                        R$ {b.price.toFixed(2)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Escolha o Energético / Acompanhamento */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-bold text-xs flex items-center justify-center">2</span>
                  Escolha o Acompanhamento / Energético
                </h3>
                {selection.mixer && (
                  <button
                    onClick={() => setSelection({ ...selection, mixer: undefined })}
                    className="text-xs text-zinc-500 hover:text-amber-400"
                  >
                    Remover
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mixers.map((m) => {
                  const isSelected = selection.mixer?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelection({ ...selection, mixer: m })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{m.name}</div>
                      <div className="text-xs font-mono text-amber-400 font-extrabold mt-1">
                        + R$ {m.price.toFixed(2)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Escolha o Gelo */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-bold text-xs flex items-center justify-center">3</span>
                  Escolha o Gelo (Coco ou Cubos 5kg)
                </h3>
                {selection.ice && (
                  <button
                    onClick={() => setSelection({ ...selection, ice: undefined })}
                    className="text-xs text-zinc-500 hover:text-amber-400"
                  >
                    Remover
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ices.map((ic) => {
                  const isSelected = selection.ice?.id === ic.id;
                  return (
                    <button
                      key={ic.id}
                      onClick={() => setSelection({ ...selection, ice: ic })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{ic.name}</div>
                      <div className="text-xs font-mono text-amber-400 font-extrabold mt-1">
                        + R$ {ic.price.toFixed(2)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Live Summary Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 space-y-6 shadow-2xl gold-glow">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h3 className="text-lg font-bold font-display text-white">Resumo do Kit</h3>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  10% OFF
                </span>
              </div>

              {/* Items Selected List */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-xs text-zinc-400">Garrafa:</span>
                  <span className="font-semibold text-right max-w-[180px] truncate">
                    {selection.bottle ? selection.bottle.name : 'Não selecionada'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-xs text-zinc-400">Energético/Acomp:</span>
                  <span className="font-semibold text-right max-w-[180px] truncate">
                    {selection.mixer ? selection.mixer.name : 'Nenhum'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-zinc-300">
                  <span className="text-xs text-zinc-400">Gelo Especial:</span>
                  <span className="font-semibold text-right max-w-[180px] truncate">
                    {selection.ice ? selection.ice.name : 'Nenhum'}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-xs font-bold text-emerald-400">
                    <span>Desconto Combo (-10%):</span>
                    <span>- R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Price calculation */}
              <div className="pt-4 border-t border-zinc-800 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-zinc-300">Total do Kit:</span>
                  <div className="text-right">
                    {rawTotal > 0 && discountAmount > 0 && (
                      <span className="text-xs text-zinc-500 line-through font-mono block">
                        R$ {rawTotal.toFixed(2)}
                      </span>
                    )}
                    <span className="text-2xl font-black font-mono text-amber-400">
                      R$ {comboPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add Combo Button */}
              <button
                disabled={!selection.bottle}
                onClick={handleFinishCombo}
                className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  selection.bottle
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 hover:-translate-y-0.5 active:scale-95 text-zinc-950 shadow-lg shadow-amber-500/20'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {selection.bottle ? 'Adicionar Combo ao Pedido' : 'Selecione uma Garrafa'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
