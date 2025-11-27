import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UpdateItem {
  title: string;
  description: string;
  icon: string; // We'll use SVG paths here or simplified names
  tag: string;  // e.g. "Planned", "In Progress"
}

@Component({
  selector: 'app-updates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './updates.html',
  styleUrls: ['./updates.scss']
})
export class UpdatesComponent {
  
  updates: UpdateItem[] = [
    {
      title: 'HR Contact Finder',
      description: 'Automatically discover email addresses and LinkedIn profiles for recruiters at the companies you have applied to, helping you send follow-up emails faster.',
      icon: 'search-user',
      tag: 'In Progress'
    },
    {
      title: 'Smart Job Search',
      description: 'A personalized job feed that uses AI to match open positions from LinkedIn and Indeed directly to your uploaded resume skills.',
      icon: 'briefcase',
      tag: 'Planned'
    },
    // --- YOUR SUGGESTED EXTRAS ---
    {
      title: 'AI Interview Coach',
      description: 'Practice with a voice-enabled AI interviewer that asks you technical questions based on your specific job role and gives real-time feedback.',
      icon: 'chat',
      tag: 'Concept'
    },
    {
      title: 'Salary Estimator',
      description: 'Get accurate salary ranges for your target roles based on real-time market data and your experience level.',
      icon: 'currency',
      tag: 'Concept'
    }
  ];
}