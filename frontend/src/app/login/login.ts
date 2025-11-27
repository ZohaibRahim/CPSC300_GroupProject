import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../api.service'; // <-- Import ApiService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  isLoginMode = true; // Start in Login Mode

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private apiService: ApiService // Inject Service
  ) {
    this.loginForm = this.fb.group({
      // Name is only required if NOT in login mode
      name: [''], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    // Reset form validity when switching modes
    this.loginForm.reset();
  }

  onSubmit() {
    // 1. Basic Validation
    if (this.loginForm.invalid) {
      // If in Register mode, Name is mandatory.
      if (!this.isLoginMode && !this.loginForm.get('name')?.value) {
        this.loginForm.get('name')?.setErrors({ required: true });
      }
      
      // If basic fields are missing
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return;
      }
    }

    this.isLoading = true;
    const { name, email } = this.loginForm.value;

    if (this.isLoginMode) {
      // --- LOGIN ---
      this.apiService.login(email).subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      });
    } else {
      // --- REGISTER ---
      this.apiService.register(name, email).subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      });
    }
  }

  onGoogleLogin() {
    console.log('Google login clicked');
  }
}