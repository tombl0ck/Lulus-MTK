import { QuizQuestion } from '../types';

export const generateQuizQuestion = async (topicTitle: string): Promise<QuizQuestion> => {
  try {
    // Kita buat pesanan yang sangat spesifik agar AI di Dapur merespons dengan format yang benar
    const prompt = `Buatlah 1 soal matematika pilihan ganda tentang "${topicTitle}". 
    Pastikan angkanya tidak terlalu rumit agar bisa dikerjakan dalam 2-3 menit.
    Berikan penjelasan langkah demi langkah yang sangat jelas di bagian 'explanation'.
    
    PENTING: Kamu WAJIB membalas HANYA dengan format JSON yang valid persis seperti di bawah ini, tanpa awalan atau akhiran teks apapun:
    {
      "question": "pertanyaan soal",
      "options": ["opsi A", "opsi B", "opsi C", "opsi D"],
      "correctIndex": 0,
      "explanation": "penjelasan jawaban"
    }`;

    // Mengirim pesanan ke Dapur Netlify kita
    const response = await fetch('/.netlify/functions/buatSoal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt })
    });

    const data = await response.json();
    
    // Mengambil teks balasan dari Dapur
    let textResponse = data.candidates[0].content.parts[0].text;
    
    // Membersihkan format tambahan (seperti ```json ) jika kebetulan AI menambahkannya
    textResponse = textResponse.replace(/```json/gi, '').replace(/```/gi, '').trim();

    return JSON.parse(textResponse) as QuizQuestion;
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Jika Dapur sedang error, tampilkan soal darurat ini agar web tidak nge-blank
    return {
      question: "Wah, Dapur sedang sibuk menyiapkan soal. Sebagai pemanasan, berapa hasil dari 12 x 12?",
      options: ["122", "144", "124", "142"],
      correctIndex: 1,
      explanation: "Perkalian 12 x 12 adalah 144."
    };
  }
};

// Fitur Chat ("Tanya Pak Budi") untuk sementara kita buat mode "istirahat"
// Karena fitur chat butuh Dapur khusus yang bisa mengingat riwayat obrolan panjang
export const createTutorChat = () => {
  return {
    sendMessage: async (message: string) => {
      return {
        text: "Halo! Maaf ya, fitur 'Tanya Pak Budi' sedang dalam perbaikan karena kita baru saja pindah ke server baru yang lebih aman. Silakan coba latihan soalnya dulu ya! 🚀"
      };
    }
  } as any;
};
