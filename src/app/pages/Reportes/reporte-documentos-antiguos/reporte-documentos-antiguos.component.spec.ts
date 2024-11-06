import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDocumentosAntiguosComponent } from './reporte-documentos-antiguos.component';

describe('ReporteDocumentosAntiguosComponent', () => {
  let component: ReporteDocumentosAntiguosComponent;
  let fixture: ComponentFixture<ReporteDocumentosAntiguosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDocumentosAntiguosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDocumentosAntiguosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
