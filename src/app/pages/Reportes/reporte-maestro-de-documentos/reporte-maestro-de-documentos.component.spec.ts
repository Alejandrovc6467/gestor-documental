import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMaestroDeDocumentosComponent } from './reporte-maestro-de-documentos.component';

describe('ReporteMaestroDeDocumentosComponent', () => {
  let component: ReporteMaestroDeDocumentosComponent;
  let fixture: ComponentFixture<ReporteMaestroDeDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteMaestroDeDocumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteMaestroDeDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
