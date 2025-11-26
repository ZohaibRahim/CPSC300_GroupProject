// backendAPIs/src/routes/aiRoutes.ts
import express from "express";
import { ResumeAnalyzer } from "../ai/resumeAnalyzer";
import { AIConfig } from "../ai/aiService";

const router = express.Router();

const aiConfig: AIConfig = {
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
};

const analyzer = new ResumeAnalyzer(aiConfig);

router.post("/analyze", async (req, res) => {
  const { job_description, resume_text, use_ai } = req.body || {};

  if (!job_description || !resume_text) {
    return res.status(400).json({
      error: "job_description and resume_text are required",
    });
  }

  try {
    const rawResult =
      use_ai === true
        ? await analyzer.analyze({ job_description, resume_text }, true)
        : analyzer.quickAnalyze({ job_description, resume_text });

    // hard-normalize so frontend always receives proper types
    const result = {
      match_score: Number(rawResult.match_score ?? 0),
      missing_skills: Array.isArray(rawResult.missing_skills)
        ? rawResult.missing_skills
        : [],
      matched_skills: Array.isArray(rawResult.matched_skills)
        ? rawResult.matched_skills
        : [],
      summary: String(rawResult.summary ?? ""),
      keyword_density: Number(rawResult.keyword_density ?? 0),
      experience_match: Number(rawResult.experience_match ?? 0),
      ai_suggestions:
        typeof rawResult.ai_suggestions === "string"
          ? rawResult.ai_suggestions
          : null,
    };

    return res.json(result);
  } catch (err: any) {
    console.error("[AI ROUTE ERROR]", err);
    return res.status(500).json({ error: "AI analysis failed" });
  }
});

export default router;
