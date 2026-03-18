import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Search, MessageCircle, X, Check, Calendar, AlertCircle, Loader2 } from 'lucide-react';

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
    <div className="relative">
      {toastMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
          <Check size={18} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meus Alunos</h1>
        <p className="text-sm text-gray-500">Gestão rápida de aulas e presenças</p>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['Todos', 'Bateria', 'Inglês'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterSubject(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterSubject === tab ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
          <p className="text-gray-500 text-sm">Carregando alunos...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map(student => (
            <div 
              key={student.id} 
              onClick={() => setSelectedStudent(student)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{student.full_name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar size={14} /> {student.lesson_day_time || 'Sem horário'} • {student.subject}
                </p>
              </div>
              <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg">
                <Check size={20} />
              </div>
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <p className="text-center text-gray-500 py-6">Nenhum aluno cadastrado ainda.</p>
          )}
        </div>
      )}

      {selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{selectedStudent.full_name}</h2>
                <p className="text-xs text-gray-500">{selectedStudent.lesson_day_time}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 bg-gray-100 rounded-full text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-5">
              <button 
                type="button"
                onClick={() => openWhatsApp(selectedStudent.phone)}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl font-medium shadow-sm active:opacity-80"
              >
                <MessageCircle size={20} />
                Chamar no WhatsApp
              </button>

              <form id="lesson-form" onSubmit={handleSaveLesson} className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status da Aula (Hoje)</label>
                  <select name="status" required className="w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Selecione...</option>
                    <option value="presenca">Presença Normal</option>
                    <option value="falta">Falta</option>
                    <option value="reposicao">Reposição</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Resumo da Aula</label>
                  <textarea name="summary" rows="2" defaultValue={selectedStudent.last_lesson_summary} placeholder="O que foi passado hoje?" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"></textarea>
                </div>

                <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                  <label className="block text-sm font-semibold text-indigo-900 mb-1">Tarefa da Semana</label>
                  <textarea name="homework_text" rows="3" defaultValue={selectedStudent.weekly_homework_text} placeholder="Descreva a lição de casa..." className="w-full p-2.5 border border-indigo-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm mb-3"></textarea>

                  <label className="block text-xs font-semibold text-indigo-800 mb-1">URL da Imagem/Partitura</label>
                  <input name="homework_image" type="url" defaultValue={selectedStudent.weekly_homework_image_url} placeholder="https://..." className="w-full p-2.5 border border-indigo-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
              </form>
            </div>

            <div className="p-4 border-t bg-white pb-safe">
              <button 
                type="submit" 
                form="lesson-form"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg shadow-md active:bg-indigo-700 disabled:opacity-70"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : 'Salvar Atualizações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}