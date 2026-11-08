import React, { useState } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { saveUserProfileToFirestore } from '../firebase/firestoreService';
import { LogIn, UserPlus, LogOut, X, Sparkles, Shield, User, Mail, Lock, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  userRole: 'customer' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userRole,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const isAdmin = result.user.email === 'ramosww6@gmail.com';
        await saveUserProfileToFirestore(result.user.uid, {
          displayName: result.user.displayName || 'Cliente PH',
          email: result.user.email || '',
          role: isAdmin ? 'admin' : 'customer',
        });
        onClose();
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setErrorMsg('Falha ao autenticar com o Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (result.user) {
          const isAdmin = result.user.email === 'ramosww6@gmail.com';
          await saveUserProfileToFirestore(result.user.uid, {
            displayName: displayName.trim() || 'Cliente PH',
            email: result.user.email || '',
            role: isAdmin ? 'admin' : 'customer',
          });
          onClose();
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMsg('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Este e-mail já está cadastrado.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setErrorMsg('Erro na autenticação. Verifique seus dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden space-y-5">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 rounded-full transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LOGGED IN VIEW */}
        {currentUser ? (
          <div className="space-y-5 text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center gold-glow">
              <User className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SESSÃO CONECTADA COM FIREBASE AUTH</span>
              </div>
              <h3 className="text-xl font-extrabold font-display text-white mt-1">
                {currentUser.displayName || currentUser.email}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">{currentUser.email}</p>
              <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-zinc-900 text-amber-300 border border-amber-500/30">
                <Shield className="w-3.5 h-3.5" />
                <span>Perfil: {userRole === 'admin' ? 'Administrador da Adega' : 'Cliente Registrado'}</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Minha Conta</span>
            </button>
          </div>
        ) : (
          /* LOG IN / REGISTER VIEW */
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 gold-glow">
                <LogIn className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black font-display text-white">
                  {mode === 'login' ? 'Entrar na Conta' : 'Criar Sua Conta'}
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  PH BEBIDAS 063 · Firebase Auth
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {/* Google Sign-In Primary Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs bg-zinc-900 hover:bg-zinc-800 text-white border border-amber-500/30 transition-all flex items-center justify-center gap-3 active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar com Conta do Google</span>
            </button>

            <div className="relative my-2 text-center text-xs text-zinc-500">
              <span className="bg-zinc-950 px-2 relative z-10">ou com e-mail</span>
              <div className="absolute inset-0 top-1/2 border-t border-zinc-800 -z-0" />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">
                    Seu Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-amber-400 mb-1">
                  Seu E-mail
                </label>
                <input
                  type="email"
                  required
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 mb-1">
                  Sua Senha
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>{mode === 'login' ? 'ENTRAR COM E-MAIL' : 'CRIAR MINHA CONTA'}</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setErrorMsg('');
                }}
                className="text-xs text-zinc-400 hover:text-amber-400 font-medium underline"
              >
                {mode === 'login'
                  ? 'Não tem conta? Cadastre-se aqui'
                  : 'Já possui conta? Faça login'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
