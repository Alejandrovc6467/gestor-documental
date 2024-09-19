import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarionormaComponent } from './usuarionorma.component';

describe('UsuarionormaComponent', () => {
  let component: UsuarionormaComponent;
  let fixture: ComponentFixture<UsuarionormaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarionormaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarionormaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
