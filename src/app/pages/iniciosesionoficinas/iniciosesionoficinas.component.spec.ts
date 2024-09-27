import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciosesionoficinasComponent } from './iniciosesionoficinas.component';

describe('IniciosesionoficinasComponent', () => {
  let component: IniciosesionoficinasComponent;
  let fixture: ComponentFixture<IniciosesionoficinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IniciosesionoficinasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IniciosesionoficinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
