const FAL_ENDPOINT = 'minimax/h3-max/text-to-video';
const ID_PATTERN = /^[0-9a-f-]{20,64}$/i;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.FAL_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Video generation is not configured.' });

  const requestId = String(req.query.id || '');
  if (!ID_PATTERN.test(requestId)) return res.status(400).json({ error: 'Invalid request ID.' });

  try {
    const base = `https://queue.fal.run/${FAL_ENDPOINT}/requests/${encodeURIComponent(requestId)}`;
    const statusResponse = await fetch(`${base}/status`, {
      headers: { Authorization: `Key ${apiKey}` }
    });
    const statusData = await statusResponse.json().catch(() => ({}));
    if (!statusResponse.ok) {
      return res.status(statusResponse.status).json({ error: statusData.detail || 'Could not retrieve render status.' });
    }

    if (statusData.status !== 'COMPLETED') {
      return res.status(200).json({ status: statusData.status || 'IN_QUEUE' });
    }

    const resultResponse = await fetch(base, {
      headers: { Authorization: `Key ${apiKey}` }
    });
    const resultData = await resultResponse.json().catch(() => ({}));
    if (!resultResponse.ok) {
      return res.status(resultResponse.status).json({ error: resultData.detail || 'Could not retrieve the generated video.' });
    }

    return res.status(200).json({ status: 'COMPLETED', video: resultData.video });
  } catch (error) {
    console.error('fal status error:', error);
    return res.status(502).json({ error: 'Could not check the AI video service. Please try again.' });
  }
}
