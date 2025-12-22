import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PButtonSecond } from './p-button-second';

describe('PButtonSecond', () => {
  let component: PButtonSecond;
  let fixture: ComponentFixture<PButtonSecond>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PButtonSecond]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PButtonSecond);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
