import { Component, OnInit, OnDestroy } from '@angular/core';
import { Countries } from '../providers/countries';
import { IlsadminService } from '../providers/ilsadmin.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ToastController, NavController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit, OnDestroy {

  public session;
  public COLOR_MENU_BACKEND;
  public pref;
  public nomPlatf;
  public nomClient;
  public logo;
  public imgPlatf;
  public colorsPlatf;
  public userType;
  public datosAgente;
  public datosPlatf;
  public datosUser;
  public paisAgencia;
  public webAgencia;
  public whatsapp: boolean = false;
  public localParamAgenMaster;
  public agencia;
  public nivelAgency;
  public agenciaMaster: boolean = false;
  public titulo;

  constructor(public navCtrl: NavController,
    public toastController: ToastController,
    public ilsAdminProvider: IlsadminService,
    public countries: Countries,
    public inAppBrowser: InAppBrowser,
    public socialSharing: SocialSharing,
    public translate: TranslateService,
    public activatedRoute: ActivatedRoute) {
    this.titulo = this.activatedRoute.snapshot.paramMap.get('titulo');
    this.webAgencia = localStorage.getItem('web');
    this.pref = localStorage.getItem('pref');
    this.localParamAgenMaster = localStorage.getItem('paramAgency');
    if (localStorage.getItem('agency') == localStorage.getItem('agencyMaster')) {
      this.agenciaMaster = true;
    }
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.session = localStorage.getItem('pref');
    this.nomPlatf = localStorage.getItem('nomPlatf');
    this.imgPlatf = 'https://ilsadmin.com/app/upload_files/logo_clientes/' + localStorage.getItem('imgPlatf');
    this.colorsPlatf = JSON.parse(localStorage.getItem('colorsPlatf'));
    this.nomClient = localStorage.getItem('nomClient');
    this.logo = localStorage.getItem("logo");
    this.userType = localStorage.getItem('userType');
    this.agencia = localStorage.getItem('agency');
    let aux: any = localStorage.getItem('nivelAgency');
    if (!isNaN(aux)) {
      this.nivelAgency = localStorage.getItem('nivelAgency');
    };
    console.log(this.colorsPlatf, this.nivelAgency, this.titulo);
  }

  ngOnInit() {
    this.verificaWhatsapp();
    this.ionViewDidLoad();
    if (!this.userType) {
      this.ilsAdminProvider.postInformAgency(this.paramPost())
        .subscribe(
          (data) => {
            this.datosPlatf = data;
            let paises = this.countries.getCountries();
            for (let i = 0; i < paises.length; i++) {
              if (paises[i].iso_country == this.datosPlatf[2].id_country) {
                this.paisAgencia = paises[i].description;
                console.log('pais', this.paisAgencia);
              }
            }
            //valida si no tiene signo + para los numeros de telefono los asignara
            if (this.datosPlatf[2].phone1.indexOf('+') < 0) {
              this.datosPlatf[2].phone1 = '+' + this.datosPlatf[2].phone1;
            } if (this.datosPlatf[2].phone2.indexOf('+') < 0) {
              this.datosPlatf[2].phone2 = '+' + this.datosPlatf[2].phone2;
            } if (this.datosPlatf[2].phone3.indexOf('+') < 0) {
              this.datosPlatf[2].phone3 = '+' + this.datosPlatf[2].phone3;
            } if (this.datosPlatf[2].phone4.indexOf('+') < 0) {
              this.datosPlatf[2].phone4 = '+' + this.datosPlatf[2].phone4;
            } if (this.datosPlatf[1].parameter_value.indexOf('+') < 0) {
              this.datosPlatf[1].parameter_value = '+' + this.datosPlatf[1].parameter_value;
            }
            console.log(this.datosPlatf);
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  ngOnDestroy() {

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

  arribaRefresh(event) {
    setTimeout(() => {
      event.target.complete(this.ngOnInit());
      this.datosAgente = null;
      this.datosUser = null;
      this.datosPlatf = null;
    }, 1500);
  }

  paramPost() {
    let datos = new FormData();
    datos.append("prefix", this.pref);
    return datos;
  }

  ionViewDidLoad() {
    if (localStorage.getItem('userType')) {
      this.ilsAdminProvider.getDatosUser(this.pref, localStorage.getItem('id_user'))
        .subscribe((data) => {
          this.datosUser = data[0];
          if (this.datosUser.code_phone) {
            this.datosUser.phone = this.datosUser.code_phone + '-' + this.datosUser.phone
          }
          console.log(this.datosUser);
        }, (err) => {

        });
      this.ilsAdminProvider.postInformAgency(this.paramPost())
        .subscribe(
          (data) => {
            this.datosPlatf = data;
            let paises = this.countries.getCountries();
            for (let i = 0; i < paises.length; i++) {
              if (paises[i].iso_country == this.datosPlatf[2].id_country) {
                this.paisAgencia = paises[i].description;
                console.log('pais', this.paisAgencia);
              }
            }
            //valida si no tiene signo + para los numeros de telefono los asignara
            if (this.datosPlatf[2].phone1.indexOf('+') < 0) {
              this.datosPlatf[2].phone1 = '+' + this.datosPlatf[2].phone1;
            } if (this.datosPlatf[2].phone2.indexOf('+') < 0) {
              this.datosPlatf[2].phone2 = '+' + this.datosPlatf[2].phone2;
            } if (this.datosPlatf[2].phone3.indexOf('+') < 0) {
              this.datosPlatf[2].phone3 = '+' + this.datosPlatf[2].phone3;
            } if (this.datosPlatf[2].phone4.indexOf('+') < 0) {
              this.datosPlatf[2].phone4 = '+' + this.datosPlatf[2].phone4;
            } if (this.datosPlatf[1].parameter_value.indexOf('+') < 0) {
              this.datosPlatf[1].parameter_value = '+' + this.datosPlatf[1].parameter_value;
            }
            console.log(this.datosPlatf);
          },
          (err) => {
            console.log(err);
          }
        );
    }

    if (localStorage.getItem('userType') == '2' || localStorage.getItem('userType') == '5' && localStorage.getItem('agency') != 'N/A' && localStorage.getItem('agency') != null) {
      this.ilsAdminProvider.getParamAgencyMaster(this.pref, localStorage.getItem('id_user'), localStorage.getItem('agency'))
        .subscribe((data) => {
          console.log('agente', data);
          this.datosAgente = data;
        }, (err) => {

        });
    }
  }

  navegadorSitioAgencia(link, event) {
    let options: InAppBrowserOptions = {
      toolbarcolor: localStorage.getItem('COLOR_MENU_BACKEND'),
      navigationbuttoncolor: '#ffffff',
      closebuttoncolor: '#ffffff'
    }

    this.inAppBrowser.create(link, '_self', options);
  }

}
