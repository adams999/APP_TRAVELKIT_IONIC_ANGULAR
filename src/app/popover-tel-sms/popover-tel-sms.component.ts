import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavController, NavParams, PopoverController } from '@ionic/angular';
import { CodPhones } from '../providers/codigo-phones';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-tel-sms',
  templateUrl: './popover-tel-sms.component.html',
  styleUrls: ['./popover-tel-sms.component.scss']
})

export class PopoverTelSmsComponent implements OnInit {

  public COLOR_MENU_BACKEND;
  public codVouch;
  public codigosPhon;
  public numeroTelSms: FormGroup;
  public botonEnviar;
  public data = {
    codigoSel: "",
    tel: ""
  };
  public color_menu_barra_hover: string;
  public codigoTelef = '';
  public dataTelef = '';


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public codPhones: CodPhones,
    public activatedRoute: ActivatedRoute,
    public popoverCtrl: PopoverController,
    public translate: TranslateService) {
    this.color_menu_barra_hover = localStorage.getItem('color_menu_barra_hover');
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.codigosPhon = this.codPhones.getCodPhones();
    this.codVouch = navParams.get('codigo');
    navParams.get('codigoTelef') ? this.codigoTelef = navParams.get('codigoTelef') : '';
    navParams.get('dataTelef') ? this.dataTelef = navParams.get('dataTelef') : '';
    this.funNumTelef(this.dataTelef);
    this.funCodigoSel(this.codigoTelef);
    console.log(this.codVouch);
  }

  ngOnInit() {

  }

  funCodigoSel(cod) {
    this.data.codigoSel = cod;
    console.log(cod);
    this.funNumTelef(this.data.tel);
  }

  funNumTelef(tel) {
    this.data.tel = tel;
    if (this.validarNumber(this.data.tel) && this.data.codigoSel) {
      console.log('valido');
      this.botonEnviar = true;
    } else {
      this.botonEnviar = false;
    }
  }

  validarNumber(number) {
    return /^[0-9+-]{7,20}$/.test(number);
  }

  enviarSms() {
    console.log(this.data);
    this.popoverCtrl.dismiss({ cod: this.data.codigoSel, tel: this.data.tel })
  }

  close() {
    //this.viewCtrl.dismiss({data:null});

  }

}
