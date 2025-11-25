import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  isSidebarCollapsed = false;
  isDarkMode = false; 

  constructor(
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // 1. Check backend health (Existing)
    this.apiService.checkHealth().subscribe();

    // 2. NEW: Load Theme Preference from LocalStorage
    const savedTheme = localStorage.getItem('theme');
    
    // If the user previously set it to 'dark', apply it immediately
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      this.renderer.addClass(this.document.body, 'dark-theme');
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark-theme');
      localStorage.setItem('theme', 'dark'); // <--- SAVE PREFERENCE
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
      localStorage.setItem('theme', 'light'); // <--- SAVE PREFERENCE
    }
  }
}