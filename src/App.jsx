import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Shop from './pages/Shop';
import Alunos from './pages/Admin/Alunos';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ROTA PÚBLICA: Tela de Login */}
          <Route path="/" element={<Login />} />

          {/* ROTAS PROTEGIDAS: Envelopadas pelo AppLayout (com o menu inferior) */}
          <Route element={<AppLayout />}>
            
            {/* PAINEL PRINCIPAL: Acesso livre para todos os logados */}
            <Route 
              path="/painel" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* SHOP: Exclusivo para Bateria e Admin */}
            <Route 
              path="/shop" 
              element={
                <ProtectedRoute allowedSubjects={['Bateria']}>
                  <Shop />
                </ProtectedRoute>
              } 
            />

            {/* PAINEL ADM: Gestão de Alunos (Somente você/Admin acessa) */}
            <Route 
              path="/admin/alunos" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Alunos />
                </ProtectedRoute>
              } 
            />

          </Route>

          {/* ROTA DE SEGURANÇA: Se digitar algo errado, volta pro Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;