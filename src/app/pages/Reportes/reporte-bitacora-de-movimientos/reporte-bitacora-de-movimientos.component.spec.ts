import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteBitacoraDeMovimientosComponent } from './reporte-bitacora-de-movimientos.component';

describe('ReporteBitacoraDeMovimientosComponent', () => {
  let component: ReporteBitacoraDeMovimientosComponent;
  let fixture: ComponentFixture<ReporteBitacoraDeMovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteBitacoraDeMovimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteBitacoraDeMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
