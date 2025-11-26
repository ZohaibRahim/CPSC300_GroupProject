import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, BehaviorSubject, tap, map, throwError } from 'rxjs';

export interface ResumeResource {
  id: number;
  title: string;
  company: string; 
  thumbnailUrl: string;
  pdfUrl: string; 
}

export interface Job {
  id: number;
  company: string;
  title: string;
  status: string;
  notes?: string;
  jobDescription?: string;
  aiAnalysis?: string;
  deadline?: string;
}

const BACKEND_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private mockResources: ResumeResource[] = [
    {
      id: 1,
      title: 'Project Management Intern',
      company: 'Google',
      // Official Google "G" Logo
      thumbnailUrl: '/assets/google.png', 
      pdfUrl: '/assets/resumes/google-resume.png' 
    },
    {
      id: 2,
      title: 'Software Engineering Intern',
      company: 'KPMG',
      // KPMG Logo
      thumbnailUrl: '/assets/kpmg.png',
      pdfUrl: '/assets/resumes/kpmg-resume.png'
    },
    {
      id: 3,
      title: 'Data Analyst Intern',
      company: 'Deloitte',
      // Deloitte Logo
      thumbnailUrl: '/assets/deloitte.png',
      pdfUrl: '/assets/resumes/deloitte-resume.png'
    },
    {
      id: 4,
      title: 'Frontend Developer Intern',
      company: 'Microsoft',
      // Microsoft Square Logo
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      pdfUrl: '/assets/resumes/Microsoft-resume.png'
    },
    {
      id: 5,
      title: 'UX Design Intern',
      company: 'Airbnb',
      // Airbnb Logo
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
      pdfUrl: '/assets/resumes/airbnb-resume.png'
    },
    {
      id: 6,
      title: 'Cybersecurity Intern',
      company: 'PwC',
      // PwC Logo
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/PricewaterhouseCoopers_Logo.svg/1200px-PricewaterhouseCoopers_Logo.svg.png',
      pdfUrl: '/assets/resumes/PWC-resume.png'
    }
  ];

  private defaultJobList: Job[] = [
    {
      id: 1,
      company: 'Google',
      title: 'Software Engineer',
      status: 'Interviewing',
      notes: 'First round done.',
      jobDescription: 'Seeking a SWE with 5+ years of Go.',
      aiAnalysis: 'Your resume is a 92% match.',
      deadline: '2025-12-31'
    },
    {
      id: 2,
      company: 'Microsoft',
      title: 'Frontend Developer',
      status: 'Applied',
      notes: 'Sent resume.',
      jobDescription: 'Requires strong React and TypeScript skills.',
      aiAnalysis: 'Your resume is a 78% match.',
      deadline: '2025-11-30'
    }
  ];

  private mockJobList: Job[] = [];
  private nextJobId = 1;
  
  // BehaviorSubjects allow us to emit new values to all subscribers
  private jobs$: BehaviorSubject<Job[]>;

  private mockMasterResume = 'Paste your resume here...';
  private resume$: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    const savedJobs = localStorage.getItem('markhor_jobs');
    if (savedJobs) {
      this.mockJobList = JSON.parse(savedJobs);
    } else {
      // If nothing saved, use defaults
      this.mockJobList = this.defaultJobList;
    }

    // B. Calculate the next ID so we don't duplicate IDs
    if (this.mockJobList.length > 0) {
      const maxId = Math.max(...this.mockJobList.map(j => j.id));
      this.nextJobId = maxId + 1;
    } else {
      this.nextJobId = 1;
    }

    // Initialize the Stream
    this.jobs$ = new BehaviorSubject<Job[]>(this.mockJobList);

    // C. Load Resume from LocalStorage
    const savedResume = localStorage.getItem('markhor_resume');
    if (savedResume) {
      this.mockMasterResume = savedResume;
    }
    this.resume$ = new BehaviorSubject<string>(this.mockMasterResume);
  }

  getResources(): Observable<ResumeResource[]> {
    // Simulate fetching data
    return of(this.mockResources).pipe(delay(300));
  }

  // --- HELPER: Save to LocalStorage ---
  private saveState() {
    localStorage.setItem('markhor_jobs', JSON.stringify(this.mockJobList));
    localStorage.setItem('markhor_resume', this.mockMasterResume);
  }

  // --- PUBLIC API METHODS ---

  checkHealth(): Observable<any> {
    // Mocking health check since backend might not be running
    return of({ status: 'OK', message: 'Backend is reachable (mock)' });
  }

  getJobs(): Observable<Job[]> { return this.jobs$.asObservable(); }

  createJob(jobData: any): Observable<Job> {
    if (jobData.company && jobData.company.toLowerCase() === 'fail') {
      return throwError(() => new Error('Simulated 500 Server Error: Could not save job.')).pipe(delay(500));
    }
    
    const newJob: Job = {
      id: this.nextJobId++, ...jobData,
      aiAnalysis: 'Analysis pending...'
    };
    
    this.mockJobList.push(newJob);
    this.jobs$.next([...this.mockJobList]); // Update UI
    this.saveState(); // <--- SAVE TO BROWSER
    
    return of(newJob).pipe(delay(200));
  }

  getResume(): Observable<string> {
    return this.resume$.asObservable();
  }

  saveResume(resumeText: string): Observable<{success: boolean, message: string}> {
    this.mockMasterResume = resumeText;
    this.resume$.next(this.mockMasterResume);
    this.saveState(); // <--- SAVE TO BROWSER
    return of({ success: true, message: 'Resume saved successfully!' }).pipe(delay(400));
  }

  deleteJob(id: number): Observable<boolean> {
    const index = this.mockJobList.findIndex(j => j.id === id);
    if (index !== -1) {
      this.mockJobList.splice(index, 1);
      this.jobs$.next([...this.mockJobList]);
      this.saveState(); // <--- SAVE TO BROWSER
      return of(true).pipe(delay(200));
    }
    return of(false);
  }

  getJob(id: number): Observable<Job | undefined> {
    const job = this.mockJobList.find(j => j.id === id);
    return of(job).pipe(delay(100));
  }

  updateJob(id: number, updatedData: any): Observable<Job | null> {
    const index = this.mockJobList.findIndex(j => j.id === id);
    if (index !== -1) {
      const updatedJob = { ...this.mockJobList[index], ...updatedData };
      this.mockJobList[index] = updatedJob;
      this.jobs$.next([...this.mockJobList]);
      this.saveState(); // <--- SAVE TO BROWSER
      return of(updatedJob).pipe(delay(200));
    }
    return of(null);
  }

  getJobStats(): Observable<any> {
    return this.jobs$.pipe(
      map(jobs => {
        return {
          total: jobs.length,
          toApply: jobs.filter(j => j.status === 'To Apply').length, // <-- NEW
          applied: jobs.filter(j => j.status === 'Applied').length,
          interviewing: jobs.filter(j => j.status === 'Interviewing').length,
          offers: jobs.filter(j => j.status === 'Offer').length
        };
      })
    );
  }

  generateCoverLetter(jobDescription: string): Observable<{ coverLetter: string }> {
    const mockResponse = `Dear Hiring Manager,

I am writing to express my strong interest in this position. Based on the job description "${jobDescription.substring(0, 30)}...", I believe my skills in software development and my experience with Angular and Node.js make me a perfect fit for your team.

I have a proven track record of delivering high-quality code and collaborating effectively in agile environments. I am particularly excited about the opportunity to contribute to your company's mission.

Thank you for considering my application.

Sincerely,
[Your Name]`;

    return of({ coverLetter: mockResponse }).pipe(delay(1500));
  }
}