import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatoForm } from './plato-form';

describe('PlatoForm', () => {
  let component: PlatoForm;
  let fixture: ComponentFixture<PlatoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
