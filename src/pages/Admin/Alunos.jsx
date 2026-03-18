import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Search, MessageCircle, X, Check, Calendar, Loader2, Users } from 'lucide-react';

export default function Alunos() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('Todos');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', false)
        .order('full_name', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'Todos' || student.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const openWhatsApp = (phone) => {
    if (!phone) return alert('Telefone não cadastrado pelo aluno.');
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.target);
    const status = formData.get('status');
    const summary = formData.get('summary');
    const homeworkText = formData.get('homework_text');
    const homeworkImage = formData.get('homework_image');

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          last_lesson_summary: summary,
          weekly_homework_text: homeworkText,
          weekly_homework_image_url: homeworkImage || null,
        })
        .eq('id', selectedStudent.id);

      if (profileError) throw profileError;

      const today = new Date().toISOString().split('T')[0];
      const { error: presenceError } = await supabase
        .from('presence')
        .insert([{
          student_id: selectedStudent.id,
          date: today,
          status: status,
          notes: summary
        }]);

      if (presenceError) throw presenceError;

      setStudents(prev => prev.map(s => 
        s.id === selectedStudent.id 
          ? { ...s, last_lesson_summary: summary, weekly_homework_text: homeworkText, weekly_homework_image_url: homeworkImage }
          : s
      ));

      setToastMessage('Aula salva com sucesso!');
      setTimeout(() => setToastMessage(null), 3000);
      setSelectedStudent(null);

    } catch (error) {
      console.error('Erro ao salvar aula:', error.message);
      alert('Ocorreu um erro ao salvar a aula.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 relative">
      {/* Toast de Feedback Minimalista */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-[100] flex items-center gap-2 animate-slide-up">
          <Check size={18} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-50 tracking-tighter flex items-center gap-3">
            <Users size={32} className="text-accent-600" />
            Meus Alunos
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Gestão rápida de aulas, presenças e tarefas.</p>
        </div>
        
        {/* Barra de Busca e Filtros Integrada */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
            <input
              type="text"
              placeholder="Buscar aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:ring-1 focus:ring-accent-600 focus:border-accent-600 outline-none transition-all"
            />
          </div>
          <div className="flex space-x-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800 overflow-x-auto">
            {['Todos', 'Bateria', 'Inglês'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilterSubject(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterSubject === tab ? 'bg-accent-600 text-white' : 'text-neutral-400 hover:text-neutral-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="animate-spin text-accent-600 mb-3" size={40} />
          <p className="text-neutral-500 text-sm">Carregando base de alunos...</p>
        </div>
      ) : (
        /* Lista de Alunos Responsiva (Grid no Desktop) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(student => (
            <div 
              key={student.id} 
              onClick={() => setSelectedStudent(student)}
              className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 flex items-center justify-between cursor-pointer transition-all hover:border-neutral-700 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div>
                <h3 className="font-bold text-neutral-50 text-base tracking-tight">{student.full_name}</h3>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1.5">
                  <Calendar size={14} className="text-accent-600" /> {student.lesson_day_time || 'Sem horário'} • {student.subject}
                </p>
              </div>
              <div className="text-accent-600 bg-accent-600/10 p-2.5 rounded-xl border border-accent-600/20">
                <Check size={20} />
              </div>
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-neutral-600 py-16 bg-neutral-900 rounded-3xl border border-neutral-800 border-dashed">
              <Users size={40} className="mx-auto mb-3 opacity-50" />
              Nenhum aluno cadastrado ou encontrado.
            </div>
          )}
        </div>
      )}

      {/* MODAL RESPONSIVO (BottomSheet no Mobile, Centralizado no Desktop) */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center p-0 md:p-4">
          <div className="bg-neutral-900 w-full h-[90vh] sm:h-auto sm:max-h-[90vh] sm:max-w-xl rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl border border-neutral-800 animate-slide-up">
            
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-800 sticky top-0 bg-neutral-900 rounded-t-3xl z-10">
              <div>
                <h2 className="text-xl font-bold text-neutral-50 tracking-tight">{selectedStudent.full_name}</h2>
                <p className="text-xs text-neutral-400 mt-0.5">{selectedStudent.lesson_day_time} • {selectedStudent.subject}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2.5 bg-neutral-800 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Corpo do Modal (Scrollable) */}
            <div className="p-5 overflow-y-auto flex-1 space-y-6">
              <button 
                type="button"
                onClick={() => openWhatsApp(selectedStudent.phone)}
                className="w-full flex items-center justify-center gap-2.5 bg-[#128C7E] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#0f7165] transition-colors active:scale-[0.98]"
              >
                <MessageCircle size={20} />
                Chamar no WhatsApp
              </button>

              <form id="lesson-form" onSubmit={handleSaveLesson} className="space-y-5">
                <div className="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                  <label className="block text-sm font-semibold text-neutral-300 mb-2.5">Status da Aula (Hoje)</label>
                  <select name="status" required className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 outline-none focus:ring-1 focus:ring-accent-600 focus:border-accent-600 transition-all text-sm">
                    <option value="">Selecione...</option>
                    <option value="presenca">Presença Normal</option>
                    <option value="falta">Falta</option>
                    <option value="reposicao">Reposição</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <FieldArea label="Resumo da Aula" name="summary" defaultValue={selectedStudent.last_lesson_summary} placeholder="O que foi passado hoje?" rows={2} />

                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-4">
                  <FieldArea label="Tarefa da Semana" name="homework_text" defaultValue={selectedStudent.weekly_homework_text} placeholder="Descreva a lição de casa..." rows={3} accent />
                  
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">URL da Imagem/Partitura</label>
                    <input name="homework_image" type="url" defaultValue={selectedStudent.weekly_homework_image_url} placeholder="https://..." className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 outline-none focus:ring-1 focus:ring-accent-600 focus:border-accent-600 text-sm placeholder:text-neutral-600" />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer do Modal */}
            <div className="p-5 border-t border-neutral-800 bg-neutral-900 pb-safe sm:rounded-b-3xl">
              <button 
                type="submit" 
                form="lesson-form"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2.5 bg-accent-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-accent-700 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Salvando...
                  </>
                ) : (
                  'Salvar Atualizações'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente Auxiliar para TextAreas no Modal
const FieldArea = ({ label, name, defaultValue, placeholder, rows, accent }) => (
  <div>
    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${accent ? 'text-accent-600' : 'text-neutral-500'}`}>{label}</label>
    <textarea name={name} rows={rows} defaultValue={defaultValue} placeholder={placeholder} className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 outline-none focus:ring-1 focus:ring-accent-600 focus:border-accent-600 resize-none text-sm placeholder:text-neutral-600"></textarea>
  </div>
);