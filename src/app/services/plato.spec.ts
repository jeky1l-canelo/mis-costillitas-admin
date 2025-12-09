import { TestBed } from '@angular/core/testing';

import { Plato } from './plato';

describe('Plato', () => {
  let service: Plato;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Plato);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
