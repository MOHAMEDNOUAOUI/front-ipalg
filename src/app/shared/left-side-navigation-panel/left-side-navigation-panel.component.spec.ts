import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSideNavigationPanelComponent } from './left-side-navigation-panel.component';

describe('LeftSideNavigationPanelComponent', () => {
  let component: LeftSideNavigationPanelComponent;
  let fixture: ComponentFixture<LeftSideNavigationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSideNavigationPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeftSideNavigationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
