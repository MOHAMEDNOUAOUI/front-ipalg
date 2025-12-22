import { Component, Input } from '@angular/core';
import { BaseFilter, BaseStore } from '../../store/type.generic';
import { PButtonSecond } from "../../shared/p-button-second/p-button-second";

@Component({
  selector: 'app-generic-table-rows-execution',
  imports: [PButtonSecond],
  templateUrl: './generic-table-rows-execution.html',
  styleUrl: './generic-table-rows-execution.scss',
})
export class GenericTableRowsExecution<T, F extends BaseFilter, TStore extends BaseStore<T, F>> {
  @Input() store!: TStore;
}
