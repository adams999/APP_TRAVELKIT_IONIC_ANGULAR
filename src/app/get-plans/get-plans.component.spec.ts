import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPlansComponent } from './get-plans.component';

describe('GetPlansComponent', () => {
  let component: GetPlansComponent;
  let fixture: ComponentFixture<GetPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
