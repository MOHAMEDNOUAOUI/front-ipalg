import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHolderComponent } from './card-holder.component';

describe('CardHolderComponent', () => {
  let component: CardHolderComponent;
  let fixture: ComponentFixture<CardHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
