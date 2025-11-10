import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesGlobales } from './variables-globales';

describe('VariablesGlobales', () => {
  let component: VariablesGlobales;
  let fixture: ComponentFixture<VariablesGlobales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariablesGlobales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariablesGlobales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
