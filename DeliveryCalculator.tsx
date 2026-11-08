import React, { useState } from 'react';
import { DeliveryZone } from '../types/adega';
import { DELIVERY_ZONES } from '../data/initialCatalog';
import { MapPin, Clock, Truck, CheckCircle2, Navigation, Timer, Edit3, Search, X } from 'lucide-react';

interface DeliveryCalculatorProps {
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  cartSubtotal: number;
}

export const DeliveryCalculator: React.FC<DeliveryCalculatorProps> = ({
  selectedZone,
  onSelectZone,
  cartSubtotal,
}) => {
  const [customSearch, setCustomSearch] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const isFreeFee = cartSubtotal >= selectedZone.minFreeFee && selectedZone.minFreeFee > 0;
  const missingForFree = Math.max(0, selectedZone.minFreeFee - cartSubtotal);
  const progressPercent = selectedZone.minFreeFee > 0
    ? Math.min(100, (cartSubtotal / selectedZone.minFreeFee) * 100)
    : 100;

  // Determine Speed Badge details dynamically based on selected zone
  const getSpeedDetails = (zone: DeliveryZone) => {
    if (zone.id === 'z6' || zone.id === 'z7') {
      return {
        badge: '🏬 Retirada no Balcão',
        color: 'from-purple-500 to-amber-500 text-purple-300 border-purple-500/40 bg-purple-950/40',
        statusText: 'Bebidas separadas e geladas prontas para retirada imediata.',
        etaLabel: 'Pronto em ~10 min',
      };
    }
    if (zone.fee <= 5.0) {
      return {
        badge: '⚡ Rota Expressa Super Rápida',
        color: 'from-emerald-500 to-amber-500 text-emerald-300 border-emerald-500/40 bg-emerald-950/40',
        statusText: 'Região central com múltiplos motoboys dedicados de prontidão.',
        etaLabel: zone.estimatedMinutes,
      };
    }
    if (zone.fee <= 8.0) {
      return {
        badge: '🛵 Rota Padrão Araguaína',
        color: 'from-amber-500 to-amber-600 text-amber-300 border-amber-500/40 bg-amber-950/40',
        statusText: 'Entrega direta no seu endereço com isolamento térmico.',
        etaLabel: zone.estimatedMinutes,
      };
    }
    return {
      badge: '📍 Rota Expandida 063',
      color: 'from-cyan-500 to-amber-500 text-cyan-300 border-cyan-500/40 bg-cyan-950/40',
      statusText: 'Entrega em região expandida com rastreamento ativo.',
      etaLabel: zone.estimatedMinutes,
    };
  };

  const speedInfo = getSpeedDetails(selectedZone);

  // Apply custom typed neighborhood if entered
  const activeZoneName = isCustomMode && customSearch.trim()
    ? customSearch.trim()
    : selectedZone.name;

  const handleApplyCustomZone = () => {
    if (customSearch.trim()) {
      setIsCustomMode(true);
      // Create a temporary custom delivery zone
      const customZone: DeliveryZone = {
        id: `custom-zone-${Date.now()}`,
        name: customSearch.trim(),
        estimatedMinutes: '20 - 30 min',
        fee: 7.00,
        minFreeFee: 90.00,
      };
      onSelectZone(customZone);
    }
  };

  return (
    <section id="delivery" className="py-12 bg-zinc-950 text-white border-b border-zinc-800 relative overflow-hidden">
      
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <MapPin className="w-4 h-4 text-amber-500" />
              ENTREGA EXPRESSA ARAGUAÍNA / 063
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white mt-1">
              CONSULTAR <span className="gold-gradient-text">TEMPO DE ENTREGA</span>
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Selecione na lista ou digite o nome do seu bairro em Araguaína para ver o tempo de entrega.
            </p>
          </div>
        </div>

        {/* CUSTOM NEIGHBORHOOD TYPING BOX */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Edit3 className="w-4 h-4" /> Digitar Nome do Seu Bairro em Araguaína
            </span>
            {isCustomMode && (
              <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Bairro Digitado Ativo
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={customSearch}
                onChange={(e) => {
                  setCustomSearch(e.target.value);
                  if (!e.target.value.trim()) setIsCustomMode(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyCustomZone();
                }}
                placeholder="Ex: Setor Universitário, Bairro São João, Residencial Barros..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
              />
              {customSearch && (
                <button
                  onClick={() => {
                    setCustomSearch('');
                    setIsCustomMode(false);
                    onSelectZone(DELIVERY_ZONES[0]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-amber-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={handleApplyCustomZone}
              className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Bairro</span>
            </button>
          </div>
        </div>

        {/* DYNAMIC VISUAL INDICATOR BANNER (TEMPO ESTIMADO DE ENTREGA) */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl gold-glow space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Dynamic ETA Meter & Clock Box */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-all duration-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-amber-400 uppercase font-mono tracking-wider">{speedInfo.badge}</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-zinc-400 font-medium">TEMPO ESTIMADO PARA {activeZoneName.toUpperCase()}:</div>
                <div className="text-3xl sm:text-5xl font-black font-mono gold-gradient-text tracking-tight flex items-center justify-center lg:justify-start gap-2">
                  <Timer className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 shrink-0 animate-pulse" />
                  <span>{speedInfo.etaLabel}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 max-w-sm leading-relaxed">
                {speedInfo.statusText}
              </p>
            </div>

            {/* Delivery Route Step Visualization (Visual Pipeline) */}
            <div className="lg:col-span-7 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider pb-2 border-b border-zinc-800/80">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Navigation className="w-3.5 h-3.5" /> Etapas do Seu Pedido
                </span>
                <span className="text-emerald-400 font-mono">🟢 Saída Imediata</span>
              </div>

              {/* Steps Progress Visual Pipeline */}
              <div className="grid grid-cols-3 gap-2 text-center relative">
                
                {/* Step 1 */}
                <div className="p-3 bg-zinc-900 rounded-xl border border-amber-500/30 space-y-1">
                  <div className="w-7 h-7 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div className="text-[11px] font-bold text-white">Separação</div>
                  <div className="text-[10px] text-zinc-400 font-mono">~3 min</div>
                </div>

                {/* Step 2 */}
                <div className="p-3 bg-zinc-900 rounded-xl border border-amber-500/30 space-y-1">
                  <div className="w-7 h-7 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div className="text-[11px] font-bold text-white">Em Trânsito</div>
                  <div className="text-[10px] text-amber-400 font-mono">Bags Térmicas</div>
                </div>

                {/* Step 3 */}
                <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-400 space-y-1">
                  <div className="w-7 h-7 mx-auto rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div className="text-[11px] font-bold text-white truncate">Chegada no {activeZoneName.split(' ')[0]}</div>
                  <div className="text-[10px] text-amber-300 font-mono font-bold">{selectedZone.estimatedMinutes}</div>
                </div>

              </div>

              {/* Status summary strip */}
              <div className="flex items-center justify-between text-xs pt-1 text-zinc-400">
                <span className="flex items-center gap-1 text-zinc-300">
                  <Truck className="w-3.5 h-3.5 text-amber-400" /> Taxa para este bairro:
                </span>
                <span className="font-mono font-extrabold text-amber-400 text-sm">
                  {isFreeFee ? (
                    <span className="text-emerald-400">FRETE GRÁTIS 🎉</span>
                  ) : selectedZone.fee === 0 ? (
                    'GRÁTIS'
                  ) : (
                    `R$ ${selectedZone.fee.toFixed(2)}`
                  )}
                </span>
              </div>
            </div>

          </div>

          {/* Progress Bar for Free Shipping */}
          {selectedZone.minFreeFee > 0 && (
            <div className="space-y-2 pt-4 border-t border-zinc-800/80">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-400">Meta para Frete Grátis em {activeZoneName}:</span>
                <span className="font-bold text-amber-400 font-mono">
                  {isFreeFee
                    ? '🎉 FRETE GRÁTIS CONQUISTADO!'
                    : `Faltam R$ ${missingForFree.toFixed(2)} (Mínimo R$ ${selectedZone.minFreeFee.toFixed(2)})`}
                </span>
              </div>
              <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Interactive Neighborhood Selector Grid */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>Ou Escolha um Bairro da Lista Pré-definida:</span>
            <span className="text-amber-400 text-[11px] font-mono">Araguaína / Tocantins</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DELIVERY_ZONES.map((zone) => {
              const isSelected = !isCustomMode && selectedZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => {
                    setIsCustomMode(false);
                    setCustomSearch('');
                    onSelectZone(zone);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 active:scale-98 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/15 scale-[1.02]'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80 hover:-translate-y-0.5'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-10 h-10 bg-amber-500 text-zinc-950 flex items-center justify-center rounded-bl-2xl">
                      <CheckCircle2 className="w-5 h-5 font-bold" />
                    </div>
                  )}

                  <div className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {zone.name}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-zinc-300 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <strong className="text-amber-300">{zone.estimatedMinutes}</strong>
                    </span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {zone.fee === 0 ? 'GRÁTIS' : `R$ ${zone.fee.toFixed(2)}`}
                    </span>
                  </div>

                  {zone.minFreeFee > 0 && (
                    <div className="mt-2 text-[11px] text-zinc-500">
                      Frete grátis a partir de R$ {zone.minFreeFee.toFixed(2)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
