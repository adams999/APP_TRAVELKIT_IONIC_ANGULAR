import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { IlsadminService } from '../providers/ilsadmin.service';
import { PopoverController, AlertController, ToastController, LoadingController, NavController, IonVirtualScroll, ModalController } from '@ionic/angular';
import { IonInfiniteScroll } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverComponent } from '../popover/popover.component';
import { PopoverTelSmsComponent } from '../popover-tel-sms/popover-tel-sms.component';
import { TranslateService } from '@ngx-translate/core';
import { FormPagoComponent } from '../form-pago/form-pago.component';
import { GetPlansComponent } from '../get-plans/get-plans.component';
import { PopoverDescripcionComponent } from '../popover-descripcion/popover-descripcion.component';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.page.html',
  styleUrls: ['./list-orders.page.scss'],
})
export class ListOrdersPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll, { static: false }) virtualScroll: IonVirtualScroll;

  public activo = "#229954";
  public pagoPendCDA = "#E9E600";
  public activoEspirado = "#49D6CF";
  public invalido = "#BCBCBC";
  public anulado = "#F10300";
  public pagoPendTDC = "#A900B6";
  public prueba = "#FF8403";
  public pref;
  public ordenes = [];
  public nota;
  public Aerror = null;
  public codeBus;
  public docBus;
  public nomBus;
  public min = 0;
  public acuMax = 0;
  public pagMax = 20;//parametro para cambiar cantidad de registros por cada paginacion
  public max = this.acuMax + this.pagMax;
  public buscador;
  public userType;
  public startDate: string;
  public endDate: string;
  public COLOR_MENU_BACKEND;
  public nomClient;
  public salFecha;
  public regFecha;
  public logo: any = false;
  public versionApp;
  public diasViaje = [];
  public linkVoucher;
  public color_menu_barra_hover;
  public paramPlatform: any = [
    { parameter_key: "DOWNLOAD_PDF_VOUCHER_APP", parameter_value: "N" },
    { parameter_key: "SEND_EMAIL_APP", parameter_value: "N" },
    { parameter_key: "SEND_SMS_APP", parameter_value: "N" }
  ];
  public subscription;
  public statusFilter: any;
  public salidaFilter: any;
  public llegadaFilter: any;
  public agencyFilter: any;

  constructor(public navCtrl: NavController,
    public ilsAdminProvider: IlsadminService,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public router: Router,
    public translate: TranslateService,
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public zone: NgZone) {
    this.linkVoucher = localStorage.getItem('web') + "/print/";
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.color_menu_barra_hover = localStorage.getItem('color_menu_barra_hover');
    this.pref = localStorage.getItem('pref');
    this.userType = localStorage.getItem('userType');
    this.nomClient = localStorage.getItem('nomClient');
    this.logo = localStorage.getItem("logo");
    this.ionViewDidLoad('', '', '', '', '');
    console.log(this.pref, this.startDate, this.endDate);

    this.subscription = this.ilsAdminProvider.currentData.subscribe((data) => {
      console.log('data pasada', data);
      if (data == 'list-orders-refresh') {
        this.zone.run(() => {
          console.log('Orden modificada Actualiza componente');
          this.nota = null;
          this.max = 20;
          this.min = 0;
          this.ordenes = [];
          this.ionViewDidLoad('', this.max = this.pagMax, this.codeBus, this.docBus, this.nomBus);
        });
      }
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log('Destruye list-orders');
    this.subscription.unsubscribe('list-orders-refresh');
  }

  arribaRefresh(refresher) {
    setTimeout(() => {
      console.log('Operacion Asincrona');
      this.nota = null;
      this.max = 20;
      this.min = 0;
      this.ordenes = [];
      refresher.target.complete(this.ionViewDidLoad('', this.max = this.pagMax, this.codeBus, this.docBus, this.nomBus));
    }, 2000);
  }

  busInput($event) {
    console.log('Buscar', this.buscador);

    if (this.buscador == "" || this.buscador == null || this.buscador == false) {
      console.log('BUSQUEDA SIN PARAMETROS');
      this.ordenes = [];
      this.nota = null;
      this.codeBus = null;
      this.docBus = null;
      this.nomBus = null;
      this.max = 20;
      this.min = 0;
      this.Aerror = null;
      this.ionViewDidLoad('', this.max = this.pagMax, '', '', '');
    }

    else if (this.buscador.indexOf('-') != -1 && this.buscador.length > 3) {
      this.codeBus = this.buscador;
      console.log('codigo');
      this.max = 20;
      this.min = 0;
      this.ionViewDidLoad('', '', this.codeBus, '', '');
      this.nomBus = null;
      this.docBus = null;
      this.nota = null;
      this.ordenes = [];
      this.Aerror = null;
    }

    else if (this.buscador - Math.floor(this.buscador) != 0 && (this.buscador.indexOf('-') != -1) == false && this.buscador.length > 3) {
      this.nomBus = this.buscador;
      console.log('nombre');
      this.max = 20;
      this.min = 0;
      this.ionViewDidLoad('', '', '', '', this.nomBus);
      this.docBus = null;
      this.ordenes = [];
      this.nota = null;
      this.codeBus = null;
      this.Aerror = null;
    }

    else if (this.buscador - Math.floor(this.buscador) == 0 && this.buscador.length > 3) {
      this.docBus = this.buscador;
      console.log('documento');
      this.max = 20;
      this.min = 0;
      this.ionViewDidLoad('', '', '', this.docBus, '');
      this.codeBus = null;
      this.ordenes = [];
      this.nota = null;
      this.nomBus = null;
      this.Aerror = null;
    }
  }

  onCancel($event) {
    this.ordenes = [];
    this.nota = null;
    this.codeBus = null;
    this.docBus = null;
    this.nomBus = null;
    this.max = 20;
    this.min = 0;
    this.Aerror = null;
    console.log('cancelado');
  }

  elimFecha() {
    this.startDate = null;
    this.endDate = null;
    this.salidaFilter = null;
    this.llegadaFilter = null;
    this.ordenes = [];
    this.nota = null;
    this.max = 20;
    this.min = 0;
    this.ionViewDidLoad(this.min, this.max, this.codeBus, this.docBus, this.nomBus);
    console.log('fechas eliminadas', this.startDate, this.endDate)
  }

  async popoverFecha(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        salida: this.salidaFilter,
        llegada: this.llegadaFilter,
        status: this.statusFilter,
        agency: this.agencyFilter
      }
    });

    popover.onDidDismiss()
      .then((data) => {
        console.log('PARAMETROS ', data, this.startDate, this.endDate, this.salFecha, this.regFecha);
        if (data.data.salida && data.data.llegada || data.data.status || data.data.agency) {
          this.startDate = data.data.salida;
          this.salFecha = data.data.salida ? this.cambiarFormatoFecha(this.startDate) : '';
          this.endDate = data.data.llegada;
          this.regFecha = data.data.llegada ? this.cambiarFormatoFecha(this.endDate) : '';
          this.ordenes = [];
          this.statusFilter = data.data.status ? data.data.status : null;
          this.llegadaFilter = data.data.llegada ? data.data.llegada : null;
          this.salidaFilter = data.data.salida ? data.data.salida : null;
          this.agencyFilter = data.data.agency ? data.data.agency : null;
          this.nota = null;
          this.max = 20;
          this.min = 0;
          this.ionViewDidLoad(this.min, this.max, this.codeBus, this.docBus, this.nomBus);
        }
        if (data.data.reset == true) {
          this.startDate = null;
          this.salFecha = null;
          this.endDate = null;
          this.regFecha = null;
          this.ordenes = [];
          this.statusFilter = null;
          this.llegadaFilter = null;
          this.salidaFilter = null;
          this.agencyFilter = null;
          this.ionViewDidLoad(this.min, this.max, this.codeBus, this.docBus, this.nomBus);
        }
      })
      .catch((err) => {
        console.log('No se paso parametro');
      })

    return await popover.present();
  }

  cambiarFormatoFecha(fecha) {
    let extAño = fecha.substring(0, fecha.length - 6);
    let extMes = fecha.substring(5, fecha.length - 3);
    let extDia = fecha.substring(8, fecha.length - 0);
    extAño = (parseInt(extAño));
    extDia = (parseInt(extDia));
    extDia = (extDia < 10 ? '0' + extDia : extDia);
    let formatFecha = extDia + "-" + extMes + "-" + extAño;
    //console.log('dd/mm/aaaa',formatFecha);
    return formatFecha;
  }

  enviarEmail(idVouch, codVouch) {
    console.log(idVouch);
    let title = this.translate.instant('LIST-ORDERS.enviar_voucher') + codVouch;
    let message = this.translate.instant('LIST-ORDERS.ing_corr_orden');
    let type = "email";
    let Placeholder = this.translate.instant('LIST-ORDERS.ing_correo');
    this.alertInput(title, message, type, Placeholder, '', '', idVouch, '');
  }

  async alertInput(title, message, type, Placeholder, codVouch, name, idVouch, salida) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: message,
      inputs: [
        {
          name: 'input',
          type: type,
          placeholder: Placeholder
        }
      ],
      buttons: [
        {
          text: this.translate.instant('LIST-ORDERS.cancelar'),
          role: 'Cancelar',
          handler: data => {
            console.log('Cancelar');
          }
        },
        {
          text: this.translate.instant('LIST-ORDERS.enviar'),
          handler: data => {

            if (type == 'email') {
              if (this.validarEmail(data.input)) {
                console.log(data.input);
                this.enviarEmailVoucher(idVouch, data.input);
              } else {
                // invalid login
                return false;
              }
            }

            if (type == 'tel') {
              if (this.validarNumber(data.input)) {
                console.log(data.input);
                this.enviarLinkSms('', data.input, '', codVouch, name, this.linkVoucher, salida);
              } else {
                // input invalido
                return false;
              }
            }
          }
        }
      ]
    });
    alert.present();
  }

  validarEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email);
  }

  validarNumber(number) {
    return /^[0-9+-]{10,20}$/.test(number);
  }

  async enviarEmailVoucher(idVouch, email) {
    let data = new FormData();
    data.append("id_orden", idVouch);
    data.append("email", email);
    data.append("prefix", this.pref);

    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('LIST-ORDERS.enviando_correo'),
      duration: 50000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.sendVouchEmail(data)
        .subscribe(
          (res) => {//Si recibe un estatus 200 o OK por parte del servidor 
            loader.dismiss();
            let respEmail = '200';
            console.log(respEmail);
            this.toastAviso(respEmail, '');
          },
          (err) => {
            console.log(err);
            loader.dismiss();
          }
        );
    });
  }

  async enviarSms(codigo, event, salida) {
    console.log(codigo, salida);

    let popover = await this.popoverCtrl.create(
      {
        component: PopoverTelSmsComponent,
        translucent: true,
        componentProps: { codigo: codigo }
      }
    );

    popover.onDidDismiss()
      .then((data => {

        if (data.data.cod != null && data.data.tel != null) {
          console.log('se envia el sms')
          this.enviarLinkSms(data.data.cod, data.data.tel, this.pref, codigo, '', this.linkVoucher, salida);
          console.log(data);
        }
      }))
      .catch((err) => {
        console.log('No se paso parametro');
      })

    return await popover.present();
  }

  async enviarLinkSms(codPhone, numPhone, prefix, code, name, linkVoucher, salida) {

    let data = new FormData();
    data.append("codPhone", codPhone ? codPhone : '+58');
    data.append("numPhone", numPhone);
    data.append("prefix", this.pref);
    data.append("code", code);
    data.append("name", name ? name : '');
    data.append("linkVoucher", linkVoucher + code);
    data.append("salida", salida);
    data.append("nomClient", this.nomClient);

    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('LIST-ORDERS.enviando_sms'),
      duration: 50000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.sendSms(data)
        .subscribe(
          (data) => {
            let respSms = data;
            console.log(respSms);
            this.toastAviso('', respSms);
            loader.dismiss();
          },
          (err) => {
            console.log(err);
            this.navCtrl.pop();
            loader.dismiss();
          }
        );
    });
  }

  async toastAviso(respEmail, respSms) {

    let toast;
    //let email = respEmail.indexOf("Archivo cargado correctamente");
    let email = respEmail.indexOf('200');
    let sms = respSms.indexOf("OK");
    console.log(sms, email);

    if (respEmail) {
      if (email >= 0) {
        toast = await this.toastCtrl.create({
          message: this.translate.instant('LIST-ORDERS.correo_enviado'),
          duration: 3000,
          position: 'top'
        });
      } else if (email < 0) {
        toast = await this.toastCtrl.create({
          message: this.translate.instant('LIST-ORDERS.err_env_correo'),
          duration: 3000,
          position: 'top'
        });
      }
    }

    if (respSms) {
      if (sms >= 0) {
        toast = await this.toastCtrl.create({
          message: this.translate.instant('LIST-ORDERS.mensaje_enviado'),
          duration: 3000,
          position: 'top'
        });
      } else if (sms < 0) {
        toast = await this.toastCtrl.create({
          message: this.translate.instant('LIST-ORDERS.err_env_mensaje'),
          duration: 3000,
          position: 'top'
        });
      }
    }

    toast.onDidDismiss(() => {
      console.log('Eliminar toast');
    });

    toast.present();
  }

  postPrefix() {
    let datos = new FormData();
    datos.append("prefix", this.pref);
    return datos
  }

  // COMPONENTE DONDE SE HACE EL PASE DE PARAMETROS A LA API Y SE OBTIENE LOS RESULTADOS
  ionViewDidLoad(min, max, codeBus, docBus, nomBus) {

    this.ilsAdminProvider.postParamPlatform(this.postPrefix())
      .subscribe(
        (data) => {
          if (!data[0].notes) {
            this.paramPlatform = null;
            this.paramPlatform = data;
          } else {
            this.paramPlatform = [
              { parameter_key: "DOWNLOAD_PDF_VOUCHER_APP", parameter_value: "N" },
              { parameter_key: "SEND_EMAIL_APP", parameter_value: "N" },
              { parameter_key: "SEND_SMS_APP", parameter_value: "N" }
            ];
          }
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );

    this.ilsAdminProvider.getOrders((this.pref ? this.pref : localStorage.getItem('pref')), min ? min : this.min, max ? max : this.max, codeBus, docBus, (this.userType ? this.userType : localStorage.getItem('userType')), (this.startDate ? this.startDate : ''), (this.endDate ? this.endDate : ''), (nomBus ? nomBus : ''), '', this.statusFilter, this.agencyFilter)
      .subscribe(
        (data: any) => {
          if (data[0].notes) {
            this.Aerror = null;
            this.nota = data[0].notes;
          } else {
            this.Aerror = null;
            for (let i = 0; i < data.length; i++) {
              this.ordenes.push(data[i]);
            }
          }
          console.log(this.ordenes);
        },
        (error) => {
          this.Aerror = error;
          this.ordenes = [];
          console.log(this.Aerror);
        }
      );
  }

  detaOrder(arrOrden) {
    console.log('click', arrOrden);
    this.router.navigate(['detalleorden', { params: JSON.stringify(arrOrden), agencyPre: JSON.stringify(this.paramPlatform) }]);
  }

  scrollArriba() {
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  cargaInfinita(event) {
    console.log(event);
    setTimeout(() => {
      console.log('busca');
      event.target.complete(this.ionViewDidLoad(this.min = (this.min + this.pagMax), this.max, this.codeBus, this.docBus, this.nomBus));
      event.target.position = "bottom";
    }, 500);
  }

  async infoTdc(dataOrden) {
    console.log(dataOrden);

    let title = this.translate.instant('LIST-ORDERS.trans_tdc');

    let popover = await this.popoverCtrl.create({
      component: PopoverDescripcionComponent,
      componentProps: { parametros: { dataOrden, type: 'infoTdc' }, navbarTitle: title },
      event: null,
      translucent: true
    });

    popover.present();
  }

  async modalFromPago() {
    const modal = await this.modalCtrl.create({
      component: FormPagoComponent,
      componentProps: {
        dataPlan: {
          "valorMenor": "33.600",
          "subTotalMenores": "67.200",
          "valorMayor": "50.400",
          "subTotalMayor": "0.000",
          "costoMenor": "10.080",
          "subTotalMenores_costo": "20.160",
          "costoMayor": "15.120",
          "subTotalMayor_costo": "0.000",
          "netoMenor": "0.000",
          "subTotalMenores_neto": "0.000",
          "netoMayor": "0.000",
          "subTotalMayor_neto": "0.000",
          "numero_menores": 2,
          "numero_mayores": 0,
          "tiepoid": "2420",
          "total": "67.20",
          "total_costo": "20.160",
          "total_neto": "0.000",
          "name_plan": "7 Mil",
          "planfamiliar": 0,
          "planpareja": 0,
          "normal_age": 75,
          "max_age": 85,
          "min_age": "0",
          "moneda_local": "N",
          "tasa_cambio": 1,
          "valore_USD": null,
          "idp": "1611",
          "price_voucher": "1",
          "family_plan": "Y",
          "pareja_plan": "N",
          "factor_family": "2.50",
          "maxFamilyCnt": "3",
          "factor_family_cost": "2.50",
          "factor_family_age": 21,
          "activofactor": "no",
          "factor_pareja": 0,
          "activofactorpareja": "no",
          "factor_pareja_cost": 0,
          "moneda": "US$",
          "overage_factor": "1.50",
          "overage_factor_cost": "1.50",
          "valorMenor2": "33.600",
          "CostoMenor2": "10.080",
          "netoMenor2": "0.000",
          "preOrden": null,
          "USDTotal": "67.20",
          "moneda_paypal": "USD"
        },
        dataVuelo: ["AL", "1", "13/05/2020", "15/06/2020", "Viajes por día", "24", ["45"], null, "Albania", "World Wide"],
        rangEd: {
          edadMin: '0',
          edadMax: '85'
        },
        diasViaje: 26,
        idPreOrden: 39771
      }
    });

    return modal.present();
  }

  pruebainfoEmision() {
    let aux: any = {
      "emision": "ERROR",
      "dataApp": {},
      "dataQuote": {
        "code": 0,
        "error": {
          "code": "6",
          "element": "#numero_tarjeta",
          "text": "Numero de tarjeta inv&aacute;lido.",
          "elem_app": "codigoTarjeta"
        },
        "attempt": 2,
        "code_orden": "TH-9DB880",
        "preOrden": {
          "status": "OK",
          "id": "40310"
        },
        "dataPreOrden": {
          "nacimiento0": "2015-03-11",
          "nacimiento1": "1954-03-11",
          "pasajeros": [
            {
              "costo": "19.845",
              "neto": "0.000",
              "nombre": "test",
              "apellido": "test",
              "fechaNacimiento": "2015-03-11",
              "edad": "5",
              "sexo": "M",
              "pais": "AL",
              "tipoDocumento": "PAS",
              "documento": "test7155261",
              "email": "adamspurry@gmail.com",
              "codigoTelfono": "+57",
              "telefono": "3124073290",
              "condMed": "",
              "subtotal": "65.42",
              "codigoVoucher": "TH-9DB880"
            },
            {
              "costo": "19.845",
              "neto": "0.000",
              "nombre": "test",
              "apellido": "test",
              "fechaNacimiento": "1954-03-11",
              "edad": "66",
              "sexo": "M",
              "pais": "AL",
              "tipoDocumento": "PAS",
              "documento": "testtsgg",
              "email": "test@g.a",
              "codigoTelfono": "+355",
              "telefono": "234687845",
              "condMed": "",
              "subtotal": "65.42",
              "codigoVoucher": "TH-9DB880"
            }
          ],
          "contacto_emergencia": {
            "nameE": "test",
            "correoE": "test@gmail.com",
            "codigoTelE": "+355",
            "TelefPE": "364527896"
          },
          "upgrades": [],
          "cupon": null,
          "id_preorden": 40310,
          "array_prices_app": {
            "tiepoid": "8800",
            "surcharge_age": "N",
            "normal_age": 74,
            "overage_factor": "1.5",
            "overage_factor_cost": "1.5",
            "planpareja": 1,
            "pareja_plan": "Y",
            "factor_pareja": "1.75",
            "activofactorpareja": "si",
            "factor_pareja_cost": "1.75",
            "factor_family": "2.50",
            "factor_family_age": 21,
            "factor_family_cost": "2.50",
            "arrPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "85",
                "pvp": "65.415",
                "cost": "19.845",
                "net": "0.000"
              }
            ],
            "arrUSDPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "85",
                "pvp": "65.415",
                "cost": "19.845",
                "net": "0.000"
              }
            ],
            "arrBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "85",
                "pvp": "74.760",
                "cost": "22.680",
                "net": "0.000"
              }
            ],
            "arrUSDBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "85",
                "pvp": "74.760",
                "cost": "22.680",
                "net": "0.000"
              }
            ],
            "cntPrices": 1,
            "arrUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "85",
                "pvp": "65.415",
                "cost": "19.845",
                "net": "0.000",
                "pvpBase": "74.76",
                "costBase": "22.68",
                "numPas": 2,
                "pvpSubTotal": "130.830",
                "costSubTotal": "39.690",
                "netSubTotal": "0.000"
              }
            ],
            "arrUSDUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "85",
                "pvp": "65.415",
                "cost": "19.845",
                "net": "0.000",
                "pvpBase": "74.76",
                "costBase": "22.68",
                "numPas": 2,
                "pvpSubTotal": "130.830",
                "costSubTotal": "39.690",
                "netSubTotal": "0.000"
              }
            ],
            "cntUsedPrices": 1,
            "total": "130.830",
            "total_costo": "39.690",
            "total_neto": "0.000",
            "USDTotal": "130.830",
            "USDTotal_costo": "39.690",
            "USDTotal_neto": "0.000",
            "tasa_cambio": 1,
            "moneda_local": "N",
            "moneda": "US$",
            "name_plan": "USD 10.000 - D - FR",
            "planfamiliar": 0,
            "planType": "dias",
            "max_age": 85,
            "min_age": 0,
            "idp": "1838",
            "price_voucher": "1",
            "family_plan": "Y",
            "maxFamilyCnt": "3",
            "activofactor": "no",
            "surcharge_region": "N",
            "remark": "0",
            "numero_menores": 2,
            "valorMenor": "74.76",
            "subTotalMenores": "130.830",
            "calc_new": "Y",
            "preOrden": null
          },
          "bloque": "",
          "FechaSalida": "2020-03-11",
          "FechaLlegada": "2020-03-31",
          "id_plan": "1838",
          "edades": [
            "5",
            "66"
          ],
          "id_plan_categoria": "24",
          "origen": "AL",
          "destino": "1",
          "paso": "3",
          "estatus": "2",
          "codigo": "TH-52EGF9",
          "dias": "21"
        },
        "ID_ORDER": 3174,
        "data_quote": {
          "id_orden": "3174",
          "id_beneficiaries": "5125,5126",
          "codigo": null,
          "externalPayment": false,
          "dataExternal": []
        },
        "STATUS_EMISION": "ERROR"
      },
      "codVoucher": "TK-9F5I22"
    };
    this.router.navigate(['info-emision', { data: JSON.stringify({ data: aux }) }]);
  }

  async modalPrecios(precios) {
    console.log('PRUEBA');
    const modal = await this.modalCtrl.create({
      component: GetPlansComponent,
      componentProps: {
        precios: [
          {
            "tiepoid": "3500",
            "surcharge_age": "Y",
            "normal_age": 74,
            "overage_factor": "1.50",
            "overage_factor_cost": "1.50",
            "planpareja": 0,
            "pareja_plan": "N",
            "factor_pareja": 0,
            "activofactorpareja": "no",
            "factor_pareja_cost": 0,
            "factor_family": "2.50",
            "factor_family_age": 21,
            "factor_family_cost": "2.50",
            "arrPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 89.59249,
                "cost": 30.93399,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "103.031",
                "cost": "35.574",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "154.995",
                "cost": "53.515",
                "net": "0.000"
              },
              {
                "ageMin": "86",
                "ageMax": "110",
                "pvp": "309.990",
                "cost": "107.031",
                "net": "0.000"
              }
            ],
            "arrUSDPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 89.59249,
                "cost": 30.93399,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "103.031",
                "cost": "35.574",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "154.995",
                "cost": "53.515",
                "net": "0.000"
              },
              {
                "ageMin": "86",
                "ageMax": "110",
                "pvp": "309.990",
                "cost": "107.031",
                "net": "0.000"
              }
            ],
            "arrBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 107.5114,
                "cost": 37.1212,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "123.638",
                "cost": "42.689",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "185.994",
                "cost": "64.219",
                "net": "0.000"
              },
              {
                "ageMin": "86",
                "ageMax": "110",
                "pvp": "371.989",
                "cost": "128.439",
                "net": "0.000"
              }
            ],
            "arrUSDBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 107.5114,
                "cost": 37.1212,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "123.638",
                "cost": "42.689",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "185.994",
                "cost": "64.219",
                "net": "0.000"
              },
              {
                "ageMin": "86",
                "ageMax": "110",
                "pvp": "371.989",
                "cost": "128.439",
                "net": "0.000"
              }
            ],
            "cntPrices": 4,
            "arrUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 89.59249,
                "cost": 30.93399,
                "net": 0,
                "pvpBase": "107.51",
                "costBase": "37.12",
                "numPas": 2,
                "pvpSubTotal": "179.184",
                "costSubTotal": "61.867",
                "netSubTotal": "0.000"
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "103.031",
                "cost": "35.574",
                "net": "0.000",
                "pvpBase": "123.63",
                "costBase": "42.68",
                "numPas": 1,
                "pvpSubTotal": "103.031",
                "costSubTotal": "35.574",
                "netSubTotal": "0.000"
              }
            ],
            "arrUSDUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 89.59249,
                "cost": 30.93399,
                "net": 0,
                "pvpBase": "107.51",
                "costBase": "37.12",
                "numPas": 2,
                "pvpSubTotal": "179.184",
                "costSubTotal": "61.867",
                "netSubTotal": "0.000"
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "103.031",
                "cost": "35.574",
                "net": "0.000",
                "pvpBase": "123.63",
                "costBase": "42.68",
                "numPas": 1,
                "pvpSubTotal": "103.031",
                "costSubTotal": "35.574",
                "netSubTotal": "0.000"
              }
            ],
            "cntUsedPrices": 2,
            "total": "282.21",
            "total_costo": "97.441",
            "total_neto": "0.000",
            "USDTotal": "282.21",
            "USDTotal_costo": "97.441",
            "USDTotal_neto": "0.000",
            "tasa_cambio": 1,
            "moneda_local": "N",
            "moneda": "US$",
            "name_plan": "Bronze R",
            "planfamiliar": 1,
            "planType": "dias",
            "max_age": 85,
            "min_age": "0",
            "idp": "18123",
            "price_voucher": "1",
            "family_plan": "Y",
            "maxFamilyCnt": "3",
            "activofactor": "si",
            "surcharge_region": "Y",
            "remark": "0",
            "preOrden": null,
            "numero_mayores": 1,
            "valorMayor": "123.63",
            "subTotalMayor": "103.031",
            "numero_menores": 2,
            "valorMenor": "107.51",
            "subTotalMenores": "179.184",
            "calc_new": "Y",
            "moneda_paypal": "USD"
          },
          {
            "tiepoid": "3343",
            "surcharge_age": "N",
            "normal_age": 74,
            "overage_factor": "1.50",
            "overage_factor_cost": "1.50",
            "planpareja": 0,
            "pareja_plan": "N",
            "factor_pareja": 0,
            "activofactorpareja": "no",
            "factor_pareja_cost": 0,
            "factor_family": "2.50",
            "factor_family_age": 21,
            "factor_family_cost": "2.50",
            "arrPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "121.550",
                "cost": "41.933",
                "net": "0.000"
              },
              {
                "ageMin": 75,
                "ageMax": "85",
                "pvp": "182.325",
                "cost": "62.899",
                "net": "0.000"
              }
            ],
            "arrUSDPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "121.550",
                "cost": "41.933",
                "net": "0.000"
              },
              {
                "ageMin": 75,
                "ageMax": "85",
                "pvp": "182.325",
                "cost": "62.899",
                "net": "0.000"
              }
            ],
            "arrBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "145.860",
                "cost": "50.320",
                "net": "0.000"
              },
              {
                "ageMin": 75,
                "ageMax": "85",
                "pvp": "218.790",
                "cost": "75.480",
                "net": "0.000"
              }
            ],
            "arrUSDBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "145.860",
                "cost": "50.320",
                "net": "0.000"
              },
              {
                "ageMin": 75,
                "ageMax": "85",
                "pvp": "218.790",
                "cost": "75.480",
                "net": "0.000"
              }
            ],
            "cntPrices": 2,
            "arrUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "121.550",
                "cost": "41.933",
                "net": "0.000",
                "pvpBase": "145.86",
                "costBase": "50.32",
                "numPas": 3,
                "pvpSubTotal": "364.650",
                "costSubTotal": "125.799",
                "netSubTotal": "0.000"
              }
            ],
            "arrUSDUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "121.550",
                "cost": "41.933",
                "net": "0.000",
                "pvpBase": "145.86",
                "costBase": "50.32",
                "numPas": 3,
                "pvpSubTotal": "364.650",
                "costSubTotal": "125.799",
                "netSubTotal": "0.000"
              }
            ],
            "cntUsedPrices": 1,
            "total": "364.65",
            "total_costo": "125.799",
            "total_neto": "0.000",
            "USDTotal": "364.65",
            "USDTotal_costo": "125.799",
            "USDTotal_neto": "0.000",
            "tasa_cambio": 1,
            "moneda_local": "N",
            "moneda": "US$",
            "name_plan": " Silver",
            "planfamiliar": 1,
            "planType": "dias",
            "max_age": 85,
            "min_age": "0",
            "idp": "1850",
            "price_voucher": "1",
            "family_plan": "Y",
            "maxFamilyCnt": "3",
            "activofactor": "si",
            "surcharge_region": "N",
            "remark": "0",
            "preOrden": null,
            "numero_menores": 3,
            "valorMenor": "145.86",
            "subTotalMenores": "364.650",
            "calc_new": "Y",
            "moneda_paypal": "USD"
          },
          {
            "tiepoid": "2946",
            "surcharge_age": "N",
            "normal_age": 74,
            "overage_factor": "1.50",
            "overage_factor_cost": "1.50",
            "planpareja": 0,
            "pareja_plan": "N",
            "factor_pareja": 0,
            "activofactorpareja": "no",
            "factor_pareja_cost": 0,
            "factor_family": "2.50",
            "factor_family_age": 21,
            "factor_family_cost": "2.50",
            "arrPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "170.000",
                "cost": "58.650",
                "net": "0.000"
              },
              {
                "ageMin": 75,
                "ageMax": "85",
                "pvp": "255.000",
                "cost": "87.975",
                "net": "0.000"
              }
            ],
            "arrUSDPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "170.000",
                "cost": "58.650",
                "net": "0.000"
              },
              {
                "ageMin": 75,
                "ageMax": "85",
                "pvp": "255.000",
                "cost": "87.975",
                "net": "0.000"
              }
            ],
            "arrBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "204.000",
                "cost": "70.380",
                "net": "0.000"
              },
              {
                "ageMin": 75,
                "ageMax": "85",
                "pvp": "306.000",
                "cost": "105.570",
                "net": "0.000"
              }
            ],
            "arrUSDBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "204.000",
                "cost": "70.380",
                "net": "0.000"
              },
              {
                "ageMin": 75,
                "ageMax": "85",
                "pvp": "306.000",
                "cost": "105.570",
                "net": "0.000"
              }
            ],
            "cntPrices": 2,
            "arrUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "170.000",
                "cost": "58.650",
                "net": "0.000",
                "pvpBase": "204.00",
                "costBase": "70.38",
                "numPas": 3,
                "pvpSubTotal": "510.000",
                "costSubTotal": "175.950",
                "netSubTotal": "0.000"
              }
            ],
            "arrUSDUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": "74",
                "pvp": "170.000",
                "cost": "58.650",
                "net": "0.000",
                "pvpBase": "204.00",
                "costBase": "70.38",
                "numPas": 3,
                "pvpSubTotal": "510.000",
                "costSubTotal": "175.950",
                "netSubTotal": "0.000"
              }
            ],
            "cntUsedPrices": 1,
            "total": "510.00",
            "total_costo": "175.950",
            "total_neto": "0.000",
            "USDTotal": "510.00",
            "USDTotal_costo": "175.950",
            "USDTotal_neto": "0.000",
            "tasa_cambio": 1,
            "moneda_local": "N",
            "moneda": "US$",
            "name_plan": "Iron",
            "planfamiliar": 1,
            "planType": "dias",
            "max_age": 85,
            "min_age": "0",
            "idp": "1717",
            "price_voucher": "1",
            "family_plan": "Y",
            "maxFamilyCnt": "3",
            "activofactor": "si",
            "surcharge_region": "N",
            "remark": "0",
            "preOrden": null,
            "numero_menores": 3,
            "valorMenor": "204.00",
            "subTotalMenores": "510.000",
            "calc_new": "Y",
            "moneda_paypal": "USD"
          },
          {
            "tiepoid": "3504",
            "surcharge_age": "Y",
            "normal_age": 74,
            "overage_factor": "1.50",
            "overage_factor_cost": "1.50",
            "planpareja": 0,
            "pareja_plan": "N",
            "factor_pareja": 0,
            "activofactorpareja": "no",
            "factor_pareja_cost": 0,
            "factor_family": "2.50",
            "factor_family_age": 21,
            "factor_family_cost": "2.50",
            "arrPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 185.31348,
                "cost": 63.9115,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "213.110",
                "cost": "73.498",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "320.592",
                "cost": "110.566",
                "net": "0.000"
              }
            ],
            "arrUSDPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 185.31348,
                "cost": 63.9115,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "213.110",
                "cost": "73.498",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "320.592",
                "cost": "110.566",
                "net": "0.000"
              }
            ],
            "arrBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 222.377,
                "cost": 76.6938,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "255.733",
                "cost": "88.197",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "384.712",
                "cost": "132.680",
                "net": "0.000"
              }
            ],
            "arrUSDBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 222.377,
                "cost": 76.6938,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "255.733",
                "cost": "88.197",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "384.712",
                "cost": "132.680",
                "net": "0.000"
              }
            ],
            "cntPrices": 3,
            "arrUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 185.31348,
                "cost": 63.9115,
                "net": 0,
                "pvpBase": "222.37",
                "costBase": "76.69",
                "numPas": 2,
                "pvpSubTotal": "370.626",
                "costSubTotal": "127.823",
                "netSubTotal": "0.000"
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "213.110",
                "cost": "73.498",
                "net": "0.000",
                "pvpBase": "255.73",
                "costBase": "88.19",
                "numPas": 1,
                "pvpSubTotal": "213.110",
                "costSubTotal": "73.498",
                "netSubTotal": "0.000"
              }
            ],
            "arrUSDUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 185.31348,
                "cost": 63.9115,
                "net": 0,
                "pvpBase": "222.37",
                "costBase": "76.69",
                "numPas": 2,
                "pvpSubTotal": "370.626",
                "costSubTotal": "127.823",
                "netSubTotal": "0.000"
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "213.110",
                "cost": "73.498",
                "net": "0.000",
                "pvpBase": "255.73",
                "costBase": "88.19",
                "numPas": 1,
                "pvpSubTotal": "213.110",
                "costSubTotal": "73.498",
                "netSubTotal": "0.000"
              }
            ],
            "cntUsedPrices": 2,
            "total": "583.73",
            "total_costo": "201.321",
            "total_neto": "0.000",
            "USDTotal": "583.73",
            "USDTotal_costo": "201.321",
            "USDTotal_neto": "0.000",
            "tasa_cambio": 1,
            "moneda_local": "N",
            "moneda": "US$",
            "name_plan": "Gold. R",
            "planfamiliar": 1,
            "planType": "dias",
            "max_age": 85,
            "min_age": "0",
            "idp": "18124",
            "price_voucher": "1",
            "family_plan": "Y",
            "maxFamilyCnt": "3",
            "activofactor": "si",
            "surcharge_region": "Y",
            "remark": "0",
            "preOrden": null,
            "numero_mayores": 1,
            "valorMayor": "255.73",
            "subTotalMayor": "213.110",
            "numero_menores": 2,
            "valorMenor": "222.37",
            "subTotalMenores": "370.626",
            "calc_new": "Y",
            "moneda_paypal": "USD"
          },
          {
            "tiepoid": "3508",
            "surcharge_age": "Y",
            "normal_age": 74,
            "overage_factor": "1.50",
            "overage_factor_cost": "1.50",
            "planpareja": 0,
            "pareja_plan": "N",
            "factor_pareja": 0,
            "activofactorpareja": "no",
            "factor_pareja_cost": 0,
            "factor_family": "2.50",
            "factor_family_age": 21,
            "factor_family_cost": "2.50",
            "arrPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 250.393,
                "cost": 86.38198,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "287.951",
                "cost": "99.339",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "433.179",
                "cost": "149.440",
                "net": "0.000"
              }
            ],
            "arrUSDPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 250.393,
                "cost": 86.38198,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "287.951",
                "cost": "99.339",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "433.179",
                "cost": "149.440",
                "net": "0.000"
              }
            ],
            "arrBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 300.4716,
                "cost": 103.6592,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "345.542",
                "cost": "119.208",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "519.815",
                "cost": "179.330",
                "net": "0.000"
              }
            ],
            "arrUSDBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 300.4716,
                "cost": 103.6592,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "345.542",
                "cost": "119.208",
                "net": "0.000"
              },
              {
                "ageMin": "75",
                "ageMax": "85",
                "pvp": "519.815",
                "cost": "179.330",
                "net": "0.000"
              }
            ],
            "cntPrices": 3,
            "arrUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 250.393,
                "cost": 86.38198,
                "net": 0,
                "pvpBase": "300.47",
                "costBase": "103.65",
                "numPas": 2,
                "pvpSubTotal": "500.786",
                "costSubTotal": "172.763",
                "netSubTotal": "0.000"
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "287.951",
                "cost": "99.339",
                "net": "0.000",
                "pvpBase": "345.54",
                "costBase": "119.20",
                "numPas": 1,
                "pvpSubTotal": "287.951",
                "costSubTotal": "99.339",
                "netSubTotal": "0.000"
              }
            ],
            "arrUSDUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 250.393,
                "cost": 86.38198,
                "net": 0,
                "pvpBase": "300.47",
                "costBase": "103.65",
                "numPas": 2,
                "pvpSubTotal": "500.786",
                "costSubTotal": "172.763",
                "netSubTotal": "0.000"
              },
              {
                "ageMin": "66",
                "ageMax": "74",
                "pvp": "287.951",
                "cost": "99.339",
                "net": "0.000",
                "pvpBase": "345.54",
                "costBase": "119.20",
                "numPas": 1,
                "pvpSubTotal": "287.951",
                "costSubTotal": "99.339",
                "netSubTotal": "0.000"
              }
            ],
            "cntUsedPrices": 2,
            "total": "788.73",
            "total_costo": "272.102",
            "total_neto": "0.000",
            "USDTotal": "788.73",
            "USDTotal_costo": "272.102",
            "USDTotal_neto": "0.000",
            "tasa_cambio": 1,
            "moneda_local": "N",
            "moneda": "US$",
            "name_plan": "Gold Premium R",
            "planfamiliar": 1,
            "planType": "dias",
            "max_age": 85,
            "min_age": "0",
            "idp": "18125",
            "price_voucher": "1",
            "family_plan": "Y",
            "maxFamilyCnt": "3",
            "activofactor": "si",
            "surcharge_region": "Y",
            "remark": "0",
            "preOrden": null,
            "numero_mayores": 1,
            "valorMayor": "345.54",
            "subTotalMayor": "287.951",
            "numero_menores": 2,
            "valorMenor": "300.47",
            "subTotalMenores": "500.786",
            "calc_new": "Y",
            "moneda_paypal": "USD"
          },
          {
            "tiepoid": "3512",
            "surcharge_age": "Y",
            "normal_age": 74,
            "overage_factor": "1.50",
            "overage_factor_cost": "1.50",
            "planpareja": 0,
            "pareja_plan": "N",
            "factor_pareja": 0,
            "activofactorpareja": "no",
            "factor_pareja_cost": 0,
            "factor_family": "2.50",
            "factor_family_age": 21,
            "factor_family_cost": "2.50",
            "arrPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 429.8705,
                "cost": 148.25099,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "75",
                "pvp": "494.351",
                "cost": "170.488",
                "net": "0.000"
              }
            ],
            "arrUSDPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 429.8705,
                "cost": 148.25099,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "75",
                "pvp": "494.351",
                "cost": "170.488",
                "net": "0.000"
              }
            ],
            "arrBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 515.8446,
                "cost": 177.9016,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "75",
                "pvp": "593.221",
                "cost": "204.586",
                "net": "0.000"
              }
            ],
            "arrUSDBasePrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 515.8446,
                "cost": 177.9016,
                "net": 0
              },
              {
                "ageMin": "66",
                "ageMax": "75",
                "pvp": "593.221",
                "cost": "204.586",
                "net": "0.000"
              }
            ],
            "cntPrices": 2,
            "arrUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 429.8705,
                "cost": 148.25099,
                "net": 0,
                "pvpBase": "515.84",
                "costBase": "177.90",
                "numPas": 2,
                "pvpSubTotal": "859.741",
                "costSubTotal": "296.501",
                "netSubTotal": "0.000"
              },
              {
                "ageMin": "66",
                "ageMax": "75",
                "pvp": "494.351",
                "cost": "170.488",
                "net": "0.000",
                "pvpBase": "593.22",
                "costBase": "204.58",
                "numPas": 1,
                "pvpSubTotal": "494.351",
                "costSubTotal": "170.488",
                "netSubTotal": "0.000"
              }
            ],
            "arrUSDUsedPrices": [
              {
                "basePrice": true,
                "ageMin": "0",
                "ageMax": 65,
                "pvp": 429.8705,
                "cost": 148.25099,
                "net": 0,
                "pvpBase": "515.84",
                "costBase": "177.90",
                "numPas": 2,
                "pvpSubTotal": "859.741",
                "costSubTotal": "296.501",
                "netSubTotal": "0.000"
              },
              {
                "ageMin": "66",
                "ageMax": "75",
                "pvp": "494.351",
                "cost": "170.488",
                "net": "0.000",
                "pvpBase": "593.22",
                "costBase": "204.58",
                "numPas": 1,
                "pvpSubTotal": "494.351",
                "costSubTotal": "170.488",
                "netSubTotal": "0.000"
              }
            ],
            "cntUsedPrices": 2,
            "total": "1354.09",
            "total_costo": "466.989",
            "total_neto": "0.000",
            "USDTotal": "1354.09",
            "USDTotal_costo": "466.989",
            "USDTotal_neto": "0.000",
            "tasa_cambio": 1,
            "moneda_local": "N",
            "moneda": "US$",
            "name_plan": "Platinum R",
            "planfamiliar": 1,
            "planType": "dias",
            "max_age": 75,
            "min_age": "0",
            "idp": "18126",
            "price_voucher": "1",
            "family_plan": "Y",
            "maxFamilyCnt": "3",
            "activofactor": "si",
            "surcharge_region": "Y",
            "remark": "0",
            "preOrden": null,
            "numero_mayores": 1,
            "valorMayor": "593.22",
            "subTotalMayor": "494.351",
            "numero_menores": 2,
            "valorMenor": "515.84",
            "subTotalMenores": "859.741",
            "calc_new": "Y",
            "moneda_paypal": "USD"
          }
        ],
        parametros: ["AL", "41", "24/06/2020", "27/07/2020", "Viajes por día", "24", [45, 20, 70], null, "Albania", "World Wide"],
        paises: 'AL',
        idPreOrden: 825554
      }
    });

    await modal.present();
  }
}


