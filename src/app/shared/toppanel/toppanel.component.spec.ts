import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToppanelComponent } from './toppanel.component';

describe('ToppanelComponent', () => {
  let component: ToppanelComponent;
  let fixture: ComponentFixture<ToppanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToppanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToppanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
