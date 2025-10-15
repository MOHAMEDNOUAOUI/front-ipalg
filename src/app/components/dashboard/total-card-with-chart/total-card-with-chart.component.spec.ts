import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCardWithChartComponent } from './total-card-with-chart.component';

describe('TotalCardWithChartComponent', () => {
  let component: TotalCardWithChartComponent;
  let fixture: ComponentFixture<TotalCardWithChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalCardWithChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalCardWithChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
