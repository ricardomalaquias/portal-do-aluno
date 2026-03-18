import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { Edit, Save, BookOpenText, CalendarCheck, Info } from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(profile?.phone || '');
  const [influences, setInfluences] = useState(profile?.musical_influences || '');

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ phone, musical_influences: influences })
        .eq('id', profile.id);

      if (error) throw error;
      setIsEditing(false);
      // Feedback minimalista (pode ser substituído por um toast no futuro)
      console.log('Perfil atualizado');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao salvar os dados.');
    }
  };

  if (!profile) return <div className="p-4 text-center text-neutral-500">Carregando painel...</div>;

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-50 tracking-tighter">Meu Painel</h1>
          <p className="text-sm text-neutral-400 mt-1">{profile.full_name} • {profile.subject}</p>
        </div>
        <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-neutral-800 rounded-full text-neutral-300 border border-neutral-700">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          {profile.modality}
        </div>
      </header>

      {/* Grid Responsivo para os Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        
        {/* Tarefa da Semana */}
        <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-4 mb-4">
            <BookOpenText className="text-accent-600" size={24} />
            <h2 className="text-xl font-bold text-neutral-50 tracking-tight">Tarefa da Semana</h2>
          </div>
          <p className="text-base text-neutral-300 leading-relaxed whitespace-pre-wrap">
            {profile.weekly_homework_text || 'Sua tarefa aparecerá aqui.'}
          </p>
          {profile.weekly_homework_image_url && (
            <img 
              src={profile.weekly_homework_image_url} 
              alt="Anexo da Tarefa" 
              className="w-full rounded-2xl object-cover shadow-inner border border-neutral-700"
            />
          )}
        </div>

        {/* Coluna Direita (Última Aula + Ficha) */}
        <div className="space-y-6 md:space-y-8">
          {/* Resumo da Última Aula */}
          <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl border-l-4 border-l-green-600">
            <div className="flex items-center gap-3 mb-3">
              <CalendarCheck className="text-green-500" size={20} />
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Resumo da Última Aula</h3>
            </div>
            <p className="text-base text-neutral-100 italic font-medium leading-relaxed bg-neutral-800 p-4 rounded-xl border border-neutral-700">
              "{profile.last_lesson_summary || 'Nenhum resumo disponível.'}"
            </p>
          </div>

          {/* Ficha Editável */}
          <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800 shadow-xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <Info className="text-accent-600" size={24} />
                <h2 className="text-xl font-bold text-neutral-50 tracking-tight">Meus Dados</h2>
              </div>
              <button 
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                className="flex items-center gap-2 text-sm font-semibold text-accent-600 bg-accent-600/10 px-4 py-2 rounded-lg hover:bg-accent-600/20 transition-colors"
              >
                {isEditing ? <Save size={16} /> : <Edit size={16} />}
                {isEditing ? 'Salvar' : 'Editar'}
              </button>
            </div>

            <div className="space-y-4">
              <DataField label="Horário da Aula" value={profile.lesson_day_time || 'Não definido'} />
              
              <DataFieldEditable 
                label="WhatsApp / Telefone" 
                value={phone} 
                setValue={setPhone} 
                isEditing={isEditing} 
                type="text"
              />

              {profile.subject === 'Bateria' && (
                <DataFieldEditable 
                  label="Influências Musicais" 
                  value={influences} 
                  setValue={setInfluences} 
                  isEditing={isEditing} 
                  type="textarea"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes Auxiliares Minimalistas para a Ficha
const DataField = ({ label, value }) => (
  <div>
    <label className="text-xs text-neutral-500 uppercase font-bold tracking-wider">{label}</label>
    <p className="text-base font-medium text-neutral-100 mt-0.5">{value}</p>
  </div>
);

const DataFieldEditable = ({ label, value, setValue, isEditing, type }) => (
  <div>
    <label className="text-xs text-neutral-500 uppercase font-bold tracking-wider">{label}</label>
    {isEditing ? (
      type === 'textarea' ? (
        <textarea 
          rows="3"
          value={value} 
          onChange={(e) => setValue(e.target.value)}
          className="mt-1.5 block w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-neutral-100 shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-600 sm:text-sm outline-none transition-all"
        />
      ) : (
        <input 
          type={type} 
          value={value} 
          onChange={(e) => setValue(e.target.value)}
          className="mt-1.5 block w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-neutral-100 shadow-sm focus:border-accent-600 focus:ring-1 focus:ring-accent-600 sm:text-sm outline-none transition-all"
        />
      )
    ) : (
      <p className="text-base font-medium text-neutral-100 mt-0.5 whitespace-pre-wrap">{value || <span className="text-neutral-600 italic">Não informado</span>}</p>
    )}
  </div>
);