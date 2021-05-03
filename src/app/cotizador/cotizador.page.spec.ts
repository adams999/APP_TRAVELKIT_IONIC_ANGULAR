import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizadorPage } from './cotizador.page';

describe('CotizadorPage', () => {
  let component: CotizadorPage;
  let fixture: ComponentFixture<CotizadorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CotizadorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
