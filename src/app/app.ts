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
  isDarkMode = false; // State for dark mode

  constructor(
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.apiService.checkHealth().subscribe();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // --- NEW: Dark Mode Logic ---
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      // Add 'dark-theme' class to the <body> tag
      this.renderer.addClass(this.document.body, 'dark-theme');
    } else {
      // Remove it
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }
}