import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTableFooter } from './generic-table-footer';

describe('GenericTableFooter', () => {
  let component: GenericTableFooter;
  let fixture: ComponentFixture<GenericTableFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericTableFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericTableFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
