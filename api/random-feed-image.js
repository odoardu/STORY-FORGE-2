import photos from '../assets/linkin-park/photos.json' with { type: 'json' };
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Metodo nao permitido' });
  }
  const photo = photos[Math.floor(Math.random() * photos.length)];
  res.setHeader('Cache-Control', 'no-store');
  return res.redirect(302, photo.path);
}
