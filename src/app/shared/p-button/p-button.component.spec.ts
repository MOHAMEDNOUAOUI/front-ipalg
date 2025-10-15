import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PButtonComponent } from './p-button.component';

describe('PButtonComponent', () => {
  let component: PButtonComponent;
  let fixture: ComponentFixture<PButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
