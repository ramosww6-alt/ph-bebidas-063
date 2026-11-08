import React from 'react';
import { MapPin, Phone, Instagram, Clock, ShieldCheck, Award, MessageCircle } from 'lucide-react';

export const AdegaInfoSection: React.FC = () => {
  return (
    <section id="sobre" className="py-16 bg-zinc-950 text-white border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl gold-glow overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Logo highlight */}
              <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 gold-glow shrink-0">
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
                  <p className="text-xs text-amber-400 font-bold mt-0.5">
                    A MELHOR ADEGA DO 063
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Araguaína - TO (DDD 063)
                  </p>
                </div>
              </div>

              {/* Operating Info */}
              <div className="mt-6 space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 text-zinc-300">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Horário de Funcionamento</div>
                    <div className="text-zinc-400 text-xs">Segunda a Quinta: 10:00 às 03:00</div>
                    <div className="text-amber-400 font-bold text-xs">Sexta, Sábado e Domingo: 24 HORAS</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-zinc-300">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Localização & Cobertura</div>
                    <div className="text-zinc-400 text-xs">Atendimento em toda Araguaína (Setor Central, Cimba, Neblina, Via Lago, Araguaína Sul)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-zinc-300">
                  <Instagram className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Instagram Oficial</div>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 font-bold hover:underline text-xs"
                    >
                      @phbebidas063
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800 flex gap-2">
                <a
                  href="https://wa.me/5563992155758"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-500 text-zinc-950 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-zinc-950" />
                  Chamar no WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Text Description & Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Award className="w-3.5 h-3.5" />
              QUALIDADE & TRADIÇÃO NO 063
            </span>

            <h2 className="text-3xl sm:text-4xl font-black font-display text-white leading-tight">
              A ADEGA DE CONFIANÇA DO <span className="gold-gradient-text">POVO DE ARAGUAÍNA</span>
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Fundada com o compromisso de entregar a bebida mais gelada da cidade com agilidade insuperável. Seja para o churrasco no final de semana, o esquenta da balada ou a comemoração de última hora, a **PH BEBIDAS 063** garante garrafas originais com lacre de fábrica e entrega em até 30 minutos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  ❄️
                </div>
                <h4 className="font-bold text-white text-sm">Temperatura Trincando</h4>
                <p className="text-xs text-zinc-400">
                  Cervejas e gelo armazenados na temperatura exata para consumo imediato.
                </p>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  🛡️
                </div>
                <h4 className="font-bold text-white text-sm">Origem 100% Garantida</h4>
                <p className="text-xs text-zinc-400">
                  Distribuidores oficiais. Whiskies, vodkas e gins autênticos selados.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
