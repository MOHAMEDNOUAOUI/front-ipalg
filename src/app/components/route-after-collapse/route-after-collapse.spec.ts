import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteAfterCollapse } from './route-after-collapse';

describe('RouteAfterCollapse', () => {
  let component: RouteAfterCollapse;
  let fixture: ComponentFixture<RouteAfterCollapse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteAfterCollapse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteAfterCollapse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
