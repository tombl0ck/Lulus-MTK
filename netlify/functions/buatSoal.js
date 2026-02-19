exports.handler = async function(event, context) {
  // Hanya menerima permintaan POST dari frontend
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Metode tidak diizinkan' };
  }

  // Mengambil kunci rahasia dari brankas Netlify
  const apiKey = process.env.GEMINI_API_KEY;
  const pesananDariUser = JSON.parse(event.body).prompt;

  try {
    // Koki yang benar dan aktif: gemini-3-flash-preview
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: pesananDariUser }] }]
      })
    });

    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Gagal membuat soal' }) };
  }
};
