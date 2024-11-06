import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDescargaDeDocumentosComponent } from './reporte-descarga-de-documentos.component';

describe('ReporteDescargaDeDocumentosComponent', () => {
  let component: ReporteDescargaDeDocumentosComponent;
  let fixture: ComponentFixture<ReporteDescargaDeDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDescargaDeDocumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDescargaDeDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
