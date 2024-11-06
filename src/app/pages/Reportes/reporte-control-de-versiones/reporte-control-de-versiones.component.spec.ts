import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteControlDeVersionesComponent } from './reporte-control-de-versiones.component';

describe('ReporteControlDeVersionesComponent', () => {
  let component: ReporteControlDeVersionesComponent;
  let fixture: ComponentFixture<ReporteControlDeVersionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteControlDeVersionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteControlDeVersionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
