import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubclasificacionesComponent } from './subclasificaciones.component';

describe('SubclasificacionesComponent', () => {
  let component: SubclasificacionesComponent;
  let fixture: ComponentFixture<SubclasificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubclasificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubclasificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
