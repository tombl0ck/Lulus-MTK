exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Metode tidak diizinkan' };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const dataDariFrontend = JSON.parse(event.body);
    
    const history = dataDariFrontend.history || [];
    const pesanBaru = dataDariFrontend.message;
    const sifatPakBudi = dataDariFrontend.systemInstruction || "Kamu adalah guru matematika.";

    // MESIN PEMBERSIH TEKS:
    // Apapun bentuk kiriman dari frontend (teks, array, atau objek), 
    // mesin ini akan memaksanya menjadi teks murni agar Google tidak bingung.
    const ekstrakTeks = (data) => {
      if (typeof data === 'string') return data;
      if (Array.isArray(data) && data[0]?.text) return data[0].text;
      if (data && typeof data.text === 'string') return data.text;
      return JSON.stringify(data);
    };

    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: ekstrakTeks(msg.text) }]
    }));
    
    // Memasukkan pesan terbaru yang sudah dibersihkan ke tumpukan paling bawah
    contents.push({ role: 'user', parts: [{ text: ekstrakTeks(pesanBaru) }] });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: ekstrakTeks(sifatPakBudi) }] },
        contents: contents
      })
    });

    const data = await response.json();
    
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
