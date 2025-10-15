import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-toppanel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './toppanel.component.html',
  styleUrl: './toppanel.component.scss',
})
export class ToppanelComponent {
  activeRoute: string = '';

  constructor(private router: Router) {
    router.events.subscribe(() => {
      this.activeRoute = this.router.url
        .split('/')
        .filter((part) => part.length)
        .join(' / ');
    });
  }
}
