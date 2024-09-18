import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormaetapasComponent } from './normaetapas.component';

describe('NormaetapasComponent', () => {
  let component: NormaetapasComponent;
  let fixture: ComponentFixture<NormaetapasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NormaetapasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NormaetapasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
