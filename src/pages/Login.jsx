import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Loader2, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email, password,
      });

      if (authError) throw authError;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles').select('subject, is_admin').eq('id', authData.user.id).single();

      if (profileError) throw profileError;

      if (profileData.is_admin) {
        navigate('/admin/alunos');
      } else {
        navigate('/painel');
      }

    } catch (err) {
      setError('E-mail ou senha incorretos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-neutral-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-neutral-900 p-8 rounded-3xl border border-neutral-800 shadow-2xl">
        <div className="text-center mb-10">
          <div className="bg-accent-600 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">RM</span>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-neutral-50 tracking-tighter">
            Portal do Aluno
          </h2>
          <p className="text-neutral-400 mt-2 text-sm">Ricardo Malaquias • Bateria & Inglês</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {error && <p className="text-red-400 text-sm text-center bg-red-950/50 p-3 rounded-xl border border-red-800">{error}</p>}
          
          <div>
            <input
              type="email"
              required
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 py-3 px-4 text-neutral-50 shadow-sm outline-none focus:ring-2 focus:ring-accent-600 focus:border-accent-600 transition-all placeholder:text-neutral-500"
            />
          </div>

          <div>
            <input
              type="password"
              required
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 py-3 px-4 text-neutral-50 shadow-sm outline-none focus:ring-2 focus:ring-accent-600 focus:border-accent-600 transition-all placeholder:text-neutral-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-accent-600 px-4 py-3.5 text-base font-bold text-white shadow-lg hover:bg-accent-700 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Entrando...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Entrar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}