const FAL_ENDPOINT = 'minimax/h3-max/text-to-video';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Video generation is not configured yet. Add FAL_KEY in your Vercel project environment variables.' });
  }

  const { prompt, aspect_ratio = '9:16', duration = 5, resolution = '768P' } = req.body || {};
  if (typeof prompt !== 'string' || prompt.trim().length < 12 || prompt.length > 2000) {
    return res.status(400).json({ error: 'Prompt must contain between 12 and 2,000 characters.' });
  }
  if (!['9:16', '16:9', '1:1'].includes(aspect_ratio)) {
    return res.status(400).json({ error: 'Unsupported aspect ratio.' });
  }
  if (![5, 6, 8, 10].includes(Number(duration))) {
    return res.status(400).json({ error: 'Unsupported clip duration.' });
  }
  if (!['768P', '1080P'].includes(resolution)) {
    return res.status(400).json({ error: 'Unsupported resolution.' });
  }

  try {
    const response = await fetch(`https://queue.fal.run/${FAL_ENDPOINT}`, {
      method: 'POST',
      headers: {
        Authorization: `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        aspect_ratio,
        duration: Number(duration),
        resolution,
        prompt_expansion_mode: 'balanced'
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({ error: data.detail || data.message || 'The AI provider rejected the request.' });
    }
    return res.status(202).json({ request_id: data.request_id, status: data.status || 'IN_QUEUE' });
  } catch (error) {
    console.error('fal submit error:', error);
    return res.status(502).json({ error: 'Could not reach the AI video service. Please try again.' });
  }
}
