import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctosModalComponent } from './doctos-modal.component';

describe('DoctosModalComponent', () => {
  let component: DoctosModalComponent;
  let fixture: ComponentFixture<DoctosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctosModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
