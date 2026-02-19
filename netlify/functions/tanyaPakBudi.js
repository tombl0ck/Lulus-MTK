exports.handler = async function(event, context) {
  // Hanya menerima jalur komunikasi yang benar
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Metode tidak diizinkan' };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const dataDariFrontend = JSON.parse(event.body);
  
  // Membongkar paket dari frontend: Riwayat chat, pesan baru, dan Sifat Pak Budi
  const history = dataDariFrontend.history || [];
  const pesanBaru = dataDariFrontend.message;
  const sifatPakBudi = dataDariFrontend.systemInstruction;

  // Menyusun format riwayat chat agar dipahami oleh Google AI
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));
  
  // Memasukkan pesan terbaru dari anak SD ke urutan paling bawah
  contents.push({ role: 'user', parts: [{ text: pesanBaru }] });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sifatPakBudi }] },
        contents: contents
      })
    });

    const data = await response.json();
    
    // CCTV untuk menangkap error dari Google jika ada
    if (data.error) throw new Error(data.error.message);

    // Mengirim balasan Pak Budi ke frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ text: data.candidates[0].content.parts[0].text })
    };
  } catch (error) {
    console.error("Error Dapur Pak Budi:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
