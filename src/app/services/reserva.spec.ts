import { TestBed } from '@angular/core/testing';

import { Reserva } from './reserva';

describe('Reserva', () => {
  let service: Reserva;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reserva);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
