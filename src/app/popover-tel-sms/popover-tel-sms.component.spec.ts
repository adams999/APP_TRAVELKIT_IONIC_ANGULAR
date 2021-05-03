import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverTelSmsComponent } from './popover-tel-sms.component';

describe('PopoverTelSmsComponent', () => {
  let component: PopoverTelSmsComponent;
  let fixture: ComponentFixture<PopoverTelSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverTelSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverTelSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
