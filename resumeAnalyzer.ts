// ============================================================================
// MAIN RESUME ANALYZER - Combines Everything
// ============================================================================
// resumeAnalyzer.ts

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

/**
 * Main Resume Analyzer - Combines skill matching and AI
 */
export class ResumeAnalyzer {
  private aiService: AIService;
  private skillMatcher: SkillMatcher;

  constructor(config: AIConfig) {
    this.aiService = new AIService(config);
    this.skillMatcher = new SkillMatcher();
  }

  /**
   * Analyze resume against job description
   * Uses skill matching algorithm (fast) + optional AI enhancement
   * 
   * @param input - Job description and resume text
   * @param useAI - Whether to include AI suggestions (slower but more detailed)
   * @returns Analysis results with match score, skills, and optional AI suggestions
   */
  async analyze(input: AnalysisInput, useAI: boolean = true): Promise<AnalysisOutput> {
    // Step 1: Run skill matching algorithm (always, no API calls, instant)
    const matchResult = this.skillMatcher.match(
      input.job_description,
      input.resume_text
    );

    // Step 2: Optionally enhance with AI suggestions
    let aiSuggestions: string | undefined;
    
    if (useAI) {
      const prompt = this.buildAIPrompt(input, matchResult);
      const aiResponse = await this.aiService.callAI(
        prompt,
        'You are a career coach helping candidates improve their resumes. Provide concise, actionable advice.'
      );

      if (aiResponse.success) {
        aiSuggestions = typeof aiResponse.data === 'string' 
          ? aiResponse.data 
          : JSON.stringify(aiResponse.data);
      }
    }

    return {
      ...matchResult,
      ai_suggestions: aiSuggestions
    };
  }

  /**
   * Quick analysis without AI (instant results)
   * 
   * @param input - Job description and resume text
   * @returns Match results using algorithmic analysis only
   */
  quickAnalyze(input: AnalysisInput): MatchResult {
    return this.skillMatcher.match(input.job_description, input.resume_text);
  }

  /**
   * Get AI-powered suggestions only (no skill matching)
   * 
   * @param input - Job description and resume text
   * @returns AI suggestions as string
   */
  async getAISuggestions(input: AnalysisInput): Promise<string | null> {
    const prompt = `Analyze this resume against the job description and provide 5 specific, actionable suggestions to improve it:

JOB DESCRIPTION:
${input.job_description}

RESUME:
${input.resume_text}

Provide clear, numbered suggestions focusing on:
1. Keywords to add
2. Experience to highlight
3. Skills to emphasize
4. Formatting improvements
5. Content optimization

Keep each suggestion concise (1-2 sentences).`;

    const response = await this.aiService.callAI(
      prompt,
      'You are an expert resume coach.'
    );

    if (response.success) {
      return typeof response.data === 'string' 
        ? response.data 
        : JSON.stringify(response.data, null, 2);
    }

    return null;
  }

  /**
   * Build AI prompt for analysis
   */
  private buildAIPrompt(input: AnalysisInput, matchResult: MatchResult): string {
    return `Based on this resume analysis, provide 3 specific, actionable suggestions to improve the resume for this job:

ANALYSIS RESULTS:
- Match Score: ${matchResult.match_score}%
- Matched Skills: ${matchResult.matched_skills.join(', ')}
- Missing Skills: ${matchResult.missing_skills.join(', ')}
- Experience Match: ${matchResult.experience_match}%

JOB DESCRIPTION:
${input.job_description}

RESUME:
${input.resume_text}

Provide 3 specific suggestions:
1. What keywords or skills to add
2. How to better highlight relevant experience
3. One formatting or content improvement

Keep each suggestion to 1-2 sentences.`;
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*

import { ResumeAnalyzer } from './resumeAnalyzer';

// Initialize
const analyzer = new ResumeAnalyzer({
  apiEndpoint: 'http://localhost:3000/api/ai',
  provider: 'backend'
});

// Example 1: Quick analysis (no AI, instant)
const quickResult = analyzer.quickAnalyze({
  job_description: "Senior Developer with React, Node.js, 5+ years...",
  resume_text: "Software Engineer with 6 years experience in React..."
});

console.log(quickResult);
// Output:
// {
//   match_score: 85,
//   matched_skills: ['react', 'node.js', '5+ years'],
//   missing_skills: ['docker', 'aws'],
//   summary: 'Excellent match! 3 key skills matched...',
//   keyword_density: 2.1,
//   experience_match: 100
// }


// Example 2: Full analysis with AI (slower, more detailed)
const fullResult = await analyzer.analyze({
  job_description: "Senior Developer with React, Node.js, 5+ years...",
  resume_text: "Software Engineer with 6 years experience in React..."
}, true); // true = use AI

console.log(fullResult);
// Output includes all above PLUS:
// {
//   ...matchResult,
//   ai_suggestions: "1. Add Docker and AWS experience...\n2. Quantify achievements...\n3. Add leadership examples..."
// }


// Example 3: Get only AI suggestions
const suggestions = await analyzer.getAISuggestions({
  job_description: "...",
  resume_text: "..."
});

console.log(suggestions);


// Example 4: Use in an API endpoint
app.post('/api/analyze', async (req, res) => {
  const { job_description, resume_text, use_ai } = req.body;
  
  const analyzer = new ResumeAnalyzer({
    apiEndpoint: process.env.AI_API_ENDPOINT,
    provider: 'backend'
  });
  
  const result = await analyzer.analyze(
    { job_description, resume_text },
    use_ai || false
  );
  
  res.json(result);
});


// Example 5: Use in React component
function ResumeAnalysisComponent() {
  const [result, setResult] = useState(null);
  
  const handleAnalyze = async () => {
    const analyzer = new ResumeAnalyzer({
      apiEndpoint: '/api/ai',
      provider: 'backend'
    });
    
    const analysis = await analyzer.analyze({
      job_description: jobText,
      resume_text: resumeText
    }, useAI);
    
    setResult(analysis);
  };
  
  return (
    <div>
      <button onClick={handleAnalyze}>Analyze</button>
      {result && (
        <div>
          <h3>Match Score: {result.match_score}%</h3>
          <p>Missing Skills: {result.missing_skills.join(', ')}</p>
          {result.ai_suggestions && (
            <p>AI Suggestions: {result.ai_suggestions}</p>
          )}
        </div>
      )}
    </div>
  );
}

*/