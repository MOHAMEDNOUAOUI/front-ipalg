import { TestBed } from '@angular/core/testing';

import { Utilisateurs } from './utilisateurs';

describe('Utilisateurs', () => {
  let service: Utilisateurs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Utilisateurs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
