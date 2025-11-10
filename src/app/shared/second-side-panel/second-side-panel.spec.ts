import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondSidePanel } from './second-side-panel';

describe('SecondSidePanel', () => {
  let component: SecondSidePanel;
  let fixture: ComponentFixture<SecondSidePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondSidePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondSidePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
