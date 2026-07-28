import { TestBed } from '@angular/core/testing';

import { EstadisticasServices } from './estadisticas.services';

describe('EstadisticasServices', () => {
  let service: EstadisticasServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadisticasServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
