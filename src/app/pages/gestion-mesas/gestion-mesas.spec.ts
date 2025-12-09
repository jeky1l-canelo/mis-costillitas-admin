import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMesas } from './gestion-mesas';

describe('GestionMesas', () => {
  let component: GestionMesas;
  let fixture: ComponentFixture<GestionMesas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMesas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionMesas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
