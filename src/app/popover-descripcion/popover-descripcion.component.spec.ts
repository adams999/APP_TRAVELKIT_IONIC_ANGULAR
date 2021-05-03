import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverDescripcionComponent } from './popover-descripcion.component';

describe('PopoverDescripcionComponent', () => {
  let component: PopoverDescripcionComponent;
  let fixture: ComponentFixture<PopoverDescripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverDescripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverDescripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
