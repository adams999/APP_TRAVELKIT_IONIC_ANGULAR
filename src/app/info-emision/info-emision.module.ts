import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoEmisionPageRoutingModule } from './info-emision-routing.module';

import { InfoEmisionPage } from './info-emision.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoEmisionPageRoutingModule,
    TranslateModule
  ],
  declarations: [InfoEmisionPage]
})
export class InfoEmisionPageModule {}
