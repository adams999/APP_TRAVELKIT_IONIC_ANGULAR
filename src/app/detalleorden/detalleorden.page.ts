import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, PopoverController, ToastController, AlertController } from '@ionic/angular';
import { IlsadminService } from '../providers/ilsadmin.service';
import { Countries } from '../providers/countries';
import { PopoverTelSmsComponent } from '../popover-tel-sms/popover-tel-sms.component';
import { PopoverDescripcionComponent } from '../popover-descripcion/popover-descripcion.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TranslateService } from '@ngx-translate/core';
import { GestorFiles } from '../providers/gestorFiles';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-detalleorden',
  templateUrl: './detalleorden.page.html',
  styleUrls: ['./detalleorden.page.scss'],
})
export class DetalleordenPage implements OnInit, OnDestroy {

  public activo = "#229954";
  public pagoPendCDA = "#E9E600";
  public activoEspirado = "#49D6CF";
  public invalido = "#BCBCBC";
  public anulado = "#F10300";
  public pagoPendTDC = "#A900B6";
  public prueba = "#FF8403";
  public arrOrden = [];
  public orden: any = {};
  public pref;
  public paises;
  public nomPais;
  public descPlan;
  public COLOR_MENU_BACKEND;
  public logo;
  public linkVoucher;
  public nomClient;
  public paramPlatform;
  public whatsapp: boolean = false;
  public color_menu_barra_hover;
  public userType;
  public statusEdit;
  public emisionVigente: boolean = false;

  constructor(public navCtrl: NavController,
    public ilsAdminProvider: IlsadminService,
    public countries: Countries,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public activatedRoute: ActivatedRoute,
    public socialSharing: SocialSharing,
    public translate: TranslateService,
    private gestorFiles: GestorFiles,
    public router: Router) {
    this.arrOrden = JSON.parse(this.activatedRoute.snapshot.paramMap.get('params'));
    this.paramPlatform = JSON.parse(this.activatedRoute.snapshot.paramMap.get('agencyPre'));
    this.userType = localStorage.getItem('userType');
    if (this.arrOrden['telefono_contacto'].indexOf('+') < 0) {
      this.arrOrden['telefono_contacto'] = '+' + this.arrOrden['telefono_contacto'];
    }

    for (let i = 0; i < this.arrOrden['beneficiaries'].length; i++) {
      if (this.arrOrden['beneficiaries'][i].telefono && this.arrOrden['beneficiaries'][i].telefono.indexOf('+') < 0) {
        this.arrOrden['beneficiaries'][i].telefono = '+' + this.arrOrden['beneficiaries'][i].telefono;
      }
    }
    //console.log(this.arrOrden, this.paramPlatform);

    this.pref = localStorage.getItem('pref');
    this.logo = localStorage.getItem("logo");
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.color_menu_barra_hover = localStorage.getItem('color_menu_barra_hover');
    this.linkVoucher = localStorage.getItem('web') + "/print/";
    this.nomClient = localStorage.getItem('nomClient');
    console.log(this.arrOrden, this.emisionVigente);

    this.verificaEmisionVigente();
  }

  verificaEmisionVigente() {
    let fechaSalida = moment(this.arrOrden['fsalida'], 'DD-MM-YYYY');
    if (this.userType == 1) {
      console.log('usuario master');
      if (this.arrOrden['period_grace'] && this.arrOrden['period_grace'] != null && this.arrOrden['period_grace'] != '') {
        fechaSalida = fechaSalida.add(this.arrOrden['period_grace'], 'days');
        let fechaAux = moment().add(this.arrOrden['period_grace'], 'days');
        console.log('se agrega ' + this.arrOrden['period_grace'] + ' dias a la fecha de salida     ', fechaSalida.format('YYYY-MM-DD'), ' fecha comparacion ', fechaAux.format('YYYY-MM-DD'), ' ', fechaSalida.diff(fechaAux.format('YYYY-MM-DD'), 'days'));
        if ((Number(fechaSalida.diff(fechaAux.format('YYYY-MM-DD'), 'days')) <= (-this.arrOrden['period_grace']))) {
          this.emisionVigente = true;
          console.log('emision en vigencia');
        }
      }
    } else {
      console.log(fechaSalida, fechaSalida.diff(moment().format('YYYY-MM-DD'), 'days'));
      if (fechaSalida.diff(moment().format('YYYY-MM-DD'), 'days') <= 0) {
        this.emisionVigente = true;
        console.log('emision en vigencia');
      }
    }
  }

  ngOnInit() {
    this.ionViewDidLoad();
    this.verificaWhatsapp();
  }

  ngOnDestroy() {
    console.log('destruye detalle orden');
  }

  verificaWhatsapp() {
    //verificar si tiene whatsapp instalado
    this.socialSharing.canShareVia('whatsapp')
      .then((a) => {
        this.whatsapp = true;
        console.log('si tiene whatsapp instalado');
      })
      .catch((e) => {
        console.log('no tiene whatsapp instalado');
      });
  }

  ionViewDidLoad() {

    this.paises = this.countries.getCountries();
    this.orden = this.arrOrden;
    for (let i = 0; i < this.paises.length; i++) {
      if (this.arrOrden['origen'].toUpperCase() == this.paises[i].iso_country) {
        this.nomPais = this.paises[i].description;
        //console.log('pais', this.nomPais);
      } if (this.arrOrden['destino'].toUpperCase() == this.paises[i].iso_country) {
        this.arrOrden['destino'] = this.paises[i].description;
      }
    };

    console.log('ionViewDidLoad GetOrdersPage');
  }

  enviarCorreo(idVouch, codVouch) {
    console.log(idVouch);
    let title = this.translate.instant('LIST-ORDERS.enviar_voucher') + codVouch;
    let message = this.translate.instant('LIST-ORDERS.ing_corr_orden');
    let type = "email";
    let Placeholder = this.translate.instant('LIST-ORDERS.ing_correo');
    this.alertInput(title, message, type, Placeholder, '', '', idVouch, '');
  }

  async enviarSms(codVouch, $event, salida) {
    console.log(codVouch, $event);
    const popover = await this.popoverCtrl.create({
      component: PopoverTelSmsComponent,
      event: event,
      translucent: true,
      componentProps: { codigo: codVouch }
    });

    popover.onDidDismiss()
      .then((data) => {
        console.log('se envia el sms')
        if (data.data.cod != null && data.data.tel != null) {

          this.enviarLinkSms(data.data.cod, data.data.tel, this.pref, codVouch, '', this.linkVoucher, salida);
          console.log(data);
        }
      })
      .catch((err) => console.log('no se paso datos'));

    return await popover.present();
  }

  enviarCorreoPasj(corrPasaj, nomPasaj, idVouch, codVouch) {
    console.log(corrPasaj, nomPasaj);
    let title = this.translate.instant('DETALLEORDEN.env_ord_correo') + codVouch + this.translate.instant('DETALLEORDEN.via_correo');
    let message = this.translate.instant('DETALLEORDEN.desea_enviar_ord') + codVouch + this.translate.instant('DETALLEORDEN.al_pasajero') + nomPasaj + this.translate.instant('DETALLEORDEN.br_correo') + corrPasaj;
    this.alertaConfirmar(title, message, '', corrPasaj, nomPasaj, '', idVouch, '');
  }

  enviarSmsPasj(telefPasaj, nomPasaj, codVouch, salida) {
    console.log(telefPasaj, nomPasaj, codVouch);
    let title = this.translate.instant('DETALLEORDEN.enviar_sms_pasaj') + codVouch + this.translate.instant('DETALLEORDEN.via_sms');
    let message = this.translate.instant('DETALLEORDEN.desea_enviar_sms') + nomPasaj + this.translate.instant('DETALLEORDEN.br_telefono') + telefPasaj;
    this.alertaConfirmar(title, message, telefPasaj, '', nomPasaj, codVouch, '', salida);
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
          text: this.translate.instant('DETALLEORDEN.cancelar'),
          role: 'Cancelar',
          handler: data => {
            console.log('Cancelar');
          }
        },
        {
          text: this.translate.instant('DETALLEORDEN.enviar'),
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
          () => {//Si recibe un estatus 200 o OK por parte del servidor 
            let respEmail = '200';
            console.log(respEmail);
            this.toastAviso(respEmail, '');
            loader.dismiss();
          },
          (err) => {
            console.log(err);
            loader.dismiss();
          }
        );
    });
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

  async alertaConfirmar(title, messaje, telefPasaj, corrPasaj, nomPasaj, codVouch, idVouch, salida) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: messaje,
      cssClass: 'titleAlert',
      buttons: [
        {
          text: this.translate.instant('DETALLEORDEN.cancelar'),
          role: 'Cancelar',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: this.translate.instant('DETALLEORDEN.enviar'),
          handler: () => {
            if (telefPasaj) {
              let codPhone = telefPasaj.split('-')[0];
              telefPasaj = telefPasaj.substr(codPhone.length, 20);//aqui capturo el prefigo que aroja la api
              telefPasaj = telefPasaj.split('-').join('')//aqui capturo todo el numero de telefono sin guiones despues del prefijo
              this.enviarLinkSms(codPhone, telefPasaj, '', codVouch, nomPasaj, this.linkVoucher, salida);
            }
            else if (idVouch) {
              this.enviarEmailVoucher(idVouch, corrPasaj);
            }
            console.log('Enviar');
          }
        }
      ]
    });
    alert.present();
  }

  async verPlan($event, idPlan) {
    console.log(idPlan);

    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('DETALLEORDEN.cargando_det_plan'),
      duration: 40000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.getPlan(idPlan, this.pref)
        .subscribe(
          (data) => {
            this.descPlan = data;
            let navbarTitle = this.translate.instant('DETALLEORDEN.detalle_plan');
            this.popoverDescripcion($event, this.descPlan, navbarTitle, 'plan');
            console.log(this.descPlan);
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

  async verVendedor($event, idVendedor) {
    console.log(idVendedor);

    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('DETALLEORDEN.carg_det_vendedor'),
      duration: 40000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.getVendedor(idVendedor, this.pref)
        .subscribe(
          (data) => {
            this.descPlan = data;
            let navbarTitle = this.translate.instant('DETALLEORDEN.detalle_vendedor');
            this.popoverDescripcion($event, this.descPlan, navbarTitle, 'vendedor');
            console.log(this.descPlan);
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

  async popoverDescripcion($event, descPlan, navbarTitle, type) {
    let popoverDescripcion = await this.popoverCtrl.create({
      component: PopoverDescripcionComponent,
      translucent: true,
      componentProps: { parametros: { 0: descPlan[0], type: type }, navbarTitle: navbarTitle }
    });

    return await popoverDescripcion.present();
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

  async alertConfirm(statusNew) {
    console.log(statusNew);
    if (statusNew == 'NC') {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('DETALLEORDEN.anul_vou_nc_c'),
        subHeader: this.translate.instant('DETALLEORDEN.atencion_nc'),
        message: this.translate.instant('DETALLEORDEN.confirm_modif_orden') + this.orden.codigo + ' ' + this.translate.instant('DETALLEORDEN.precio') + ' ' + this.orden.total,
        inputs: [
          {
            name: 'cupon',
            type: 'text',
            placeholder: this.translate.instant('DETALLEORDEN.cupon_opcional')
          }
        ],
        backdropDismiss: false,
        buttons: [{
          text: this.translate.instant('DETALLEORDEN.no'),
          handler: ((data) => {
            this.statusEdit = null;
          })
        },
        {
          text: this.translate.instant('DETALLEORDEN.si'),
          handler: ((data) => {
            this.updateOrden(statusNew, data.cupon);
          })
        }]
      });

      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        subHeader: this.translate.instant('DETALLEORDEN.confirm_modif_orden') + this.orden.codigo + '?',
        backdropDismiss: false,
        buttons: [{
          text: this.translate.instant('DETALLEORDEN.no'),
          handler: ((data) => {
            this.statusEdit = null;
          })
        },
        {
          text: this.translate.instant('DETALLEORDEN.si'),
          handler: ((a) => {
            this.updateOrden(statusNew);
          })
        }]
      });

      await alert.present();
    }

  }

  async updateOrden(statusNew, cupon = '') {
    this.statusEdit = statusNew;
    let data = new FormData();
    data.append('idOrden', this.orden['id']);
    data.append('statusNew', this.statusEdit);
    cupon != '' ? data.append('cupon', cupon) : '';

    let loading = await this.loadingCtrl.create({
      duration: 30000
    });

    loading.present().then(() => {
      this.ilsAdminProvider.postUpdateOrden(localStorage.getItem('pref'), data)
        .subscribe(
          async (data: any) => {
            console.log(data);
            if (data && data[0] && data[0].notes) {
              let toast = await this.toastCtrl.create({
                message: data[0].notes,
                position: 'bottom',
                color: 'danger',
                duration: 2000
              });
              toast.present();
              this.statusEdit = null;
            }

            if (data.status == 'OK') {
              setTimeout(async () => {
                this.router.navigate(['/list-orders']);
                this.ilsAdminProvider.eventGeneral('list-orders-refresh');
                loading.dismiss();
                let toast = await this.toastCtrl.create({
                  message: this.translate.instant('DETALLEORDEN.orden_modificada'),
                  position: 'top',
                  color: 'success',
                  duration: 2000
                });
                toast.present();
                this.statusEdit = null;
              }, 1000);
            } else {
              loading.dismiss();
              this.statusEdit = null;
            }
          },
          (err) => {
            console.log(err);
            loading.dismiss();
            this.statusEdit = null;
          }
        );
    });

  }

  irAtras() {
    this.navCtrl.pop();
  }

  async descargaVerPDF(codigo, event) {

    let loader = await this.loadingCtrl.create({
      duration: 120000
    });
    await loader.present();

    this.gestorFiles.verPDFDownApp(this.linkVoucher + codigo, codigo)
      .then((data) => {
        console.log(data);
        loader.dismiss();
      }).catch((err) => {
        console.log(err);
        loader.dismiss();
      });
  }

}
