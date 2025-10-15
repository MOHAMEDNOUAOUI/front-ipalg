import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { step } from '../../interfaces/sidepanel-tabs';

@Component({
  selector: 'app-steps-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './steps-header.component.html',
  styleUrl: './steps-header.component.scss',
})
export class StepsHeaderComponent {
  @Input() Steps: step[] = [];
  // Steps: step[] = [
  //   {
  //     label: 'Profils',
  //     route: 'test',
  //   },
  //   {
  //     label: 'Permission',
  //     route: 'test',
  //   },
  // ];
}
