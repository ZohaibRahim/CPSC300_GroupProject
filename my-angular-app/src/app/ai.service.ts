import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// API CONFIGURATION
// API keys are in the backend code - collaboarated with ahad
// stored in environment variables and called through backend
const OPENAI_API_KEY = 'your-openai-api-key-here'; // not going to use openAI
const HUGGING_FACE_API_KEY = 'your-huggingface-api-key-here'; // using backend because can't put the key out on github

// Choose which AI provider to use
export enum AIProvider {
  OPENAI = 'openai',
  HUGGING_FACE = 'huggingface',
  BACKEND = 'backend' // Using backend as a proxy
}

// INTERFACES
export interface ParsedResume {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  summary?: string;
  experience: Array<{
    company: string;
    title: string;
    duration: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  certifications: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  preferredSkills: string[];
}

export interface OptimizationSuggestions {
  overallScore: number; // 0-100
  matchPercentage: number; // How well resume matches job
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestedImprovements: Array<{
    section: string;
    current: string;
    suggested: string;
    reason: string;
  }>;
  atsCompatibility: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  optimizedSummary?: string;
  tailoredExperience?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private currentProvider: AIProvider = AIProvider.BACKEND; // Default to backend proxy

  // API Endpoints
  private readonly OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
  private readonly HUGGING_FACE_ENDPOINT = 'https://api-inference.huggingface.co/models/';
  private readonly BACKEND_AI_ENDPOINT = 'http://localhost:3000/api/ai'; // Your backend proxy

  constructor(private http: HttpClient) {}

  // MAIN METHODS

  /**
   * Parse a resume file and extract structured data
   * @param resumeText - The text content of the resume
   * @param provider - Which AI provider to use
   */
  parseResume(resumeText: string, provider: AIProvider = this.currentProvider): Observable<ParsedResume> {
    const prompt = this.buildResumeParsingPrompt(resumeText);

    switch (provider) {
      case AIProvider.OPENAI:
        return this.callOpenAI(prompt, 'parse');
      case AIProvider.HUGGING_FACE:
        return this.callHuggingFace(prompt, 'parse');
      case AIProvider.BACKEND:
        return this.callBackendAI({ action: 'parse', text: resumeText });
      default:
        return throwError(() => new Error('Invalid AI provider'));
    }
  }

  /**
   * Optimize resume based on job description
   * @param resume - Parsed resume data
   * @param jobDescription - Target job description
   * @param provider - Which AI provider to use
   */
  optimizeResume(
    resume: ParsedResume,
    jobDescription: JobDescription,
    provider: AIProvider = this.currentProvider
  ): Observable<OptimizationSuggestions> {
    const prompt = this.buildOptimizationPrompt(resume, jobDescription);

    switch (provider) {
      case AIProvider.OPENAI:
        return this.callOpenAI(prompt, 'optimize');
      case AIProvider.HUGGING_FACE:
        return this.callHuggingFace(prompt, 'optimize');
      case AIProvider.BACKEND:
        return this.callBackendAI({ 
          action: 'optimize', 
          resume, 
          jobDescription 
        });
      default:
        return throwError(() => new Error('Invalid AI provider'));
    }
  }

  /**
   * Extract keywords from job description
   */
  extractJobKeywords(jobDescription: string): Observable<string[]> {
    const prompt = `Extract the top 20 most important keywords and skills from this job description:\n\n${jobDescription}\n\nReturn ONLY a JSON array of strings.`;

    return this.callOpenAI(prompt, 'keywords').pipe(
      map((response: any) => {
        try {
          return JSON.parse(response);
        } catch {
          return [];
        }
      })
    );
  }

  /**
   * Calculate ATS compatibility score
   */
  calculateATSScore(resumeText: string): Observable<number> {
    const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility. Consider formatting, keywords, structure, and readability. Return a score from 0-100.\n\nResume:\n${resumeText}\n\nReturn ONLY the numeric score.`;

    return this.callOpenAI(prompt, 'ats').pipe(
      map((response: any) => {
        const score = parseInt(response);
        return isNaN(score) ? 0 : score;
      })
    );
  }

  // PRIVATE HELPER METHODS 

  /**
   * Build prompt for resume parsing
   */
  private buildResumeParsingPrompt(resumeText: string): string {
    return `You are an expert resume parser. Extract ALL information from the following resume and return it as a JSON object with this exact structure:

{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": ""
  },
  "summary": "",
  "experience": [
    {
      "company": "",
      "title": "",
      "duration": "",
      "description": "",
      "achievements": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "year": ""
    }
  ],
  "skills": {
    "technical": [],
    "soft": []
  },
  "certifications": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
  ]
}

Resume text:
${resumeText}

Return ONLY valid JSON, no additional text.`;
  }

  /**
   * Build prompt for resume optimization
   */
  private buildOptimizationPrompt(resume: ParsedResume, job: JobDescription): string {
    return `You are an expert career coach and resume optimizer. Analyze this resume against the job description and provide detailed optimization suggestions.

RESUME:
${JSON.stringify(resume, null, 2)}

JOB DESCRIPTION:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Requirements: ${job.requirements.join(', ')}
Preferred Skills: ${job.preferredSkills.join(', ')}

Provide optimization suggestions in this JSON format:
{
  "overallScore": 0-100,
  "matchPercentage": 0-100,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestedImprovements": [
    {
      "section": "experience/summary/skills",
      "current": "current text",
      "suggested": "improved text",
      "reason": "why this is better"
    }
  ],
  "atsCompatibility": {
    "score": 0-100,
    "issues": ["issue1", "issue2"],
    "recommendations": ["rec1", "rec2"]
  },
  "optimizedSummary": "A tailored summary for this job",
  "tailoredExperience": ["bullet1", "bullet2"]
}

Return ONLY valid JSON.`;
  }

  /**
   * Call OpenAI API
   */
  private callOpenAI(prompt: string, type: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    });

    const body = {
      model: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo' for faster/cheaper
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyst and career coach. Always return valid JSON responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    };

    return this.http.post(this.OPENAI_ENDPOINT, body, { headers }).pipe(
      map((response: any) => {
        const content = response.choices[0].message.content;
        try {
          return JSON.parse(content);
        } catch {
          return content;
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Call Hugging Face API
   * Note: HuggingFace free API has rate limits and may be slower
   */
  private callHuggingFace(prompt: string, type: string): Observable<any> {
    // Using a text generation model
    const model = 'mistralai/Mistral-7B-Instruct-v0.2';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
      'Content-Type': 'application/json'
    });

    const body = {
      inputs: prompt,
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.7,
        return_full_text: false
      }
    };

    return this.http.post(`${this.HUGGING_FACE_ENDPOINT}${model}`, body, { headers }).pipe(
      map((response: any) => {
        const text = response[0]?.generated_text || '';
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Call Backend AI proxy (RECOMMENDED APPROACH)
   * This keeps API keys secure on the server
   */
  private callBackendAI(payload: any): Observable<any> {
    return this.http.post(`${this.BACKEND_AI_ENDPOINT}`, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error handler
   */
  private handleError(error: any) {
    console.error('AI Service Error:', error);
    let errorMessage = 'An error occurred while processing your request.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  // === 🎛️ UTILITY METHODS ===

  /**
   * Set the AI provider to use
   */
  setProvider(provider: AIProvider): void {
    this.currentProvider = provider;
  }

  /**
   * Get current provider
   */
  getProvider(): AIProvider {
    return this.currentProvider;
  }
}