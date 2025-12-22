import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiquesHolder } from './statistiques-holder';

describe('StatistiquesHolder', () => {
  let component: StatistiquesHolder;
  let fixture: ComponentFixture<StatistiquesHolder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistiquesHolder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiquesHolder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
