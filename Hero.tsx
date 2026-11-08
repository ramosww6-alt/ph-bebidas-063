import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, ShieldCheck, Clock, Truck, Zap, CheckCircle, UserCheck } from 'lucide-react';
import { CustomerProfileData } from './CustomerModal';

interface HeroProps {
  customerProfile: CustomerProfileData;
  onExploreCatalog: () => void;
  onOpenComboBuilder: () => void;
  onOpenCustomerModal: () => void;
}

const RECENT_ORDERS_TOASTS = [
  {
    customer: 'Marcos V.',
    neighborhood: 'Setor Central',
    item: 'Kit Red Label + 4 Red Bull + Gelo Coco',
    timeAgo: 'há 2 minutos',
  },
  {
    customer: 'Juliana M.',
    neighborhood: 'Via Lago',
    item: 'Caixa de Heineken Long Neck Geladas',
    timeAgo: 'há 4 minutos',
  },
  {
    customer: 'Gabriel R.',
    neighborhood: 'Setor Cimba',
    item: 'Vodka Absolut 1L + 2 Gelo de Coco',
    timeAgo: 'há 7 minutos',
  },
  {
    customer: 'Rodrigo A.',
    neighborhood: 'Setor Araguaína Sul',
    item: "Jack Daniel's Tennessee 1 Litro",
    timeAgo: 'há 11 minutos',
  },
  {
    customer: 'Camila P.',
    neighborhood: 'Setor Neblina',
    item: 'Gin Tanqueray + 4 Schweppes Tônica',
    timeAgo: 'há 14 minutos',
  },
];

export const Hero: React.FC<HeroProps> = ({ customerProfile, onExploreCatalog, onOpenComboBuilder, onOpenCustomerModal }) => {
  const [toastIdx, setToastIdx] = useState(0);

  // Rotate real-time social proof order activity every 4.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setToastIdx((prev) => (prev + 1) % RECENT_ORDERS_TOASTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentToast = RECENT_ORDERS_TOASTS[toastIdx];

  return (
    <section id="hero" className="relative overflow-hidden bg-zinc-950 py-12 lg:py-20 border-b border-zinc-800">
      {/* Background Dark Gradient Backdrop */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-900/50 via-zinc-950 to-zinc-950 pointer-events-none" />

      {/* Decorative Gold Light Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Copy Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Customer Personal Welcome Badge */}
            {customerProfile.isIdentified ? (
              <div
                onClick={onOpenCustomerModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all duration-300 active:scale-95 cursor-pointer shadow-md animate-fade-in-down"
              >
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Olá, <strong className="text-white underline">{customerProfile.name}</strong>! O que vai beber hoje em {customerProfile.neighborhood || 'Araguaína'}?</span>
                <span className="text-[10px] text-amber-400 bg-zinc-950/60 px-2 py-0.5 rounded-md">Mudar</span>
              </div>
            ) : (
              <div
                onClick={onOpenCustomerModal}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-xs font-semibold text-amber-400 hover:border-amber-400 transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-md animate-fade-in-down"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>ADEGA ABERTA 24H · ATENDIMENTO E DELIVERY EM ARAGUAÍNA / 063</span>
                <span className="text-[10px] bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full font-bold">Identificar-se</span>
              </div>
            )}

            {/* Headline with Fade-in Animation */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.1] animate-fade-in-up">
              SUA BEBIDA <span className="gold-gradient-text uppercase">TRINCANDO DE GELADA</span> CHEGANDO RÁPIDO!
            </h1>

            {/* Paragraph with Subtle Delayed Fade-in */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal animate-fade-in-up delay-150">
              A melhor adega de Araguaína e região (DDD 063). Cervejas trincando no ponto, whiskies 100% originais, combos de balada com energético, gelo de coco e petiscos entregues no seu endereço em até 30 minutos.
            </p>

            {/* CTAs with Hover and Active Effects */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2 animate-fade-in-up delay-200">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-extrabold text-sm sm:text-base bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <Flame className="w-5 h-5 fill-zinc-950 transition-transform duration-200 group-hover:scale-110" />
                VER CARDÁPIO GELADO
              </button>

              <button
                onClick={onOpenComboBuilder}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 border border-amber-500/40 hover:border-amber-400 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-5 h-5 text-amber-400 transition-transform duration-200 group-hover:rotate-12" />
                MONTE SEU COMBO ADEGA
              </button>
            </div>

            {/* DYNAMIC SOCIAL PROOF WIDGET */}
            <div className="pt-2 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-300">
              <div className="p-3 bg-zinc-900/90 border border-emerald-500/30 rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-3 transition-all duration-500 hover:border-emerald-500/50">
                
                {/* Clean Icon Thumbnail */}
                <div className="relative w-11 h-11 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-800 shrink-0">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-950" />
                </div>

                {/* Info Text */}
                <div className="flex-1 overflow-hidden text-left">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      ÚLTIMO PEDIDO SAINDO AGORA
                    </span>
                    <span className="font-mono text-zinc-500 text-[10px]">{currentToast.timeAgo}</span>
                  </div>
                  <div className="text-xs font-bold text-white truncate mt-0.5">
                    {currentToast.customer} <span className="text-zinc-400 font-normal">({currentToast.neighborhood})</span>
                  </div>
                  <div className="text-[11px] text-amber-300 font-medium truncate">
                    {currentToast.item}
                  </div>
                </div>

              </div>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-2 grid grid-cols-3 gap-3 border-t border-zinc-800/80 text-left max-w-xl mx-auto lg:mx-0 animate-fade-in delay-400">
              <div className="flex items-center gap-2 text-zinc-300 text-xs sm:text-sm font-medium transition-transform duration-200 hover:translate-x-1">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Delivery Express</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300 text-xs sm:text-sm font-medium transition-transform duration-200 hover:translate-x-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Chega em 15-30min</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300 text-xs sm:text-sm font-medium transition-transform duration-200 hover:translate-x-1">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Original</span>
              </div>
            </div>

          </div>

          {/* Logo Badge & Featured Combo Preview Box */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-zinc-900/80 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-2xl gold-glow animate-scale-up delay-200">
              
              {/* Logo highlight */}
              <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 gold-glow shrink-0 transition-transform duration-300 hover:scale-105">
                  <img
                    src="/assets/aistudio/Screenshot_2026-11-05-09-59-57-996_com.instagram.android_448cfc35.jpg"
                    alt="PH BEBIDAS 063"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display">
                    PH BEBIDAS <span className="gold-gradient-text">063</span>
                  </h3>
                  <p className="text-xs text-amber-400 font-medium">
                    Adega Oficial @phbebidas063
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1">
                    <span>⭐ 4.9 (1.200+ avaliações no 063)</span>
                  </div>
                </div>
              </div>

              {/* Special Offer Highlight */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
                    DESTAQUE DA MADRUGADA
                  </span>
                  <span className="text-xs font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    OFERTA ATIVA
                  </span>
                </div>

                <div className="relative h-40 rounded-xl overflow-hidden border border-zinc-800 group cursor-pointer" onClick={onExploreCatalog}>
                  <img
                    src="/src/assets/images/combo_whisky_kit_1793883751151.jpg"
                    alt="Kit Whisky Red Label + Red Bull"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="text-xs text-amber-300 font-bold">Kit Ostentação</div>
                      <div className="text-sm font-extrabold text-white">Red Label + 4 Red Bull + Gelo Coco</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-zinc-400 line-through">R$ 219,90</div>
                      <div className="text-base font-extrabold text-amber-400 font-mono">R$ 189,90</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onExploreCatalog}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 transition-all duration-200 active:scale-95 hover:border-amber-400 flex items-center justify-center gap-2"
                >
                  Garantir esse Kit Gelado
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
