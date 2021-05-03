import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, Platform, AlertController, ToastController, ModalController, LoadingController } from '@ionic/angular';
import { IlsadminService } from '../providers/ilsadmin.service';
import { FormsModule } from '@angular/forms';
import { GetPlansComponent } from '../get-plans/get-plans.component';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-cotizador',
  templateUrl: './cotizador.page.html',
  styleUrls: ['./cotizador.page.scss'],
})
export class CotizadorPage implements OnInit, OnDestroy {

  public COLOR_MENU_BACKEND;
  public categorias;
  public Aerror;
  public precios;
  public fechaActual;
  public fechSalida;
  public fechLegada;
  public actualYYYY: any;
  public yyyySalida;
  public llegadaMin: String = new Date().toISOString();
  public llegadaMax: String = new Date().toISOString();
  public auxCateg;
  public selCateg = null;
  public selCategoriaName;
  public arrEdades = [];
  public numPasajeros;
  public numeroPasaj;
  public edades;
  public paises;
  public territorios;
  public parametros;
  public nomClient;
  public startDate;
  public salidaConv;
  public endDate = null;
  public llegadaConv;
  public pref;
  public logo;
  public userType;
  public origen: string;
  public bloque;
  public spinnerImg = false;
  public pruebaSalida;
  public pruebaLlegada;
  public salidaApi;
  public llegadaApi;
  public destino;
  public pasajeroMax;
  public intervaloEdades;
  public intervaloFechas;
  public bloqueSel;
  public nomDestino: any;
  public nomOrigen: any;
  public spinnerLoader: any = [];
  public idPreOrden;

  constructor(public navCtrl: NavController,
    public ilsAdminProvider: IlsadminService,
    public platform: Platform,
    public alertCtrl: AlertController,
    public ToastCtrl: ToastController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public formsModule: FormsModule,
    public datePicker: DatePicker,
    public translate: TranslateService,
    public router: Router) {
    this.pref = localStorage.getItem('pref');
    this.nomClient = localStorage.getItem('nomClient');
    this.fechaActual = this.hoyFecha();
    this.actualYYYY = this.yearAct();
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.logo = localStorage.getItem("logo");
    this.userType = localStorage.getItem("userType");
    console.log(this.rangoEdadesYFechas());
  }

  ngOnInit() {
    this.ionViewDidLoad()
  }

  ngOnDestroy() {
    console.log('Destruyo Cotizador');
  }

  hoyFecha() {
    var hoy = new Date();//Se obtiene la fecha actual del sistema operativo con formato año-mes-dia
    let dd = ((hoy.getDate()) < 10 ? '0' : '') + (hoy.getDate());
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaDeHoy = yyyy + '-' + mm + '-' + dd;
    return fechaDeHoy;
  }

  formatoFecha(date) {
    var hoy;
    date ? hoy = date : hoy = new Date();//si se envia una fecha se formateara si no se recibe ninguna obtendra la fecha actual del S.O
    let dd = ((hoy.getDate()) < 10 ? '0' : '') + (hoy.getDate());
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaDeHoy = yyyy + '-' + mm + '-' + dd;
    return fechaDeHoy;
  }

  cargaDeImg(load) {
    this.spinnerImg = true;
  }

  yearAct() {
    var año = new Date();
    let yyyy = año.getFullYear();
    return yyyy;
  }

  arribaRefresh(event) {

    setTimeout(() => {
      console.log('Actualizar Cotizador');
      event.target.complete(this.ionViewDidLoad());
    }, 2000);

    this.origen = null;
    this.destino = null;
    this.startDate = null;
    this.salidaConv = null;
    this.salidaApi = null;
    this.endDate = null;
    this.llegadaConv = null;
    this.llegadaApi = null;
    this.llegadaMin = null;
    this.llegadaMax = null;
    this.categorias = null;
    this.spinnerLoader = [];
    this.auxCateg = null;
    this.selCateg = null;
    this.selCategoriaName = null;
    this.edades = null;
    this.arrEdades = [];
    this.fechSalida = null;
    this.fechLegada = null;
    this.numPasajeros = null;
    this.intervaloEdades = null;
    this.bloqueSel = null;
    this.nomDestino = null;
    this.nomOrigen = null;
    this.bloque = null;
    this.idPreOrden = null;
  }

  async ionViewDidLoad() {
    if (localStorage.getItem('pref') == null) {
      console.log('no logueado');
      this.noLogin();
      return
    }

    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('COTIZADOR.cargando_cotizador'),
      duration: 40000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.getCategories(localStorage.getItem('pref'))
        .subscribe(
          (data) => {
            if (!data[0].notes) {
              this.categorias = data;
              for (let i = 0; i < this.categorias.length; i++) {
                this.spinnerLoader.push(false);
              }
              console.log(this.categorias);
              this.Aerror = null;
            } else {
              let aviso = this.translate.instant('COTIZADOR.no_categoria');
              this.toastErrorSeleccion(aviso, '', '');
            }
          },
          (error) => {
            this.Aerror = error;
            console.log(this.Aerror);
          }
        );

      this.ilsAdminProvider.getTerritorios(localStorage.getItem('pref'))
        .subscribe(
          (data) => {
            if (!data[0].notes) {
              this.territorios = data;
              console.log(this.territorios);
              this.Aerror = null;
            } else {
              let aviso = this.translate.instant('COTIZADOR.no_territorios');
              this.toastErrorSeleccion(aviso, '', '');
            }
          },
          (error) => {
            this.Aerror = error;
            console.log(this.Aerror);
          }
        );

      this.ilsAdminProvider.getCountries(localStorage.getItem('pref'))
        .subscribe(
          (data) => {
            if (!data[0].notes) {
              this.paises = data;
              console.log(this.paises);
              loader.dismiss();
              this.Aerror = null;
            } else {
              loader.dismiss();
              let aviso = this.translate.instant('COTIZADOR.no_paises');
              this.toastErrorSeleccion(aviso, '', '');
            }
          },
          (err) => {
            this.Aerror = err;
            console.log(this.Aerror);
          },
          () => {
            loader.dismiss();
          }
        );
    });
    console.log(this.fechaActual, this.actualYYYY)
  }

  async noLogin() {
    let alert = await this.alertCtrl.create({
      header: this.translate.instant('COTIZADOR.por_f_logueate'),
      message: this.translate.instant('COTIZADOR.inicia_ses_acc_cot'),
      buttons: [
        {
          text: this.translate.instant('COTIZADOR.aceptar'),
          handler: () => {
            //this.navCtrl.getPrevious();
            console.log('OK');
          }
        }
      ]
    });
    alert.present();
  }

  nombreOrigen(id) {
    for (let i = 0; i < this.paises.length; i++) {
      if (this.paises[i].iso_country == id) {
        this.nomOrigen = this.paises[i].description;
      }
    }
    console.log(this.nomOrigen);
  }

  nombredestino(id) {///aqui obtengo el nombre del destino 
    for (let i = 0; i < this.territorios.length; i++) {
      if (this.territorios[i].id_territory == id) {
        this.nomDestino = this.territorios[i].desc_small;
      }
    }
    console.log(this.nomDestino);
  }

  borrarFechaSalida(a, salida) {
    let extAño = salida.substring(0, salida.length - 6);
    let extMes = salida.substring(5, salida.length - 3);
    let extDia = salida.substring(8, salida.length - 0);
    extDia = (parseInt(extDia) + 1);
    extDia = (extDia < 10 ? '0' + extDia : extDia);
    let fechaMas = extAño + "-" + extMes + "-" + extDia;
    this.llegadaMin = fechaMas;
    this.fechaLlegadaMax(salida);
    console.log('fecha regreso min', this.llegadaMin);
    this.endDate = null;
  }

  fechaLlegadaMax(salida) {
    let extAño = salida.substring(0, salida.length - 6);
    let extMes = salida.substring(5, salida.length - 3);
    let extDia = salida.substring(8, salida.length - 0);
    extAño = (parseInt(extAño) + 1);
    extDia = (parseInt(extDia) - 1);
    extDia = (extDia < 10 ? '0' + extDia : extDia);
    let fechaMax = extAño + "-" + extMes + "-" + extDia;
    this.llegadaMax = fechaMax;
    this.scrollAbajo(500);
    console.log('fecha regreso max', this.llegadaMax);
  }

  selCategoria(categoria, nomCategoria, i) {
    if (this.selCateg != categoria) {
      this.rangoEdadesYFechas();
    }
    this.selCateg = categoria;
    this.selCategoriaName = nomCategoria;
    if (this.auxCateg == null) {
      this.auxCateg = false;
      this.rangoEdadesYFechas();
    }
    console.log('click', categoria, nomCategoria);
  }

  cargaImgCategorias($event, i) {
    this.spinnerLoader[i] = true;
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

  fechaLlegadaMinDatePicker(date: Date, masDias: number) {//aqui aumento 2 dias para que se establezca bien el limite de fecha minima de salida del datepicker
    var hoy = this.agregaDias(new Date(date), masDias);
    hoy.setDate(hoy.getDate() + 1);//sumo un dia para que limite bien en el datepicker nativo la fecha minima
    let dd = (hoy.getDate() < 10 ? '0' : '') + hoy.getDate();
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = hoy.getFullYear();
    let fechaMinDate = yyyy + '-' + mm + '-' + dd;
    console.log('minLegada', fechaMinDate);
    return fechaMinDate;
  }

  fechaLlegadaMaxDatePicker(date: Date, masDias: number) {//aqui aumento un año menos un dia para limitar la fecha maxima
    var hoy = this.agregaDias(new Date(date), masDias);
    hoy.setDate(hoy.getDate() + 1);//sumo un dia para que limite bien en el datepicker nativo la fecha maxima
    let dd = (hoy.getDate() < 10 ? '0' : '') + hoy.getDate();
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = (hoy.getFullYear());
    let fechaMinDate = yyyy + '-' + mm + '-' + dd;
    console.log('MaxLegada', fechaMinDate);
    return fechaMinDate;
  }

  fechaSalidaMaxDatePicker(date) {//aqui aumento un año menos un dia para limitar la fecha maxima
    var hoy;
    date ? hoy = new Date(date) : hoy = new Date();
    let dd = ((hoy.getDate() + 1) < 10 ? '0' : '') + (hoy.getDate() + 1);
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = ((hoy.getFullYear()) + 4);
    let fechaMinDate = yyyy + '-' + mm + '-' + dd;
    return fechaMinDate;
  }

  cambiarFormatoFecha(fecha) {
    var hoy;
    hoy = new Date(fecha);
    let dd = ((hoy.getDate()) < 10 ? '0' : '') + (hoy.getDate());
    let mm = ((hoy.getMonth() + 1) < 10 ? '0' : '') + (hoy.getMonth() + 1);
    let yyyy = (hoy.getFullYear());
    let fechaMinDate = dd + '-' + mm + '-' + yyyy;
    return fechaMinDate;
  }

  datePickerSalida() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      titleText: this.translate.instant('COTIZADOR.sel_fecha_salida'),
      androidTheme: (localStorage.getItem('themeDark') == 'true') ? this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK : this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      minDate: (this.platform.is('android')) ? moment(new Date()).valueOf() : new Date(this.fechaActual),
      maxDate: (this.platform.is('android')) ? (new Date(this.fechaSalidaMaxDatePicker(this.fechaActual))).valueOf() : new Date(this.fechaSalidaMaxDatePicker(this.fechaActual)),
      //allowOldDates:true,
      todayText: this.translate.instant('POPOVER.hoy'),
      cancelText: this.translate.instant('POPOVER.cancelar'),
      okText: this.translate.instant('POPOVER.aceptar')
    }).then(
      (date) => {
        this.startDate = this.formatoFecha(date);
        console.log('startDate', this.startDate);
        this.salidaConv = this.cambiarFormatoFecha(date);
        this.salidaApi = date;
        this.endDate = null;
        this.llegadaConv = null;
        this.llegadaApi = null;
        if ((this.intervaloFechas[0].dias_min == 365) && (this.intervaloFechas[0].dias_max == 365) && this.intervaloFechas[0].bloques_multi_viajes) {
          this.bloqueSel = true;
          this.llegadaApi = this.formatoFecha(this.agregaDias(date, 365));
          this.endDate = this.formatoFecha(this.agregaDias(date, 365));
          this.llegadaConv = this.cambiarFormatoFecha(this.agregaDias(date, 365));
        }
        this.scrollAbajo(500);
      })
      .catch((err) => {
      })
  }

  datePickerllegada() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      titleText: this.translate.instant('COTIZADOR.dias_min') + this.intervaloFechas[0].dias_min + this.translate.instant('COTIZADOR.dias_max') + this.intervaloFechas[0].dias_max,
      androidTheme: (localStorage.getItem('themeDark') == 'true') ? this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK : this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      minDate: (this.platform.is('android')) ? (new Date(this.fechaLlegadaMinDatePicker(this.startDate, this.intervaloFechas[0].dias_min + 1))).valueOf() : new Date(this.fechaLlegadaMinDatePicker(this.startDate, this.intervaloFechas[0].dias_min + 1)),
      maxDate: (this.platform.is('android')) ? (new Date(this.fechaLlegadaMaxDatePicker(this.startDate, this.intervaloFechas[0].dias_max + 1))).valueOf() : new Date(this.fechaLlegadaMaxDatePicker(this.startDate, this.intervaloFechas[0].dias_max + 1)),
      //allowOldDates:true,
      //todayText:'Hoy'
      cancelText: this.translate.instant('POPOVER.cancelar'),
      okText: this.translate.instant('POPOVER.aceptar')
    }).then(
      (date) => {
        this.endDate = this.formatoFecha(date);
        this.llegadaConv = this.cambiarFormatoFecha(date);
        this.llegadaApi = this.formatoFecha(date);
        this.scrollAbajo(500);
        console.log('endDate', this.endDate)
      })
      .catch((err) => {

      })
  }

  agregaDias(date: Date, days: number) {
    var fecha2;
    fecha2 = moment(date).add(days, 'days').format('YYYY-MM-DD');
    return new Date(fecha2);
  }

  async rangoEdadesYFechas() {
    if (this.origen && this.destino && this.selCateg) {
      this.startDate = null;
      this.salidaConv = null;
      this.salidaApi = null;
      this.endDate = null;
      this.llegadaConv = null;
      this.llegadaApi = null;
      this.numPasajeros = null;
      this.bloque = null;
      this.bloqueSel = null;
      this.arrEdades = [];
      this.intervaloFechas = null;
      let loader = await this.loadingCtrl.create({
        message: this.translate.instant('COTIZADOR.carg_rang_ed_fech'),
        duration: 150000
      });

      this.ilsAdminProvider.getIntervaloFechas(localStorage.getItem('pref'), this.selCateg, this.origen)
        .subscribe(
          (data) => {
            if (!data[0].notes) {
              this.intervaloFechas = data;
              console.log(this.intervaloFechas);
            } else {
              let aviso = this.translate.instant('COTIZADOR.no_interv_fechas');
              this.toastErrorSeleccion(aviso, '', '');
            }
          }, (err) => {
            loader.dismiss();
            let aviso = this.translate.instant('COTIZADOR.no_interv_fechas');
            this.toastErrorSeleccion(aviso, '', '');
            console.log(err);
          });

      loader.present().then(() => {
        this.ilsAdminProvider.getIntervaloDeEdades(localStorage.getItem('pref'), this.origen, this.selCateg)
          .subscribe(
            (data) => {
              if (!data[0].notes) {
                this.pasajeroMax = data[0][0].num_pas;
                this.intervaloEdades = data;
                console.log(data, this.pasajeroMax);
              } else {
                let aviso = this.translate.instant('COTIZADOR.no_interv_edades');
                this.toastErrorSeleccion(aviso, '', '');
              }
            },
            (err) => {
              console.log(err);
              loader.dismiss();
              let aviso = this.translate.instant('COTIZADOR.no_interv_edades');
              this.toastErrorSeleccion(aviso, '', '');
            },
            () => {
              setTimeout(() => {
                loader.dismiss();
                this.scrollAbajo(500);
              }, 500);
            }
          );
      });
    }
  }

  nPasajeros() {
    this.funMaxPasajero(this.pasajeroMax);
  }

  funMaxPasajero(cantidad: number) {
    const data: any = [];

    for (let i = 1; i <= cantidad; i++) {
      data[i - 1] = Object.assign({
        name: (i > 1) ? i + this.translate.instant('COTIZADOR.pasajeros') : i + this.translate.instant('COTIZADOR.pasajero'),
        type: 'radio',
        label: (i > 1) ? i + this.translate.instant('COTIZADOR.pasajeros') : i + this.translate.instant('COTIZADOR.pasajero'),
        value: i
      });
    }

    this.alertNPasajeros(data)
  }

  async alertNPasajeros(arreglo: []) {
    let alert = await this.alertCtrl.create({
      header: this.translate.instant('COTIZADOR.selec_cant_pasaj') + arreglo.length + ')',
      inputs: arreglo,
      buttons: [
        {
          text: this.translate.instant('COTIZADOR.cancelar'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('COTIZADOR.aceptar'),
          handler: (data) => {
            if (data) {
              console.log('Cantidad de Pasajetos Seleccionados', data);
              let miArreglo = [];
              for (let i = 0; i < data; i++) {
                miArreglo.push(i);
                //console.log('radio datos:', miArreglo, i, data);
              }
              this.numPasajeros = miArreglo;
              this.numeroPasaj = data;

              for (let i = 0; i < this.numPasajeros.length; i++) {
                this.arrEdades[i] = null;
              }
              this.scrollAbajo(500);
              console.log(this.numPasajeros, this.arrEdades)
            }
          }
        }
      ]
    });

    await alert.present();
  }

  edadPasajero(posicion) {
    let intPosicion = parseInt(posicion);
    console.log('prueba', intPosicion)
    this.alertEdades(intPosicion);
  }

  eliminarUnPasajero(indice, edad) {
    console.log(indice, edad, this.numPasajeros, this.arrEdades);
    //aqui elimino la posicion del pasajero y la reordeno
    for (var i = this.numPasajeros.length; i >= 0; i--) {

      if (this.numPasajeros[i] === indice) {
        this.numPasajeros.splice(i, 1);
      }

    }
    //aqui coloco posicion de 0 a n para que capture la posicion correcta al momneto de eliminar la edad del pasajero selecionado
    for (let i = 0; i < this.numPasajeros.length; i++) {
      this.numPasajeros[i] = i;
    }
    if (this.numPasajeros.length == 0) {
      console.log("no hay edades procede a eliminar los pasajeros con las edades");
      this.numPasajeros = null;
      this.arrEdades = [];
      this.edades = null;
      return
    }

    console.log(this.numPasajeros, this.arrEdades);

    for (var a = this.numPasajeros.length; a >= 0; a--) {

      if (this.arrEdades[indice] === edad) {
        this.arrEdades.splice(indice, 1);
        console.log(this.arrEdades, indice);
        return
      }
    }
    if (this.arrEdades[indice] == null) {
      console.log("array de edades nulo");
      this.numPasajeros = null;
      this.arrEdades = null;
      this.edades = null;
    }
  }

  async alertEdades(posicion) {
    let alert = await this.alertCtrl.create({
      header: this.translate.instant('COTIZADOR.edad_pasajero') + (posicion + 1),
      inputs: [
        {
          name: 'Edad',
          placeholder: this.translate.instant('COTIZADOR.de') + this.intervaloEdades[0][0].edadMin + this.translate.instant('COTIZADOR.a') + this.intervaloEdades[0][0].edadMax + this.translate.instant('COTIZADOR.years'),
          type: 'number',
          min: Number(this.intervaloEdades[0][0].edadMin),
          max: Number(this.intervaloEdades[0][0].edadMax),
        }
      ],
      buttons: [
        {
          text: this.translate.instant('COTIZADOR.atras'),
          role: 'Atras',
          handler: data => {
            console.log('Cancel clicked', data);
          }
        },
        {
          text: this.translate.instant('COTIZADOR.aceptar'),
          handler: data => {
            let entero = data.Edad;
            entero = entero * entero;
            console.log(data.Edad, entero);
            if ((data.Edad >= (Number(this.intervaloEdades[0][0].edadMin))) && (data.Edad <= Number(this.intervaloEdades[0][0].edadMax) && this.validarEdad(data.Edad))) {
              console.log('ok');
              let arreglo = new Array();
              arreglo.push(posicion, Number(data.Edad));
              console.log(this.arrEdades.length);

              for (let i = 0; i < this.arrEdades.length; i++) {
                this.arrEdades[posicion] = data.Edad;
              }

              this.edades = this.arrEdades.toString();
              console.log('radio datos:', this.arrEdades, this.edades);
            }
            else {
              let message = this.translate.instant('COTIZADOR.edad_invalida') + this.intervaloEdades[0][0].edadMin + this.translate.instant('COTIZADOR.a') + this.intervaloEdades[0][0].edadMax + this.translate.instant('COTIZADOR.years');
              this.toastErrorSeleccion(message, false, false);
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  validarEdad(number) {
    return /^[0-9]{1,3}$/.test(number);
  }

  elimPasajeros() {
    this.numPasajeros = null;
    this.arrEdades = [];
    this.edades = null;
  }

  async cotizar(origen, destino, startDate, endDate, selCateg, edades) {

    let fechSalida = new Date(this.salidaApi);
    let sdia = fechSalida.getDate();
    let sdias = (sdia < 10 ? '0' + sdia : sdia);
    let smes = fechSalida.getMonth() + 1;
    let smess = (smes < 10 ? '0' + smes : smes);
    let sano = fechSalida.getFullYear();
    let salida = sdias + '/' + smess + '/' + sano;
    this.pruebaSalida = salida;
    console.log('LLEGADAAPI', this.llegadaApi);

    let auxRegreso = String(this.llegadaConv).split('-');
    let regreso = auxRegreso[0] + '/' + auxRegreso[1] + '/' + auxRegreso[2];
    this.pruebaLlegada = regreso;
    console.log('SALIDAAPI:', endDate);
    console.log('SALIDA:', salida, '    REGRESO:', regreso)

    if (!this.endDate) {
      let sinFechaRegreso = this.translate.instant('COTIZADOR.selec_fechas_valida');
      this.toastErrorSeleccion('', '', sinFechaRegreso);
      return;
    }

    if (this.arrEdades.length == 0) {
      let sinPasajerosEdades = this.translate.instant('COTIZADOR.ing_pasaj_edad');
      console.log(sinPasajerosEdades, 'No hay Pasajeros Selecionados');
      this.toastErrorSeleccion('', '', sinPasajerosEdades);
      return edades;
    }

    for (let i = 0; i < this.arrEdades.length; i++) {
      if (isNaN(this.arrEdades[i]) || this.arrEdades[i] == null) {
        console.log('Campo Vacío', this.arrEdades[i]);
        let edadVacia = this.translate.instant('COTIZADOR.edad_vacia_pasaj') + (i + 1);
        this.toastErrorSeleccion('', edadVacia, '');
        return edadVacia;
      }
    }

    this.parametros = [origen, destino, salida, regreso, this.selCategoriaName, selCateg, edades, this.bloque, this.nomOrigen, this.nomDestino];
    console.log(origen, destino, salida, this.endDate, selCateg, edades, this.parametros);

    let preOrdenData = this.funDataPreOrden(origen, destino, salida, regreso, selCateg, edades);
    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('COTIZADOR.cargando_planes'),
      duration: 100000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.GetPricesApiQuoteGeneral(localStorage.getItem('pref'), origen, destino, salida.toString(), regreso.toString(), selCateg, edades.toString(), this.bloque, '', preOrdenData)
        .subscribe(
          (data: any) => {
            this.precios = data;
            this.idPreOrden = (data[0].preOrden && data[0].preOrden.id) ? data[0].preOrden.id : null;
            console.log(data, this.idPreOrden);
            loader.dismiss();
            if (!data[0].notes) {
              this.modalPrecios(this.precios);
              this.Aerror = null;
            } else {
              this.toastErrorSeleccion(data[0].notes, '', '');
            }
          },
          (error) => {
            this.Aerror = error;
            if (this.Aerror.error[0].notes) {
              this.toastErrorSeleccion(this.Aerror.error[0].notes, '', '');
              console.log(this.Aerror.error[0].notes)
            }
            loader.dismiss();
            console.log(this.Aerror, error);
          }
        );
    })
  }

  async modalPrecios(precios) {

    const modal = await this.modalCtrl.create({
      component: GetPlansComponent,
      componentProps: {
        precios: precios,
        parametros: this.parametros,
        paises: this.paises,
        idPreOrden: this.idPreOrden
      }
    });

    modal.onDidDismiss()
      .then((data: any) => {
        setTimeout(() => {
          if (data.data.emision == 'ERROR') {
            console.log('data ERROR ', data);
            this.router.navigate(['/info-emision', { data: JSON.stringify(data) }]);
          } if (data.data.emision == 'OK') {
            console.log('data OK ', data);
            this.router.navigate(['/info-emision', { data: JSON.stringify(data) }]);
          }
        }, 500);
        console.log('data callback', data);
      });

    return await modal.present();
  }

  funDataPreOrden(origen: string, destino: string, salida: string, regreso: string, selCateg: string, edades: any) {
    let datos = {
      'origen': origen,
      'destino': destino,
      'FechaSalida': moment(salida, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      'FechaLlegada': moment(regreso, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      'id_plan_categoria': selCateg,
      'edades': edades,
      'bloque': this.bloque,
      'paso': 1
    };
    console.log("dataPreOrden", datos);
    return JSON.stringify(datos);
  }

  async toastErrorSeleccion(errorNotes, edadVacia, sinPasajerosEdades) {
    let toast = await this.ToastCtrl.create({
      message: (errorNotes ? errorNotes : edadVacia) + (sinPasajerosEdades ? sinPasajerosEdades : '') + '!',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss()
      .then()
      .catch();
    toast.present();
  }

  scrollAbajo(time) {

    setTimeout(() => {
      let top = document.getElementById('bottom');
      if (top !== null) {
        top.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        top = null;
      }
    }, time ? time : 500);
  }

}
