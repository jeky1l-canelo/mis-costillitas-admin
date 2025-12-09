import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionReservasComponent } from './gestion-reservas';

describe('GestionReservas', () => {
  let component: GestionReservasComponent;
  let fixture: ComponentFixture<GestionReservasComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionReservasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
