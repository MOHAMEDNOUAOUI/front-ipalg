import { Component } from '@angular/core';
import { SidepanelComponent } from '../shared/sidepanel/sidepanel.component';
import { RouterOutlet } from '@angular/router';
import { ToppanelComponent } from "../shared/toppanel/toppanel.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidepanelComponent, RouterOutlet, ToppanelComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {}
