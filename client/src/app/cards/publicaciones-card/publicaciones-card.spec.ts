import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesCard } from './publicaciones-card';

describe('PublicacionesCard', () => {
  let component: PublicacionesCard;
  let fixture: ComponentFixture<PublicacionesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionesCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicacionesCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
