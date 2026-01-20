
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const input = req.body.input || '';
  const type = req.body.type || 'url';

  // Construir el prompt según el tipo
  let prompt = '';
  if (type === 'url') {
    prompt = `Analiza esta URL para detectar phishing: ${input}\n\nProporciona un análisis de seguridad en el siguiente formato JSON:\n{\n  "riesgo": "alto|medio|bajo",\n  "esPhishing": true|false,\n  "confianza": 0-100,\n  "indicadores": ["lista", "de", "señales"],\n  "explicacion": "explicación simple para usuarios sin conocimientos técnicos",\n  "recomendacion": "qué debe hacer el usuario"\n}`;
  } else {
    prompt = `Analiza este mensaje/conversación para detectar phishing o fraude:\n\n${input}\n\nProporciona un análisis de seguridad en el siguiente formato JSON:\n{\n  "riesgo": "alto|medio|bajo",\n  "esPhishing": true|false,\n  "confianza": 0-100,\n  "indicadores": ["lista", "de", "señales"],\n  "explicacion": "explicación simple para usuarios sin conocimientos técnicos",\n  "recomendacion": "qué debe hacer el usuario"\n}`;
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'API key no configurada' });
      return;
    }

    // Llamada a OpenAI Chat API (gpt-4o)
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.2
      })
    });

    const data = await openaiRes.json();
    const text = data.choices?.[0]?.message?.content || '';
    // Extraer JSON de la respuesta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      res.status(200).json(result);
    } else {
      res.status(200).json({ error: 'No se pudo analizar la respuesta', raw: text });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al analizar', details: error.message });
  }
}
