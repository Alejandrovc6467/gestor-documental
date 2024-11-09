import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalabrasClaveComponent } from './palabras-clave.component';

describe('PalabrasClaveComponent', () => {
  let component: PalabrasClaveComponent;
  let fixture: ComponentFixture<PalabrasClaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PalabrasClaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalabrasClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
