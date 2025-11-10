import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampsPersonalises } from './champs-personalises';

describe('ChampsPersonalises', () => {
  let component: ChampsPersonalises;
  let fixture: ComponentFixture<ChampsPersonalises>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampsPersonalises]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampsPersonalises);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
