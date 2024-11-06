import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDocumentosSinMovimientosComponent } from './reporte-documentos-sin-movimientos.component';

describe('ReporteDocumentosSinMovimientosComponent', () => {
  let component: ReporteDocumentosSinMovimientosComponent;
  let fixture: ComponentFixture<ReporteDocumentosSinMovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDocumentosSinMovimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDocumentosSinMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
