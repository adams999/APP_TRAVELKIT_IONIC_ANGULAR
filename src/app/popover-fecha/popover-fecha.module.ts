import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PopoverFechaPage } from './popover-fecha.page';
import { PopoverFechaComponent } from './popover-fecha.component';

const routes: Routes = [
  {
    path: '',
    component: PopoverFechaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PopoverFechaPage, PopoverFechaComponent]
})
export class PopoverFechaPageModule {}
