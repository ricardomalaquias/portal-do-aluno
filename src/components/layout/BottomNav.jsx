import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, ShoppingBag, User, Users, LogOut } from 'lucide-react';

export default function BottomNav() {
  const { isBateria, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Início', path: '/painel', icon: Home, show: true },
    { name: 'Alunos', path: '/admin/alunos', icon: Users, show: isAdmin },
    { name: 'Shop', path: '/shop', icon: ShoppingBag, show: isBateria || isAdmin },
    { name: 'Sair', path: '/', icon: LogOut, show: true, action: signOut },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 flex justify-around h-16 items-center px-4 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] pb-safe">
      {navItems.filter(i => i.show).map(item => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.name} 
            to={item.path} 
            onClick={item.action === signOut ? (e) => { e.preventDefault(); signOut(); } : undefined} 
            className={`flex flex-col items-center justify-center w-20 h-full gap-1 group`}
          >
            <item.icon 
              size={24} 
              className={`transition-colors duration-200 ${isActive ? 'text-accent-600' : 'text-neutral-500 group-hover:text-neutral-300'}`}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-accent-600' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}