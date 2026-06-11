// Wöchentlicher Ping, damit das Supabase-Free-Projekt nie wegen Inaktivität pausiert.
// Wird von Vercel Cron (siehe vercel.json) jeden Montag um 8:00 UTC aufgerufen.
module.exports = async (req, res) => {
  try {
    const r = await fetch(
      "https://szoyhphyhacgjhyzrodz.supabase.co/rest/v1/fl_lists?select=id&limit=1",
      { headers: { apikey: "sb_publishable_fvV4E6YpI4YWeUFHOwJgEA_UknQi5RG" } }
    );
    res.status(200).json({ ok: r.ok, status: r.status, ts: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
};
