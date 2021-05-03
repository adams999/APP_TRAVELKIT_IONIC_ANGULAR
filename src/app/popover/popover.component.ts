import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavParams, NavController, AlertController } from '@ionic/angular';
import { PopoverController, Platform } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { TranslateService } from '@ngx-translate/core';
import { IlsadminService } from '../providers/ilsadmin.service';
import * as moment from 'moment';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})

export class PopoverComponent implements OnInit, OnDestroy {

  public fechaActual = new Date().toISOString();
  public salida: any;
  public salidaConv;
  public llegada: any = null;
  public llegadaConv;
  public fecha1;
  public color_menu_barra_hover: string;
  public COLOR_MENU_BACKEND: string;
  public pruebaSalida;
  public fechaHoy;
  public llegadaActualConv;
  public status: any = null;
  public listAgencys: any = null;
  public agencySelect: any = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public datePicker: DatePicker,
    public platform: Platform,
    public translate: TranslateService,
    public alertController: AlertController,
    public ilsAdminProvider: IlsadminService) {
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.color_menu_barra_hover = localStorage.getItem('color_menu_barra_hover');
    this.fechaActual = this.hoyFecha('');
    this.fechaHoy = this.hoy('');
    if (navParams.get('salida') && navParams.get('llegada')) {
      this.salida = navParams.get('salida');
      this.salidaConv = moment(this.salida).format('DD-MM-YYYY');
      this.llegada = navParams.get('llegada');
      this.llegadaConv = moment(this.llegada).format('DD-MM-YYYY');
      this.pruebaSalida = this.salida;
      if (this.salida == this.llegada) {
        this.llegadaActualConv = moment(this.salida).format('DD-MM-YYYY');
      }
    }
    this.status = navParams.get('status');
    this.agencySelect = navParams.get('agency');
    console.log(this.salida, this.llegada, this.status, this.agencySelect);
  }

  ngOnInit() {
    console.log('popover fecha', this.fechaActual);

    this.ilsAdminProvider.getAgencys(localStorage.getItem('pref'))
      .subscribe(
        (data: any) => {
          if (!data[0].notes) {
            this.listAgencys = data;
            this.listAgencys.unshift(
              {
                'name': this.translate.instant('POPOVER.todos'),
                'id': 'all'
              }
            );
            console.log(this.listAgencys);
          } else {
            this.listAgencys = null;
          }
        },
        (err) => {
          this.listAgencys = null;
        });
  }

  ngOnDestroy() {

  }

  hoy(date) {
    var hoy;
    date ? hoy = date : hoy = new Date();//si se envia una fecha se formateara si no se recibe ninguna obtendra la fecha actual del S.O
    let dd = ((hoy.getDate()) < 10 ? '0' : '') + (hoy.getDate());
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaDeHoy = yyyy + '-' + mm + '-' + dd;
    return fechaDeHoy;
  }

  hoyFecha(date) {
    var hoy;
    date ? hoy = date : hoy = new Date();//si se envia una fecha se formateara si no se recibe ninguna obtendra la fecha actual del S.O
    let dd = ((hoy.getDate() + 1) < 10 ? '0' : '') + (hoy.getDate() + 1);
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaDeHoy = yyyy + '-' + mm + '-' + dd;
    return fechaDeHoy;
  }

  formatoFecha(date) {
    var hoy;
    date ? hoy = date : hoy = new Date();//aqui doy formato
    let dd = ((hoy.getDate()) < 10 ? '0' : '') + (hoy.getDate());
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaDeHoy = yyyy + '-' + mm + '-' + dd;
    return fechaDeHoy;
  }

  formatoFechaMinima(date) {//aqui aumento 2 dias para que se establezca bien el limite de fecha minima para el datepicker
    var hoy;
    date ? hoy = new Date(date) : hoy = new Date();
    let dd = ((hoy.getDate()) < 10 ? '0' : '') + (hoy.getDate());
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaMinDate = yyyy + '-' + mm + '-' + dd;
    return fechaMinDate;
  }

  fechaMinDatePicker(date) {//aqui aumento 2 dias para que se establezca bien el limite de fecha minima para el datepicker
    var hoy;
    date ? hoy = new Date(date) : hoy = new Date();
    let dd = ((hoy.getDate() + 2) < 10 ? '0' : '') + (hoy.getDate() + 2);
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaMinDate = yyyy + '-' + mm + '-' + dd;
    return fechaMinDate;
  }

  cambiarFormatoFecha(fecha) {
    var hoy;
    fecha ? hoy = new Date(fecha) : hoy = new Date();
    let dd = ((hoy.getDate()) < 10 ? '0' : '') + (hoy.getDate());
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaForm = dd + '-' + mm + '-' + yyyy;
    return fechaForm;
  }

  datePickerSalida() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      titleText: this.translate.instant('POPOVER.selec_fech_salida'),
      androidTheme: (localStorage.getItem('themeDark') == 'true') ? this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK : this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      minDate: (this.platform.is('android')) ? (new Date('2011')).valueOf() : new Date('2011'),
      maxDate: (this.platform.is('android')) ? (new Date(this.fechaActual)).valueOf() : new Date(this.fechaActual),
      //allowOldDates:true,
      todayText: this.translate.instant('POPOVER.hoy'),
      cancelText: this.translate.instant('POPOVER.cancelar'),
      okText: this.translate.instant('POPOVER.aceptar')
    }).then(
      (date) => {
        this.salida = this.formatoFecha(date);
        this.salidaConv = this.cambiarFormatoFecha(date);
        this.pruebaSalida = this.formatoFechaMinima(date);
        this.llegada = null;
        this.llegadaConv = null;
        if (this.salida == this.fechaHoy) {//Validaciòn para poder realizar y evitar el datepicker nativo erroneo de la fecha de salida
          this.llegada = this.cambiarFormatoFecha(Date());
          this.llegadaActualConv = this.cambiarFormatoFecha(Date()).toString();
          this.llegadaConv = this.cambiarFormatoFecha(this.salida);
        }
      })
      .catch((err) => {

      })
  }

  datePickerllegada() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      titleText: this.translate.instant('POPOVER.selec_fech_regreso'),
      androidTheme: (localStorage.getItem('themeDark') == 'true') ? this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK : this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      minDate: (this.platform.is('android')) ? (new Date(this.fechaMinDatePicker(this.pruebaSalida))).valueOf() : new Date(this.fechaMinDatePicker(this.pruebaSalida)),
      maxDate: (this.platform.is('android')) ? (new Date()).valueOf() : new Date(),
      //allowOldDates:true,
      todayText: this.translate.instant('POPOVER.hoy'),
      cancelText: this.translate.instant('POPOVER.cancelar'),
      okText: this.translate.instant('POPOVER.aceptar')
    }).then(
      (date) => {
        this.llegada = this.formatoFecha(date);
        this.llegadaConv = this.cambiarFormatoFecha(date);
        this.llegadaActualConv = null;
      })
      .catch((err) => {

      });
  }

  fechaSalida(salida) {
    this.salida = salida;
    this.fecha1 = salida;
    console.log(this.salida);
  }

  fechaLlegada(llegada) {
    this.llegada = llegada;
    console.log(this.llegada);
  }

  async elimpopover() {
    await this.popoverCtrl.dismiss();
  }

  async elimParametros() {
    await this.popoverCtrl.dismiss({
      reset: true
    });
  }

  async enviarParametros() {
    console.log(this.salida, this.llegada);
    await this.popoverCtrl.dismiss(
      {
        salida: this.salida ? this.salida : null,
        llegada: this.llegadaActualConv ? this.salida : this.llegada,
        status: this.status ? this.status : null,
        agency: this.agencySelect ? this.agencySelect : null
      }
    );
  }

  async alertaStatus() {
    const alert = await this.alertController.create({
      header: this.translate.instant('POPOVER.estatus'),
      inputs: [
        {
          name: 'todos',
          type: 'radio',
          label: this.translate.instant('POPOVER.todos'),
          value: 'all',
          checked: this.status == 'all' ? true : false
        },
        {
          name: 'activo',
          type: 'radio',
          label: this.translate.instant('POPOVER.activo'),
          value: '1',
          checked: this.status == '1' ? true : false
        },

        {
          name: 'pago_pend_ca',
          type: 'radio',
          label: this.translate.instant('POPOVER.pago_pend_ca'),
          value: '2',
          checked: this.status == '2' ? true : false
        },

        {
          name: 'activo_expirado',
          type: 'radio',
          label: this.translate.instant('POPOVER.expirado'),
          value: '1,3',
          checked: this.status == '1,3' ? true : false
        },

        {
          name: 'invalido',
          type: 'radio',
          label: this.translate.instant('POPOVER.invalido'),
          value: '4',
          checked: this.status == '4' ? true : false
        },

        {
          name: 'anulado',
          type: 'radio',
          label: this.translate.instant('POPOVER.anulado'),
          value: '5',
          checked: this.status == '5' ? true : false
        },

        {
          name: 'pago_pendiente',
          type: 'radio',
          label: this.translate.instant('POPOVER.pago_pendiente'),
          value: '6',
          checked: this.status == '6' ? true : false
        },
        {
          name: 'emision_prueba',
          type: 'radio',
          label: this.translate.instant('POPOVER.emision_prueba'),
          value: '9',
          checked: this.status == '9' ? true : false
        }
      ],
      buttons: [
        {
          text: this.translate.instant('POPOVER.cancelar')
        }, {
          text: this.translate.instant('POPOVER.aceptar'),
          handler: (data) => {
            console.log('Confirm ', data);
            this.status = data;
          }
        }
      ]
    });

    await alert.present();
  }

}
