import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciosesionprincipalComponent } from './iniciosesionprincipal.component';

describe('IniciosesionprincipalComponent', () => {
  let component: IniciosesionprincipalComponent;
  let fixture: ComponentFixture<IniciosesionprincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IniciosesionprincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IniciosesionprincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
