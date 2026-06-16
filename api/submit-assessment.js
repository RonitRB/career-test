module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body;
    // Minimal validation
    if (!payload || !payload.submittedAt) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // Log the submission to Vercel function logs (visible in Vercel dashboard)
    console.log("[submit-assessment] received:", JSON.stringify(payload));

    // TODO: persist to a database, Google Sheets, Airtable, email, etc.

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[submit-assessment] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
