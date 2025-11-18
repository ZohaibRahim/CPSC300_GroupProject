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
}

const BACKEND_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // --- Mock Database (Jobs) ---
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

  // --- NEW: Mock Database (Resume) ---
  // We'll store the master resume in a new BehaviorSubject
  private mockMasterResume = 'Paste your resume here...';
  private resume$ = new BehaviorSubject<string>(this.mockMasterResume);
  // ------------------------------------

  constructor(private http: HttpClient) { }
  
  // --- Job Functions (Unchanged) ---
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
  // ----------------------------------

  // --- NEW: Resume Functions ---

  
  // * Gets the user's master resume.
   
  getResume(): Observable<string> {
    return this.resume$.asObservable();
  }

 
  // * Saves the user's master resume.
   
  saveResume(resumeText: string): Observable<{success: boolean, message: string}> {
    // Simulate a 400ms API call
    this.mockMasterResume = resumeText;
    this.resume$.next(this.mockMasterResume);
    
    // Simulate a success response
    return of({ success: true, message: 'Resume saved successfully!' }).pipe(delay(400));
  }
}
