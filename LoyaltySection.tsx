import React, { useState } from 'react';
import { UserLoyaltyProfile, LoyaltyReward } from '../types/adega';
import { Trophy, Award, Gift, Clock, Check, Copy, Sparkles, ArrowRight, ShieldCheck, Flame, Star } from 'lucide-react';

interface LoyaltySectionProps {
  profile: UserLoyaltyProfile;
  onRedeemReward?: (reward: LoyaltyReward) => void;
  onExploreCatalog: () => void;
}

export const REWARDS_CATALOG: LoyaltyReward[] = [
  {
    id: 'rew-1',
    title: 'Cupom Entrega Grátis em Araguaína',
    description: 'Sua próxima entrega de bebidas com frete 100% grátis.',
    pointsRequired: 200,
    icon: '🛵',
    code: 'FRETE063',
    discountType: 'free_delivery',
    value: 0,
  },
  {
    id: 'rew-2',
    title: '1 Gelo de Coco Sabores (Grátis)',
    description: 'Adicione 1 pacote de gelo saborizado de maracujá/coco sem custo.',
    pointsRequired: 400,
    icon: '🧊',
    code: 'GELOCOCO063',
    discountType: 'free_item',
    value: 12.00,
  },
  {
    id: 'rew-3',
    title: '1 Cerveja Heineken Long Neck Gelada',
    description: 'Cerveja trincando no ponto adicionada ao seu próximo pedido.',
    pointsRequired: 700,
    icon: '🍺',
    code: 'HEINEKEN063',
    discountType: 'free_item',
    value: 8.90,
  },
  {
    id: 'rew-4',
    title: 'Desconto de R$ 30,00 em Combos',
    description: 'Desconto especial para usar no Kit Red Label ou Black Label.',
    pointsRequired: 1200,
    icon: '💎',
    code: 'VIP063',
    discountType: 'discount_fixed',
    value: 30.00,
  },
];

export const LoyaltySection: React.FC<LoyaltySectionProps> = ({
  profile,
  onRedeemReward,
  onExploreCatalog,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Compute tier based on points
  const getTier = (points: number) => {
    if (points >= 1200) return { name: 'Diamante 💎', nextGoal: 2000, progress: 100, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' };
    if (points >= 700) return { name: 'Ouro 🥇', nextGoal: 1200, progress: Math.min(100, (points / 1200) * 100), color: 'text-amber-400 border-amber-500/40 bg-amber-950/40' };
    if (points >= 300) return { name: 'Prata 🥈', nextGoal: 700, progress: Math.min(100, (points / 700) * 100), color: 'text-slate-300 border-slate-400/40 bg-slate-900/60' };
    return { name: 'Bronze 🥉', nextGoal: 300, progress: Math.min(100, (points / 300) * 100), color: 'text-amber-600 border-amber-700/40 bg-amber-950/30' };
  };

  const tier = getTier(profile.totalPoints);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="fidelidade" className="py-16 bg-zinc-950 text-white border-t border-zinc-800 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Trophy className="w-4 h-4 text-amber-400" />
            PROGRAMA DE FIDELIDADE EXCLUSIVO
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
            CLUBE <span className="gold-gradient-text">PH BEBIDAS 063</span>
          </h2>
          <p className="text-sm text-zinc-400">
            Cada pedido de bebida no 063 acumula pontos que valem frete grátis, gelo de coco e cerveja gelada na faixa!
          </p>
        </div>

        {/* LOYALTY CARD & POINTS DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Gold Loyalty Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/50 rounded-3xl p-6 shadow-2xl gold-glow relative overflow-hidden space-y-6">
              
              {/* Card Header & Brand */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 gold-glow shrink-0">
                    <img
                      src="/assets/aistudio/Screenshot_2026-11-05-09-59-57-996_com.instagram.android_448cfc35.jpg"
                      alt="PH BEBIDAS 063"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-black font-display text-white">CLUBE FIDELIDADE</h3>
                    <p className="text-xs text-amber-400 font-bold">PH BEBIDAS 063</p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${tier.color}`}>
                  {tier.name}
                </span>
              </div>

              {/* Total Points Big Highlight */}
              <div className="space-y-1 text-center py-2">
                <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                  Seu Saldo de Pontos
                </div>
                <div className="text-4xl sm:text-5xl font-black font-mono gold-gradient-text">
                  {profile.totalPoints} <span className="text-xl font-sans text-amber-400">PTS</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  R$ 1,00 em compras = 1 Ponto PH · Bônus +50 pts em combos
                </div>
              </div>

              {/* Progress Gauge to Next Reward */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-400">Progresso para Próxima Recompensa:</span>
                  <span className="text-amber-400 font-mono">
                    {profile.totalPoints} / {tier.nextGoal} PTS
                  </span>
                </div>
                <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${tier.progress}%` }}
                  />
                </div>
              </div>

              {/* Member details info */}
              <div className="text-xs text-zinc-400 flex items-center justify-between pt-2 border-t border-zinc-800">
                <span>Membro: <strong className="text-white">{profile.customerName || 'Cliente VIP 063'}</strong></span>
                <span>Pedidos Realizados: <strong className="text-amber-400 font-mono">{profile.orderHistory.length}</strong></span>
              </div>

            </div>
          </div>

          {/* How Points Work Explanation */}
          <div className="lg:col-span-6 space-y-5">
            <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              Como Funciona o Clube PH?
            </h3>

            <div className="space-y-3">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Peça suas Bebidas</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Toda compra de cervejas, whiskies, combos ou gelo no site acumula pontos automaticamente.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Ganhe 1 Ponto a Cada R$ 1,00</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Gaste R$ 100,00 e receba 100 Pontos PH + bônus extra de +50 pontos ao pedir combos!
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-extrabold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Resgate Recompensas Exclusivas</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Troque seus pontos por cupom de frete grátis, gelo de coco e cervejas trincando!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onExploreCatalog}
              className="py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <span>Fazer Pedido e Ganhar Pontos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* REWARDS CATALOG GRID */}
        <div className="space-y-6 pt-6 border-t border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                CATÁLOGO DE RECOMPENSAS
              </span>
              <h3 className="text-2xl font-black font-display text-white mt-1">
                TROQUE SEUS PONTOS POR <span className="gold-gradient-text">PRÊMIOS</span>
              </h3>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Seu Saldo Atual: <strong className="text-amber-400">{profile.totalPoints} PTS</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REWARDS_CATALOG.map((reward) => {
              const canRedeem = profile.totalPoints >= reward.pointsRequired;
              const isCopied = copiedCode === reward.code;

              return (
                <div
                  key={reward.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    canRedeem
                      ? 'bg-zinc-900 border-amber-500/40 hover:border-amber-400 shadow-md'
                      : 'bg-zinc-900/40 border-zinc-800 opacity-80'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{reward.icon}</span>
                      <span className="text-xs font-mono font-black px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {reward.pointsRequired} PTS
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{reward.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {reward.description}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={!canRedeem}
                    onClick={() => handleCopyCode(reward.code)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 ${
                      canRedeem
                        ? 'bg-amber-500 hover:bg-amber-400 hover:shadow-amber-500/20 text-zinc-950 shadow-md'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Cupom {reward.code} Copiado!</span>
                      </>
                    ) : canRedeem ? (
                      <>
                        <Gift className="w-3.5 h-3.5" />
                        <span>Resgatar (Copiar Cupom)</span>
                      </>
                    ) : (
                      <span>Faltam {reward.pointsRequired - profile.totalPoints} Pontos</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ORDER HISTORY LOG */}
        <div className="space-y-4 pt-6 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              Histórico de Pedidos & Pontos Acumulados
            </h3>
            <span className="text-xs text-zinc-500">
              Registros automáticos no aparelho
            </span>
          </div>

          {profile.orderHistory.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {profile.orderHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 font-mono font-bold text-white">
                      <span>{rec.orderNumber}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                        {rec.status === 'entregue' ? '🟢 Concluído' : '🛵 Em Preparo'}
                      </span>
                    </div>
                    <div className="text-zinc-400 text-xs mt-1">
                      {rec.summaryText} · {rec.date}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-amber-400 font-extrabold text-sm">
                      + {rec.pointsEarned} Pontos PH
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      Total: R$ {rec.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-center space-y-2">
              <Gift className="w-8 h-8 text-amber-500/40 mx-auto" />
              <div className="text-sm font-bold text-white">Nenhum pedido registrado ainda</div>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Faça o seu primeiro pedido de bebidas no site para começar a acumular pontos no Clube PH 063!
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
