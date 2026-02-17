import React, { useState } from 'react';
import { Key, Lock, ExternalLink, ChevronRight, ShieldCheck } from 'lucide-react';

interface AccessModalProps {
  onSave: (key: string) => void;
}

const AccessModal: React.FC<AccessModalProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim().length > 10) {
      onSave(inputKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl text-center border-4 border-white ring-4 ring-blue-500/20">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <Lock size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Selamat Datang!</h2>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
          Untuk mulai belajar, masukkan <strong>Google Gemini API Key</strong> kamu ya.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Key className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Tempel API Key di sini..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all font-mono text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={inputKey.length < 10}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
          >
            Mulai Belajar <ChevronRight size={20} className="ml-2" />
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-1 text-[10px] text-slate-400">
           <ShieldCheck size={12} />
           <span>Kunci tersimpan aman di browser kamu (Local Storage).</span>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2">Belum punya kunci?</p>
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border border-blue-100"
          >
            <ExternalLink size={14} className="mr-2" />
            Ambil Gratis di Google AI Studio
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccessModal;