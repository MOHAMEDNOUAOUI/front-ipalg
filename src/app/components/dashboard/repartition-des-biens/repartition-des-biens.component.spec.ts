import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepartitionDesBiensComponent } from './repartition-des-biens.component';

describe('RepartitionDesBiensComponent', () => {
  let component: RepartitionDesBiensComponent;
  let fixture: ComponentFixture<RepartitionDesBiensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepartitionDesBiensComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RepartitionDesBiensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
