import React from 'react';
import { Instagram, MessageCircle, MapPin, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onScrollTo: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTo }) => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800 pt-12 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 gold-glow">
                <img
                  src="/assets/aistudio/Screenshot_2026-11-05-09-59-57-996_com.instagram.android_448cfc35.jpg"
                  alt="PH BEBIDAS 063"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-xl font-black font-display text-white">
                  PH BEBIDAS <span className="gold-gradient-text">063</span>
                </h3>
                <p className="text-xs text-amber-400 font-bold">
                  ADEGA & DELIVERY 24H NO DDD 063
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Bebidas estupidamente geladas entregues na velocidade da luz em Araguaína e região Tocantins. Cervejas, whiskies, combos de balada, destilados e gelo de coco.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/5563992155758"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500 hover:text-emerald-400 flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-500 hover:text-amber-400 flex items-center justify-center transition-colors"
                title="Instagram @phbebidas063"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navegação Rápida
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onScrollTo('catalog')}
                  className="hover:text-amber-400 transition-colors"
                >
                  🍺 Cervejas Geladas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('combos')}
                  className="hover:text-amber-400 transition-colors"
                >
                  🔥 Combos & Kits
                </button>
              </li>

              <li>
                <button
                  onClick={() => onScrollTo('delivery')}
                  className="hover:text-amber-400 transition-colors"
                >
                  🛵 Taxas de Entrega 063
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('sobre')}
                  className="hover:text-amber-400 transition-colors"
                >
                  📍 Sobre a Adega PH
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Atendimento 063
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Araguaína, Tocantins (DDD 063)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <MessageCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>(63) 99215-5758</span>
              </div>
              <div className="text-[11px] text-amber-400 font-bold pt-1">
                🟢 Atendimento 24h nos Finais de Semana
              </div>
            </div>
          </div>

        </div>

        {/* Legal Warning Banner */}
        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center gap-3 text-xs text-zinc-400">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-white">BEBA COM MODERAÇÃO.</strong> A venda de bebidas alcoólicas é proibida para menores de 18 anos (Lei nº 8.069/90 e Lei nº 9.294/96). Se beber, não dirija.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-zinc-900 text-center text-xs text-zinc-600 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © {new Date().getFullYear()} PH BEBIDAS 063. Todos os direitos reservados.
          </div>
          <div>
            Araguaína · Tocantins · Brasil
          </div>
        </div>

      </div>
    </footer>
  );
};
