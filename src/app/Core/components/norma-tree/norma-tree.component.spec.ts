import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormaTreeComponent } from './norma-tree.component';

describe('NormaTreeComponent', () => {
  let component: NormaTreeComponent;
  let fixture: ComponentFixture<NormaTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NormaTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NormaTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
