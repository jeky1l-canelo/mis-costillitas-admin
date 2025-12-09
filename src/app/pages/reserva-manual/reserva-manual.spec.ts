import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaManual } from './reserva-manual';

describe('ReservaManual', () => {
  let component: ReservaManual;
  let fixture: ComponentFixture<ReservaManual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaManual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaManual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
