import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipodocumentosComponent } from './tipodocumentos.component';

describe('TipodocumentosComponent', () => {
  let component: TipodocumentosComponent;
  let fixture: ComponentFixture<TipodocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipodocumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipodocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
