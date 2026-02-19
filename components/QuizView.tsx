import React, { useEffect, useState } from 'react';
import { Topic, QuizQuestion, QuizState } from '../types';
import { generateQuizQuestion } from '../services/geminiService';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Trophy, Loader2, Home } from 'lucide-react';

interface QuizViewProps {
  topic: Topic;
  onBack: () => void;
  // apiKey dihapus dari sini karena sudah aman di Dapur Netlify
}

const QuizView: React.FC<QuizViewProps> = ({ topic, onBack }) => {
  const [state, setState] = useState<QuizState>({
    currentQuestion: null,
    isLoading: true,
    selectedAnswer: null,
    isCorrect: null,
    score: 0,
    streak: 0,
    totalAnswered: 0
  });

  const loadQuestion = async () => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      selectedAnswer: null, 
      isCorrect: null,
      currentQuestion: null
    }));
    
    // Memanggil kurir pembuat soal tanpa perlu membawa API Key lagi!
    const q = await generateQuizQuestion(topic.title);
    
    setState(prev => ({ 
      ...prev, 
      isLoading: false, 
      currentQuestion: q 
    }));
  };

  useEffect(() => {
    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const handleAnswer = (index: number) => {
    if (state.selectedAnswer !== null || !state.currentQuestion) return;

    const correct = index === state.currentQuestion.correctIndex;
    
    setState(prev => ({
      ...prev,
      selectedAnswer: index,
      isCorrect: correct,
      score: correct ? prev.score + 10 : prev.score,
      streak: correct ? prev.streak + 1 : 0,
      totalAnswered: prev.totalAnswered + 1
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-slate-800 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200"
        >
          <Home size={18} className="mr-2" />
          Beranda
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold border border-yellow-200 shadow-sm">
            <Trophy size={18} className="mr-2 text-yellow-600" />
            {state.score} Poin
          </div>
          <div className="hidden sm:flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-bold border border-orange-200 shadow-sm">
            🔥 {state.streak}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border-b-4 border-slate-200 overflow-hidden min-h-[400px]">
        {state.isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
            <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
            <p className="font-medium animate-pulse">Sedang membuat soal...</p>
          </div>
        ) : state.currentQuestion ? (
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${topic.bgColor} ${topic.color}`}>
                {topic.title}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                {state.currentQuestion.question}
              </h2>
            </div>

            <div className="grid gap-3 md:gap-4 mb-8">
              {state.currentQuestion.options.map((option, idx) => {
                let btnClass = "border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50 bg-slate-50 text-slate-700";
                
                if (state.selectedAnswer !== null) {
                  if (idx === state.currentQuestion!.correctIndex) {
                    btnClass = "border-green-500 bg-green-100 text-green-800 ring-2 ring-green-200";
                  } else if (idx === state.selectedAnswer) {
                    btnClass = "border-red-400 bg-red-100 text-red-800";
                  } else {
                    btnClass = "opacity-50 border-slate-100 bg-slate-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={state.selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl font-semibold transition-all duration-200 transform ${state.selectedAnswer === null ? 'active:scale-98' : ''} ${btnClass}`}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-sm font-bold border border-slate-200 mr-3 shadow-sm">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                      {state.selectedAnswer !== null && idx === state.currentQuestion!.correctIndex && (
                         <CheckCircle2 className="ml-auto text-green-600" />
                      )}
                      {state.selectedAnswer === idx && idx !== state.currentQuestion!.correctIndex && (
                         <XCircle className="ml-auto text-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {state.selectedAnswer !== null && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className={`rounded-2xl p-5 mb-6 border-l-4 ${state.isCorrect ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'}`}>
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    {state.isCorrect ? <span className="text-green-700">Hebat! Benar 🎉</span> : <span className="text-blue-700">Pembahasan 💡</span>}
                  </h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {state.currentQuestion.explanation}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={loadQuestion}
                    className="flex items-center bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                  >
                    Soal Berikutnya <ArrowRight className="ml-2" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-red-500">
            <p>Gagal memuat soal. Coba lagi ya.</p>
            <button onClick={loadQuestion} className="mt-4 flex items-center mx-auto text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
              <RefreshCw size={16} className="mr-2" /> Ulangi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
