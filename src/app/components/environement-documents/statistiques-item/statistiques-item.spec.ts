import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiquesItem } from './statistiques-item';

describe('StatistiquesItem', () => {
  let component: StatistiquesItem;
  let fixture: ComponentFixture<StatistiquesItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistiquesItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiquesItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
