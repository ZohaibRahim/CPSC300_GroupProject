import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT, CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive, Router, NavigationEnd, Event } from '@angular/router';
import { ApiService } from './api.service';
import { filter } from 'rxjs/operators';

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
  isLoginPage = false; // <-- NEW FLAG

  constructor(
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router // <-- Inject Router
  ) {
    // Listen to route changes to check if we are on the login page
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // If the URL contains '/login', hide the sidebar layout
      this.isLoginPage = event.urlAfterRedirects.includes('/login');
    });
  }

  ngOnInit(): void {
    this.apiService.checkHealth().subscribe();

    const savedTheme = localStorage.getItem('theme');
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
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}