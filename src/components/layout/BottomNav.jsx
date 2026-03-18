import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Home, ShoppingBag, User, Users } from 'lucide-react'

export default function BottomNav() {
  const { isBateria, isAdmin, signOut } = useAuth()
  const location = useLocation()

  const navItems = [
    { name: 'Início', path: '/painel', icon: Home, show: true },
    { name: 'Alunos', path: '/admin/alunos', icon: Users, show: isAdmin },
    { name: 'Shop', path: '/shop', icon: ShoppingBag, show: isBateria || isAdmin },
    { name: 'Sair', path: '/', icon: User, show: true, action: signOut },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around h-16 items-center px-4">
      {navItems.filter(i => i.show).map(item => (
        <Link 
          key={item.name} 
          to={item.path} 
          onClick={item.action === signOut ? (e) => { e.preventDefault(); signOut(); } : undefined} 
          className={`flex flex-col items-center ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <item.icon size={24} />
          <span className="text-[10px]">{item.name}</span>
        </Link>
      ))}
    </nav>
  )
}