import { AppStore } from './../store/app.store';
import { Component } from '@angular/core';
import { SidepanelComponent } from '../shared/sidepanel/sidepanel.component';
import { RouterOutlet } from '@angular/router';
import { ToppanelComponent } from '../shared/toppanel/toppanel.component';
import { SecondSidePanel } from '../shared/second-side-panel/second-side-panel';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidepanelComponent, RouterOutlet, ToppanelComponent, SecondSidePanel],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  constructor(public AppStore: AppStore) {}
}
