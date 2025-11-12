import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs'; // <-- NOTE: Added 'of' and 'delay' for mocking

// === 🛠️ AHAD'S BACKEND CONFIGURATION (MINIMAL CHANGE AREA) ===
const BACKEND_URL = 'http://localhost:3000'; 
// =============================================================

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  /**
   * Calls the backend's simple health check endpoint.
   * Currently returns a MOCKED SUCCESS response for the Thursday demo.
   * * To switch to the REAL backend:
   * 1. Remove the 'of' and 'delay' imports from line 2.
   * 2. Delete the 'return of(...)' block below.
   * 3. UNCOMMENT the 'return this.http.get(...)' block.
   */
  checkHealth(): Observable<any> {
    // -------------------------------------------------------------------
    // 🧪 MOCK SUCCESS (For Demo)
    const mockResponse = { 
      status: 'ok', 
      message: 'Simulated connection success for Thursday demo.' 
    };
    // Simulates a successful HTTP call after a short delay (for realism)
    return of(mockResponse).pipe(delay(500)); 
    // -------------------------------------------------------------------

    // -------------------------------------------------------------------
    // // 📞 REAL BACKEND CALL (To be UNCOMMENTED when Ahad's backend is live)
    // console.log(`Attempting real connection to ${BACKEND_URL}/health`);
    // return this.http.get(`${BACKEND_URL}/health`);
    // -------------------------------------------------------------------
  }
}