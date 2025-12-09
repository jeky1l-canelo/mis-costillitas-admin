import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPlatos } from './gestion-platos';

describe('GestionPlatos', () => {
  let component: GestionPlatos;
  let fixture: ComponentFixture<GestionPlatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPlatos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPlatos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
