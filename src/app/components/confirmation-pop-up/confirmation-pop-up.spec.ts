import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationPopUp } from './confirmation-pop-up';

describe('ConfirmationPopUp', () => {
  let component: ConfirmationPopUp;
  let fixture: ComponentFixture<ConfirmationPopUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationPopUp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationPopUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
