import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarsChartComponent } from './bars-chart.component';

describe('BarsChartComponent', () => {
  let component: BarsChartComponent;
  let fixture: ComponentFixture<BarsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarsChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
