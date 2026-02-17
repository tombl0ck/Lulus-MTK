import { Topic } from './types';
import { Calculator, Circle, BarChart3, PieChart, Box } from 'lucide-react';
import React from 'react';

// Using standard Lucide icons but mapped to simple string IDs for the logic, 
// the rendering will happen in components.
export const TOPICS: Topic[] = [
  {
    id: 'bilangan-bulat',
    title: 'Bilangan Bulat',
    description: 'Operasi hitung positif & negatif',
    icon: 'Calculator',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    id: 'lingkaran',
    title: 'Lingkaran',
    description: 'Luas, Keliling & Unsur',
    icon: 'Circle',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200'
  },
  {
    id: 'bangun-ruang',
    title: 'Bangun Ruang',
    description: 'Volume & Luas Permukaan',
    icon: 'Box',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  {
    id: 'statistika',
    title: 'Pengolahan Data',
    description: 'Mean, Median, Modus',
    icon: 'BarChart3',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200'
  },
  {
    id: 'pecahan',
    title: 'Pecahan & Desimal',
    description: 'Operasi Campuran',
    icon: 'PieChart',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200'
  }
];

export const SYSTEM_INSTRUCTION_QUIZ = `
Kamu adalah pembuat soal matematika ahli untuk siswa kelas 6 SD Kurikulum Merdeka Indonesia.
Tugasmu adalah membuat SATU soal pilihan ganda berdasarkan topik yang diminta.
Soal harus menantang tapi sesuai tingkat kemampuan siswa 12 tahun.
Gunakan format JSON yang valid.
`;

export const SYSTEM_INSTRUCTION_CHAT = `
Kamu adalah "Pak Budi", seorang guru matematika digital yang ramah, sabar, dan seru untuk siswa kelas 6 SD.
Gunakan bahasa Indonesia yang santai tapi baku, mudah dimengerti anak-anak.
Jangan memberikan jawaban langsung. Bimbing siswa untuk menemukan jawabannya sendiri (metode scaffolding).
Gunakan emoji yang sesuai agar percakapan terasa hidup.
Jika siswa bertanya topik di luar matematika, arahkan kembali ke matematika dengan halus.
Nama siswamu adalah "Sobat Juara".
`;
