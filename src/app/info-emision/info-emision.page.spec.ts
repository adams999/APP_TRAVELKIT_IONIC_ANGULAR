import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoEmisionPage } from './info-emision.page';

describe('InfoEmisionPage', () => {
  let component: InfoEmisionPage;
  let fixture: ComponentFixture<InfoEmisionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoEmisionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoEmisionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
