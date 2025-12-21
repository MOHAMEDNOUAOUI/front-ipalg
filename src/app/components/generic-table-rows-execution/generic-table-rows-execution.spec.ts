import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTableRowsExecution } from './generic-table-rows-execution';

describe('GenericTableRowsExecution', () => {
  let component: GenericTableRowsExecution;
  let fixture: ComponentFixture<GenericTableRowsExecution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericTableRowsExecution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericTableRowsExecution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
