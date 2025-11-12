import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, BehaviorSubject, tap, map } from 'rxjs';

// --- Define what a "Job" looks like ---
export interface Job {
  id: number; 
  company: string;
  title: string;
  status: string;
  notes?: string;
  aiAnalysis?: string; // <-- NEW: Placeholder for Sara's AI data
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
      aiAnalysis: 'Your resume is a 92% match. Keywords "React" and "Go" are strong, but "Data Structures" is missing.' // <-- NEW
    },
    { 
      id: 2, 
      company: 'Microsoft', 
      title: 'Frontend Developer', 
      status: 'Applied', 
      notes: 'Sent resume.',
      aiAnalysis: 'Your resume is a 78% match. Add more quantifiable achievements to stand out.' // <-- NEW
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
  createJob(jobData: { company: string, title: string, status: string, notes?: string }): Observable<Job> {
    const newJob: Job = {
      id: this.nextJobId++,
      ...jobData,
      aiAnalysis: 'Analysis pending... (This is a mock response for a new job)' // <-- NEW: Default AI response
    };

    this.mockJobList.push(newJob);
    this.jobs$.next([...this.mockJobList]);
    return of(newJob).pipe(delay(200));
  }
}