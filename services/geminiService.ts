import { QuizQuestion } from '../types';
import { SYSTEM_INSTRUCTION_CHAT } from '../constants';

export const generateQuizQuestion = async (topicTitle: string): Promise<QuizQuestion> => {
  try {
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

    const response = await fetch('/.netlify/functions/buatSoal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt })
    });

    if (!response.ok) {
      throw new Error(`Koneksi bermasalah (Error ${response.status})`);
    }

    const data = await response.json();
    
    if (data.error) {
       console.error("ALASAN DARI GOOGLE:", data.error);
       throw new Error(data.error.message || data.error);
    }
    if (!data.candidates) throw new Error("Format jawaban dari Google tidak dikenali");

    let textResponse = data.candidates[0].content.parts[0].text;
    textResponse = textResponse.replace(/```json/gi, '').replace(/```/gi, '').trim();

    return JSON.parse(textResponse) as QuizQuestion;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return {
      question: "Wah, Dapur sedang sibuk menyiapkan soal. Sebagai pemanasan, berapa hasil dari 12 x 12?",
      options: ["122", "144", "124", "142"],
      correctIndex: 1,
      explanation: "Perkalian 12 x 12 adalah 144."
    };
  }
};

export const createTutorChat = () => {
  let history: { role: string, text: string }[] = [];

  return {
    sendMessageStream: async function* (message: string) {
      try {
        const response = await fetch('/.netlify/functions/tanyaPakBudi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            history: history, 
            message: message,
            systemInstruction: SYSTEM_INSTRUCTION_CHAT 
          })
        });

        // --- PEREDAM KEJUT BARU ---
        // Jika Netlify memutus sambungan (bukan status 200 OK)
        if (!response.ok) {
          if (response.status === 504) {
            throw new Error("Waduh, Pak Budi mikirnya agak kelamaan dan diputus oleh server (Timeout 504). Coba klik kirim lagi ya, mesinnya sudah panas kok!");
          }
          throw new Error(`Oops, ada masalah jaringan (Error ${response.status})`);
        }
        // --------------------------

        const data = await response.json();

        if (data.error) {
           alert("PESAN DARI GOOGLE: " + data.error);
           throw new Error(data.error);
        }

        history.push({ role: 'user', text: message });
        history.push({ role: 'model', text: data.text });

        yield { text: data.text };

      } catch (error: any) {
        console.error("Error chat:", error);
        yield { text: error.message };
      }
    }
  } as any;
};
