import { TestBed } from '@angular/core/testing';

import { ComentariosServices } from './comentarios.services';

describe('ComentariosServices', () => {
  let service: ComentariosServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComentariosServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
