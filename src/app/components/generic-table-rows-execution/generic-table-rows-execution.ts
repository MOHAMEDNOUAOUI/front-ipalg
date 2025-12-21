import { Component, Input } from '@angular/core';
import { BaseFilter, BaseStore } from '../../store/type.generic';

@Component({
  selector: 'app-generic-table-rows-execution',
  imports: [],
  templateUrl: './generic-table-rows-execution.html',
  styleUrl: './generic-table-rows-execution.scss',
})
export class GenericTableRowsExecution<T, F extends BaseFilter, TStore extends BaseStore<T, F>> {
  @Input() store!: TStore;
}
