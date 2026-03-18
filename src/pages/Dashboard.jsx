import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

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
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao salvar os dados.');
    }
  };

  if (!profile) return <div className="p-4 text-center">Carregando painel...</div>;

  return (
    <div className="space-y-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Olá, {profile.full_name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-gray-500">{profile.subject} • {profile.modality}</p>
      </header>

      {/* Tarefa da Semana */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3">Tarefa da Semana 🥁</h2>
        <p className="text-sm text-gray-700 mb-3">{profile.weekly_homework_text || 'Sua tarefa aparecerá aqui.'}</p>
        {profile.weekly_homework_image_url && (
          <img 
            src={profile.weekly_homework_image_url} 
            alt="Anexo da Tarefa" 
            className="w-full rounded-lg object-cover"
          />
        )}
      </div>

      {/* Resumo da Última Aula */}
      <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Última Aula</h3>
        <p className="text-sm text-gray-700 mt-2 italic">"{profile.last_lesson_summary || 'Nenhum resumo disponível.'}"</p>
      </div>

      {/* Ficha Editável */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-lg font-bold text-gray-800">Minha Ficha</h2>
          <button 
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            className="text-sm font-medium text-indigo-600"
          >
            {isEditing ? 'Salvar' : 'Editar'}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Horário da Aula</label>
            <p className="text-sm font-medium text-gray-800">{profile.lesson_day_time || 'Não definido'}</p>
          </div>

          <div>
            <label className="text-xs text-gray-500">WhatsApp / Telefone</label>
            {isEditing ? (
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            ) : (
              <p className="text-sm font-medium text-gray-800">{profile.phone || 'Adicione seu contato'}</p>
            )}
          </div>

          {profile.subject === 'Bateria' && (
            <div>
              <label className="text-xs text-gray-500">Influências Musicais</label>
              {isEditing ? (
                <textarea 
                  rows="3"
                  value={influences} 
                  onChange={(e) => setInfluences(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800">{profile.musical_influences || 'Adicione suas influências'}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}