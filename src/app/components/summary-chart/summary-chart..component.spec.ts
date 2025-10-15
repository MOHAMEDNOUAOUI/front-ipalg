import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryChartComponent } from './summary-chart..component';

describe('SummaryChartComponent', () => {
  let component: SummaryChartComponent;
  let fixture: ComponentFixture<SummaryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SummaryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
