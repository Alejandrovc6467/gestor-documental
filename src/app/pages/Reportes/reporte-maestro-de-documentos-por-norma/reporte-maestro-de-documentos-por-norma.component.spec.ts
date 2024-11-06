import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMaestroDeDocumentosPorNormaComponent } from './reporte-maestro-de-documentos-por-norma.component';

describe('ReporteMaestroDeDocumentosPorNormaComponent', () => {
  let component: ReporteMaestroDeDocumentosPorNormaComponent;
  let fixture: ComponentFixture<ReporteMaestroDeDocumentosPorNormaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteMaestroDeDocumentosPorNormaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteMaestroDeDocumentosPorNormaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
