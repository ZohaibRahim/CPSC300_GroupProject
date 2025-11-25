import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, BehaviorSubject, tap, map, throwError } from 'rxjs'; 


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

  private mockJobList: Job[] = [
    { 
      id: 1, 
      company: 'Google', 
      title: 'Software Engineer', 
      status: 'Interviewing', 
      notes: 'First round done.',
      jobDescription: 'Seeking a SWE with 5+ years of Go.', 
      aiAnalysis: 'Your resume is a 92% match.'
    },
    { 
      id: 2, 
      company: 'Microsoft', 
      title: 'Frontend Developer', 
      status: 'Applied', 
      notes: 'Sent resume.',
      jobDescription: 'Requires strong React and TypeScript skills.', 
      aiAnalysis: 'Your resume is a 78% match.'
    }
  ];
  private nextJobId = 3;
  private jobs$ = new BehaviorSubject<Job[]>(this.mockJobList);

  private mockMasterResume = 'Paste your resume here...';
  private resume$ = new BehaviorSubject<string>(this.mockMasterResume);

  constructor(private http: HttpClient) { }
  
  checkHealth(): Observable<any> {
    return this.http.get<any>(`${BACKEND_URL}/health`);
  }

  getJobs(): Observable<Job[]> { return this.jobs$.asObservable(); }

  createJob(jobData: any): Observable<Job> { 
    if (jobData.company.toLowerCase() === 'fail') {
      return throwError(() => new Error('Simulated 500 Server Error: Could not save job.')).pipe(delay(500));
    }
    const newJob: Job = {
      id: this.nextJobId++, ...jobData,
      aiAnalysis: 'Analysis pending...'
    };
    this.mockJobList.push(newJob);
    this.jobs$.next([...this.mockJobList]);
    return of(newJob).pipe(delay(200));
  }

  getJobStats(): Observable<any> {
    return this.jobs$.pipe(
      map(jobs => {
        return {
          total: jobs.length,
          applied: jobs.filter(j => j.status === 'Applied').length,
          interviewing: jobs.filter(j => j.status === 'Interviewing').length,
          offers: jobs.filter(j => j.status === 'Offer').length
        };
      })
    );
  }

  getJob(id: number): Observable<Job | undefined> {
    const job = this.mockJobList.find(j => j.id === id);
    return of(job).pipe(delay(100)); // Simulate small network delay
  }

  // --- NEW: Update Existing Job ---
  updateJob(id: number, updatedData: any): Observable<Job | null> {
    const index = this.mockJobList.findIndex(j => j.id === id);
    if (index !== -1) {
      // Merge existing job with new data (preserving ID and AI analysis)
      const updatedJob = { ...this.mockJobList[index], ...updatedData };
      this.mockJobList[index] = updatedJob;
      
      // Update the stream so the list refreshes automatically
      this.jobs$.next([...this.mockJobList]);
      
      return of(updatedJob).pipe(delay(200));
    }
    return of(null); // Job not found
  }

  getResume(): Observable<string> {
    return this.resume$.asObservable();
  }

  saveResume(resumeText: string): Observable<{success: boolean, message: string}> {
    this.mockMasterResume = resumeText;
    this.resume$.next(this.mockMasterResume);
    return of({ success: true, message: 'Resume saved successfully!' }).pipe(delay(400));
  }

  // --- NEW: Delete Function ---
  deleteJob(id: number): Observable<boolean> {
    // Find index of the job
    const index = this.mockJobList.findIndex(j => j.id === id);
    if (index !== -1) {
      // Remove it
      this.mockJobList.splice(index, 1);
      // Notify subscribers (refresh the list)
      this.jobs$.next([...this.mockJobList]);
      return of(true).pipe(delay(200));
    }
    return of(false);
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