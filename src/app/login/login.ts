import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Required for ngModel (two-way binding)
import { CommonModule } from '@angular/common'; // Required for common directives like *ngIf

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // Import the necessary form module
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  // State variables for the form
  isLoginMode: boolean = true;
  userEmail: string = '';
  userPassword: string = '';
  userPasswordConfirm: string = '';
  
  // Placeholder function for toggling between login and register
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  // Placeholder function for submission
  onSubmit() {
    if (this.isLoginMode) {
      console.log('Attempting Login with:', this.userEmail, this.userPassword);
      // **In Week 2, Ahad will provide the actual authentication API call here**
    } else {
      if (this.userPassword !== this.userPasswordConfirm) {
        alert("Passwords do not match!"); // Using alert for now, will replace with UI message later
        return;
      }
      console.log('Attempting Registration with:', this.userEmail, this.userPassword);
      // **In Week 2, Ahad will provide the actual registration API call here**
    }
  }
}
