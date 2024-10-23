import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroHorizontalComponent } from './filtro-horizontal.component';

describe('FiltroHorizontalComponent', () => {
  let component: FiltroHorizontalComponent;
  let fixture: ComponentFixture<FiltroHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
