import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroHorizontalProcesoComponent } from './filtro-horizontal-proceso.component';

describe('FiltroHorizontalProcesoComponent', () => {
  let component: FiltroHorizontalProcesoComponent;
  let fixture: ComponentFixture<FiltroHorizontalProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroHorizontalProcesoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroHorizontalProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
