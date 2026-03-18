import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../../contexts/AuthContext';

export default function AppLayout() {
  const { signOut, profile } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header Minimalista para Desktop (Escondido no Mobile) */}
      <header className="hidden md:flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-accent-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">RM</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-50 tracking-tighter">Portal do Aluno</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-400">{profile?.full_name}</span>
          <button 
            onClick={signOut}
            className="text-sm font-medium text-neutral-300 hover:text-white border border-neutral-700 px-4 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Container Principal Responsivo */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Menu Inferior (Exclusivo Mobile - Escondido no Desktop) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}