import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  protected readonly title = signal('markhor-frontend');

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.checkHealth().subscribe({
      next: (res) => console.log('Backend Health Check:', res),
      error: (err) => console.error('Backend Error:', err)
    });
  }
}
