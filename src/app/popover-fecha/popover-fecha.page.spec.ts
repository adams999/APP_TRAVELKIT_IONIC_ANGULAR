import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverFechaPage } from './popover-fecha.page';

describe('PopoverFechaPage', () => {
  let component: PopoverFechaPage;
  let fixture: ComponentFixture<PopoverFechaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverFechaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverFechaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
