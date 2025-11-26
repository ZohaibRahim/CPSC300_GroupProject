// ============================================================================
// SKILL MATCHING ALGORITHM - No AI Required
// ============================================================================
// skillMatcher.ts

export interface MatchResult {
  match_score: number;
  missing_skills: string[];
  matched_skills: string[];
  summary: string;
  keyword_density: number;
  experience_match: number;
}

/**
 * Skill matching algorithm using keyword comparison and scoring
 * No AI required - pure algorithmic matching
 */
export class SkillMatcher {
  
  /**
   * Main matching function
   * @param jobDescription - Job description text
   * @param resumeText - Resume text
   */
  match(jobDescription: string, resumeText: string): MatchResult {
    const jobKeywords = this.extractKeywords(jobDescription);
    const resumeKeywords = this.extractKeywords(resumeText);
    
    const matchedSkills = this.findMatchedSkills(jobKeywords, resumeKeywords);
    const missingSkills = this.findMissingSkills(jobKeywords, resumeKeywords);
    
    const matchScore = this.calculateMatchScore(
      matchedSkills.length,
      jobKeywords.length
    );
    
    const keywordDensity = this.calculateKeywordDensity(
      matchedSkills,
      resumeText
    );
    
    const experienceMatch = this.extractExperienceMatch(
      jobDescription,
      resumeText
    );
    
    const summary = this.generateSummary(
      matchScore,
      matchedSkills.length,
      missingSkills.length
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
   * Extract important keywords from text
   */
  private extractKeywords(text: string): string[] {
    const commonSkills = [
      // Programming Languages
      'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift',
      'kotlin', 'go', 'rust', 'typescript', 'sql', 'r', 'matlab', 'scala',
      'perl', 'shell', 'bash', 'powershell',
      
      // Frontend Frameworks & Libraries
      'react', 'angular', 'vue', 'vue.js', 'svelte', 'next.js', 'nuxt',
      'jquery', 'backbone', 'ember', 'redux', 'mobx', 'webpack', 'vite',
      'tailwind', 'bootstrap', 'material-ui', 'sass', 'less',
      
      // Backend Frameworks
      'node.js', 'express', 'django', 'flask', 'fastapi', 'spring', 
      'spring boot', 'laravel', '.net', 'asp.net', 'rails', 'sinatra',
      
      // Databases
      'mongodb', 'postgresql', 'mysql', 'sql server', 'oracle', 'redis',
      'cassandra', 'dynamodb', 'firebase', 'sqlite', 'mariadb', 'couchdb',
      
      // Cloud & DevOps
      'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s',
      'jenkins', 'gitlab', 'github actions', 'circleci', 'terraform',
      'ansible', 'chef', 'puppet', 'vagrant', 'nginx', 'apache',
      
      // AI/ML
      'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
      'machine learning', 'deep learning', 'nlp', 'computer vision', 'opencv',
      
      // Mobile Development
      'react native', 'flutter', 'ios', 'android', 'swift', 'kotlin',
      'xamarin', 'cordova', 'ionic',
      
      // APIs & Architecture
      'rest api', 'restful', 'graphql', 'grpc', 'soap', 'microservices',
      'serverless', 'lambda', 'api gateway',
      
      // Message Queues & Streaming
      'kafka', 'rabbitmq', 'redis', 'aws sqs', 'pubsub',
      
      // Search & Analytics
      'elasticsearch', 'solr', 'kibana', 'splunk', 'datadog', 'grafana',
      
      // Version Control & Collaboration
      'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial',
      
      // Testing
      'jest', 'mocha', 'jasmine', 'pytest', 'junit', 'selenium', 'cypress',
      'testing', 'unit testing', 'integration testing', 'tdd', 'bdd',
      
      // Methodologies & Practices
      'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'continuous integration',
      'continuous deployment', 'pair programming', 'code review',
      
      // Soft Skills
      'leadership', 'communication', 'teamwork', 'problem solving',
      'critical thinking', 'project management', 'mentoring', 'collaboration',
      
      // Security
      'security', 'oauth', 'jwt', 'ssl', 'encryption', 'penetration testing',
      
      // Other Tools
      'jira', 'confluence', 'slack', 'trello', 'asana', 'notion',
      'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator'
    ];

    const lowerText = text.toLowerCase();
    const foundSkills: string[] = [];

    // Extract common skills
    for (const skill of commonSkills) {
      if (lowerText.includes(skill)) {
        foundSkills.push(skill);
      }
    }

    // Extract years of experience mentions
    const experienceRegex = /(\d+)\+?\s*years?/gi;
    const expMatches = text.match(experienceRegex);
    if (expMatches) {
      foundSkills.push(...expMatches.map(m => m.toLowerCase()));
    }

    // Extract degree requirements
    const degreeRegex = /(bachelor|master|phd|doctorate|bs|ms|mba|b\.s\.|m\.s\.)/gi;
    const degreeMatches = text.match(degreeRegex);
    if (degreeMatches) {
      foundSkills.push(...degreeMatches.map(m => m.toLowerCase()));
    }

    return [...new Set(foundSkills)]; // Remove duplicates
  }

  /**
   * Find skills that match between job and resume
   */
  private findMatchedSkills(jobSkills: string[], resumeSkills: string[]): string[] {
    return jobSkills.filter(skill =>
      resumeSkills.some(rSkill => 
        rSkill.includes(skill) || skill.includes(rSkill)
      )
    );
  }

  /**
   * Find skills in job description but missing from resume
   */
  private findMissingSkills(jobSkills: string[], resumeSkills: string[]): string[] {
    return jobSkills.filter(skill =>
      !resumeSkills.some(rSkill => 
        rSkill.includes(skill) || skill.includes(rSkill)
      )
    );
  }

  /**
   * Calculate match score (0-100)
   */
  private calculateMatchScore(matchedCount: number, totalRequired: number): number {
    if (totalRequired === 0) return 0;
    return Math.round((matchedCount / totalRequired) * 100);
  }

  /**
   * Calculate keyword density (how often matched keywords appear)
   */
  private calculateKeywordDensity(matchedSkills: string[], resumeText: string): number {
    const lowerResume = resumeText.toLowerCase();
    let totalOccurrences = 0;

    for (const skill of matchedSkills) {
      const regex = new RegExp(skill, 'gi');
      const matches = lowerResume.match(regex);
      totalOccurrences += matches ? matches.length : 0;
    }

    const wordCount = resumeText.split(/\s+/).length;
    return Math.round((totalOccurrences / wordCount) * 1000) / 10; // Percentage
  }

  /**
   * Extract and match experience requirements
   */
  private extractExperienceMatch(jobDesc: string, resume: string): number {
    const jobExpRegex = /(\d+)\+?\s*years?/i;
    const jobExpMatch = jobDesc.match(jobExpRegex);
    
    if (!jobExpMatch) return 100; // No experience requirement

    const requiredYears = parseInt(jobExpMatch[1]);
    
    // Find highest experience mentioned in resume
    const resumeExpRegex = /(\d+)\+?\s*years?/gi;
    const resumeExpMatches = resume.match(resumeExpRegex);
    
    if (!resumeExpMatches || resumeExpMatches.length === 0) return 0;

    const resumeYears = Math.max(
      ...resumeExpMatches.map(match => parseInt(match))
    );

    if (resumeYears >= requiredYears) return 100;
    
    return Math.round((resumeYears / requiredYears) * 100);
  }

  /**
   * Generate human-readable summary
   */
  private generateSummary(score: number, matched: number, missing: number): string {
    if (score >= 80) {
      return `Excellent match! ${matched} key skills matched. ${missing} skills could be added to strengthen the application.`;
    } else if (score >= 60) {
      return `Good match with ${matched} skills found. Consider adding ${missing} missing skills to improve your chances.`;
    } else if (score >= 40) {
      return `Moderate match. ${matched} skills aligned, but ${missing} important skills are missing. Consider upskilling or highlighting relevant experience.`;
    } else {
      return `Limited match. Only ${matched} skills found. This position may require significant additional skills or experience.`;
    }
  }
}