// src/ai/skillMatcher.ts

export interface MatchResult {
  match_score: number;
  missing_skills: string[];
  matched_skills: string[];
  summary: string;
  keyword_density: number;
  experience_match: number;
}

/**
 * Skill matching algorithm using TOKEN-BASED comparison and scoring
 * v3.1 – removes junk tokens (r, ms, bs, bachelor, ember, etc.)
 */
export class SkillMatcher {

  // Words we never want to treat as skills
  private readonly blacklist: Set<string> = new Set<string>([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those',
    'go', 'less', 'as', 'so', 'no', 'if', 'can', 'who', 'what',
    'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
    'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'than',
    'too', 'very',
    'ember',      // to avoid matching "member"
    'work',       // too generic
    'sample'      // from "work sample" in your resume header
  ]);

  // Tokens that represent education level (we don't want them as "skills")
  private readonly educationTokens: Set<string> = new Set<string>([
    'bachelor', 'bachelors', 'master', 'masters', 'phd',
    'bs', 'ms', 'bsc', 'msc', 'mba'
  ]);

  // Very short tokens are usually noise.
  private readonly allowedShortTokens: Set<string> = new Set<string>([
    // keep empty for now, or add e.g. 'c' if you really want C language
  ]);

  /**
   * Main matching function
   */
  match(jobDescription: string, resumeText: string): MatchResult {
    const jobSkills = this.extractSkillsTokenBased(jobDescription);
    const resumeSkills = this.extractSkillsTokenBased(resumeText);

    const matchedSkills = this.findMatchedSkills(jobSkills, resumeSkills);
    const missingSkills = this.findMissingSkills(jobSkills, resumeSkills);

    const matchScore = this.calculateMatchScore(
      matchedSkills.length,
      jobSkills.length
    );

    const keywordDensity = this.calculateKeywordDensity(
      matchedSkills,
      resumeText
    );

    const experienceMatch = this.calculateExperienceMatch(
      jobDescription,
      resumeText
    );

    const summary = this.generateSummary(
      matchScore,
      matchedSkills.length,
      missingSkills.length,
      experienceMatch
    );

    return {
      match_score: matchScore,
      missing_skills: missingSkills,
      matched_skills: matchedSkills,
      summary,
      keyword_density: keywordDensity,
      experience_match: experienceMatch
    };
  }

  /**
   * Extract skills using token-based matching
   */
  private extractSkillsTokenBased(text: string): string[] {
    const lowerText = text.toLowerCase();
    const rawSkills: string[] = [];

    // 1) Multi-word skills
    const multiWordSkills = this.getMultiWordSkills();
    for (const skill of multiWordSkills) {
      if (this.isTokenMatch(lowerText, skill)) {
        rawSkills.push(skill);
      }
    }

    // 2) Single-word skills
    const singleWordSkills = this.getSingleWordSkills();
    for (const skill of singleWordSkills) {
      if (this.blacklist.has(skill)) continue;

      if (this.isTokenMatch(lowerText, skill)) {
        rawSkills.push(skill);
      }
    }

    // 3) Experience tokens (e.g. "2 years", "3+ years")
    const experienceMatches = this.extractExperienceTokens(text);
    rawSkills.push(...experienceMatches);

    // 4) Auto-detected domain skills
    const autoDetected = this.autoDetectSkills(text);
    rawSkills.push(...autoDetected);

    // --- CLEANUP PHASE ---
    const cleaned = rawSkills
      .map((s) => s.trim().toLowerCase())
      .filter((s) => !!s)
      .filter((s) => !this.blacklist.has(s))
      // drop education tokens like "bachelor", "bs", "ms"
      .filter((s) => !this.educationTokens.has(s))
      // drop very short tokens (length < 3) unless explicitly allowed
      .filter((s) => s.length >= 3 || this.allowedShortTokens.has(s));

    return [...new Set(cleaned)];
  }

  /**
   * Token-based matching using word boundaries
   */
  private isTokenMatch(text: string, skill: string): boolean {
    if (skill.includes(' ')) {
      // exact phrase for multi-word skills
      return text.includes(skill);
    }

    const regex = new RegExp(`\\b${this.escapeRegex(skill)}\\b`, 'i');
    return regex.test(text);
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Multi-word skills
   */
  private getMultiWordSkills(): string[] {
    const skills: string[] = [
      // Professional / accounting / finance
      'customer service', 'client service', 'client relations',
      'project management', 'business analysis', 'data analysis',
      'financial analysis', 'financial reporting', 'financial statements',
      'balance sheet', 'income statement', 'cash flow',
      'accounts payable', 'accounts receivable',
      'cost accounting', 'management accounting',
      'tax preparation', 'audit preparation', 'budget planning',
      'risk management', 'compliance management',

      // Accounting standards
      'international financial reporting standards',
      'generally accepted accounting principles',
      'accounting standards for private enterprises',

      // Software & systems
      'sap erp', 'oracle erp', 'microsoft dynamics',
      'salesforce crm', 'workday hcm',
      'quickbooks online', 'sage accounting', 'xero accounting',
      'microsoft office', 'google workspace', 'adobe creative suite',

      // Tech / misc (useful for other tech jobs)
      'machine learning', 'deep learning', 'natural language processing',
      'data science', 'data engineering', 'software engineering',
      'web development', 'mobile development', 'full stack',
      'front end', 'back end', 'cloud computing', 'distributed systems',
      'database design', 'api design', 'user experience', 'user interface',

      // Methodologies
      'agile methodology', 'scrum methodology', 'kanban methodology',
      'continuous integration', 'continuous deployment',
      'test driven development',

      // Call centre / support
      'call center', 'call centre', 'help desk', 'technical support',
      'phone support', 'email support', 'chat support'
    ];
    return skills;
  }

  /**
   * Single-word skills
   */
  private getSingleWordSkills(): string[] {
    const skills: string[] = [
      // Programming / data
      'javascript', 'typescript', 'python', 'java', 'csharp', 'ruby', 'php',
      'swift', 'kotlin', 'golang', 'scala', 'perl', 'bash', 'powershell',

      'html', 'html5', 'css', 'css3', 'sass', 'scss',
      'react', 'angular', 'vue', 'svelte', 'jquery', 'redux', 'webpack',
      'tailwind', 'bootstrap',
      'nodejs', 'express', 'django', 'flask', 'fastapi', 'laravel', 'rails',

      // Databases / analytics
      'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis',
      'elasticsearch', 'firebase', 'dynamodb', 'cassandra', 'oracle',
      'pandas', 'numpy', 'powerbi', 'tableau',

      // Cloud / devops
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
      'ansible', 'nginx',

      // Accounting / finance
      'gaap', 'ifrs', 'aspe', 'cpa', 'bookkeeping', 'payroll',
      'taxation', 'reconciliation', 'forecasting', 'budgeting',
      'auditing', 'compliance',

      // Office tools
      'excel', 'powerpoint', 'word', 'outlook',

      // Soft skills
      'leadership', 'communication', 'teamwork', 'mentoring', 'collaboration',
      'analytical', 'organized', 'adaptable', 'bilingual', 'multilingual',

      // Design
      'figma', 'sketch', 'photoshop', 'illustrator', 'canva'
    ];
    return skills;
  }

  /**
   * Experience tokens (e.g. "2 years experience")
   */
  private extractExperienceTokens(text: string): string[] {
    const regex =
      /(\d+)[\+\-–]?(\d+)?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience)?/gi;
    const matches = text.match(regex);
    if (!matches) return [];
    return matches.map((m) => m.toLowerCase().trim());
  }

  /**
   * Auto-detect some domain skills from raw text
   */
  private autoDetectSkills(text: string): string[] {
    const detected: string[] = [];
    const lowerText = text.toLowerCase();

    // Accounting / finance
    if (lowerText.includes('accounting') || lowerText.includes('finance')) {
      if (lowerText.includes('reconcil')) detected.push('reconciliation');
      if (lowerText.includes('journal entries')) detected.push('journal entries');
      if (lowerText.includes('payroll')) detected.push('payroll');
      if (lowerText.includes('audit')) detected.push('auditing');
      if (lowerText.includes('bookkeeping')) detected.push('bookkeeping');
    }

    // Customer-facing
    if (lowerText.includes('customer') || lowerText.includes('client')) {
      detected.push('client service');
    }

    // Data / research
    if (lowerText.includes('data')) {
      detected.push('data analysis');
    }

    return detected;
  }

  private findMatchedSkills(jobSkills: string[], resumeSkills: string[]): string[] {
    const matched: string[] = [];

    for (const jobSkill of jobSkills) {
      for (const resumeSkill of resumeSkills) {
        if (jobSkill === resumeSkill || this.areSkillsSimilar(jobSkill, resumeSkill)) {
          matched.push(jobSkill);
          break;
        }
      }
    }

    return [...new Set(matched)];
  }

  private areSkillsSimilar(skill1: string, skill2: string): boolean {
    const s1 = skill1.toLowerCase().replace(/[^a-z0-9]/g, '');
    const s2 = skill2.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (s1 === s2) return true;

    if (s1.includes(s2) || s2.includes(s1)) {
      return Math.abs(s1.length - s2.length) <= 2;
    }

    return false;
  }

  private findMissingSkills(jobSkills: string[], resumeSkills: string[]): string[] {
    const missing: string[] = [];

    for (const jobSkill of jobSkills) {
      let found = false;
      for (const resumeSkill of resumeSkills) {
        if (jobSkill === resumeSkill || this.areSkillsSimilar(jobSkill, resumeSkill)) {
          found = true;
          break;
        }
      }
      if (!found) missing.push(jobSkill);
    }

    return missing;
  }

  private calculateMatchScore(matchedCount: number, totalRequired: number): number {
    if (totalRequired === 0) return 0;
    return Math.round((matchedCount / totalRequired) * 100);
  }

  private calculateKeywordDensity(matchedSkills: string[], resumeText: string): number {
    const lowerResume = resumeText.toLowerCase();
    let totalOccurrences = 0;

    for (const skill of matchedSkills) {
      if (skill.includes(' ')) {
        const count =
          (lowerResume.match(new RegExp(this.escapeRegex(skill), 'g')) || [])
            .length;
        totalOccurrences += count;
      } else {
        const regex = new RegExp(`\\b${this.escapeRegex(skill)}\\b`, 'g');
        const count = (lowerResume.match(regex) || []).length;
        totalOccurrences += count;
      }
    }

    const wordCount = resumeText.split(/\s+/).length || 1;
    return Math.round((totalOccurrences / wordCount) * 1000) / 10;
  }

  private calculateExperienceMatch(jobDesc: string, resume: string): number {
    const jobExpMatch = jobDesc.match(/(\d+)[\+\-–]?(\d+)?\s*(?:years?|yrs?)/i);

    // If job doesn’t specify years, treat as 100% match (no constraint)
    if (!jobExpMatch) return 100;

    const requiredMin = parseInt(jobExpMatch[1]);
    const requiredMax = jobExpMatch[2] ? parseInt(jobExpMatch[2]) : requiredMin;

    const resumeExpMatches = resume.match(
      /(\d+)[\+\-–]?(\d+)?\s*(?:years?|yrs?)/gi
    );
    if (!resumeExpMatches || resumeExpMatches.length === 0) return 0;

    let candidateYears = 0;
    for (const match of resumeExpMatches) {
      const years = parseInt(match.match(/\d+/)?.[0] || '0');
      // Skip unrealistic values (0, negative, or > 50 years)
      if (years <= 0 || years > 50) continue;
      if (years > candidateYears) candidateYears = years;
    }

    if (candidateYears >= requiredMax) return 100;

    if (candidateYears >= requiredMin) {
      const denom = requiredMax - requiredMin || 1;
      const progress = (candidateYears - requiredMin) / denom;
      return Math.round(80 + progress * 20);
    }

    const ratio = candidateYears / requiredMin;
    if (ratio >= 0.75) return 70;
    if (ratio >= 0.5) return 50;
    if (ratio >= 0.25) return 30;
    return 10;
  }

  private generateSummary(
    score: number,
    matched: number,
    missing: number,
    experienceMatch: number
  ): string {
    let summary = '';

    if (score >= 80) {
      summary = `Excellent match! ${matched} key skills matched.`;
    } else if (score >= 60) {
      summary = `Good match with ${matched} skills found.`;
    } else if (score >= 40) {
      summary = `Moderate match. ${matched} skills aligned, but ${missing} important skills missing.`;
    } else {
      summary = `Limited match. Only ${matched} skills found.`;
    }

    if (experienceMatch < 100 && experienceMatch > 0) {
      if (experienceMatch >= 70) {
        summary += ` Experience level is close to requirements.`;
      } else if (experienceMatch >= 40) {
        summary += ` Some experience gap exists.`;
      } else {
        summary += ` Significant experience gap noted.`;
      }
    }

    if (missing > 0 && score >= 60) {
      summary += ` Consider adding ${missing} missing skill${missing > 1 ? 's' : ''}.`;
    } else if (missing > 0 && score < 60) {
      summary += ` Consider upskilling in missing areas.`;
    }

    return summary;
  }
}
