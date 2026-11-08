import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Sparkles, X, Check, Award, Beer } from 'lucide-react';
import { DELIVERY_ZONES } from '../data/initialCatalog';

export interface CustomerProfileData {
  name: string;
  phone: string;
  neighborhood: string;
  isIdentified: boolean;
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CustomerProfileData;
  onSaveProfile: (newProfile: CustomerProfileData) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [neighborhood, setNeighborhood] = useState(profile.neighborhood || DELIVERY_ZONES[0].name);
  const [isCustomNeighborhood, setIsCustomNeighborhood] = useState(false);
  const [customNeighborhoodText, setCustomNeighborhoodText] = useState('');

  useEffect(() => {
    setName(profile.name || '');
    setPhone(profile.phone || '');
    if (profile.neighborhood) {
      const match = DELIVERY_ZONES.find((z) => z.name === profile.neighborhood);
      if (match) {
        setNeighborhood(match.name);
        setIsCustomNeighborhood(false);
      } else {
        setIsCustomNeighborhood(true);
        setCustomNeighborhoodText(profile.neighborhood);
      }
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, digite seu nome ou apelido para continuar.');
      return;
    }

    const finalNeighborhood = isCustomNeighborhood && customNeighborhoodText.trim()
      ? customNeighborhoodText.trim()
      : neighborhood;

    onSaveProfile({
      name: name.trim(),
      phone: phone.trim() || '(63) 99215-5758',
      neighborhood: finalNeighborhood,
      isIdentified: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden space-y-5">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 rounded-full transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 gold-glow">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black font-display text-white">
              Identificação de Cliente
            </h3>
            <p className="text-xs text-amber-400 font-medium">
              PH BEBIDAS 063 · Araguaína - TO
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
          👋 Digite seu nome e telefone para a adega te reconhecer instantaneamente nos próximos pedidos!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Como prefere ser chamado(a)? *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: João da Silva / Lucas Araguaína"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-2xl text-sm text-white placeholder-zinc-600 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Seu WhatsApp / Telefone
            </label>
            <input
              type="tel"
              placeholder="Ex: (63) 99999-8888"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-2xl text-sm text-white placeholder-zinc-600 focus:outline-none"
            />
          </div>

          {/* Customer Neighborhood */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Seu Bairro em Araguaína
              </label>
              <button
                type="button"
                onClick={() => setIsCustomNeighborhood(!isCustomNeighborhood)}
                className="text-[11px] text-amber-400 hover:underline font-semibold"
              >
                {isCustomNeighborhood ? '📋 Selecionar Lista' : '✍️ Digitar Outro'}
              </button>
            </div>

            {isCustomNeighborhood ? (
              <input
                type="text"
                placeholder="Digite o nome do seu bairro..."
                value={customNeighborhoodText}
                onChange={(e) => setCustomNeighborhoodText(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-amber-500/50 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
            ) : (
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-2xl text-sm text-white focus:outline-none cursor-pointer"
              >
                {DELIVERY_ZONES.map((z) => (
                  <option key={z.id} value={z.name} className="bg-zinc-900 text-white">
                    {z.name} ({z.estimatedMinutes})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Perks list */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1">
            <div className="flex items-center gap-1.5 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Pedido Rápido no Zap</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Acúmulo de Pontos</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>SALVAR MEU PERFIL</span>
          </button>
        </form>

      </div>
    </div>
  );
};
