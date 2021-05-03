import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverFechaComponent } from './popover-fecha.component';

describe('PopoverFechaComponent', () => {
  let component: PopoverFechaComponent;
  let fixture: ComponentFixture<PopoverFechaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverFechaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
