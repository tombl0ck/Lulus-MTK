import React, { useState } from 'react';
import { TOPICS } from './constants';
import { Topic, AppView } from './types';
import TopicCard from './components/TopicCard';
import QuizView from './components/QuizView';
import ChatTutor from './components/ChatTutor';
import { GraduationCap, MessageCircle, Star, Instagram, Coffee, Link } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setView(AppView.QUIZ);
  };

  const handleBackToHome = () => {
    setView(AppView.HOME);
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <header className="px-6 py-5 flex justify-between items-center max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-200">
               <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 leading-none">LulusMath</h1>
              <span className="text-xs font-bold text-blue-600 tracking-wider">KELAS 6 SD</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 border border-blue-100 px-4 py-2 rounded-full font-bold shadow-sm transition-all hover:shadow-md"
            >
              <MessageCircle size={20} />
              <span className="hidden sm:inline">Tanya Pak Budi</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6">
          {view === AppView.HOME && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="text-center mb-10 mt-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
                  Siap Ujian & Masuk SMP? 🚀
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Pilih topik matematika di bawah ini untuk mulai latihan soal. 
                  Jangan takut salah, kita belajar sama-sama!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOPICS.map((topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    onClick={handleTopicClick} 
                  />
                ))}
                
                {/* Coming Soon Card */}
                <div className="border-2 border-dashed border-slate-300 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 min-h-[200px]">
                  <Star size={32} className="mb-2 opacity-50" />
                  <span className="font-bold">Topik Lainnya Segera Hadir</span>
                </div>
              </div>
            </div>
          )}

          {view === AppView.QUIZ && selectedTopic && (
            <QuizView topic={selectedTopic} onBack={handleBackToHome} />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-12 py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-slate-700 flex items-center justify-center md:justify-start gap-2">
                <GraduationCap size={20} className="text-blue-600"/> LulusMath
              </h4>
              <p className="text-slate-500 text-sm mt-1 font-medium">© {new Date().getFullYear()} Belajar jadi lebih mudah.</p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dukung Developer</span>
              <div className="flex flex-wrap justify-center gap-3">
                <a 
                  href="https://saweria.co/tomblock" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 rounded-full text-sm font-bold transition-colors border border-yellow-200"
                >
                  <Coffee size={16} /> Saweria
                </a>
                <a 
                  href="https://lynk.id/tomblock" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 rounded-full text-sm font-bold transition-colors border border-green-200"
                >
                  <Link size={16} /> Lynk.id
                </a>
                <a 
                  href="https://www.instagram.com/tombl0ck/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 hover:bg-pink-100 hover:text-pink-800 rounded-full text-sm font-bold transition-colors border border-pink-200"
                >
                  <Instagram size={16} /> @tombl0ck
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Chat Overlay */}
      {showChat && <ChatTutor onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default App;
