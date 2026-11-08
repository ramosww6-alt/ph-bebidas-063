import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  location: string;
  comment: string;
  rating: number;
  favoriteItem: string;
  timeAgo: string;
}

const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Mateus Oliveira',
    location: 'Setor Central, Araguaína',
    comment: 'Melhor adega do 063 de longe! Pedi o Kit Red Label 3 horas da manhã de sábado e chegou em 18 minutos estupidamente gelado.',
    rating: 5,
    favoriteItem: 'Kit Red Label + Red Bull',
    timeAgo: 'Ontem',
  },
  {
    id: '2',
    name: 'Carolina Santos',
    location: 'Via Lago, Araguaína',
    comment: 'Atendimento nota 1000 pelo WhatsApp! O gelo de coco de maracujá é perfeito pro Gin Tanqueray. Recomendo muito!',
    rating: 5,
    favoriteItem: 'Gelo de Coco Maracujá + Tanqueray',
    timeAgo: 'Há 3 dias',
  },
  {
    id: '3',
    name: 'Lucas Ferreira',
    location: 'Setor Cimba, Araguaína',
    comment: 'A Heineken chega no ponto da neve! Nunca me deixaram na mão no churrasco. O troco veio certinho no Pix.',
    rating: 5,
    favoriteItem: 'Caixa de Heineken Long Neck',
    timeAgo: 'Há 5 dias',
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 bg-zinc-900/40 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            AVALIAÇÕES DOS CLIENTES
          </span>
          <h2 className="text-3xl font-black font-display text-white">
            QUEM PEDE NO <span className="gold-gradient-text">063 APPROVA!</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Veja o depoimento de quem já pediu bebidas geladas na PH BEBIDAS.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">{review.timeAgo}</span>
                </div>

                <Quote className="w-6 h-6 text-amber-500/30" />
                
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{review.name}</div>
                  <div className="text-[11px] text-zinc-400">{review.location}</div>
                </div>
                <div className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                  {review.favoriteItem}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
