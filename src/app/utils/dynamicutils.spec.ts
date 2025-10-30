import { TestBed } from '@angular/core/testing';

import { Dynamicutils } from './dynamicutils';

describe('Dynamicutils', () => {
  let service: Dynamicutils;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dynamicutils);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
