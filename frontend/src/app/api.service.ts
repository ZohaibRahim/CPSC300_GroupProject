import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// NEW: Import 'throwError' to simulate an error
import { Observable, of, delay, BehaviorSubject, tap, map, throwError } from 'rxjs'; 

// (Job interface is unchanged)
export interface Job {
  id: number; 
  company: string;
  title: string;
  status: string;
  notes?: string;
  aiAnalysis?: string; 
}

const BACKEND_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // (Mock data and health check are unchanged)
  private mockJobList: Job[] = [
    { 
      id: 1, 
      company: 'Google', 
      title: 'Software Engineer', 
      status: 'Interviewing', 
      notes: 'First round done.',
      aiAnalysis: 'Your resume is a 92% match. Keywords "React" and "Go" are strong, but "Data Structures" is missing.'
    },
    { 
      id: 2, 
      company: 'Microsoft', 
      title: 'Frontend Developer', 
      status: 'Applied', 
      notes: 'Sent resume.',
      aiAnalysis: 'Your resume is a 78% match. Add more quantifiable achievements to stand out.'
    }
  ];
  private nextJobId = 3;
  private jobs$ = new BehaviorSubject<Job[]>(this.mockJobList);

  constructor(private http: HttpClient) { }
  
  checkHealth(): Observable<any> { 
    const mockResponse = { status: 'ok', message: 'Simulated connection success.' };
    return of(mockResponse).pipe(delay(500)); 
  }
  
  getJobs(): Observable<Job[]> { 
    return this.jobs$.asObservable();
  }

  // --- UPDATED: Create a New Job ---
  createJob(jobData: { company: string, title: string, status: string, notes?: string }): Observable<Job> {
    
    // --- NEW: FAILURE TEST ---
    // If the company name is "fail", we simulate a 500 server error.
    if (jobData.company.toLowerCase() === 'fail') {
      console.log('--- SIMULATING 500 SERVER ERROR ---');
      // We return an Error Observable instead of a success (of)
      return throwError(() => new Error('Simulated 500 Server Error: Could not save job.')).pipe(delay(500));
    }
    // -------------------------

    // (This is the normal, successful path)
    const newJob: Job = {
      id: this.nextJobId++,
      ...jobData,
      aiAnalysis: 'Analysis pending... (This is a mock response for a new job)'
    };

    this.mockJobList.push(newJob);
    this.jobs$.next([...this.mockJobList]);
    return of(newJob).pipe(delay(200));
  }
}