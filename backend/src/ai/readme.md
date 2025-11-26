what each file does:
FilePurpose                                                      AI Required? 
skillMatcher.ts           Core matching algorithm                ❌ No
helpers.ts                Extract emails, phones, format text    ❌ No
aiService.ts              Call OpenAI/Anthropic/Backend          ✅ Yes
resumeAnalyzer.ts         Combine skill matching + AI            ⚠️ Optional
test-examples.ts          Sample data for testing                ❌ No
README.md                 Documentation                          ❌ No


What's Included

resume-analyzer/
├── aiService.ts          AI integration (OpenAI, Anthropic, Backend)
├── skillMatcher.ts        Algorithmic skill matching (NO AI required)
├── helpers.ts             Utility functions
├── resumeAnalyzer.ts      Main API combining everything
└── README.md             This file

 Installation

bash
 If using TypeScript
npm install



 Basic Usage

typescript
import { SkillMatcher } from './skillMatcher';

const matcher = new SkillMatcher();
const result = matcher.match(jobDescription, resumeText);
console.log(result);


 Core Functions

 1.SkillMatcher.match() - Algorithmic Matching (No AI)

What it does: Compares resume against job description using keyword matching and scoring algorithms.

Input:
typescript
{
  jobDescription: string;  // Job posting text
  resumeText: string;      // Resume text
}


Output:
typescript
{
  match_score: number;        // 0-100 overall match score
  missing_skills: string[];   // Skills in job but not in resume
  matched_skills: string[];   // Skills found in both
  summary: string;           // Human-readable summary
  keyword_density: number;   // How often keywords appear (%)
  experience_match: number;  // Experience requirements match (0-100)
}


Example:
typescript
const matcher = new SkillMatcher();

const result = matcher.match(
  "Senior Developer with React, Node.js, 5+ years experience",
  "Software Engineer, 6 years experience with React and JavaScript"
);

// Result:
// {
//   match_score: 75,
//   matched_skills: ['react', '5+ years'],
//   missing_skills: ['node.js'],
//   summary: 'Good match with 2 skills found...',
//   keyword_density: 1.8,
//   experience_match: 100
// }


 2. ResumeAnalyzer.analyze() - Full Analysis with AI

What it does: Runs skill matching + optionally gets AI suggestions for improvement.

Input:
typescript
{
  job_description: string;
  resume_text: string;
}


Output:
typescript
{
  match_score: number;
  missing_skills: string[];
  matched_skills: string[];
  summary: string;
  keyword_density: number;
  experience_match: number;
  ai_suggestions?: string;  // Only if useAI = true
}


Example:
typescript
import { ResumeAnalyzer } from './resumeAnalyzer';

const analyzer = new ResumeAnalyzer({
  apiEndpoint: 'http://localhost:3000/api/ai',
  provider: 'backend'
});

// Without AI (fast)
const quickResult = await analyzer.quickAnalyze({
  job_description: "...",
  resume_text: "..."
});

// With AI enhancement (slower but more detailed)
const fullResult = await analyzer.analyze({
  job_description: "...",
  resume_text: "..."
}, true); // true = use AI



 3. AIService.callAI() - Direct AI Integration

What it does: Sends prompts to AI providers (OpenAI, Anthropic, or your backend).

Configuration:
typescript
const aiService = new AIService({
  apiEndpoint: 'https://your-backend.com/api/ai',
  apiKey: 'your-api-key',        // Only for direct OpenAI/Anthropic
  provider: 'backend',           // 'openai' | 'anthropic' | 'backend'
  model: 'gpt-4-turbo-preview'   // AI model to use
});


Usage:
typescript
const response = await aiService.callAI(
  "Analyze this resume...",
  "You are a career coach"  // System message
);

if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error);
}




Helper Functions (helpers.ts)

 extractEmails(text: string): string[]
Extracts all email addresses from text.

typescript
const emails = extractEmails(resumeText);
// ['john@example.com', 'jane@company.com']


 extractPhoneNumbers(text: string): string[]
Extracts all phone numbers from text.

typescript
const phones = extractPhoneNumbers(resumeText);
// ['(123) 456-7890', '+1-555-123-4567']


 extractURLs(text: string): string[]
Extracts all URLs from text.

typescript
const urls = extractURLs(resumeText);
// ['https://github.com/user', 'https://linkedin.com/in/user']


 cleanText(text: string): string
Removes extra whitespace and special characters.

typescript
const clean = cleanText("  Hello    world!  \n\n");
// "Hello world!"


 readFileAsText(file: File): Promise<string>
Reads uploaded file as text.

typescript
const text = await readFileAsText(uploadedFile);


 safeJSONParse<T>(text: string, fallback: T): T
Safely parse JSON with fallback.

typescript
const data = safeJSONParse('{"name":"John"}', {});




JSON API Format

 Input Format
json
{
  "job_description": "Senior Software Engineer with 5+ years in React, Node.js, AWS. Strong problem-solving skills required.",
  "resume_text": "Software Engineer with 6 years experience. Expert in React, JavaScript, Python, Node.js. Led 5 projects using Agile."
}


 Output Format
json
{
  "match_score": 85,
  "missing_skills": ["aws"],
  "matched_skills": ["react", "node.js", "5+ years", "problem solving"],
  "summary": "Excellent match! 4 key skills matched. 1 skills could be added to strengthen the application.",
  "keyword_density": 2.1,
  "experience_match": 100,
  "ai_suggestions": "1. Add AWS certifications or projects\n2. Quantify achievements with metrics\n3. Highlight leadership experience"
}



How the Logic Works

 Skill Matching Algorithm (No AI Required)

1. Keyword Extraction
   - Scans text for 100+ common technical skills (JavaScript, Python, React, etc.)
   - Identifies experience mentions ("5+ years", "3 years experience")
   - Detects education requirements (Bachelor's, Master's, PhD)

2. Matching Process
   - Compares job keywords with resume keywords
   - Finds exact and partial matches (e.g., "javascript" matches "js")
   - Separates matched vs missing skills

3. Scoring System
   - Match Score: (matched_skills / total_job_skills) × 100
   - Keyword Density: (keyword_occurrences / total_words) × 100
   - Experience Match: Compares years required vs years on resume

4. Summary Generation
   - 80-100: Excellent match
   - 60-79: Good match
   - 40-59: Moderate match
   - 0-39: Limited match

 AI Enhancement (Optional)

When enabled, AI provides:
- Specific suggestions to improve resume
- Context-aware recommendations
- Writing improvements for bullet points
- ATS optimization tips

Trade-off: AI is slower and requires API calls, but gives personalized suggestions.



Integration Examples

 Frontend (React/Vue/Angular)

typescript
// In your component
import { ResumeAnalyzer } from './resumeAnalyzer';

const handleAnalyze = async () => {
  const analyzer = new ResumeAnalyzer({
    apiEndpoint: '/api/ai',
    provider: 'backend'
  });

  const result = await analyzer.analyze({
    job_description: jobText,
    resume_text: resumeText
  }, useAI);

  setResults(result);
};


 Backend Endpoint (Node.js/Express)

typescript
import { SkillMatcher } from './skillMatcher';

app.post('/api/analyze', (req, res) => {
  const { job_description, resume_text } = req.body;
  
  const matcher = new SkillMatcher();
  const result = matcher.match(job_description, resume_text);
  
  res.json(result);
});


 Testing

typescript
// test.ts
import { SkillMatcher } from './skillMatcher';

const testCases = [
  {
    name: "Perfect Match",
    job: "React developer with 3 years experience",
    resume: "Senior React developer with 5 years experience",
    expectedScore: 100
  },
  {
    name: "Partial Match",
    job: "React, Node.js, AWS, Docker",
    resume: "React and Node.js developer",
    expectedScore: 50
  }
];

testCases.forEach(test => {
  const matcher = new SkillMatcher();
  const result = matcher.match(test.job, test.resume);
  console.log(`${test.name}: ${result.match_score}%`);
});



API Provider Configuration

 Option 1: Backend API (Recommended for Production)
typescript
const analyzer = new ResumeAnalyzer({
  apiEndpoint: 'https://your-api.com/ai',
  provider: 'backend'
});

Pros: API keys stay secure on server, better rate limit control
Cons: Requires backend implementation

 Option 2: Direct OpenAI
typescript
const analyzer = new ResumeAnalyzer({
  apiEndpoint: '',
  apiKey: 'sk-...',
  provider: 'openai',
  model: 'gpt-4-turbo-preview'
});

Pros: Fastest setup, no backend needed
Cons: API key exposed in frontend (security risk)

 Option 3: Anthropic Claude
typescript
const analyzer = new ResumeAnalyzer({
  apiEndpoint: '',
  apiKey: 'sk-ant-...',
  provider: 'anthropic'
});

Pros: Claude is excellent at analysis tasks
Cons: Requires Anthropic API access



Performance

- Skill Matching (No AI): ~50ms (instant)
- With AI Enhancement: ~2-5 seconds (depends on API)
- Memory Usage: Minimal (~5MB)
- No External Libraries: Zero npm dependencies for core matching



Security Best Practices

1. Never expose API keys in frontend code
   - Use backend proxy for production
   - Environment variables for sensitive data

2. Validate inputs
   - Sanitize resume/job text before processing
   - Limit text length (max 50KB recommended)

3. Rate limiting
   - Implement rate limits on your backend
   - Cache results when possible



Troubleshooting

 "No skills detected"
- Check if resume/job description contains recognizable keywords
- Add custom skills to the `commonSkills` array in `skillMatcher.ts`

 "AI call failed"
- Verify API endpoint is correct
- Check API key is valid
- Ensure proper CORS configuration

 Low match scores
- Algorithm is conservative by design
- Consider the quality of resume formatting
- Some skills may need to be added to keyword list



Customization

 Add Custom Skills
Edit `commonSkills` array in `skillMatcher.ts`:

typescript
const commonSkills = [
  // Add your custom skills
  'your-framework',
  'your-tool',
  'your-methodology'
];


 Adjust Scoring Weights
Modify scoring logic in `calculateMatchScore()` method.

 Change AI Prompts
Edit prompt templates in `resumeAnalyzer.ts` for different AI behaviors.

How to use ai service

import { AIService } from './aiService';

// Initialize with Hugging Face
const aiService = new AIService({
  apiKey: 'hf_...', // Get free key from huggingface.co/settings/tokens
  provider: 'huggingface',
  model: 'mistralai/Mistral-7B-Instruct-v0.2' // Optional
});

// Use it
const result = await aiService.callAI("Analyze this resume...");