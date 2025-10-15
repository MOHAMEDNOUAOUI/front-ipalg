import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostumeSelectComponent } from './costume-select.component';

describe('CostumeSelectComponent', () => {
  let component: CostumeSelectComponent;
  let fixture: ComponentFixture<CostumeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostumeSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CostumeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
