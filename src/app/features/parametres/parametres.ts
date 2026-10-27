import { Component } from '@angular/core';
import { StepsHeaderComponent } from '../../shared/steps-header/steps-header.component';
import { step } from '../../interfaces/sidepanel-tabs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-parametres',
  imports: [StepsHeaderComponent, RouterModule],
  templateUrl: './parametres.html',
  styleUrl: './parametres.scss',
})
export class Parametres {
  Steps: step[] = [
    {
      label: 'Général',
      route: 'parametre-general',
    },
    {
      label: 'Modules',
      route: 'parametre-modules',
    },
    {
      label: 'Permissions',
      route: 'parametre-permissions',
    },
  ];
}
