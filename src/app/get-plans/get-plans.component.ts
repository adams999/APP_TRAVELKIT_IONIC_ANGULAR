import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { IlsadminService } from '../providers/ilsadmin.service';
import { BeneficiosPlanPage } from '../beneficios-plan/beneficios-plan.page';
import { TranslateService } from '@ngx-translate/core';
import { FormPagoComponent } from '../form-pago/form-pago.component';
import { Validators, FormsModule, FormBuilder, FormArray } from '@angular/forms';
import { GestorFiles } from '../providers/gestorFiles';
import * as moment from 'moment';

@Component({
  selector: 'app-get-plans',
  templateUrl: './get-plans.component.html',
  styleUrls: ['./get-plans.component.scss']
})
export class GetPlansComponent implements OnInit, OnDestroy {

  public formPrecios: FormsModule;
  public COLOR_MENU_BACKEND;
  public precios;
  public beneficios;
  public isToggled: boolean;
  public parametros = new Array();
  public paises;
  public nomPais;
  public destino;
  public prefijo;
  public nombre = null;
  public correo = null;
  public chekEnviado;
  public nomClient;
  public todosSele;
  public togledTodos: any;
  public logo;
  public imgAvatar;
  public diasViaje;
  public idPreOrden;
  public planSel = [];
  public dataCondic;
  public datos = {
    name: "",
    email: "",
    prefix: "",
    category: "",
    plans: "",
    startDate: "",
    endDate: "",
    destination: "",
    origen: "",
    ages: ""
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ilsAdminProvider: IlsadminService,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    private gestorFiles: GestorFiles) {
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.nomClient = localStorage.getItem('nomClient');
    this.prefijo = localStorage.getItem('pref');
    this.precios = navParams.get('precios');
    this.imgAvatar = '1px solid ' + this.COLOR_MENU_BACKEND;
    this.parametros = navParams.get('parametros');
    this.idPreOrden = navParams.get('idPreOrden');
    this.rangoEntreFechas(this.parametros[2], this.parametros[3]);
    this.paises = navParams.get('paises');
    this.isToggled = false;
    this.togledTodos = false;
    this.logo = localStorage.getItem("logo");
  }

  rangoEntreFechas(startDate, endDate) {
    this.diasViaje = moment(this.convertirFecha(endDate)).diff(moment(this.convertirFecha(startDate)), 'days') + 1;
  }

  convertirFecha(date) {
    return date.split("/").reverse().join("-");
  }

  ngOnInit() {
    this.ionViewDidLoad();
    console.log(this.precios.length);
    this.formPrecios = this.formBuilder.array([]);
    for (let i = 0; i < this.precios.length; i++) {
      this.funcFormPrecios(this.precios[i].idp);
    }
    console.log(this.formPrecios);
    this.funTermCond();
  }

  funSelPrecio() {
    let aux = 0;
    for (let i = 0; i < this.precios.length; i++) {
      if (this.formPrecios['controls'][i].get('planSel').value == true) {
        aux++;
        this.isToggled = true;
      }
    }

    if (aux == this.precios.length) {
      this.togledTodos = true;
    }
    else {
      this.togledTodos = false;
    }
    if (aux == 0) {
      this.isToggled = false;
      this.togledTodos = false;
    }
    console.log('final', aux, this.formPrecios, this.togledTodos);
  }

  funcFormPrecios(idp) {
    console.log('cargo');
    var creds: any = this.formPrecios as FormArray;
    creds.push(this.formBuilder.group({
      planSel: [false, Validators.compose([Validators.required, Validators.pattern('true')])],
      idPlan: [idp, Validators.compose([Validators.required, Validators.pattern('true')])]
    }));
  }

  ngOnDestroy() {
    console.log('destruyo getPrice');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GetPricesPage', this.parametros, this.nomPais, this.prefijo);
  }

  cotizarSeleccion() {
    let aux: any = [];
    for (let i = 0; i < this.formPrecios['controls'].length; i++) {
      if (this.formPrecios['controls'][i]['value'].planSel == true) {
        aux.push(this.formPrecios['controls'][i]['value'].idPlan);
      }
    }
    this.planSel = aux;
    console.log(aux, this.parametros);
    this.alertNombreCorreoCotizacion(this.planSel);
  }

  async alertNombreCorreoCotizacion(planesSel) {
    let alert = await this.alertCtrl.create({
      header: this.translate.instant('GET-PLANS.cotizar_a'),
      inputs: [
        {
          name: 'Nombre',
          placeholder: this.translate.instant('GET-PLANS.nombre'),
          type: 'text'
        },
        {
          name: 'Correo',
          placeholder: 'alias@correo.com',
          type: 'email'
        }
      ],
      buttons: [
        {
          text: this.translate.instant('GET-PLANS.atras'),
          role: 'Atras',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translate.instant('GET-PLANS.enviar'),
          handler: async data => {
            this.nombre = data.Nombre;
            this.correo = data.Correo;

            if (this.validarNombre(data.Nombre) && this.validarEmail(data.Correo)) {
              let asd = [this.parametros, data.Nombre, data.Correo];
              this.funcDatos(planesSel);
              console.log(this.nombre, this.correo);

              let loading = await this.loadingCtrl.create({
                message: this.translate.instant('GET-PLANS.enviando_correo') + this.correo,
                duration: 100000
              });

              loading.present();

              loading.present().then(() => {
                this.ilsAdminProvider.sendQuote(this.funcDatos(planesSel))
                  .subscribe(
                    (data: any) => {
                      this.chekEnviado = data;
                      let alerta = this.translate.instant('GET-PLANS.correo_enviado');
                      this.avisoToast(alerta);
                      if (data.preOrden && data.preOrden.id && this.idPreOrden != data.preOrden.id) {
                        console.log('Se Genera Nueva PreOrden');
                        this.idPreOrden = data.preOrden.id;
                      }
                      console.log(this.chekEnviado, 'id preorden ', this.idPreOrden);
                      loading.dismiss();
                    },
                    (error) => {
                      console.log(error, error.error[0].notes);
                      loading.dismiss();
                      this.avisoToast(error.error[0].notes);
                    }
                  );
              });

              console.log(asd);
            } else {
              let texto = this.translate.instant('GET-PLANS.datos_invalidos');
              this.avisoToast(texto);
              return false;
            }
          }
        },
        {
          text: this.translate.instant('GET-PLANS.descargar'),
          handler: async data => {
            this.nombre = data.Nombre;
            this.correo = data.Correo;

            if (this.validarNombre(data.Nombre) && this.validarEmail(data.Correo)) {
              let asd = [this.parametros, data.Nombre, data.Correo];
              console.log('impresion cotizacion', asd);

              this.downloadPdfCotiza();
            } else {
              let texto = this.translate.instant('GET-PLANS.datos_invalidos');
              this.avisoToast(texto);
              return false;
            }
          }
        },
        {
          text: this.translate.instant('GET-PLANS.cond_gen'),
          handler: async data => {
            let nombrePDF = 'COND_GEN_' + this.prefijo;
            let loading = await this.loadingCtrl.create({
              duration: 50000
            });

            loading.present().then(() => {
              this.gestorFiles.verPDFDownApp(this.dataCondic.COND_GEN, nombrePDF)
                .then(() => {
                  loading.dismiss();
                })
                .catch(() => {
                  loading.dismiss();
                })
            });
          }
        }
      ]
    });
    alert.present();
  }

  validarNombre(nombre) {
    return /^[a-zA-ZñÑ ]{3,25}$/.test(nombre);
  }

  validarEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email);
  }

  funcDatos(planesSel = null) {
    let datos = new FormData();
    datos.append("name", this.nombre);
    datos.append("email", this.correo);
    datos.append("prefix", this.prefijo);
    datos.append("category", this.parametros[5]);
    datos.append("plans", planesSel.join());
    datos.append("startDate", this.parametros[2]);
    datos.append("endDate", this.parametros[3]);
    datos.append("destination", this.parametros[1]);
    datos.append("origen", this.parametros[0]);
    datos.append("ages", this.parametros[6]);
    datos.append("bloque", this.parametros[7] ? this.parametros[7] : '');
    datos.append("destino", this.parametros[1]);
    datos.append("FechaSalida", moment(this.parametros[2], 'DD/MM/YYYY').format('YYYY-MM-DD'));
    datos.append("FechaLlegada", moment(this.parametros[3], 'DD/MM/YYYY').format('YYYY-MM-DD'));
    datos.append("id_plan_categoria", this.parametros[5]);
    datos.append("id_plan", planesSel.join());
    datos.append("edades", this.parametros[6]);
    datos.append("email_usado", this.correo);
    datos.append("id_preorden", this.idPreOrden);
    datos.append("total_dias", this.diasViaje);
    datos.append("paso", '2');
    console.log(datos);
    return datos;
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  async verDetallePrecio(idPlan, nombrePlan) {
    console.log(idPlan);

    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('GET-PLANS.cargando_beneficios'),
      duration: 40000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.getCoverages(this.prefijo, idPlan, "spa")
        .subscribe(
          (data) => {
            this.beneficios = data;

            if (this.beneficios[0].message == "NOT RESULTS") {
              console.log("PLAN SIN BENEFICIOS");
              let alerta = this.translate.instant('GET-PLANS.plan_sin_beneficios');
              this.avisoToast(alerta);
              return;
            } else if (this.beneficios[0].name && this.beneficios[0].valor) {
              console.log('PLAN CON BENEFICIOS', data);
              this.modalBenefDesc(this.beneficios, nombrePlan);
            }
            loader.dismiss();
            console.log(this.beneficios[1].valor, nombrePlan);
          },
          (error) => {
            console.log(error);
            loader.dismiss();
          },
          () => {
            loader.dismiss();
          }
        );
    });
  }

  async avisoToast(texto) {
    let toast = await this.toastCtrl.create({
      message: texto,
      duration: 3000,
      position: 'bottom'
    });

    return await toast.present();
  }

  async modalBenefDesc(beneficios, nombrePlan) {
    let modalBeneficios = await this.modalCtrl.create({
      component: BeneficiosPlanPage,
      componentProps: { beneficios: beneficios, nombrePlan: nombrePlan }
    });

    return await modalBeneficios.present();
  }

  selecTodos(togled) {
    if (this.togledTodos == true) {
      this.isToggled = true;
      for (let i = 0; i < this.precios.length; i++) {
        this.formPrecios['controls'][i]['controls'].planSel.setValue(true);
      }
    }
    else {
      this.isToggled = false;
      this.togledTodos = false;
      this.planSel = [];
      for (let i = 0; i < this.precios.length; i++) {
        this.formPrecios['controls'][i]['controls'].planSel.setValue(false);
      }
    }

    if (togled == false) {
      this.isToggled = false;
      this.togledTodos = false;
      this.planSel = [];
    }
  }

  async modalFromPago(dataPlan) {
    console.log(dataPlan);
    const modal = await this.modalCtrl.create({
      component: FormPagoComponent,
      componentProps: {
        dataPlan: dataPlan,
        dataVuelo: this.parametros,
        rangEd: {
          edadMin: Number(dataPlan.min_age),
          edadMax: Number(dataPlan.max_age)
        },
        diasViaje: Number(this.diasViaje),
        idPreOrden: this.idPreOrden
      }
    });

    modal.onDidDismiss()
      .then((data: any) => {
        setTimeout(() => {
          if (data.data.emision == 'ERROR') {
            console.log('data ERROR ', data);
            this.modalCtrl.dismiss(data.data);
          } if (data.data.emision == 'OK') {
            console.log('data OK', data);
            this.modalCtrl.dismiss(data.data);
          }
        }, 500);
        console.log('Data Callback');
      });

    return modal.present();
  }

  async downloadPdfCotiza() {
    let lang_app;

    switch (true) {
      case (localStorage.getItem('lang_app') == 'spa'):
        lang_app = 'es';
        break;

      case (localStorage.getItem('lang_app') == 'eng'):
        lang_app = 'en';
        break;

      case (localStorage.getItem('lang_app') == 'por'):
        lang_app = 'pr';
        break;

      default:
        lang_app = 'es';
        break;
    }

    let url = localStorage.getItem('web') + '/app/pages/imprimir_quote.php?categoria=' + this.parametros[5]
      + '&PlanSel=' + this.planSel.join()
      + '&nomape=' + this.nombre
      + '&edades=' + this.parametros[6].join() + ','
      + '&FechaSalida=' + moment(this.parametros[2], 'DD/MM/YYYY').format('MM/DD/YYYY')
      + '&FechaLlegada=' + moment(this.parametros[3], 'DD/MM/YYYY').format('MM/DD/YYYY')
      + '&diaxpersona=' + this.diasViaje
      + '&origen=' + this.parametros[0]
      + '&destino=' + this.parametros[1]
      + '&nropasajeros=' + this.parametros[6].length
      + '&email_cliente=' + this.correo
      + '&selectLanguage=' + lang_app
      + '&app=' + 'Y'
      + ((localStorage.getItem('agency') == 'N/A' || localStorage.getItem('agency') == '') ? '' : '&broker_sesion=' + localStorage.getItem('agency'))
      + ((localStorage.getItem('agency') == 'N/A' || localStorage.getItem('agency') == '') ? '' : '&id_broker=' + localStorage.getItem('agency'))
      + ((localStorage.getItem('prefixApp') != 'ILS') ? '&user=' + localStorage.getItem('id_user') : '');

    console.log('url pdf cotizacion', url);

    let nombrePDF = this.translate.instant('GET-PLANS.cotizacion') + '_' + moment().format('YYYY-MM-DD');
    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('GET-PLANS.generando_cotiza'),
      duration: 40000
    });

    loader.present().then(() => {
      this.gestorFiles.verPDFDownApp(url, nombrePDF)
        .then((data) => {
          console.log(data);
          loader.dismiss();
        }).catch((err) => {
          console.log(err);
          loader.dismiss();
        });
    });
  }

  funTermCond() {
    this.ilsAdminProvider.getTermCond(this.prefijo, '')
      .subscribe(
        (data) => {
          console.log(data);
          this.dataCondic = data;
        }
      );
  }

}
