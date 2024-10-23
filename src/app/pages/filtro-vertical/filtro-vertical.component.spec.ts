import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroVerticalComponent } from './filtro-vertical.component';

describe('FiltroVerticalComponent', () => {
  let component: FiltroVerticalComponent;
  let fixture: ComponentFixture<FiltroVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroVerticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
