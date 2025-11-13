import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCategories } from './table-categories';

describe('TableCategories', () => {
  let component: TableCategories;
  let fixture: ComponentFixture<TableCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
