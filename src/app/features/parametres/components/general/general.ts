import { AppStore } from './../../../../store/app.store';
import { Component } from '@angular/core';
import { CostumeSelectComponent } from '../../../../components/costume-select/costume-select.component';

@Component({
  selector: 'app-general',
  imports: [CostumeSelectComponent],
  templateUrl: './general.html',
  styleUrl: './general.scss',
})
export class General {
  appearances = ['Light', 'Dark'];
  languages = ['Francais', 'Anglais'];

  constructor(public AppStore: AppStore) {}

  catchOption(option: any) {
    if (this.appearances.includes(option)) {
      this.AppStore.setAppearance(option);
    } else if (this.languages.includes(option)) {
      this.AppStore.setLangue(option);
    }
  }
}
