import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoversionesComponent } from './documentoversiones.component';

describe('DocumentoversionesComponent', () => {
  let component: DocumentoversionesComponent;
  let fixture: ComponentFixture<DocumentoversionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentoversionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentoversionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
