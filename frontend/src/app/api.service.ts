import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, BehaviorSubject, tap, map } from 'rxjs'; // <-- New imports

// --- Define what a "Job" looks like ---
export interface Job {
  id: number; // Unique ID
  company: string;
  title: string;
  status: string;
  notes?: string;
}
// ----------------------------------------

const BACKEND_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // --- Mock Database ---
  // This is our fake list of jobs.
  private mockJobList: Job[] = [
    { id: 1, company: 'Google', title: 'Software Engineer', status: 'Interviewing', notes: 'First round done.' },
    { id: 2, company: 'Microsoft', title: 'Frontend Developer', status: 'Applied', notes: 'Sent resume.' }
  ];
  private nextJobId = 3;

  // --- The "Live" List ---
  // This BehaviorSubject will hold the current list of jobs and notify any component that is listening.
  private jobs$ = new BehaviorSubject<Job[]>(this.mockJobList);
  // ---------------------

  constructor(private http: HttpClient) { }

  // --- OLD HEALTH CHECK (Still works) ---
  checkHealth(): Observable<any> {
    const mockResponse = { status: 'ok', message: 'Simulated connection success.' };
    return of(mockResponse).pipe(delay(500)); 
  }

  // --- NEW: Get All Jobs ---
  // This returns the "live" list. Any component can subscribe to this.
  getJobs(): Observable<Job[]> {
    return this.jobs$.asObservable();
  }

  // --- NEW: Create a New Job ---
  // This adds a job to our fake list and then updates the "live" list for everyone.
  createJob(jobData: { company: string, title: string, status: string, notes?: string }): Observable<Job> {
    // 1. Create the new job
    const newJob: Job = {
      id: this.nextJobId++,
      ...jobData
    };

    // 2. Add it to our mock list
    this.mockJobList.push(newJob);

    // 3. "Next" emits the new, updated list to all subscribers (like our job-list component!)
    this.jobs$.next([...this.mockJobList]); // Send a new copy of the array

    // 4. Return the new job, wrapped in a (mock) 200ms API delay
    return of(newJob).pipe(delay(200));
  }
}