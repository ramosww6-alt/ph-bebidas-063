import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 group">
      {/* Subtle Tooltip Label */}
      <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900/95 text-zinc-100 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-500/40 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 pointer-events-none backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Pedir no Zap (63) 99215-5758</span>
      </div>

      {/* Floating Button with Discreet Floating and Breathing Glow */}
      <a
        href="https://wa.me/5563992155758?text=Ol%C3%A1%20PH%20Bebidas!%20Gostaria%20de%20fazer%20um%20pedido%20de%20bebidas."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Atendimento no WhatsApp PH Bebidas 063"
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-emerald-400 text-white flex items-center justify-center shadow-2xl animate-float-slow animate-pulse-glow transition-all duration-300 hover:scale-110 active:scale-90 border border-emerald-300/40"
      >
        {/* Discreet Ping Halo Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/25 animate-ping opacity-60 pointer-events-none" />

        {/* Live Status Mini Indicator */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-zinc-950 rounded-full flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />
        </span>

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 fill-white/20 text-white stroke-[2.2] transition-transform duration-300 group-hover:scale-110" />
      </a>
    </div>
  );
};
