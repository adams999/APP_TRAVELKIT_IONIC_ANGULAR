import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, LoadingController, PopoverController, AlertController, ToastController } from '@ionic/angular';
import { IlsadminService } from '../providers/ilsadmin.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Countries } from '../providers/countries';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { GestorFiles } from '../providers/gestorFiles';
import { PopoverTelSmsComponent } from '../popover-tel-sms/popover-tel-sms.component';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-info-emision',
  templateUrl: './info-emision.page.html',
  styleUrls: ['./info-emision.page.scss'],
})
export class InfoEmisionPage implements OnInit, OnDestroy {

  public activo = "#229954";
  public pagoPendCDA = "#E9E600";
  public activoEspirado = "#49D6CF";
  public invalido = "#BCBCBC";
  public anulado = "#F10300";
  public pagoPendTDC = "#A900B6";
  public prueba = "#FF8403";
  public COLOR_MENU_BACKEND;
  public color_menu_barra_hover;
  public dataInfoEmision;
  public logo;
  public dataOrden;
  public paises: any;
  public dataSocial;
  public whatsapp: boolean = false;
  public urlCondicionado;
  public linkVoucher;
  public dataTextTelef;
  public urlPlatform;
  public opciones;
  public masOpciones;
  public agregarEvento = false;

  constructor(public navCtrl: NavController,
    public activatedRoute: ActivatedRoute,
    public ilsAdminProvider: IlsadminService,
    public modalCtrl: ModalController,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public router: Router,
    public countries: Countries,
    public popoverCtrl: PopoverController,
    public socialSharing: SocialSharing,
    private gestorFiles: GestorFiles,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public inAppBrowser: InAppBrowser) {
    this.loadingCtrl.dismiss();
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.color_menu_barra_hover = localStorage.getItem('color_menu_barra_hover');
    this.logo = localStorage.getItem("logo");
    this.urlPlatform = localStorage.getItem('urlPlatform');
    this.dataInfoEmision = JSON.parse(activatedRoute.snapshot.paramMap.get('data')).data;
    console.log('data pasada Info ', this.dataInfoEmision, 'Codigo voucher pasado ', this.dataInfoEmision.codVoucher);
    this.linkVoucher = localStorage.getItem('web') + "/print/";
    this.verificaWhatsapp();
  }

  ngOnInit() {
    this.infoVoucher(this.dataInfoEmision.codVoucher);
  }

  infoSocialSharningParam() {
    this.ilsAdminProvider.getInfoSocialsPlatform(localStorage.getItem('pref'))
      .subscribe(
        (data: any) => {
          if (data[0] && data[0].notes) {
          } else {
            console.log('social', data);
            this.dataSocial = data;
          }
        }, (err) => {

        });
  }

  getCondicionados() {
    this.ilsAdminProvider.getCondicionadosApp(localStorage.getItem('pref'))
      .subscribe(
        (data) => {
          if (!data[0].notes) {
            console.log('Condicionado url', data)
            this.urlCondicionado = data;
          }
        }, (err) => {

        }
      )
  }

  enviarEmailNativ(email) {
    this.socialSharing.canShareViaEmail()
      .then((data) => {
        console.log('si se puede enviar');
        this.socialSharing.shareViaEmail('', '', [email])
          .then((ok) => {
            console.log('correo enviado');
          }).catch((err) => {
            console.log('error al enviar el correo');
          })
      }).catch((er) => {
        console.log('No se puede enviar el correo');
      })
  }

  verificaWhatsapp() {
    this.socialSharing.canShareVia('whatsapp')
      .then((a) => {
        this.whatsapp = true;
        console.log('si tiene whatsapp instalado');
      })
      .catch((e) => {
        console.log('no tiene whatsapp instalado');
      });
  }

  infoTexttelef() {
    this.ilsAdminProvider.getinfoTextTelef(localStorage.getItem('pref'))
      .subscribe(
        (data) => {
          if (!data[0].notes) {
            console.log('data Text Teelf', data);
            this.dataTextTelef = data[0];
          }
        }, (err) => {

        });
  }

  async infoVoucher(codigo) {
    let loader = await this.loadingCtrl.create({
      duration: 120000
    });

    this.infoSocialSharningParam();
    this.getCondicionados();
    this.infoTexttelef();

    loader.present().then(() => {
      this.ilsAdminProvider.getOrders(localStorage.getItem('pref'), 0, 1, codigo, '', '', localStorage.getItem('userType'), '', '', '')
        .subscribe(
          (data: any) => {
            loader.dismiss();
            if (!data[0].notes) {
              console.log('data de Orden', data);
              this.dataOrden = data[0];
              this.paises = this.countries.getCountries();
              for (let i = 0; i < this.paises.length; i++) {
                if (this.dataOrden['origen'].toUpperCase() == this.paises[i].iso_country) {
                  this.dataOrden['origen'] = this.paises[i].description;
                } else {
                  if (this.dataOrden['origen'].toUpperCase() == 'XX' || this.dataOrden['origen'] == '1') {
                    this.dataOrden['origen'] = this.translate.instant('DETALLEORDEN.mundial');
                  } else if (this.dataOrden['origen'] == '2') {
                    this.dataOrden['origen'] = this.translate.instant('DETALLEORDEN.europa');
                  } else if (this.dataOrden['origen'] == '9') {
                    this.dataOrden['origen'] = this.translate.instant('DETALLEORDEN.local');
                  }
                }

                if (this.dataOrden['destino'].toUpperCase() == this.paises[i].iso_country) {
                  this.dataOrden['destino'] = this.paises[i].description;
                } else {
                  if (this.dataOrden['destino'].toUpperCase() == 'XX' || this.dataOrden['destino'] == '1') {
                    this.dataOrden['destino'] = this.translate.instant('DETALLEORDEN.mundial');
                  } else if (this.dataOrden['destino'] == '2') {
                    this.dataOrden['destino'] = this.translate.instant('DETALLEORDEN.europa');
                  } else if (this.dataOrden['destino'] == '9') {
                    this.dataOrden['destino'] = this.translate.instant('DETALLEORDEN.local');
                  }
                }
              }
            } else {
              this.router.navigate(['detalleorden']);
            }
            loader.dismiss();
          }, (err) => {
            loader.dismiss();
          })
    });
  }

  async verCondicionesPDF() {
    let loader = await this.loadingCtrl.create({
      duration: 120000
    });

    await loader.present();
    let nombrePDF = this.translate.instant('INFO-EMISION.condiciones') + localStorage.getItem('pref');

    this.gestorFiles.verPDFDownApp(this.urlCondicionado, nombrePDF)
      .then((data) => {
        console.log(data);
        loader.dismiss();
      }).catch((err) => {
        console.log(err);
        loader.dismiss();
      });
  }

  irAtras() {
    if (this.dataOrden && this.dataOrden.status == 1) {
      let dataEmail = new FormData();
      dataEmail.append("id_orden", this.dataOrden.id);
      dataEmail.append("email", this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['email']);
      dataEmail.append("prefix", localStorage.getItem('pref'));

      let dataSms = new FormData();
      dataSms.append("codPhone", this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['codigoTelfono'] ? this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['codigoTelfono'] : '+58');
      dataSms.append("numPhone", this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['telefono']);
      dataSms.append("prefix", localStorage.getItem('pref'));
      dataSms.append("code", this.dataOrden.codigo);
      dataSms.append("name", this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['nombre'] ? this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['nombre'] : '');
      dataSms.append("linkVoucher", this.linkVoucher + this.dataOrden.codigo);
      dataSms.append("salida", this.dataOrden.fsalida);
      dataSms.append("nomClient", localStorage.getItem('nomClient'));

      this.ilsAdminProvider.sendVouchEmail(dataEmail)
        .subscribe(
          (data) => {
            console.log('enviado mail', data);
          }, (err) => {

          });

      this.ilsAdminProvider.sendSms(dataSms)
        .subscribe(
          (data) => {
            console.log('enviado sms', data);
          },
          (err) => {
            console.log(err);
          }
        );

      if (this.agregarEvento) {
        this.ilsAdminProvider.getGuardarOrdenEventsApp(localStorage.getItem('pref'), this.dataOrden.id, 1, 2, 1, this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['codigoTelfono'] + this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['telefono'])
          .subscribe(
            (data) => {
              console.log('agregado evento', data);
            }, (err) => {

            }
          );
      }
    }

    this.router.navigate(['list-orders']);
  }

  async enviarEmailVoucher(idVouch, email) {
    let data = new FormData();
    data.append("id_orden", idVouch);
    data.append("email", email);
    data.append("prefix", localStorage.getItem('pref'));

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
          placeholder: Placeholder,
          value: this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['email'] ? this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['email'] : ''
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

  async enviarSms(codigo, event, salida) {
    console.log(codigo, salida);

    let popover = await this.popoverCtrl.create(
      {
        component: PopoverTelSmsComponent,
        translucent: true,
        componentProps: {
          codigo: codigo,
          codigoTelef: this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['codigoTelfono'] ? this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['codigoTelfono'] : '',
          dataTelef: this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['telefono'] ? this.dataInfoEmision.dataQuote.dataPreOrden.pasajeros[0]['telefono'] : ''
        }
      }
    );

    popover.onDidDismiss()
      .then((data => {
        if (data.data.cod != null && data.data.tel != null) {
          console.log('se envia el sms')
          this.enviarLinkSms(data.data.cod, data.data.tel, localStorage.getItem('pref'), codigo, '', this.linkVoucher, salida);
          console.log(data);
        }
      }))
      .catch((err) => {
        console.log('No se paso parametro');
      })

    return await popover.present();
  }

  validarEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email);
  }

  validarNumber(number) {
    return /^[0-9+-]{10,20}$/.test(number);
  }

  async enviarLinkSms(codPhone, numPhone, prefix, code, name, linkVoucher, salida) {

    let data = new FormData();
    data.append("codPhone", codPhone ? codPhone : '+58');
    data.append("numPhone", numPhone);
    data.append("prefix", localStorage.getItem('pref'));
    data.append("code", code);
    data.append("name", name ? name : '');
    data.append("linkVoucher", linkVoucher + code);
    data.append("salida", salida);
    data.append("nomClient", localStorage.getItem('nomClient'));

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

  funHiddenDiv(elemento) {
    if (this.opciones) {
      this.opciones = false;
    } else {
      this.opciones = 'opciones';
      this.scrollDiv(500, elemento);
    }
  }

  funHiddenDivMasOpc(elemento) {
    if (this.masOpciones) {
      this.masOpciones = false;
    } else {
      this.masOpciones = 'masOpciones';
      this.scrollDiv(500, elemento);
    }
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

  navegadorApp() {
    let options: InAppBrowserOptions = {
      toolbarcolor: localStorage.getItem('COLOR_MENU_BACKEND'),
      navigationbuttoncolor: '#ffffff',
      closebuttoncolor: '#ffffff'
    }

    this.inAppBrowser.create(localStorage.getItem('web'), '_self', options);
  }

  ngOnDestroy() {
    console.log('destruye info emision');
  }

}
