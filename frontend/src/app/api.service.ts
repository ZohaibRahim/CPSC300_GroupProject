import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, BehaviorSubject, tap, map, throwError } from 'rxjs'; 

// --- Define what a "Job" looks like ---
export interface Job {
  id: number; 
  company: string;
  title: string;
  status: string;
  notes?: string;
  jobDescription?: string; // <-- NEW
  aiAnalysis?: string; 
}
// ----------------------------------------

const BACKEND_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // --- Mock Database ---
  private mockJobList: Job[] = [
    { 
      id: 1, 
      company: 'Google', 
      title: 'Software Engineer', 
      status: 'Interviewing', 
      notes: 'First round done.',
      jobDescription: 'Seeking a SWE with 5+ years of Go.', // <-- NEW
      aiAnalysis: 'Your resume is a 92% match. Keywords "React" and "Go" are strong, but "Data Structures" is missing.'
    },
    { 
      id: 2, 
      company: 'Microsoft', 
      title: 'Frontend Developer', 
      status: 'Applied', 
      notes: 'Sent resume.',
      jobDescription: 'Requires strong React and TypeScript skills.', // <-- NEW
      aiAnalysis: 'Your resume is a 78% match. Add more quantifiable achievements to stand out.'
    }
  ];
  private nextJobId = 3;

  private jobs$ = new BehaviorSubject<Job[]>(this.mockJobList);

  constructor(private http: HttpClient) { }

  // --- OLD HEALTH CHECK (Unchanged) ---
  checkHealth(): Observable<any> {
    const mockResponse = { status: 'ok', message: 'Simulated connection success.' };
    return of(mockResponse).pipe(delay(500)); 
  }

  // --- Get All Jobs (Unchanged) ---
  getJobs(): Observable<Job[]> {
    return this.jobs$.asObservable();
  }

  // --- Create a New Job (Updated) ---
  createJob(jobData: { 
    company: string, 
    title: string, 
    status: string, 
    notes?: string, 
    jobDescription?: string // <-- NEW
  }): Observable<Job> {
    
    // --- FAILURE TEST ---
    if (jobData.company.toLowerCase() === 'fail') {
      console.log('--- SIMULATING 500 SERVER ERROR ---');
      return throwError(() => new Error('Simulated 500 Server Error: Could not save job.')).pipe(delay(500));
    }
    // -------------------------

    // (This is the normal, successful path)
    const newJob: Job = {
      id: this.nextJobId++,
      company: jobData.company,
      title: jobData.title,
      status: jobData.status,
      notes: jobData.notes,
      jobDescription: jobData.jobDescription, // <-- NEW
      aiAnalysis: 'Analysis pending... (This is a mock response for a new job)'
    };

    this.mockJobList.push(newJob);
    // Send a new copy of the array to trigger Angular's change detection
    this.jobs$.next([...this.mockJobList]);
    return of(newJob).pipe(delay(200));
  }
}