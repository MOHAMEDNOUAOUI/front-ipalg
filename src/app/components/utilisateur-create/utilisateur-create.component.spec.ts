import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurCreateComponent } from './utilisateur-create.component';

describe('UtilisateurCreateComponent', () => {
  let component: UtilisateurCreateComponent;
  let fixture: ComponentFixture<UtilisateurCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtilisateurCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
