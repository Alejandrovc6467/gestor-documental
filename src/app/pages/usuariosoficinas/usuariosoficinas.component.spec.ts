import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosoficinasComponent } from './usuariosoficinas.component';

describe('UsuariosoficinasComponent', () => {
  let component: UsuariosoficinasComponent;
  let fixture: ComponentFixture<UsuariosoficinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosoficinasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosoficinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
