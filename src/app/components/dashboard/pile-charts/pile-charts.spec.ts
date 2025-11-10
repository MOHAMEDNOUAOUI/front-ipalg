import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PileCharts } from './pile-charts';

describe('PileCharts', () => {
  let component: PileCharts;
  let fixture: ComponentFixture<PileCharts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PileCharts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PileCharts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
