export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Metodo nao permitido' });
  }
  try {
    const requestUrl = new URL(req.url, 'http://localhost');
    const seed = (requestUrl.searchParams.get('seed') || String(Date.now())).slice(0, 200);
    const response = await fetch(`https://picsum.photos/1080/1350?random=${encodeURIComponent(seed)}`, {
      redirect: 'follow', signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error('Falha na fonte de imagens');
    const body = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(body);
  } catch {
    return res.status(502).json({ ok: false, error: 'Nao foi possivel buscar uma imagem aleatoria. Tente novamente ou envie uma imagem.' });
  }
}
