// src/ai/resumeAnalyzer.ts
import { AIService, AIConfig } from './aiService';
import { SkillMatcher, MatchResult } from './skillMatcher';

export interface AnalysisInput {
  job_description: string;
  resume_text: string;
}

export interface AnalysisOutput {
  match_score: number;
  missing_skills: string[];
  matched_skills: string[];
  summary: string;
  keyword_density: number;
  experience_match: number;
  ai_suggestions?: string;
}

export class ResumeAnalyzer {
  private aiService: AIService;
  private skillMatcher: SkillMatcher;

  constructor(config: AIConfig) {
    this.aiService = new AIService(config);
    this.skillMatcher = new SkillMatcher();
  }

  async analyze(input: AnalysisInput, useAI: boolean = false): Promise<AnalysisOutput> {
    const matchResult = this.skillMatcher.match(
      input.job_description,
      input.resume_text
    );

    let aiSuggestions = 'AI suggestions unavailable';

    if (useAI) {
      try {
        const prompt = this.buildAIPrompt(input, matchResult);
        console.log('[ResumeAnalyzer] Calling AI, useAI =', useAI);

        const aiResponse = await this.aiService.callAI(
          prompt,
          'You are a career coach. Provide SHORT, bullet-point suggestions. Each point should be ONE sentence max.'
        );

        console.log('[ResumeAnalyzer] aiResponse.success:', aiResponse.success);

        if (aiResponse.success && aiResponse.data) {
          aiSuggestions =
            typeof aiResponse.data === 'string'
              ? aiResponse.data
              : JSON.stringify(aiResponse.data);
        } else {
          aiSuggestions = 'AI was unable to generate suggestions.';
        }
      } catch (error) {
        console.error('AI suggestion error:', error);
        aiSuggestions = 'AI suggestions currently unavailable. Try again later.';
      }
    }

    return {
      ...matchResult,
      ai_suggestions: aiSuggestions
    };
  }

  quickAnalyze(input: AnalysisInput): MatchResult {
    return this.skillMatcher.match(input.job_description, input.resume_text);
  }

  async getAISuggestions(input: AnalysisInput): Promise<string> {
    const prompt = `Analyze this resume vs job and give EXACTLY 3 one-sentence tips:

JOB: ${input.job_description.substring(0, 400)}
RESUME: ${input.resume_text.substring(0, 400)}

Format:
1. [One sentence tip]
2. [One sentence tip]
3. [One sentence tip]`;

    try {
      const response = await this.aiService.callAI(
        prompt,
        'You are a resume coach. Be extremely concise.'
      );

      if (response.success && response.data) {
        return typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data, null, 2);
      }

      return 'AI suggestions unavailable at this time.';
    } catch (error) {
      console.error('AI error:', error);
      return 'Unable to generate AI suggestions. Please try again.';
    }
  }

  private buildAIPrompt(input: AnalysisInput, matchResult: MatchResult): string {
    return `You are a resume expert. Based on this analysis, provide EXACTLY 3 SHORT suggestions (one sentence each).

ANALYSIS:
Match: ${matchResult.match_score}%
Matched: ${matchResult.matched_skills.slice(0, 5).join(', ')}
Missing: ${matchResult.missing_skills.slice(0, 5).join(', ')}

JOB: ${input.job_description.substring(0, 500)}
RESUME: ${input.resume_text.substring(0, 500)}

Respond ONLY with 3 numbered points. Each point ONE sentence. No introduction, no conclusion.

Example format:
1. Add "Docker" and "Kubernetes" to your skills section.
2. Quantify achievements with numbers (e.g., "Improved performance by 40%").
3. Highlight leadership experience in project descriptions.`;
  }
}
