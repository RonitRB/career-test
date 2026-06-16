module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body;
    if (!payload || !payload.submittedAt) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    console.log("[submit-assessment] received submission at", payload.submittedAt);

    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || "Submissions";

    if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID) {
      // Prepare fields -- store full JSON in `Payload` and some top-level columns if present
      const fields = {
        SubmittedAt: payload.submittedAt,
        RespondentName: payload.respondent?.name || "",
        RespondentAge: payload.respondent?.age || "",
        Course: payload.respondent?.currentCourse || "",
        College: payload.respondent?.college || "",
        Payload: JSON.stringify(payload),
      };

      const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;

      try {
        const resp = await fetch(airtableUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ records: [{ fields }] }),
        });

        if (!resp.ok) {
          const text = await resp.text();
          console.error("[submit-assessment] Airtable error:", resp.status, text);
        } else {
          const data = await resp.json();
          console.log("[submit-assessment] saved to Airtable, record id:", data?.records?.[0]?.id);
        }
      } catch (err) {
        console.error("[submit-assessment] Airtable request failed:", err);
      }
    } else {
      console.log("[submit-assessment] Airtable not configured; skipping persistence.");
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[submit-assessment] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
