import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubProfilsComponent } from './sub-profils.component';

describe('SubProfilsComponent', () => {
  let component: SubProfilsComponent;
  let fixture: ComponentFixture<SubProfilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubProfilsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubProfilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
