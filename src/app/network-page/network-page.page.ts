import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-network-page',
  templateUrl: './network-page.page.html',
  styleUrls: ['./network-page.page.scss'],
})


export class NetworkPagePage implements OnInit {

  public COLOR_MENU_BACKEND: string;
  public plataforma;

  constructor(public platform: Platform) {
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.plataforma = localStorage.getItem('platfApp');
  }

  ngOnInit() {
  }

  exitApp() {
    //para ios no esta permitido cerrar la app desde si misma solo se puede hacer desde el escritorio de ios de forma nativa 
    console.log('exit');
    navigator['app'].exitApp();
  }

}
