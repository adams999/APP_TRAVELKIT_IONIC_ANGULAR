import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, NavParams, ToastController, ModalController, LoadingController, AlertController, IonicModule, PopoverController } from '@ionic/angular';
import { IlsadminService } from '../providers/ilsadmin.service';
import { Validators, FormsModule, FormBuilder, FormArray } from '@angular/forms';
import { Countries } from '../providers/countries';
import { CodPhones } from '../providers/codigo-phones';
import { GestorFiles } from '../providers/gestorFiles';
import { PopoverDescripcionComponent } from '../popover-descripcion/popover-descripcion.component';
import { BeneficiosPlanPage } from '../beneficios-plan/beneficios-plan.page';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-form-pago',
  templateUrl: './form-pago.component.html',
  styleUrls: ['./form-pago.component.scss'],
})
export class FormPagoComponent implements OnInit, OnDestroy {

  public users: FormArray;
  public contacto: FormsModule;
  public codigoCupon: FormsModule;
  public formPagoTDC: FormsModule;
  public formCreditAgency: FormsModule;
  public formLinkPago: FormsModule;
  public formPagoPaypal: FormsModule;
  public formReferencia: FormsModule;
  public formDirHabit: FormsModule;
  public dataPlan: any;
  public dataVuelo: any;
  public rangEd: any;
  public COLOR_MENU_BACKEND;
  public color_menu_barra_hover;
  public pasajeros = false;
  public conEmerg = false;
  public upgrades = false;
  public cupones = false;
  public pago = false;
  public habitacion = false;
  public divHidden: any = [];
  public fechaMinPas: String = new Date().toISOString();
  public fechaMaxPas: String = new Date().toISOString();
  public paises;
  public codigosPhones;
  public pasos: any = [true, false, false, false, false, false];
  public upgrTotal: any = 0;
  public precioTotal = 0;
  public logo;
  public nomClient;
  public diasViaje;
  public dataBeneficios;
  public dataUpgrades: any = null;
  public overageInFactors;
  public auxEdades = new Array();
  public arrUpgradesAplicados: any = [];
  public auxPreciosRaiders: any = 0;
  public cuponActivo: Boolean = false;
  public dataCupon: any = null;
  public descAPlic: any;
  public tipoPago: any;
  public yearActual = Number(moment().format('YYYY'));
  public imgTDC = '../../assets/imgs/Logos_TDC/Card.png';
  public dataTermCond: any;
  public dataMethodPago: any;
  public typeMethodPago: any = null;
  public idPreOrden;
  public intento: any = 0;
  public recargEdad = false;
  public dataRespPago = null;
  public codeVouchGenerado = null;
  public pagoCreditoAgencia: Boolean = false;
  public dataCreditoAgencia: any = null;
  public userType;
  public payPalConfig?: IPayPalConfig;
  public showSuccess: boolean;
  public respPayPal: any = new Object();
  public textDescApi;
  public dataCuponAux: any;
  public ciudades: any;
  public estados: any;
  public statesTDC: any;
  public citiesTDC: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ilsAdminProvider: IlsadminService,
    public modalCtrl: ModalController,
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    public countries: Countries,
    public codPhones: CodPhones,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private gestorFiles: GestorFiles,
    public router: Router) {
    this.dataPlan = navParams.get('dataPlan');
    this.dataVuelo = navParams.get('dataVuelo');
    this.rangEd = navParams.get('rangEd');
    this.diasViaje = navParams.get('diasViaje');
    this.idPreOrden = navParams.get('idPreOrden');
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.color_menu_barra_hover = localStorage.getItem('color_menu_barra_hover');
    console.log(this.dataPlan, this.dataVuelo, this.rangEd, this.diasViaje, this.idPreOrden);
    this.paises = this.countries.getCountries();
    this.codigosPhones = this.codPhones.getCodPhones();
    this.logo = localStorage.getItem("logo");
    this.nomClient = localStorage.getItem('nomClient');
    this.userType = localStorage.getItem('userType');
  }

  ngOnInit() {
    this.FechaMin();
    this.users = this.formBuilder.array([]);
    for (let i = 0; i < this.dataVuelo[6].length; i++) {
      this.divHidden.push(false);
      this.addpasajForm();
    }
    this.funFormContacto();
    this.funFormCupon();
    this.funformPagoTDC();
    this.funformCreditAgency();
    this.funcFormLinkPago();
    this.funcFormPagoPaypal();
    this.funcFormReferencia();
    (this.dataPlan['dir_habit'] != undefined && this.dataPlan['dir_habit'] == 'Y') ? this.funcFormHabitacion() : '';
    this.precioTotal = this.formatNumberDecimal(Number(this.dataPlan.USDTotal) + Number(this.upgrTotal));
    this.funTermCond();
    this.funListMethodPago();
    this.funPreciosPasajerosRecal(this.dataPlan);
    this.updatePreorden(this.funDataPreOrden());
    if (localStorage.getItem('agency') != 'N/A' && localStorage.getItem('agency')) {
      this.funCreditAgencia();
    }
  }

  funCreditAgencia() {
    this.ilsAdminProvider.getStatusCreditAgency(localStorage.getItem('pref'))
      .subscribe((data: any) => {
        console.log('data credito agencia ', data);
        if ((this.formatNumberDecimal((data[0]['credito_actual'] * this.dataPlan.tasa_cambio)) >= this.formatNumberDecimal((this.precioTotal * this.dataPlan.tasa_cambio))) && (moment(data[0]['fecha_credito'], 'YYYY-MM-DD').format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD'))) {
          this.pagoCreditoAgencia = true;
          this.dataCreditoAgencia = data[0];
        } else {
          this.typeMethodPago = null;
          this.pagoCreditoAgencia = false;
          this.dataCreditoAgencia = null;
          let text = this.translate.instant('FORM-PAGO.credito_vencido');
          this.avisoToast(text, 'bottom', 'danger');
        }
      }, (err) => {

      })
  }

  funCodTelefxPais() {
    let aux: any = '';
    for (const key in this.codigosPhones) {
      if (this.codigosPhones.hasOwnProperty(key)) {
        if ((this.codigosPhones[key].iso_country.toUpperCase() == this.dataVuelo[0].toUpperCase())) {
          aux = this.codigosPhones[key].cod_phone;
        }
      }
    }
    return aux;
  }

  FechaMin() {
    this.fechaMaxPas = moment().subtract(this.rangEd.edadMin, 'years').format('YYYY-MM-DD').toString();
    this.fechaMinPas = moment().subtract(this.rangEd.edadMax, 'years').format('YYYY-MM-DD').toString();
    console.log(this.fechaMinPas, this.fechaMaxPas);
  }

  addpasajForm() {
    var creds: any = this.users as FormArray;
    creds.push(this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ ]+")])],
      apellido: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ ]+")])],
      nacimiento: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      edad: ['', Validators.compose([Validators.required, Validators.maxLength(3)])],
      sexo: ['M', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(3)])],
      pais: [this.dataVuelo[0].toUpperCase(), Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      tipoDoc: ['PAS', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])],
      documento: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern("^[a-zA-Z0-9.-\s/]{3,30}$")])],
      correoP: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.email])],
      codigoTel: [this.funCodTelefxPais(), Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])],
      TelefP: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern("[0-9-]+")])],
      condMed: ['', Validators.compose([Validators.minLength(0), Validators.maxLength(500)])],
      subTotal: ['', Validators.compose([Validators.required])]
    }));
    this.onChangeForm();
  }

  funFormContacto() {
    this.contacto = this.formBuilder.group({
      nameE: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ ]+")])],
      correoE: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.email])],
      codigoTelE: [this.funCodTelefxPais(), Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10)])],
      TelefPE: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern("[0-9-]+")])],
    });
  }

  funFormCupon() {
    this.codigoCupon = this.formBuilder.group({
      codigo: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(60)])],
    });
  }

  onChangeForm() {
    this.users.valueChanges.subscribe((ok) => { this.payPalConfig = null; });
  }

  funformPagoTDC() {
    this.formPagoTDC = this.formBuilder.group({
      codigoTarjeta: ['', Validators.compose([Validators.required, Validators.minLength(18), Validators.maxLength(19)])],
      nombreTarjeta: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("^[A-Za-z0-9-Ññáé.íóúÁÉÍÓÚ& ]+")])],
      apellidoTarjeta: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("^[A-Za-z0-9-Ññáé.íóúÁÉÍÓÚ& ]+")])],
      CCV: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(4), Validators.pattern("^[0-9]+")])],
      mesTarjetaVen: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      yearTarjetaVen: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50)])],
      tipoTarjeta: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      tipoDocumentTDC: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(10)])],
      nDocumentTDC: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("^[a-zA-Z0-9.-\s/]{3,30}$")])],
      correoTDC: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.email])],
      paisTDC: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      estadoTDC: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      ciudadTDC: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      prefTelTDC: [this.funCodTelefxPais(), Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(10)])],
      telefTDC: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern("[0-9-]+")])],
      termCond: [false, Validators.compose([Validators.required, Validators.pattern('true')])]
    });
  }

  funformCreditAgency() {
    this.formCreditAgency = this.formBuilder.group({
      termCond: [false, Validators.compose([Validators.required, Validators.pattern('true')])]
    })
  }

  funcFormLinkPago() {
    this.formLinkPago = this.formBuilder.group({
      correoLinkPago: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(50), Validators.email])],
      codigoTelLinkPago: [this.funCodTelefxPais(), Validators.compose([Validators.minLength(2), Validators.maxLength(10)])],
      telefLinkPago: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(15), Validators.pattern("[0-9-]+")])],
      termCond: [false, Validators.compose([Validators.required, Validators.pattern('true')])]
    });
  }

  funcFormPagoPaypal() {
    this.formPagoPaypal = this.formBuilder.group({
      termCond: [false, Validators.compose([Validators.required, Validators.pattern('true')])]
    })
  }

  funcFormReferencia() {
    this.formReferencia = this.formBuilder.group({
      referencia: ['']
    })
  }

  funcFormHabitacion() {
    this.formDirHabit = this.formBuilder.group({
      dir_pais: [this.dataVuelo[0].toUpperCase(), Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      dir_provincia: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      dir_ciudad: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
      dir_cod_post: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern("[0-9-]+")])],
      dir_direcion: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern("[A-Za-zÑñáéíóúÁÉÍÓÚ/. 0-9-]+")])],
      dir_direccion_alter: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(100), Validators.pattern("[A-Za-zÑñáéíóúÁÉÍÓÚ/. 0-9-]+")])]
    });
  }

  funHiddenDivPasajero(pos: any) {
    if (this.divHidden[pos] == false) {
      this.divHidden[pos] = true;
      this.scrollDiv(500, pos);
    } else {
      this.divHidden[pos] = false;
    }
  }

  funHiddenDivPasajeros(pos: any) {
    if (this.pasajeros == false) {
      this.pasajeros = true;
      this.scrollDiv(500, pos);
    } else {
      this.pasajeros = false;
    }
  }

  funHiddenDivContacto(pos) {
    if (this.conEmerg == false) {
      this.conEmerg = true;
      this.scrollDiv(500, pos);
    } else {
      this.conEmerg = false;
    }
  }

  funHiddenDivUpgrades(pos) {
    if (this.upgrades == false) {
      this.upgrades = true;
      this.scrollDiv(500, pos);
    } else {
      this.upgrades = false;
    }
  }

  funHiddenDivCupon(pos) {
    if (this.cupones == false) {
      this.cupones = true;
      this.scrollDiv(500, pos);
    } else {
      this.cupones = false;
    }
  }

  funHiddenDivPago(pos) {
    if (this.pago == false) {
      this.pago = true;
      this.scrollDiv(500, pos);
    } else {
      this.pago = false;
    }
  }

  funHiddenHabitacion(pos) {
    if (this.habitacion == false) {
      this.habitacion = true;
      this.scrollDiv(500, pos);
    } else {
      this.habitacion = false;
    }
  }

  calcEdadPas(fNacimiento, pos) {
    let dateHoy = moment().format('YYYY-MM-DD');
    let fecha = moment(fNacimiento, 'YYYY-MM-DD').format('YYYY-MM-DD');
    let yearsPasaj: any = moment(dateHoy, 'YYYY-MM-DD').diff(fecha, 'years');
    let precioPasajero = Number(this.dataPlan.USDTotal) / this.dataVuelo[6].length;
    this.users.controls[pos]['controls'].edad.setValue(isNaN(yearsPasaj) ? '' : yearsPasaj);
    console.log(yearsPasaj, precioPasajero, this.users, this.contacto);

    //calculo de precio por pasajero
    this.auxEdades[pos] = yearsPasaj;
    let aux = this.auxEdades.filter(number => (number >= this.rangEd.edadMin));
    if (aux.length == this.dataVuelo[6].length) {
      console.log('se actualiza los precios ');
      this.dataVuelo[6] = aux;
      this.funRecalcularPrecios(this.auxEdades);
    } else {
      this.users.controls[pos]['controls'].subTotal.setValue(this.formatNumberDecimal(precioPasajero));
    }
  }

  funDataPreOrden() {
    let datos: Object = {
      'precios_plan_app': this.dataPlan,
      'origen': this.dataVuelo[0],
      'destino': this.dataVuelo[1],
      'FechaSalida': moment(this.dataVuelo[2], 'DD/MM/YYYY').format('YYYY-MM-DD'),
      'FechaLlegada': moment(this.dataVuelo[3], 'DD/MM/YYYY').format('YYYY-MM-DD'),
      'id_plan_categoria': this.dataVuelo[5],
      'edades': this.dataVuelo[6],
      'bloque': this.dataVuelo[7],
      'id_plan': this.dataPlan.idp,
      'id_preorden': this.idPreOrden,
      'paso': 2
    };
    console.log("dataPreOrden", datos);
    return JSON.stringify(datos);
  }

  updatePreorden(data) {
    this.ilsAdminProvider.postUpdatePreorden(data)
      .subscribe(
        (data: any) => {
          if (data.preOrden && data.preOrden.id && this.idPreOrden != data.preOrden.id) {
            console.log('Se Genera Nueva PreOrden');
            this.idPreOrden = data.preOrden.id;
          }
          console.log('se actualizo preorden', data);
        }, (err) => {
          console.log('err', err);
        });
  }

  funTermCond() {
    this.ilsAdminProvider.getTermCond(localStorage.getItem('pref'), this.dataPlan.idp)
      .subscribe(
        (data) => {
          this.dataTermCond = data;
        },
        (error) => {
          if (error.status == 0) {/////error de internet
            let aviso = this.translate.instant('FORM-PAGO.verif_conexion');
            this.avisoToast(aviso, 'bottom', 'danger');
            this.modalCtrl.dismiss();
          }
        },
      );
  }

  funListMethodPago() {
    this.ilsAdminProvider.getListMethodPagoApp(localStorage.getItem('pref'))
      .subscribe(
        (data) => {
          this.dataMethodPago = data;
        },
        (error) => {
          if (error.status == 0) {/////error de internet
            let aviso = this.translate.instant('FORM-PAGO.verif_conexion');
            this.avisoToast(aviso, 'bottom', 'danger');
            this.modalCtrl.dismiss();
          }
        },
      );
  }

  async funRecalcularPrecios(ages) {
    let loader = await this.loadingCtrl.create({
      duration: 120000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.GetPricesApiQuoteGeneral(localStorage.getItem('pref'), this.dataVuelo[0], this.dataVuelo[1], this.dataVuelo[2], this.dataVuelo[3], this.dataVuelo[5], ages, this.dataVuelo[7], this.dataPlan.idp, '')
        .subscribe(
          (data) => {
            if (data[0].message == "NOT RESULTS") {
              console.log("No hay Precios");
              let alerta = this.translate.instant('FORM-PAGO.no_precios');
              this.modalCtrl.dismiss();
              this.avisoToast(alerta);
              return;
            } else {
              if (Number(this.dataPlan.USDTotal) != Number(data[0].total)) {
                let avisoUno = this.translate.instant('FORM-PAGO.precios_actualizados');
                this.avisoToast(avisoUno, 'top', 'warning');
                if (localStorage.getItem('agency') != 'N/A' && localStorage.getItem('agency')) {
                  this.funCreditAgencia();
                }
                if (this.arrUpgradesAplicados.length > 0) {
                  this.eliminarTodosUpgrades();
                  setTimeout(() => {
                    let avisoDos = this.translate.instant('FORM-PAGO.upgr_restablecidos');
                    this.avisoToast(avisoDos, 'top', 'danger');
                    if (this.cuponActivo) { //// si hay cupon antivo vuelvo a aplicar el cupon
                      this.funAplicaDescuento(this.dataCuponAux);
                    }
                  }, 3000);
                }
              }
              this.dataPlan = data[0];
              console.log(this.dataPlan, 'Recalculo Precios', data);
              this.funPreciosPasajerosRecal(this.dataPlan);
            }
            loader.dismiss();
          },
          (error) => {
            if (error.status == 0) {/////error de internet
              loader.dismiss();
              let aviso = this.translate.instant('FORM-PAGO.verif_conexion');
              this.avisoToast(aviso, 'bottom', 'danger');
              this.modalCtrl.dismiss();
            } else {///muestro el error al usuario
              console.log('error al cargar', error.error[0].notes);
              this.avisoToast(error.error[0].notes, 'bottom', 'danger');
              console.log(error);
              loader.dismiss();
              this.modalCtrl.dismiss();
            }
          },
          () => {
            loader.dismiss();
          }
        );
    });
  }

  async funPreciosPasajerosRecal(dataPlan) {
    this.payPalConfig = null;
    if (dataPlan.calc_new == 'Y' && dataPlan.arrBasePrices.length > 1) {////////aplica factores si tiene y recargo de edades
      console.log('recargo por edades');
      this.dataPlan.numero_menores = 0;
      this.dataPlan.numero_mayores = 0;
      for (let i = 0; i < this.dataVuelo[6].length; i++) {
        for (let a = 0; a < dataPlan.arrBasePrices.length; a++) {
          this.dataPlan.subTotalMenores = 0;
          //console.log('rango de edad a evaluar de ' + Number(dataPlan.arrBasePrices[a].ageMin), 'a ', Number(dataPlan.arrBasePrices[a].ageMax), ' edad de pasajero ' + (i + 1) + ': ' + Number(this.dataVuelo[6][i]));
          if (Number(this.dataVuelo[6][i]) >= Number(dataPlan.arrBasePrices[a].ageMin) && Number(this.dataVuelo[6][i]) <= Number(dataPlan.arrBasePrices[a].ageMax)) {
            //console.log('Recargo por edad con plan pareja o familia de ' + dataPlan.arrBasePrices[a].ageMin, 'a ', dataPlan.arrBasePrices[a].ageMax, 'edad de pasajero ', this.dataVuelo[6][i]);
            this.users.controls[i].get('subTotal').setValue(this.formatNumberDecimal(Number(dataPlan.arrPrices[a].pvp)));
            this.recargEdad = true;
          }
        }
        if (Number(this.dataVuelo[6][i]) >= Number(dataPlan.min_age) && Number(this.dataVuelo[6][i]) <= Number(dataPlan.normal_age)) {
          console.log('pasajero corresponde a normal age');
          this.dataPlan.numero_menores = this.dataPlan.numero_menores + 1;
        } else {
          console.log('pasajero corresponde a exeso de edad');
          this.dataPlan.numero_mayores = this.dataPlan.numero_mayores + 1;
        }
      }
      console.log(this.dataPlan);
    }
    else if (((Number(dataPlan.subTotalMayor) > 0) && (Number(dataPlan.numero_mayores) > 0)) && (Number(dataPlan.planpareja) > 0) || (Number(dataPlan.planfamiliar) > 0)) {//si aplica factor en overages
      console.log('tiene overaje y factor activo');
      this.recargEdad = false;
      for (let i = 0; i < this.users.controls.length; i++) {
        if (Number(this.users.controls[i].value.edad) > Number(this.dataPlan.normal_age) && Number(this.users.controls[i].value.edad) <= Number(this.dataPlan.max_age)) {
          this.users.controls[i]['controls'].subTotal.setValue(this.formatNumberDecimal(Number(Number(this.dataPlan.subTotalMayor) / Number(dataPlan.numero_mayores))));
        } else {
          this.users.controls[i].get('subTotal').setValue(this.formatNumberDecimal(Number(Number(this.dataPlan.subTotalMenores) / Number(this.dataPlan.numero_menores))));
        }
      }
    } else {
      this.recargEdad = false;
      console.log('solo tiene factor o overage');
      if (dataPlan.numero_mayores > 0) { //////overage
        for (let i = 0; i < this.users.controls.length; i++) {
          if (Number(this.users.controls[i].value.edad) > Number(this.dataPlan.normal_age) && Number(this.users.controls[i].value.edad) <= Number(this.dataPlan.max_age)) {
            this.users.controls[i]['controls'].subTotal.setValue(this.formatNumberDecimal(Number((Number(this.dataPlan.subTotalMayor) > 0) && (Number(this.dataPlan.numero_mayores > 0))) ? Number(this.dataPlan.valorMayor) : Number(this.dataPlan.valorMenor)));
          } else {
            this.users.controls[i].get('subTotal').setValue(this.formatNumberDecimal(Number(this.dataPlan.valorMenor)));
          }
        }
        console.log('overage');
      } else if (dataPlan.planpareja > 0) { //////Plan pareja
        for (let i = 0; i < this.users.controls.length; i++) {
          this.users.controls[i]['controls'].subTotal.setValue(this.formatNumberDecimal(Number(Number(this.dataPlan.USDTotal) / Number(this.dataVuelo[6].length))));
        }
        console.log('plan pareja');
      } else if (dataPlan.planfamiliar > 0) { /////plan familiar
        for (let i = 0; i < this.users.controls.length; i++) {
          this.users.controls[i]['controls'].subTotal.setValue(this.formatNumberDecimal(Number(Number(this.dataPlan.USDTotal) / Number(this.dataVuelo[6].length))));
        }
        console.log('plan Familia');
      } else {////precio normal
        for (let i = 0; i < this.users.controls.length; i++) {
          this.users.controls[i]['controls'].subTotal.setValue(this.formatNumberDecimal(Number(Number(this.dataPlan.USDTotal) / Number(this.dataVuelo[6].length))));
        }
        console.log('No Aplica factor solo precio normal');
      }
    }

    this.precioTotal = this.formatNumberDecimal(Number(this.dataPlan.USDTotal) + Number(this.upgrTotal));
    console.log(this.users);
    if (this.cuponActivo) { //// si hay cupon antivo vuelvo a aplicar el cupon
      this.funAplicaDescuento(this.dataCuponAux);
    }
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  scrollDiv(time, elemento) {
    setTimeout(() => {
      let top = document.getElementById(elemento);
      if (top !== null) {
        top.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        top = null;
      }
    }, time ? time : 200);
  }

  async popoverDescri(descripcion, title, upgrades: Boolean = true, type) {
    let popover = await this.popoverCtrl.create({
      component: PopoverDescripcionComponent,
      componentProps: { parametros: { 0: descripcion[0], type: type }, navbarTitle: title, },
      event: (upgrades == true) ? event : null,
      translucent: true
    });

    popover.present();
  }

  pasoSiguiente(paso, elemento) {
    let elemAux = elemento;
    this.pasos[paso] = true;
    if (paso == 1) {
      this.conEmerg = true;
      this.pasajeros = false;
    } if (paso == 2) {
      if (this.dataPlan['dir_habit'] == 'Y') {
        elemAux = 'habitacion';
        this.pasos[2] = false;
        this.pasos[5] = true;
        this.habitacion = true;
        this.upgrades = false;
        this.pasajeros = false;
        this.conEmerg = false;
        if (this.formDirHabit['controls']['dir_provincia'].value == '')
          this.funStatesHab();
      } else {
        if (this.dataUpgrades == null) {
          this.getUpgrades(this.dataPlan.idp, elemento);
        }
        this.pasos[3] = true;
        this.pasos[4] = true;
        this.upgrades = true;
        this.pasajeros = false;
        this.conEmerg = false;
      }

    } if (paso == 3) {
      this.pasos[4] = true;
      this.upgrades = false;
      this.pasajeros = false;
      this.conEmerg = false;
      this.cupones = true;
    } if (paso == 4) {
      this.upgrades = false;
      this.pasajeros = false;
      this.conEmerg = false;
      this.cupones = false;
      this.pago = true;
    } if (paso == 5) {
      if (this.dataUpgrades == null) {
        this.getUpgrades(this.dataPlan.idp, elemento);
      }
      this.pasos[2] = true;
      this.pasos[3] = true;
      this.pasos[4] = true;
      this.habitacion = false;
      this.upgrades = true;
      this.pasajeros = false;
      this.conEmerg = false;
    }
    this.scrollDiv(650, elemAux);
    console.log(this.pasos, this.users);
  }

  async getUpgrades(idP, elemento) {
    console.log(idP)
    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('FORM-PAGO.cargando_upgrades'),
      duration: 50000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.getUpgrades(idP, localStorage.getItem('pref'))
        .subscribe(
          (data) => {
            if (data[0].message == "NOT RESULTS") {
              console.log("PLAN SIN BENEFICIOS");
              let alerta = this.translate.instant('FORM-PAGO.no_upgrades_disp');
              this.dataUpgrades = data;
              this.avisoToast(alerta, 'bottom', 'light');
              return;
            } else {
              this.dataUpgrades = data;
              console.log('upgrades', data);
              this.scrollDiv(500, elemento);
            }
            loader.dismiss();
          },
          (error) => {
            if (error.status == 0) {/////error de internet
              loader.dismiss();
              let aviso = this.translate.instant('FORM-PAGO.verif_conexion');
              this.avisoToast(aviso, 'bottom', 'danger');
              this.modalCtrl.dismiss();
            } else {///muestro el error al usuario
              console.log('error al cargar', error.error[0].notes);
              this.avisoToast(error.error[0].notes, 'bottom', 'danger');
              console.log(error);
              loader.dismiss();
            }
            console.log(error);
            loader.dismiss();
          },
          () => {
            loader.dismiss();
          }
        );
    });
  }

  async verBeneficios(idPlan, namePlan) {
    console.log(idPlan, namePlan);

    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('GET-PLANS.cargando_beneficios'),
      duration: 40000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.getCoverages(localStorage.getItem('pref'), idPlan, "spa")
        .subscribe(
          (data) => {
            this.dataBeneficios = data;
            if (this.dataBeneficios[0].message == "NOT RESULTS") {
              console.log("PLAN SIN BENEFICIOS");
              let alerta = this.translate.instant('GET-PLANS.plan_sin_beneficios');
              this.avisoToast(alerta, 'bottom', 'light');
              return;
            } else if (this.dataBeneficios[0].name && this.dataBeneficios[0].valor) {
              console.log('PLAN CON BENEFICIOS', data);
              this.modalBenefDesc(this.dataBeneficios, namePlan);
            }
            loader.dismiss();
            console.log(this.dataBeneficios[1].valor);
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

  async avisoToast(texto, posi: any = 'bottom', color = undefined) {
    let toast = await this.toastCtrl.create({
      message: texto,
      duration: 3000,
      position: posi,
      color: color
    });

    toast.onDidDismiss()
      .then()
      .catch();

    return await toast.present();
  }

  async modalBenefDesc(beneficios, nombrePlan) {
    let modalBeneficios = await this.modalCtrl.create({
      component: BeneficiosPlanPage,
      componentProps: { beneficios: beneficios, nombrePlan: nombrePlan }
    });

    return await modalBeneficios.present();
  }

  infoSubTotal() {
    let dataEdadSimple = {
      'normal_age': this.dataPlan.normal_age,
      'max_age': this.dataPlan.max_age,
      'min_age': this.dataPlan.min_age,
      'numero_menores': this.dataPlan.numero_menores,
      'numero_mayores': this.dataPlan.numero_mayores,
      'subTotalMenores': (this.dataPlan.subTotalMenores * this.dataPlan.tasa_cambio),
      'subTotalMayor': (this.dataPlan.subTotalMayor * this.dataPlan.tasa_cambio)
    };
    let parametros = [{
      dataEdades: this.dataPlan.arrUsedPrices ? this.dataPlan.arrUsedPrices : dataEdadSimple,
      moneda: this.dataPlan.moneda
    }];
    let titulo = this.translate.instant('FORM-PAGO.inf_pasajeros');
    this.popoverDescri(parametros, titulo, true, 'detalleEdades');
  }

  descripcionUpgrade(upgrade) {
    console.log('upgrade pasado', upgrade);
    let parametros = [{
      descripcionUpgrade: upgrade.description,
      rango_edades_activo: ((upgrade.limiteage.toUpperCase() == 'Y')) ? 'Y' : 'N',
      edad_min_upgr: Number(upgrade.limiteedadmin),
      edad_max_upgr: Number(upgrade.limiteedadmax)
    }];
    let titulo = this.translate.instant('FORM-PAGO.descripcion');
    this.popoverDescri(parametros, titulo, true, 'descripUpgrade');
  }

  validaUpgrade(upgrade, posUpgrade) {
    this.payPalConfig = null;
    console.log(upgrade, posUpgrade);
    if (upgrade.rd_calc_type == 1) {
      let pasajAplica = 0;
      if (upgrade.limiteage.toUpperCase() == 'Y') {/////SI TIENE RANGO DE EDAD
        for (let i = 0; i < this.dataVuelo[6].length; i++) { ///validar si todos aplican en este raider
          if (this.dataVuelo[6][i] >= Number(upgrade.limiteedadmin) && this.dataVuelo[6][i] <= Number(upgrade.limiteedadmax)) {
            pasajAplica = pasajAplica + 1;
          }
        }
        if (pasajAplica == this.dataVuelo[6].length) {
          let aux: any = 0;
          aux = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade == upgrade.id_raider));
          console.log('auxiliar', aux);
          if (aux.length > 0) {
            let aux = this.funValidaUpgradeExis(upgrade);
            console.log(aux);
            let deleteObj = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade != upgrade.id_raider));
            console.log('upgrades diferentes al que se modifica ', deleteObj);
            if (aux) {
              this.funcRestarRaidersActivo(posUpgrade, aux, deleteObj);
              console.log('Se Elimina el valor del comprobante', this.arrUpgradesAplicados);
            }
          } else {
            this.arrUpgradesAplicados.push(Object.assign({
              idUpgrade: upgrade.id_raider,
              name_raider: upgrade.name_raider,
              pasajero: [],
              monto_upgrade: Number(upgrade.value_raider),
              type_raider: upgrade.type_raider,
              tipo: (upgrade.type_raider == 1) ? 'Monto' : '%',
              monto_aplicado: this.formatNumberDecimal((upgrade.type_raider == 1) ? Number(upgrade.value_raider) : Number((Number(this.dataPlan.USDTotal) * Number(upgrade.value_raider)) / 100)),
              tipo_calculo: upgrade.rd_calc_type,
              rangEdadAct: upgrade.limiteage.toUpperCase(),
              edad_Min: Number(upgrade.limiteedadmin),
              edad_Max: Number(upgrade.limiteedadmax),
              moneda: this.dataPlan.moneda
            }));
            this.funSumaRaidersActivos();
            this.dataUpgrades[posUpgrade].activo = true;
            let aviso = this.translate.instant('FORM-PAGO.upgr_aplicado');
            this.avisoToast(aviso, 'top', 'success');
            console.log('Se agrega el valor del comprobante', this.arrUpgradesAplicados);
          }
        } else {
          let aviso = this.translate.instant('FORM-PAGO.upgr_no_valido') + upgrade.limiteedadmin + ' - ' + upgrade.limiteedadmax + this.translate.instant('FORM-PAGO.upgr_years');
          this.avisoToast(aviso, 'bottom', 'danger');

        }
      } else {/////SI  NO TIENE RANGO DE EDAD APLICA A TODOS 
        let aux: any = 0;
        aux = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade == upgrade.id_raider));
        console.log('auxiliar', aux);
        if (aux.length > 0) {
          let aux = this.funValidaUpgradeExis(upgrade);
          console.log(aux);
          let deleteObj = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade != upgrade.id_raider));
          console.log('upgrades diferentes al que se modifica ', deleteObj);
          if (aux) {
            this.funcRestarRaidersActivo(posUpgrade, aux, deleteObj);
            console.log('Se Elimina el valor del comprobante', this.arrUpgradesAplicados);
          }
        } else {
          this.arrUpgradesAplicados.push(Object.assign({
            idUpgrade: upgrade.id_raider,
            name_raider: upgrade.name_raider,
            pasajero: [],
            monto_upgrade: Number(upgrade.value_raider),
            type_raider: upgrade.type_raider,
            tipo: (upgrade.type_raider == 1) ? 'Monto' : '%',
            monto_aplicado: this.formatNumberDecimal((upgrade.type_raider == 1) ? Number(upgrade.value_raider) : Number((Number(this.dataPlan.USDTotal) * Number(upgrade.value_raider)) / 100)),
            tipo_calculo: upgrade.rd_calc_type,
            rangEdadAct: upgrade.limiteage.toUpperCase(),
            edad_Min: Number(upgrade.limiteedadmin),
            edad_Max: Number(upgrade.limiteedadmax),
            moneda: this.dataPlan.moneda
          }));
          this.funSumaRaidersActivos();
          this.dataUpgrades[posUpgrade].activo = true;
          let aviso = this.translate.instant('FORM-PAGO.upgr_aplicado');
          this.avisoToast(aviso, 'top', 'success');
          console.log('Se agrega el valor del comprobante', this.arrUpgradesAplicados);
        }
      }
      console.log('COMPROBANTE');
    }
    if (upgrade.rd_calc_type == 2) {
      console.log('PASAJERO ESPECIFICO');
      let auxAlert = 0;
      for (let i = 0; i < this.dataVuelo[6].length; i++) {
        if (upgrade.limiteage.toUpperCase() == 'Y') {
          if ((upgrade.limiteage.toUpperCase() == 'Y') && (this.dataVuelo[6][i] >= upgrade.limiteedadmin) && (this.dataVuelo[6][i] <= upgrade.limiteedadmax)) {
            auxAlert = auxAlert + 1;
          }
        } else {
          auxAlert = auxAlert + 1;
        }
      }
      if (auxAlert == 0) {
        let message = this.translate.instant('FORM-PAGO.upgr_no_aplicado_1pas') + upgrade.limiteedadmin + ' - ' + upgrade.limiteedadmax + this.translate.instant('FORM-PAGO.upgr_years');
        this.avisoToast(message, 'bottom', 'danger');
      } else {
        this.alertUpgradePasajero(upgrade, posUpgrade);
      }
    }

    if (upgrade.rd_calc_type == 3) {
      let pasajAplica = 0;
      if (upgrade.limiteage.toUpperCase() == 'Y') {/////SI TIENE RANGO DE EDAD
        for (let i = 0; i < this.dataVuelo[6].length; i++) { ///validar si todos aplican en este raider
          if (this.dataVuelo[6][i] >= Number(upgrade.limiteedadmin) && this.dataVuelo[6][i] <= Number(upgrade.limiteedadmax)) {
            pasajAplica = pasajAplica + 1;
          }
        }
        if (pasajAplica == this.dataVuelo[6].length) {
          let aux: any = 0;
          aux = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade == upgrade.id_raider));
          console.log('auxiliar', aux);
          if (aux.length > 0) {
            let aux = this.funValidaUpgradeExis(upgrade);
            console.log(aux);
            let deleteObj = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade != upgrade.id_raider));
            console.log('upgrades diferentes al que se modifica ', deleteObj);
            if (aux) {
              this.funcRestarRaidersActivo(posUpgrade, aux, deleteObj);
              console.log('Se Elimina el valor del comprobante', this.arrUpgradesAplicados);
            }
          } else {
            this.arrUpgradesAplicados.push(Object.assign({
              idUpgrade: upgrade.id_raider,
              name_raider: upgrade.name_raider,
              pasajero: [],
              monto_upgrade: Number(upgrade.value_raider),
              type_raider: upgrade.type_raider,
              tipo: (upgrade.type_raider == 1) ? 'Monto' : '%',
              monto_aplicado: this.formatNumberDecimal((upgrade.type_raider == 1) ? Number(upgrade.value_raider) * this.dataVuelo[6].length : Number((Number(this.dataPlan.USDTotal) * Number(upgrade.value_raider)) / 100)),
              tipo_calculo: upgrade.rd_calc_type,
              rangEdadAct: upgrade.limiteage.toUpperCase(),
              edad_Min: Number(upgrade.limiteedadmin),
              edad_Max: Number(upgrade.limiteedadmax),
              moneda: this.dataPlan.moneda
            }));
            this.funSumaRaidersActivos();
            this.dataUpgrades[posUpgrade].activo = true;
            let aviso = this.translate.instant('FORM-PAGO.upgr_aplicado');
            this.avisoToast(aviso, 'top', 'success');
            console.log('Se agrega el valor del comprobante', this.arrUpgradesAplicados);
          }
        } else {
          let aviso = this.translate.instant('FORM-PAGO.upgr_no_valido') + upgrade.limiteedadmin + ' - ' + upgrade.limiteedadmax + this.translate.instant('FORM-PAGO.upgr_years');
          this.avisoToast(aviso, 'bottom', 'danger');

        }
      } else {/////SI  NO TIENE RANGO DE EDAD APLICA A TODOS 
        let aux: any = 0;
        aux = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade == upgrade.id_raider));
        console.log('auxiliar', aux);
        if (aux.length > 0) {
          let aux = this.funValidaUpgradeExis(upgrade);
          console.log(aux);
          let deleteObj = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade != upgrade.id_raider));
          console.log('upgrades diferentes al que se modifica ', deleteObj);
          if (aux) {
            this.funcRestarRaidersActivo(posUpgrade, aux, deleteObj);
            console.log('Se Elimina el valor del comprobante', this.arrUpgradesAplicados);
          }
        } else {
          this.arrUpgradesAplicados.push(Object.assign({
            idUpgrade: upgrade.id_raider,
            name_raider: upgrade.name_raider,
            pasajero: [],
            monto_upgrade: Number(upgrade.value_raider),
            type_raider: upgrade.type_raider,
            tipo: (upgrade.type_raider == 1) ? 'Monto' : '%',
            monto_aplicado: this.formatNumberDecimal((upgrade.type_raider == 1) ? Number(upgrade.value_raider) * this.dataVuelo[6].length : Number((Number(this.dataPlan.USDTotal) * Number(upgrade.value_raider)) / 100)),
            tipo_calculo: upgrade.rd_calc_type,
            rangEdadAct: upgrade.limiteage.toUpperCase(),
            edad_Min: Number(upgrade.limiteedadmin),
            edad_Max: Number(upgrade.limiteedadmax),
            moneda: this.dataPlan.moneda
          }));
          this.funSumaRaidersActivos();
          this.dataUpgrades[posUpgrade].activo = true;
          let aviso = this.translate.instant('FORM-PAGO.upgr_aplicado');
          this.avisoToast(aviso, 'top', 'success');
          console.log('Se agrega el valor del comprobante', this.arrUpgradesAplicados);
        }
      }
      console.log('PASAJERO GENERAL');
    }

    if (upgrade.rd_calc_type == 4) {
      let pasajAplica = 0;
      if (upgrade.limiteage.toUpperCase() == 'Y') {/////SI TIENE RANGO DE EDAD
        for (let i = 0; i < this.dataVuelo[6].length; i++) { ///validar si todos aplican en este raider
          if (this.dataVuelo[6][i] >= Number(upgrade.limiteedadmin) && this.dataVuelo[6][i] <= Number(upgrade.limiteedadmax)) {
            pasajAplica = pasajAplica + 1;
          }
        }
        if (pasajAplica == this.dataVuelo[6].length) {
          let aux: any = 0;
          aux = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade == upgrade.id_raider));
          console.log('auxiliar', aux);
          if (aux.length > 0) {
            let aux = this.funValidaUpgradeExis(upgrade);
            console.log(aux);
            let deleteObj = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade != upgrade.id_raider));
            console.log('upgrades diferentes al que se modifica ', deleteObj);
            if (aux) {
              this.funcRestarRaidersActivo(posUpgrade, aux, deleteObj);
              console.log('Se Elimina el valor del comprobante', this.arrUpgradesAplicados);
            }
          } else {
            this.arrUpgradesAplicados.push(Object.assign({
              idUpgrade: upgrade.id_raider,
              name_raider: upgrade.name_raider,
              pasajero: [],
              monto_upgrade: Number(upgrade.value_raider),
              type_raider: upgrade.type_raider,
              tipo: (upgrade.type_raider == 1) ? 'Monto' : '%',
              monto_aplicado: this.formatNumberDecimal((upgrade.type_raider == 1) ? Number(upgrade.value_raider) * this.diasViaje : Number(((Number(this.dataPlan.USDTotal) * Number(upgrade.value_raider)) / 100) * this.diasViaje)),
              tipo_calculo: upgrade.rd_calc_type,
              rangEdadAct: upgrade.limiteage.toUpperCase(),
              edad_Min: Number(upgrade.limiteedadmin),
              edad_Max: Number(upgrade.limiteedadmax),
              moneda: this.dataPlan.moneda
            }));
            this.funSumaRaidersActivos();
            this.dataUpgrades[posUpgrade].activo = true;
            let aviso = this.translate.instant('FORM-PAGO.upgr_aplicado');
            this.avisoToast(aviso, 'top', 'success');
            console.log('Se agrega el valor del comprobante', this.arrUpgradesAplicados);
          }
        } else {
          let aviso = this.translate.instant('FORM-PAGO.upgr_no_valido') + upgrade.limiteedadmin + ' - ' + upgrade.limiteedadmax + this.translate.instant('FORM-PAGO.upgr_years');
          this.avisoToast(aviso, 'bottom', 'danger');

        }
      } else {/////SI  NO TIENE RANGO DE EDAD APLICA A TODOS 
        let aux: any = 0;
        aux = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade == upgrade.id_raider));
        console.log('auxiliar', aux);
        if (aux.length > 0) {
          let aux = this.funValidaUpgradeExis(upgrade);
          console.log(aux);
          let deleteObj = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade != upgrade.id_raider));
          console.log('upgrades diferentes al que se modifica ', deleteObj);
          if (aux) {
            this.funcRestarRaidersActivo(posUpgrade, aux, deleteObj);
            console.log('Se Elimina el valor del comprobante', this.arrUpgradesAplicados);
          }
        } else {
          this.arrUpgradesAplicados.push(Object.assign({
            idUpgrade: upgrade.id_raider,
            name_raider: upgrade.name_raider,
            pasajero: [],
            monto_upgrade: Number(upgrade.value_raider),
            type_raider: upgrade.type_raider,
            tipo: (upgrade.type_raider == 1) ? 'Monto' : '%',
            monto_aplicado: this.formatNumberDecimal((upgrade.type_raider == 1) ? Number(upgrade.value_raider) * this.diasViaje : Number(((Number(this.dataPlan.USDTotal) * Number(upgrade.value_raider)) / 100) * this.diasViaje)),
            tipo_calculo: upgrade.rd_calc_type,
            rangEdadAct: upgrade.limiteage.toUpperCase(),
            edad_Min: Number(upgrade.limiteedadmin),
            edad_Max: Number(upgrade.limiteedadmax),
            moneda: this.dataPlan.moneda
          }));
          this.funSumaRaidersActivos();
          this.dataUpgrades[posUpgrade].activo = true;
          let aviso = this.translate.instant('FORM-PAGO.upgr_aplicado');
          this.avisoToast(aviso, 'top', 'success');
          console.log('Se agrega el valor del comprobante', this.arrUpgradesAplicados);
        }
      }
      console.log('POR DIAS POR VOUCHER');
    }

    if (upgrade.rd_calc_type == 5) {
      let auxAlert = 0;
      for (let i = 0; i < this.dataVuelo[6].length; i++) {
        if (upgrade.limiteage.toUpperCase() == 'Y') {
          if ((upgrade.limiteage.toUpperCase() == 'Y') && (this.dataVuelo[6][i] >= upgrade.limiteedadmin) && (this.dataVuelo[6][i] <= upgrade.limiteedadmax)) {
            auxAlert = auxAlert + 1;
          }
        } else {
          auxAlert = auxAlert + 1;
        }
      }
      if (auxAlert == 0) {
        let message = this.translate.instant('FORM-PAGO.upgr_no_aplicado_1pas') + upgrade.limiteedadmin + ' - ' + upgrade.limiteedadmax + this.translate.instant('FORM-PAGO.upgr_years');
        this.avisoToast(message, 'bottom', 'danger');
      } else {
        this.alertUpgradePasajero(upgrade, posUpgrade);
      }

      console.log('POR DIA POR PASAJERO');
    }

    console.log('ARREGLO DE UPGRADE APLICADOS ', this.arrUpgradesAplicados);
  }

  funValidaUpgradeExis(Upgrade) {
    let aux = 0;
    let auxAdams;
    for (let i = 0; i < this.arrUpgradesAplicados.length; i++) {
      if (this.arrUpgradesAplicados[i].idUpgrade == Upgrade.id_raider) {
        aux = i;
        auxAdams = true;
      } else {
        aux = 0;
      }
    }
    if (auxAdams == true) {
      return this.arrUpgradesAplicados[aux];
    } else {
      return false;
    }
  }

  arrPasajerosUpgrade(upgrade, type = 'checkbox') {
    let objeto: any = [];
    let aux = this.funValidaUpgradeExis(upgrade);
    if (aux) {
      console.log('verifica para cargar la data', aux);
      for (let i = 0; i < this.dataVuelo[6].length; i++) {
        if (upgrade.limiteage.toUpperCase() == 'Y') {
          if ((upgrade.limiteage.toUpperCase() == 'Y') && (this.dataVuelo[6][i] >= upgrade.limiteedadmin) && (this.dataVuelo[6][i] <= upgrade.limiteedadmax)) {
            let aiuda = aux.pasajero.filter(pasaj => (pasaj == i));
            console.log(i, aux.pasajero);
            objeto.push(Object.assign({
              name: this.translate.instant('FORM-PAGO.pasajero') + (i + 1),
              type: type,
              value: i,
              label: (i + 1) + this.translate.instant('FORM-PAGO.pasajero_edad') + '(' + this.dataVuelo[6][i] + ')',
              checked: (i == aiuda.find((element) => (element == i))) ? true : false
            }));
          }
        } else {
          let aiuda = aux.pasajero.filter(pasaj => (pasaj == i));
          console.log(i, aux.pasajero);
          objeto.push(Object.assign({
            name: this.translate.instant('FORM-PAGO.pasajero') + (i + 1),
            type: type,
            value: i,
            label: (i + 1) + this.translate.instant('FORM-PAGO.pasajero_edad') + '(' + this.dataVuelo[6][i] + ')',
            checked: (i == aiuda.find((element) => (element == i))) ? true : false
          }));
        }
      }
      console.log(objeto);


    } else {
      for (let i = 0; i < this.dataVuelo[6].length; i++) {
        if (upgrade.limiteage.toUpperCase() == 'Y') {
          if ((upgrade.limiteage.toUpperCase() == 'Y') && (this.dataVuelo[6][i] >= upgrade.limiteedadmin) && (this.dataVuelo[6][i] <= upgrade.limiteedadmax)) {
            objeto.push(Object.assign({
              name: this.translate.instant('FORM-PAGO.pasajero') + (i + 1),
              type: type,
              value: i,
              label: (i + 1) + this.translate.instant('FORM-PAGO.pasajero_edad') + '(' + this.dataVuelo[6][i] + ')'
            }));
          }
        } else {
          objeto.push(Object.assign({
            name: this.translate.instant('FORM-PAGO.pasajero') + (i + 1),
            type: type,
            value: i,
            label: (i + 1) + this.translate.instant('FORM-PAGO.pasajero_edad') + this.dataVuelo[6][i] + ')'
          }));
        }
      }
    }
    return objeto;
  }

  async alertUpgradePasajero(upgrade, posUpgrade) {
    this.payPalConfig = null;
    console.log('parametros ', upgrade, posUpgrade);
    let header = this.translate.instant('FORM-PAGO.sel_pasaj_upgrade') + Number(upgrade.value_raider) + ((upgrade.type_raider == 1) ? ' ' + this.dataPlan.moneda : '%');
    const alert = await this.alertCtrl.create({
      header: header,
      inputs: this.arrPasajerosUpgrade(upgrade),
      buttons: [
        {
          text: this.translate.instant('FORM-PAGO.eliminar_upgrade'),
          role: this.translate.instant('FORM-PAGO.eliminar_upgrade'),
          handler: (data) => {
            let aux = this.funValidaUpgradeExis(upgrade);
            console.log(aux);
            let deleteObj = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade != upgrade.id_raider));
            console.log('Elimino el Upgrade', aux, this.upgrTotal, this.dataUpgrades[posUpgrade], this.arrUpgradesAplicados);
            if (aux) {
              this.funcRestarRaidersActivo(posUpgrade, aux, deleteObj);
            } else {
              let aviso = this.translate.instant('FORM-PAGO.aplicar_upgr_alm_un_pasaj');
              this.avisoToast(aviso, 'top', 'warning');
              return false;
            }
          }
        }, {
          text: this.translate.instant('FORM-PAGO.aplicar_upgrade'),
          handler: (data) => {
            if (data.length > 0) {
              let aux: any = 0;
              aux = this.arrUpgradesAplicados.filter((upr) => (upr.idUpgrade == upgrade.id_raider));
              if (aux.length > 0) {
                for (let a = 0; a < this.arrUpgradesAplicados.length; a++) {
                  if (upgrade.id_raider == this.arrUpgradesAplicados[a].idUpgrade) {
                    console.log('ya existe se modifica');
                    this.arrUpgradesAplicados[a] = Object.assign({
                      idUpgrade: upgrade.id_raider,
                      name_raider: upgrade.name_raider,
                      pasajero: data,
                      monto_upgrade: Number(upgrade.value_raider),
                      type_raider: upgrade.type_raider,
                      tipo: (upgrade.type_raider == 1) ? 'Monto' : '%',
                      monto_aplicado: 0,
                      tipo_calculo: upgrade.rd_calc_type,
                      rangEdadAct: upgrade.limiteage.toUpperCase(),
                      edad_Min: Number(upgrade.limiteedadmin),
                      edad_Max: Number(upgrade.limiteedadmax),
                      moneda: this.dataPlan.moneda
                    });
                  }
                }
              } else {
                this.arrUpgradesAplicados.push(Object.assign({
                  idUpgrade: upgrade.id_raider,
                  name_raider: upgrade.name_raider,
                  pasajero: data,
                  monto_upgrade: Number(upgrade.value_raider),
                  type_raider: upgrade.type_raider,
                  tipo: (upgrade.type_raider == 1) ? 'Monto' : '%',
                  monto_aplicado: 0,
                  tipo_calculo: upgrade.rd_calc_type,
                  rangEdadAct: upgrade.limiteage.toUpperCase(),
                  edad_Min: Number(upgrade.limiteedadmin),
                  edad_Max: Number(upgrade.limiteedadmax),
                  moneda: this.dataPlan.moneda
                }));
              }

              if (Number(upgrade.rd_calc_type) == 2) {
                let auxPrec: any = 0;
                let posUpgr: any;
                posUpgr = this.arrUpgradesAplicados.findIndex(i => i.idUpgrade == upgrade.id_raider);

                if (this.dataPlan.calc_new == 'Y') {
                  for (let a = 0; a < data.length; a++) {
                    for (let i = 0; i < this.dataPlan.arrUSDBasePrices.length; i++) {
                      if (this.users.controls[data[a]].get('edad').value >= this.dataPlan.arrUSDBasePrices[i].ageMin && this.users.controls[data[a]].get('edad').value <= this.dataPlan.arrUSDBasePrices[i].ageMax) {
                        auxPrec += Number((Number(upgrade.type_raider) == 1) ? Number(upgrade.value_raider) : ((Number(this.dataPlan.arrUSDBasePrices[i]['pvp']) * Number(upgrade.value_raider)) / 100));
                        console.log('agrega a pasajero precios nuevos ', auxPrec, posUpgr);
                        this.arrUpgradesAplicados[posUpgr].monto_aplicado = this.formatNumberDecimal(Number(auxPrec));
                      }
                    }
                  }
                } else {
                  for (let a = 0; a < data.length; a++) {
                    auxPrec += Number((Number(this.arrUpgradesAplicados[posUpgr].type_raider) == 1) ? Number(this.arrUpgradesAplicados[posUpgr].monto_upgrade) : ((Number(this.dataPlan.valorMenor) * Number(this.arrUpgradesAplicados[posUpgr].monto_upgrade)) / 100));
                    console.log('agrega a pasajero precio menor ', auxPrec, posUpgr);
                    this.arrUpgradesAplicados[posUpgr].monto_aplicado = this.formatNumberDecimal(Number(auxPrec));
                  }
                }

                console.log(2, this.arrUpgradesAplicados, auxPrec);
              }

              if (Number(upgrade.rd_calc_type) == 5) {
                let auxPrec: any = 0;
                let posUpgr: any;
                posUpgr = this.arrUpgradesAplicados.findIndex(i => i.idUpgrade == upgrade.id_raider);

                auxPrec = Number((Number(this.arrUpgradesAplicados[posUpgr].type_raider) == 1) ? Number((this.arrUpgradesAplicados[posUpgr].monto_upgrade * this.diasViaje) * data.length) : Number((((this.arrUpgradesAplicados[posUpgr].monto_upgrade / 100) * this.dataPlan.USDTotal) * this.diasViaje) * data.length));
                console.log('agrega a pasajero calculo 5 ', auxPrec, posUpgr, (this.arrUpgradesAplicados[posUpgr].monto_upgrade / 100), this.dataPlan.USDTotal, this.diasViaje, data.length);
                this.arrUpgradesAplicados[posUpgr].monto_aplicado = this.formatNumberDecimal(Number(auxPrec));
                console.log(5, this.arrUpgradesAplicados, auxPrec);
              }

              console.log('seleccionados', data);
              this.funSumaRaidersActivos();
              this.dataUpgrades[posUpgrade].activo = true;
              let aviso = this.translate.instant('FORM-PAGO.upgr_aplicado');
              this.avisoToast(aviso, 'top', 'success');
              console.log('ARREGLO DE UPGRADE APLICADOS ', this.arrUpgradesAplicados);
            } else {
              let aviso = this.translate.instant('FORM-PAGO.debes_selec_alm_1_pasaj');
              this.avisoToast(aviso, 'top', 'warning');
              return false;
            }
          }
        }, {
          text: this.translate.instant('FORM-PAGO.cancelar'),
          role: this.translate.instant('FORM-PAGO.cancelar')
        }
      ]
    });

    await alert.present();
  }

  funSumaRaidersActivos() {
    this.upgrTotal = 0;
    for (let i = 0; i < this.arrUpgradesAplicados.length; i++) {
      this.upgrTotal += this.arrUpgradesAplicados[i].monto_aplicado;
    }
    this.precioTotal = this.formatNumberDecimal(Number(this.upgrTotal) + Number(this.dataPlan.USDTotal));
    if (localStorage.getItem('agency') != 'N/A' && localStorage.getItem('agency')) {
      this.funCreditAgencia();
    }
    if (this.cuponActivo) { //// si hay cupon activo vuelvo a aplicar el cupon
      this.funAplicaDescuento(this.dataCuponAux);
    }
  }

  funcRestarRaidersActivo(posUpgrade, aux, deleteObj) {
    this.upgrTotal = this.formatNumberDecimal(Number(Number(this.upgrTotal) - Number(aux.monto_aplicado)));
    this.dataUpgrades[posUpgrade].activo = false;
    this.arrUpgradesAplicados = deleteObj;
    let auxPrecTotal = 0;
    for (let i = 0; i < this.arrUpgradesAplicados.length; i++) {
      auxPrecTotal += Number(this.arrUpgradesAplicados[i].monto_aplicado);
    }
    console.log('monto a restar para quitar raiders', auxPrecTotal);
    this.precioTotal = this.formatNumberDecimal(Number(this.dataPlan.USDTotal) + auxPrecTotal);
    let aviso = this.translate.instant('FORM-PAGO.upgr_eliminado');
    this.avisoToast(aviso, 'top', 'danger');
    if (this.cuponActivo) { //// si hay cupon antivo vuelvo a aplicar el cupon
      this.funAplicaDescuento(this.dataCuponAux);
    }
    if (localStorage.getItem('agency') != 'N/A' && localStorage.getItem('agency')) {
      this.funCreditAgencia();
    }
  }

  eliminarTodosUpgrades() {
    this.arrUpgradesAplicados = [];
    for (let i = 0; i < this.dataUpgrades.length; i++) {
      this.dataUpgrades[i].activo = false;
    }
    this.upgrTotal = 0;
    this.precioTotal = this.formatNumberDecimal(Number(this.dataPlan.USDTotal) + Number(this.upgrTotal));
    console.log('SE ELIMINARON TODOS LOS UPGRADES');
    if (this.cuponActivo) { //// si hay cupon antivo vuelvo a aplicar el cupon
      this.funAplicaDescuento(this.dataCuponAux);
    }
    if (localStorage.getItem('agency') != 'N/A' && localStorage.getItem('agency')) {
      this.funCreditAgencia();
    }
  }

  upgrDescripXPasaj() {
    let titulo = this.translate.instant('FORM-PAGO.upgr_aplicados');
    const aux = this.arrUpgradesAplicados;
    const auxdata = aux.sort(function (raider, raiderr) {
      if (raider.name_raider > raiderr.name_raider) { //comparación lexicogŕafica
        return 1;
      } else if (raider.name_raider < raiderr.name_raider) {
        return -1;
      }
      return 0;
    });

    for (const key in auxdata) {
      if (auxdata.hasOwnProperty(key)) {
        const element = auxdata[key];
        element['tasa_cambio'] = this.dataPlan.tasa_cambio;
      }
    }

    this.popoverDescri([auxdata], titulo, false, 'upgradesAplicados');
  }

  async validaCupon() {
    this.payPalConfig = null;
    let auxCupon = this.codigoCupon['value'].codigo;
    console.log('cupon', this.codigoCupon['value'].codigo);

    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('FORM-PAGO.validando_cupon'),
      duration: 120000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.getCuponDescuentoNC(localStorage.getItem('pref'), this.dataVuelo[5], this.dataPlan.idp, auxCupon, this.precioTotal, this.dataVuelo[1], this.dataVuelo[6].length, this.dataPlan.moneda, this.dataPlan.tasa_cambio)
        .subscribe(
          (data: any) => {
            loader.dismiss();
            console.log('data descuento', data);
            let avisoAux;
            switch (true) {
              case data['CUPON'] && data['CUPON']['STATUS'] == 'OK' && data['NC'] && data['NC']['STATUS'] == 'OK':
                console.log('data Cupon', data['CUPON']);
                avisoAux = data['CUPON']['MSG'];
                this.avisoToast(avisoAux, 'top', 'success');
                this.cuponActivo = true;
                this.dataCupon = data;
                this.dataCuponAux = data;
                this.textDescApi = data.CUPON.TEXT_APP + ',' + data.NC.TEXT_APP;
                this.funAplicaDescuento(this.dataCuponAux);
                this.scrollDiv(500, 'cupones');
                break;

              case data['CUPON'] && data['CUPON']['STATUS'] == 'OK':
                console.log('data Cupon', data['CUPON']);
                avisoAux = data['CUPON']['MSG'];
                this.avisoToast(avisoAux, 'top', 'success');
                this.cuponActivo = true;
                this.dataCupon = data;
                this.dataCuponAux = [data['CUPON']];
                this.textDescApi = data.CUPON.TEXT_APP;
                this.funAplicaDescuento(this.dataCuponAux);
                this.scrollDiv(500, 'cupones');
                break;

              case data['NC'] && data['NC']['STATUS'] == 'OK':
                console.log('data NC', data['NC']);
                avisoAux = data['NC']['MSG'];
                this.avisoToast(avisoAux, 'top', 'success');
                this.cuponActivo = true;
                this.dataCupon = data;
                this.dataCuponAux = [data['NC']];
                this.textDescApi = data.NC.TEXT_APP;
                this.funAplicaDescuento(this.dataCuponAux);
                this.scrollDiv(500, 'cupones');
                break;

              default:
                console.log('error de descuento', data);
                for (const key in data) {
                  if (data.hasOwnProperty(key)) {
                    if (data[key]['STATUS'] == 'ERROR') {
                      const element = data[key].MSG;
                      this.avisoToast(element, 'bottom', 'danger');
                    }
                  }
                }
                break;
            }
          },
          (error) => {
            if (error.status == 0) {/////error de internet
              loader.dismiss();
              let aviso = this.translate.instant('FORM-PAGO.verif_conexion');
              this.avisoToast(aviso, 'bottom', 'danger');
              this.modalCtrl.dismiss();
            } else {///muestro el error al usuario
              console.log('error al cargar', error.error[0].notes);
              this.avisoToast(error.error[0].notes, 'bottom', 'danger');
              console.log(error);
              loader.dismiss();
            }
          },
          () => {
            loader.dismiss();
          }
        );
    });
  }

  funAplicaDescuento(allData: any = {}) {
    this.payPalConfig = null;
    let cantElem = Object.keys(allData).length;

    console.log('data recibida para calcular descuentos', allData);

    if (allData != {}) {
      let descAux = 0;
      this.descAPlic = 0;

      console.log('cantidad de elementos ', cantElem);
      if (cantElem >= 2) {////////si aplica dos descuentos cupon y nc
        allData = [allData];

        console.log('APLICA DOS DESCUENTOS', allData[0]);

        for (const key in allData[0]) {
          if (allData[0].hasOwnProperty(key)) {
            const element = allData[0][key];
            console.log('primer arreglo', element);
            for (const k in element) {
              if (element.hasOwnProperty(k)) {

                if (k == 'TIPO_CALC') {
                  if (element[k] == '%') {//// si es porcentaje
                    console.log('segundo arreglo ', element[k], k);
                    descAux += Number(((Number(this.dataPlan.USDTotal) + Number(this.upgrTotal)) * Number(element['VALUE_CUPON'])) / 100);
                    this.descAPlic = descAux;
                    console.log('Descuento con porcentaje', descAux, this.descAPlic);
                    if (Number(element['VALUE_CUPON']) >= 100) {//si cubre todo el monto
                      this.precioTotal = 0.00;
                    } else {
                      this.precioTotal = this.formatNumberDecimal(Number((Number(this.dataPlan.USDTotal) + Number(this.upgrTotal)) - Number(this.descAPlic)));
                      if (localStorage.getItem('agency') != 'N/A' && localStorage.getItem('agency')) {
                        this.funCreditAgencia();
                      }
                      this.dataCupon.PAGO_CUPON = 'No';
                      this.dataCupon.DESC_APP = this.descAPlic;
                    }
                  } else {   ///// si es monto 
                    console.log('segundo arreglo ', element[k], k);
                    descAux += Number(element['VALUE_CUPON']);
                    this.descAPlic = descAux;
                    console.log('Descuento con Monto', descAux, this.descAPlic);
                    if ((Number(this.precioTotal) - Number(this.descAPlic)) <= 0) {
                      this.precioTotal = 0.00;
                    } else {
                      this.precioTotal = this.formatNumberDecimal(Number((Number(this.dataPlan.USDTotal) + Number(this.upgrTotal)) - Number(this.descAPlic)));
                      if (localStorage.getItem('agency') != 'N/A' && localStorage.getItem('agency')) {
                        this.funCreditAgencia();
                      }
                      this.dataCupon.PAGO_CUPON = 'No';
                      this.dataCupon.DESC_APP = this.descAPlic;
                    }
                  }
                }
              }
            }

          }
        }
      } else {
        for (const key in allData[0]) {
          if (allData[0].hasOwnProperty(key)) {
            const element = allData[0][key];
            if (key == 'TIPO_CALC') {
              if (element == '%') {//// si es porcentaje
                console.log('segundo arreglo ', element, key);
                descAux += Number(((Number(this.dataPlan.USDTotal) + Number(this.upgrTotal)) * Number(allData[0]['VALUE_CUPON'])) / 100);
                this.descAPlic = descAux;
                console.log('Descuento con porcentaje', descAux, this.descAPlic);
                if (Number(allData[0]['VALUE_CUPON']) >= 100) {//si cubre todo el monto
                  this.precioTotal = 0.00;
                } else {
                  this.precioTotal = this.formatNumberDecimal(Number((Number(this.dataPlan.USDTotal) + Number(this.upgrTotal)) - Number(this.descAPlic)));
                  if (localStorage.getItem('agency') != 'N/A' && localStorage.getItem('agency')) {
                    this.funCreditAgencia();
                  }
                  this.dataCupon.PAGO_CUPON = 'No';
                  this.dataCupon.DESC_APP = this.descAPlic;
                }
              } else {   ///// si es monto 
                console.log(element, key);
                descAux += Number(allData[0]['VALUE_CUPON']);
                this.descAPlic = descAux;
                console.log('Descuento con Monto', descAux, this.descAPlic);
                if ((Number(this.precioTotal) - Number(this.descAPlic)) <= 0) {
                  this.precioTotal = 0.00;
                } else {
                  this.precioTotal = this.formatNumberDecimal(Number((Number(this.dataPlan.USDTotal) + Number(this.upgrTotal)) - Number(this.descAPlic)));
                  if (localStorage.getItem('agency') != 'N/A' && localStorage.getItem('agency')) {
                    this.funCreditAgencia();
                  }
                  this.dataCupon.PAGO_CUPON = 'No';
                  this.dataCupon.DESC_APP = this.descAPlic;
                }
              }
            }

          }
        }

      }
    }

    this.precioTotal = (this.formatNumberDecimal(Number((Number(this.dataPlan.USDTotal) + Number(this.upgrTotal)) - Number(this.descAPlic))) > 0) ? this.formatNumberDecimal(Number((Number(this.dataPlan.USDTotal) + Number(this.upgrTotal)) - Number(this.descAPlic))) : 0;

    console.log('Validacion si los descuentos cubren todo ', Number(this.descAPlic), Number(Number(this.dataPlan.USDTotal) + Number(this.upgrTotal)));
    if (Number(this.descAPlic) >= Number(Number(this.dataPlan.USDTotal) + Number(this.upgrTotal))) {
      setTimeout(() => {
        let aviso = this.translate.instant('FORM-PAGO.cupon_cubre_todo');
        this.dataCupon.PAGO_CUPON = 'Si';
        this.dataCupon.DESC_APP = this.descAPlic;
        console.log('cuponCubreTodo', this.dataCupon);
        this.avisoToast(aviso, 'middle', 'warning');
      }, 3000);
    }

  }

  eliminarCupon() {
    this.cuponActivo = false;
    this.descAPlic = 0;
    this.dataCupon = null;
    this.precioTotal = this.formatNumberDecimal(Number((Number(this.dataPlan.USDTotal) + Number(this.upgrTotal))));
    if (localStorage.getItem('agency') != 'N/A' && localStorage.getItem('agency')) {
      this.funCreditAgencia();
    }
    this.codigoCupon['controls'].codigo.setValue('');
    let aviso = this.translate.instant('FORM-PAGO.cupon_descartado');
    this.avisoToast(aviso, 'top', 'danger');
  }

  funFormatCreditCard(event) {
    let codigoValor: any = document.getElementsByName("codigoTarjeta")[0]['value'];
    codigoValor = String(codigoValor).replace(/[a-zA-Z]/g, '');
    this.formPagoTDC['controls'].codigoTarjeta.setValue(codigoValor);

    codigoValor = codigoValor
      .replace(/\W/gi, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
    this.formPagoTDC['controls'].codigoTarjeta.setValue(codigoValor);
    this.funAsigTipoTDC(codigoValor);
    //console.log(this.formPagoTDC)
    // //validamos si es american express para esto quitamos todos los espacios en blaco y luego veriricamos que tenga 4, 6 y 5 digitos.
    // if (codigoValor.replace(/ /g, '').match(/\b(\d{4})(\d{6})(\d{5})\b/)) {
    //   codigoValor = codigoValor
    //     .replace(/\W/gi, '')//quitamos todos los espacios demas
    //     .replace(/\b(\d{4})(\d{6})(\d{5})\b/, '$1 $2 $3') //si cumple el formato añadimos 3,6 y 5 digitos
    //     .trim();
    //   this.formPagoTDC['controls'].codigoTarjeta.setValue(codigoValor);
    // }
    // //si no es american express entonces es una tarjeta visa o master card
    // else {
    //   codigoValor = codigoValor
    //     .replace(/\W/gi, '')
    //     .replace(/(.{4})/g, '$1 ')
    //     .trim();
    //   this.formPagoTDC['controls'].codigoTarjeta.setValue(codigoValor);
    // }
  }

  funAsigTipoTDC(cod) {
    let aux = cod.slice(0, 2);
    switch (true) {
      case ((aux == 34) || (aux == 37)):
        this.formPagoTDC['controls'].tipoTarjeta.setValue('Amex');
        this.imgTDC = '../../assets/imgs/Logos_TDC/Amex.png';
        break;

      case aux == 35:
        this.formPagoTDC['controls'].tipoTarjeta.setValue('Jcb');
        this.imgTDC = '../../assets/imgs/Logos_TDC/Jcb.png';
        break;

      case ((aux == 36) || (aux == 38)):
        this.formPagoTDC['controls'].tipoTarjeta.setValue('DinersClub');
        this.imgTDC = '../../assets/imgs/Logos_TDC/DinersClub.png';
        break;

      case ((aux >= 40) && (aux <= 49)):
        this.formPagoTDC['controls'].tipoTarjeta.setValue('Visa');
        this.imgTDC = '../../assets/imgs/Logos_TDC/Visa.png';
        break;

      case ((aux >= 51) && (aux <= 55)):
        this.formPagoTDC['controls'].tipoTarjeta.setValue('MasterCard');
        this.imgTDC = '../../assets/imgs/Logos_TDC/MasterCard.png';
        break;

      case aux == 62:
        this.formPagoTDC['controls'].tipoTarjeta.setValue('UnionPay');
        this.imgTDC = '../../assets/imgs/Logos_TDC/UnionPay.png';
        break;

      case ((aux == 65) && (aux == 65)):
        this.formPagoTDC['controls'].tipoTarjeta.setValue('Discover');
        this.imgTDC = '../../assets/imgs/Logos_TDC/Discover.png';
        break;

      default:
        this.formPagoTDC['controls'].tipoTarjeta.setValue('Card');
        this.imgTDC = '../../assets/imgs/Logos_TDC/Card.png';
        break;
    }
  }

  async verPDFApp(pos, url, nombrePdf: string) {
    let loader = await this.loadingCtrl.create({
      duration: 120000
    });
    await loader.present();
    let nombrePDF = nombrePdf + localStorage.getItem('pref');

    switch (pos) {
      case 1:
        console.log(pos);
        this.gestorFiles.verPDFDownApp(url, nombrePDF)
          .then((data) => {
            console.log(data);
            loader.dismiss();
          }).catch((err) => {
            console.log(err);
            loader.dismiss();
          });
        break;

      case 2:
        console.log(pos);
        this.gestorFiles.verPDFDownApp(url, nombrePDF)
          .then((data) => {
            console.log(data);
            loader.dismiss();
          }).catch((err) => {
            console.log(err);
            loader.dismiss();
          });
        break;

      case 3:
        console.log(pos);
        this.gestorFiles.verPDFDownApp(url, nombrePDF)
          .then((data) => {
            console.log(data);
            loader.dismiss();
          }).catch((err) => {
            console.log(err);
            loader.dismiss();
          });
        break;

      default:
        this.gestorFiles.verPDFDownApp(url, 'PDF')
          .then((data) => {
            console.log(data);
            loader.dismiss();
          }).catch((err) => {
            console.log(err);
            loader.dismiss();
          });
        break;
    }
  }

  funSeltipoPago(typeMethod: string) {
    switch (typeMethod) {
      case 'PAY_CREDIT_CARD':
        this.typeMethodPago = typeMethod;
        this.scrollDiv(1800, 'PAY_CREDIT_CARD');
        break;

      case 'USE_PAYPAL':
        this.typeMethodPago = typeMethod;
        this.scrollDiv(800, 'USE_PAYPAL');
        break;

      case 'CREDIT_AGENCY':
        this.typeMethodPago = typeMethod;
        this.scrollDiv(800, 'CREDIT_AGENCY');
        this.funCreditAgencia();
        break;

      case 'SHIPPING_LINK':
        this.typeMethodPago = typeMethod;
        this.scrollDiv(800, 'SHIPPING_LINK');
        break;

      default:
        this.typeMethodPago = null;
        break;
    }
  }

  formatNumberDecimal(number) {
    return Number(number.toString().match(/^\d+(?:\.\d{0,2})?/));
  }

  dataOrdenGen() {
    let dataPasaj: any = [];
    let dataEmer;
    let dataPago;
    let dataLinkPago;
    let key: any;
    let valor: string;
    let prueba = {};
    let keys = [
      'name',
      'apellido',
      'nacimiento',
      'edad',
      'sexo',
      'pais',
      'tipoDoc',
      'documento',
      'correoP',
      'codigoTel',
      'TelefP',
      'condMed',
      'subTotal'
    ];

    let k = [
      'nombre',
      'apellido',
      'fechaNacimiento',
      'edad',
      'sexo',
      'pais',
      'tipoDocumento',
      'documento',
      'email',
      'codigoTelfono',
      'telefono',
      'condMed',
      'subtotal'
    ];

    for (let i = 0; i < this.users.controls.length; i++) {
      if (this.dataPlan.calc_new && this.dataPlan.calc_new == 'Y') {//////aplica para calculos nuevos
        for (let e = 0; e < this.dataPlan.arrUSDUsedPrices.length; e++) {
          if (this.users.controls[i].get('edad').value >= this.dataPlan.arrUSDUsedPrices[e].ageMin && this.users.controls[i].get('edad').value <= this.dataPlan.arrUSDUsedPrices[e].ageMax) {
            prueba['costo'] = this.dataPlan.arrUSDUsedPrices[e].cost ? this.dataPlan.arrUSDUsedPrices[e].cost : 0;
            prueba['neto'] = this.dataPlan.arrUSDUsedPrices[e].net ? this.dataPlan.arrUSDUsedPrices[e].net : 0;
          }
        }
      } else {
        if (this.users.controls[i].get('edad').value >= this.dataPlan.min_age && this.users.controls[i].get('edad').value <= this.dataPlan.normal_age) {
          ///precio normal
          prueba['costo'] = this.dataPlan.costoMenor ? this.dataPlan.costoMenor : 0;
          prueba['neto'] = this.dataPlan.netoMenor ? this.dataPlan.netoMenor : 0;
        } else {
          /////precio overage
          prueba['costo'] = this.dataPlan.costoMayor ? this.dataPlan.costoMayor : 0;
          prueba['neto'] = this.dataPlan.netoMayor ? this.dataPlan.netoMayor : 0;
        }
      }

      for (let a = 0; a < keys.length; a++) {
        key = keys[a] + i;
        valor = this.users.controls[i].get(keys[a]).value;

        if ((key.toLowerCase()).indexOf('nacimiento') >= 0) {
          prueba[k[a]] = moment(valor).format('YYYY-MM-DD');//////dar formato yyyy-mm-dd nacimiento
        } else {
          prueba[k[a]] = valor;
        }
      }
      dataPasaj.push(prueba);
      prueba = {};
    }
    console.log('pruebaaa', dataPasaj);

    dataEmer = {
      'nameE': this.contacto['controls']['nameE'].value,
      'correoE': this.contacto['controls']['correoE'].value,
      'codigoTelE': this.contacto['controls']['codigoTelE'].value,
      'TelefPE': this.contacto['controls']['TelefPE'].value
    };

    dataPago = {
      'codigoTarjeta': this.formPagoTDC['controls']['codigoTarjeta'].value,
      'nombreTarjeta': this.formPagoTDC['controls']['nombreTarjeta'].value,
      'apellidoTarjeta': this.formPagoTDC['controls']['apellidoTarjeta'].value,
      'tipoTarjeta': this.formPagoTDC['controls']['tipoTarjeta'].value,
      'CCV': this.formPagoTDC['controls']['CCV'].value,
      'mesTarjetaVen': moment(this.formPagoTDC['controls']['mesTarjetaVen'].value).format('MM'),
      'yearTarjetaVen': moment(this.formPagoTDC['controls']['yearTarjetaVen'].value).format('YYYY'),
      'pay_typeDoc': this.formPagoTDC['controls']['tipoDocumentTDC'].value,
      'pay_document': this.formPagoTDC['controls']['nDocumentTDC'].value,
      'pay_email': this.formPagoTDC['controls']['correoTDC'].value,
      'pay_country': this.formPagoTDC['controls']['paisTDC'].value,
      'pay_state': this.formPagoTDC['controls']['estadoTDC'].value,
      'pay_city': this.formPagoTDC['controls']['ciudadTDC'].value,
      'pay_phoneCode': this.formPagoTDC['controls']['prefTelTDC'].value,
      'pay_phoneNumbre': this.formPagoTDC['controls']['telefTDC'].value,
      'termCond': this.formPagoTDC['controls']['termCond'].value,
    };

    dataLinkPago = {
      'correoLinkPago': this.formLinkPago['controls']['correoLinkPago'].value ? this.formLinkPago['controls']['correoLinkPago'].value : '',
      'codigoTelLinkPago': this.formLinkPago['controls']['codigoTelLinkPago'].value ? this.formLinkPago['controls']['codigoTelLinkPago'].value : '',
      'telefLinkPago': this.formLinkPago['controls']['telefLinkPago'].value ? this.formLinkPago['controls']['telefLinkPago'].value : ''
    }

    let dataOrden: any = {
      dataPasajeros: dataPasaj,
      contactoEmergencia: dataEmer,
      upgrades: this.arrUpgradesAplicados,
      cupon: this.dataCupon,
      idPreOrden: this.idPreOrden
    };
    (this.dataCupon && this.dataCupon.PAGO_CUPON == 'Si' || this.typeMethodPago != 'PAY_CREDIT_CARD') ? '' : dataOrden.TDC = dataPago;
    (this.dataCupon && this.dataCupon.PAGO_CUPON == 'Si') ? '' : dataOrden.dataLinkPago = dataLinkPago;

    let dataOrdenPost = new FormData();
    dataOrdenPost.append('data', JSON.stringify(dataOrden));
    dataOrdenPost.append("category", this.dataVuelo[5]);
    dataOrdenPost.append("startDate", moment(this.dataVuelo[2], 'DD/MM/YYYY').format('YYYY-MM-DD'));
    dataOrdenPost.append("endDate", moment(this.dataVuelo[3], 'DD/MM/YYYY').format('YYYY-MM-DD'));
    dataOrdenPost.append("destination", this.dataVuelo[1]);
    dataOrdenPost.append("origen", this.dataVuelo[0]);
    dataOrdenPost.append("ages", this.dataVuelo[6]);
    dataOrdenPost.append("bloque", this.dataVuelo[7] ? this.dataVuelo[7] : '');
    dataOrdenPost.append("destino", this.dataVuelo[1]);
    dataOrdenPost.append("FechaSalida", moment(this.dataVuelo[2], 'DD/MM/YYYY').format('YYYY-MM-DD'));
    dataOrdenPost.append("FechaLlegada", moment(this.dataVuelo[3], 'DD/MM/YYYY').format('YYYY-MM-DD'));
    dataOrdenPost.append("id_plan_categoria", this.dataVuelo[5]);
    dataOrdenPost.append("id_plan", this.dataPlan.idp);
    dataOrdenPost.append("edades", this.dataVuelo[6]);
    dataOrdenPost.append("id_preorden", this.idPreOrden);
    dataOrdenPost.append("array_prices_app", JSON.stringify(this.dataPlan));
    dataOrdenPost.append("total_dias", this.diasViaje);
    this.codeVouchGenerado ? dataOrdenPost.append("voucher", this.codeVouchGenerado) : '';
    dataOrdenPost.append("paso", '3');
    dataOrdenPost.append("intento", this.intento);
    dataOrdenPost.append("subTotal", this.dataPlan.USDTotal);
    dataOrdenPost.append("subTotalUpgrades", this.upgrTotal);
    dataOrdenPost.append("precioTotal", String(this.precioTotal));
    dataOrdenPost.append("tipoPagoApp", this.typeMethodPago);
    this.formReferencia['controls']['referencia'].value ? dataOrdenPost.append("referencia", this.formReferencia['controls']['referencia'].value) : '';
    (this.dataRespPago && this.dataRespPago.data_quote) ? dataOrdenPost.append('dataRespQuoteApp', JSON.stringify(this.dataRespPago.data_quote)) : '';
    if (this.dataPlan['dir_habit'] != undefined && this.dataPlan['dir_habit'] == 'Y') {
      dataOrdenPost.append("hab_country", String(this.formDirHabit['controls']['dir_pais'].value));
      dataOrdenPost.append("hab_state", String(this.formDirHabit['controls']['dir_provincia'].value));
      dataOrdenPost.append("hab_city", String(this.formDirHabit['controls']['dir_ciudad'].value));
      dataOrdenPost.append("hab_postal", String(this.formDirHabit['controls']['dir_cod_post'].value));
      dataOrdenPost.append("hab_address", String(this.formDirHabit['controls']['dir_direcion'].value));
      dataOrdenPost.append("hab_address_alt", String(this.formDirHabit['controls']['dir_direccion_alter'].value));
    }

    this.intento = Number(Number(this.intento) + 1);
    console.log('DATA ENVIO', dataOrden, this.precioTotal);
    return dataOrdenPost;
  }

  async pagoOrden(methodExterno: Boolean = false) {
    this.respPayPal = new Object();
    let dataApiSend: any = this.dataOrdenGen();
    let titleLoading;
    if (this.intento >= 4) {////validacion cada vez que se da click al boton de comprar para limitar la operacion 
      setTimeout(() => {
        this.modalCtrl.dismiss({ emision: 'ERROR', dataApp: dataApiSend, dataQuote: this.dataRespPago, codVoucher: this.codeVouchGenerado });
      }, 500);
      return;
    }

    if (methodExterno == false) {
      titleLoading = this.translate.instant('FORM-PAGO.procesando_emision');
    } else {
      titleLoading = this.translate.instant('FORM-PAGO.generando_orden');
    }

    let loader = await this.loadingCtrl.create({
      message: titleLoading,
      duration: 120000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.postProcesarEmisionApp(dataApiSend)
        .subscribe(
          async (data: any) => {
            loader.dismiss();
            if (data.preOrden && data.preOrden.id && this.idPreOrden != data.preOrden.id) {
              console.log('Se Genera Nueva PreOrden');
              this.idPreOrden = data.preOrden.id;
            }
            if (data && data.data_quote != undefined) {
              console.log('SE CARGA LA RESPUESTA EN LA VARIABLE PARA SER ENVIADO A API');
              this.dataRespPago = data;
            }
            this.codeVouchGenerado = data.code_orden;
            console.log('paso', data, 'codigo orden', this.codeVouchGenerado);
            if (data.STATUS_EMISION && data.STATUS_EMISION == 'ERROR' && this.intento < 3 && this.typeMethodPago == 'PAY_CREDIT_CARD') {////error de proceso de pago 
              if (data.error && data.error.text) {
                this.avisoToast(data.error.text, 'top', 'danger');
              }
              this.elemtFormErrPago((data.error && data.error.elem_app) ? data.error.elem_app : 'PAY_CREDIT_CARD', data);
            }

            /////validacion para el 4to paso 
            if (data.STATUS_EMISION && data.STATUS_EMISION == 'OK') {//////pasa el pago 
              console.log('ORDEN PROCESADA CORRECTAMENTE SE VA AL CUARTO PASO');
              let loader = await this.loadingCtrl.create({
                duration: 10000
              });
              loader.present();
              setTimeout(() => {
                this.modalCtrl.dismiss({ emision: 'OK', dataApp: dataApiSend, dataQuote: this.dataRespPago, codVoucher: this.codeVouchGenerado });
              }, 500);
              return;
            }
            if (data.STATUS_EMISION && data.STATUS_EMISION == 'paypal') {
              let dataPagoPaypal = { emision: 'OK', dataApp: dataApiSend, dataQuote: this.dataRespPago, codVoucher: this.codeVouchGenerado };
              this.avisoAlert(this.translate.instant('FORM-PAGO.porfavor_presiona_paypal'), this.translate.instant('FORM-PAGO.pregenerado_su_orden'));
              setTimeout(() => {
                this.pagoPaypalApp(dataPagoPaypal);
                this.scrollDiv(500, 'USE_PAYPAL');
              }, 1000);
              return;
            }
            if (this.intento >= 3) {
              console.log('INTENTOS AGOTADOS VA AL CUARTO PASO');
              let loader = await this.loadingCtrl.create({
                duration: 10000
              });
              loader.present();
              setTimeout(() => {
                this.modalCtrl.dismiss({ emision: 'ERROR', dataApp: dataApiSend, dataQuote: this.dataRespPago, codVoucher: this.codeVouchGenerado });
              }, 500);
              return;
            }
          },
          (err) => {
            loader.dismiss();
            if (err && err.status == 0) {/////error de internet
              let aviso = this.translate.instant('FORM-PAGO.verif_conexion');
              this.avisoToast(aviso, 'bottom', 'danger');
              this.modalCtrl.dismiss();
            } else {///muestro el error al usuario
              if (err && err.error && err.error[0] && err.error[0].notes) {
                console.log('error al cargar', err, err.error[0].notes);
                this.avisoToast(err.error[0].notes, 'bottom', 'danger');
              } else {
                let avisoErr = this.translate.instant('FORM-PAGO.error_conexion_platf');
                this.avisoToast(avisoErr, 'bottom', 'danger');
                this.modalCtrl.dismiss();
              }
            }
          });
    });
  }

  async avisoAlert(header, message) {
    let aviso = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [{
        text: this.translate.instant('FORM-PAGO.entendido'),
        handler: ((ok) => {
          console.log('entendido');
        })
      }]
    });

    aviso.present();
  }

  elemtFormErrPago(elem, data) {
    console.log('elemento recibido  ', elem, 'data  ', data, 'form card ', this.formPagoTDC);
    if (elem == 'PAY_CREDIT_CARD') {
      this.formPagoTDC['controls']['codigoTarjeta'].setValue('');
      this.formPagoTDC['controls']['nombreTarjeta'].setValue('');
      this.formPagoTDC['controls']['apellidoTarjeta'].setValue('');
      this.formPagoTDC['controls']['CCV'].setValue('');
      this.formPagoTDC['controls']['mesTarjetaVen'].setValue('');
      this.formPagoTDC['controls']['yearTarjetaVen'].setValue('');
    } else if (elem == 'mesTarjetaVen') {
      this.formPagoTDC['controls']['mesTarjetaVen'].setValue('');
      this.formPagoTDC['controls']['yearTarjetaVen'].setValue('');
    } else {
      this.formPagoTDC['controls'][elem].setValue('');
    }
    this.scrollDiv(1000, elem);
  }

  pagoPaypalApp(dataEmision = null) {
    let totalPaypal = this.formatNumberDecimal((this.precioTotal * this.dataPlan.tasa_cambio)).toString();
    this.payPalConfig = {
      currency: this.dataPlan.moneda_paypal ? this.dataPlan.moneda_paypal : 'USD',
      clientId: this.dataMethodPago.CREDENTIAL_PAYPAL.toString(),
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: this.dataPlan.moneda_paypal ? this.dataPlan.moneda_paypal : 'USD',
              value: totalPaypal,
              breakdown: {
                item_total: {
                  currency_code: this.dataPlan.moneda_paypal ? this.dataPlan.moneda_paypal : 'USD',
                  value: totalPaypal
                }
              }
            },
            items: [
              {
                name: this.dataPlan.name_plan,
                quantity: '1',
                description: this.codeVouchGenerado ? this.codeVouchGenerado : '',
                unit_amount: {
                  currency_code: this.dataPlan.moneda_paypal ? this.dataPlan.moneda_paypal : 'USD',
                  value: totalPaypal,
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        this.loadingPaypal();
        this.respPayPal.proccess_paypal = {
          orderID: data.orderID,
          payerID: data.payerID,
          facilitatorAccessToken: data['facilitatorAccessToken']
        }
        console.log('onApprove: la transacción se aprobó, pero no se autorizó', data, actions);


        actions.order.get().then((details) => {
          this.respPayPal.details_paypal = {
            create_time: details.create_time,
            id: details.id,
            intent: details.intent,
            status: details.status,
            payer: details.payer,
            purchase_units: details.purchase_units,
            links: details.links
          }
          console.log('onApprove: puede obtener todos los detalles del pedido en onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization: probablemente debería informar a su servidor sobre la transacción completada en este momento', data);
        this.showSuccess = true;
        this.payPalConfig = null;
        this.loadingPaypal(true);
        this.respPayPal.transaction_complete_paypal = {
          create_time: data.create_time,
          update_time: data.update_time,
          id: data.id,
          intent: data.intent,
          status: data.status,
          payer: data.payer,
          purchase_units: data['purchase_units'],
          links: data.links
        }
        console.log('data Resp Pago', this.respPayPal, '         intento : ', this.intento);

        if (this.respPayPal.details_paypal.status.toUpperCase() == "APPROVED" && this.respPayPal.transaction_complete_paypal.status.toUpperCase() == "COMPLETED") {
          this.avisoToast(this.translate.instant('FORM-PAGO.pago_exitoso'), "top", "success");
        } else {
          this.avisoToast(this.translate.instant('FORM-PAGO.pago_no_exitoso'), "bottom", "danger");
        }
        this.UpdateOrderPaypalApp(dataEmision, this.respPayPal);
      },
      onCancel: (data, actions) => {
        this.payPalConfig = null;
        this.avisoToast(this.translate.instant('FORM-PAGO.pago_paypal_cancelado'), "bottom", "danger");
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        this.payPalConfig = null;
        this.avisoToast(this.translate.instant('FORM-PAGO.error_al_utilizar_paypal'), "bottom", "danger");
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
    if (this.payPalConfig) {
      console.log('cargopaypal');
      //this.payPalConfig.onClick(this.payPalConfig);
    }
  }

  async UpdateOrderPaypalApp(dataEmision, respPayPal) {
    console.log('se actualiza estus de la orden y se guarda el log de paypal ', dataEmision);

    let data = new FormData();
    data.append('prefix', localStorage.getItem('pref'));
    data.append('resp_paypal', JSON.stringify(respPayPal));
    data.append('dataEmisionApp', JSON.stringify(dataEmision));

    let loading = await this.loadingCtrl.create({
      message: this.translate.instant('FORM-PAGO.conectando_plataforma_estatus'),
      duration: 50000
    });

    loading.present().then(() => {
      this.ilsAdminProvider.postUpdateOrderPaypalApp(localStorage.getItem('pref'), data)
        .subscribe((data) => {
          loading.dismiss();
          console.log('exito actualizacion status orden con paypal', data);
          if (respPayPal.details_paypal.status.toUpperCase() == "APPROVED") {
            dataEmision.emision = 'OK';
            setTimeout(() => {
              this.modalCtrl.dismiss(dataEmision);
            }, 500);
          } else {
            dataEmision.emision = 'ERROR';
            this.funcIntentoAcabados(dataEmision, 'ERROR');
          }
        }, (err) => {
          loading.dismiss();
          console.log('err actualizacion de status con pago paypal ', err);
          setTimeout(() => {
            this.modalCtrl.dismiss(dataEmision);
          }, 500);
        });
    });
  }

  funcIntentoAcabados(dataEmision, status: string = 'ERROR') {
    if (this.intento >= 3) {
      console.log('INTENTOS AGOTADOS VA AL CUARTO PASO');
      dataEmision.emision = status;

      setTimeout(() => {
        this.modalCtrl.dismiss(dataEmision);
      }, 500);
    }
  }

  async loadingPaypal(stop = false) {
    if (stop == false) {
      var loading = await this.loadingCtrl.create({
        message: this.translate.instant('FORM-PAGO.validando_pago_paypal'),
        duration: 50000
      });
      loading.present();
    } if (stop == true) {
      this.loadingCtrl.dismiss();
    }
  }

  async funStatesHab() {
    this.estados = null;
    this.ciudades = null;
    this.formDirHabit['controls']['dir_provincia'].setValue('');
    this.formDirHabit['controls']['dir_ciudad'].setValue('');
    let pais = this.formDirHabit['controls']['dir_pais'].value;
    let loading = await this.loadingCtrl.create({
      duration: 15000
    });

    loading.present().then((data) => {
      this.ilsAdminProvider.getStatesApp(pais)
        .subscribe((data: any) => {
          console.log('data states ', data);
          loading.dismiss();
          if (data[0].notes) {
            this.avisoToast(data[0].notes, 'bottom', 'danger');
          } else {
            this.estados = data;
          }
        },
          (err) => {
            loading.dismiss();
          });
    });
  }

  async funCitiesHab() {
    this.ciudades = null;
    this.formDirHabit['controls']['dir_ciudad'].setValue('');
    let estado = this.formDirHabit['controls']['dir_provincia'].value;
    console.log(estado);
    let loading = await this.loadingCtrl.create({
      duration: 15000
    });

    loading.present().then((data) => {
      this.ilsAdminProvider.getCityApp(estado)
        .subscribe((data: any) => {
          console.log('data cities ', data);
          loading.dismiss();
          if (data[0].notes) {
            this.avisoToast(data[0].notes, 'bottom', 'danger');
          } else {
            this.ciudades = data;
          }
        },
          (err) => {
            loading.dismiss();
          });
    });
  }

  async funStates() {
    this.statesTDC = null;
    this.citiesTDC = null;
    this.formPagoTDC['controls']['estadoTDC'].setValue('');
    this.formPagoTDC['controls']['ciudadTDC'].setValue('');
    let pais = this.formPagoTDC['controls']['paisTDC'].value;
    let loading = await this.loadingCtrl.create({
      duration: 15000
    });

    loading.present().then((data) => {
      this.ilsAdminProvider.getStatesApp(pais)
        .subscribe((data: any) => {
          console.log('data states ', data);
          loading.dismiss();
          if (data[0].notes) {
            this.avisoToast(data[0].notes, 'bottom', 'danger');
          } else {
            this.statesTDC = data;
          }
        },
          (err) => {
            loading.dismiss();
          });
    });
  }

  async funCities() {
    this.citiesTDC = null;
    this.formPagoTDC['controls']['ciudadTDC'].setValue('');
    let estado = this.formPagoTDC['controls']['estadoTDC'].value;
    let loading = await this.loadingCtrl.create({
      duration: 15000
    });

    loading.present().then((data) => {
      this.ilsAdminProvider.getCityApp(estado)
        .subscribe((data: any) => {
          console.log('data cities ', data);
          loading.dismiss();
          if (data[0].notes) {
            this.avisoToast(data[0].notes, 'bottom', 'danger');
          } else {
            this.citiesTDC = data;
          }
        },
          (err) => {
            loading.dismiss();
          });
    });
  }

  ngOnDestroy() {
    console.log('Destruyo form pago');
  }

}
