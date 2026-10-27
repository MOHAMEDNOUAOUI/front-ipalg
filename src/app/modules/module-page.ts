import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataPage } from '../shared/data-page/data-page';
import { MODULES } from './registry';

/** Route target for every list module: looks up the ModuleDef named in the route data. */
@Component({
  selector: 'app-module-page',
  imports: [DataPage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-data-page [def]="def" [embedded]="embedded" />`,
})
export class ModulePage {
  private readonly data = inject(ActivatedRoute).snapshot.data;
  readonly def = MODULES[this.data['module'] as string];
  readonly embedded = !!this.data['embedded'];
}
