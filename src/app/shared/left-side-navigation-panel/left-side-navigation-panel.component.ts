
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { navigation } from '../../interfaces/sidepanel-tabs';

@Component({
  selector: 'app-left-side-navigation-panel',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './left-side-navigation-panel.component.html',
  styleUrl: './left-side-navigation-panel.component.scss',
})
export class LeftSideNavigationPanelComponent {
  @Input() navigationList: navigation[] = [];
}
