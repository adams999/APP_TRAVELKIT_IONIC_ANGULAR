import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-popover-fecha',
  templateUrl: './popover-fecha.page.html',
  styleUrls: ['./popover-fecha.page.scss'],
})
export class PopoverFechaPage implements OnInit {

  public fecha1;
  public fecha2;
  public fechaSalida;
  public fechaActual = this.hoyFecha();

  constructor(public navCtrl: NavController) {
    console.log('popover fecha');
  }
  ngOnInit() {

  }
  hoyFecha() {
    var hoy = new Date();
    let dd = (hoy.getDate() < 10 ? '0' : '') + hoy.getDate();
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaDeHoy = yyyy + '-' + mm + '-' + dd;
    return fechaDeHoy;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalsPage', this.fechaActual);
  }

  close() {
    //this.viewCtrl.dismiss();
  }

  elimpopover() {
    this.navCtrl.pop();
  }

  enviarFechas(salida, regreso) {
    console.log(salida, regreso);
    //this.viewCtrl.dismiss({salida:salida, regreso:regreso}); 
  }

}
