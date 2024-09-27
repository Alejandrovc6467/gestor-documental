import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosnormasComponent } from './usuariosnormas.component';

describe('UsuariosnormasComponent', () => {
  let component: UsuariosnormasComponent;
  let fixture: ComponentFixture<UsuariosnormasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosnormasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosnormasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
