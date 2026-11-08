import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export const AgeGateModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [underAgeError, setUnderAgeError] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('adega_ph_063_age_verified');
    if (!verified) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('adega_ph_063_age_verified', 'true');
    setIsOpen(false);
  };

  const handleReject = () => {
    setUnderAgeError(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-zinc-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-center space-y-6 animate-in fade-in zoom-in duration-300">
        
        {/* Logo preview */}
        <div className="relative mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500 gold-glow">
          <img
            src="/assets/aistudio/Screenshot_2026-11-05-09-59-57-996_com.instagram.android_448cfc35.jpg"
            alt="PH BEBIDAS 063 Logo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            Verificação de Idade
          </span>
          <h2 className="mt-3 text-2xl font-black font-display text-white tracking-tight">
            VOCÊ TEM MAIS DE 18 ANOS?
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            De acordo com a legislação brasileira (Lei nº 8.069/90), este site contém bebidas alcoólicas e seu conteúdo é exclusivo para maiores de idade.
          </p>
        </div>

        {underAgeError ? (
          <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-xl text-left text-sm text-red-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Acesso Não Permitido
            </div>
            <p>
              Desculpe, você precisa ter 18 anos ou mais para navegar na loja da PH BEBIDAS 063 e realizar pedidos de bebidas alcoólicas.
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Sim, tenho 18+ anos
            </button>
            <button
              onClick={handleReject}
              className="py-3 px-4 rounded-xl font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              Sou menor de idade
            </button>
          </div>
        )}

        <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">
          Aprecie com moderação. Se beber, não dirija.
        </div>
      </div>
    </div>
  );
};
