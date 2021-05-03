import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleordenPage } from './detalleorden.page';

describe('DetalleordenPage', () => {
  let component: DetalleordenPage;
  let fixture: ComponentFixture<DetalleordenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleordenPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleordenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
