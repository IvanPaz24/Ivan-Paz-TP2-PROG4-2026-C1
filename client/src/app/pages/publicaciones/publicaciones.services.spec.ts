import { TestBed } from '@angular/core/testing';

import { PublicacionesServices } from './publicaciones.services';

describe('PublicacionesServices', () => {
  let service: PublicacionesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicacionesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
