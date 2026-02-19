exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Metode tidak diizinkan' };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const dataDariFrontend = JSON.parse(event.body);
    
    const history = dataDariFrontend.history || [];
    const pesanBaru = dataDariFrontend.message;
    
    // Jaga-jaga kalau variabel sifat asli Pak Budi tidak terbaca oleh sistem
    const sifatPakBudi = dataDariFrontend.systemInstruction || "Kamu adalah Pak Budi, guru matematika SD yang sabar.";

    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || "lanjut" }]
    }));
    
    // Masukkan pesan terbaru ke tumpukan paling bawah
    contents.push({ role: 'user', parts: [{ text: pesanBaru }] });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sifatPakBudi }] },
        contents: contents
      })
    });

    const data = await response.json();
    
    // CCTV: Kalau Google menolak, kirim alasan penolakannya ke frontend
    if (data.error) {
      return { statusCode: 200, body: JSON.stringify({ error: data.error.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ text: data.candidates[0].content.parts[0].text })
    };
  } catch (error) {
    return { statusCode: 200, body: JSON.stringify({ error: error.message }) };
  }
};
