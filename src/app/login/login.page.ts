import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { IlsadminService } from '../providers/ilsadmin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  public loginUser: FormGroup;
  public pref;
  public logueo;
  public nomClient;
  public dataVoucherClient;
  public segmento;
  public COLOR_MENU_BACKEND;
  public logo;
  public source = 'public';
  public imgLoaging = false;
  public huella;
  public dataA = {
    user: "",
    password: ""
  };

  // public dataC = {
  //   codVoucher:"", 
  //   documento:""
  // };
  constructor(public ilsAdminProvider: IlsadminService,
    public loadingCtrl: LoadingController,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public toastController: ToastController,
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    public faio: FingerprintAIO,
    public translate: TranslateService) {

    this.loginUser = this.formBuilder.group({
      user: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])]
    });

    this.pref = this.activatedRoute.snapshot.paramMap.get('pref');
    this.logo = localStorage.getItem('logo');
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.nomClient = localStorage.getItem('nomClient');

    // this.loginUserVoucher = formBuilder.group({
    //   codVoucher: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20), Validators.pattern('[0-9a-zA-Z-]+')])],
    //   documento: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern('[0-9]+')])],
    // });
  }

  ngOnInit() {
    console.log(this.pref);
  }

  ngOnDestroy() {
    console.log('destruye login');
  }

  datosAgente() {
    let datos = new FormData();
    datos.append("user", this.dataA.user);
    datos.append("password", this.dataA.password);
    datos.append("prefix", this.pref);
    return datos;
  }

  // datosCliente(){
  //   let datos= new FormData();
  //   datos.append ("codigo", this.dataC.codVoucher); 
  //   datos.append ("documento", this.dataC.documento); 
  //   datos.append ("prefix", this.pref);
  //   datos.append ("source", 'public');
  //   return datos
  // }

  ionViewDidLoad() {
    console.log('prefijo recibido', this.pref);
    console.log('ionViewDidLoad LoginPage');
  }

  funSegmento(segmento) {
    this.segmento = segmento;
    console.log(segmento);
  }

  async enviarDatosAgente(valor) {
    console.log(this.datosAgente());

    const loading = await this.loadingCtrl.create({
      message: this.translate.instant('LOGIN.conectando'),
      duration: 600000
    });

    loading.present();

    loading.present().then(() => {
      this.ilsAdminProvider.loginUsers(this.datosAgente())
        .subscribe(
          (data) => {
            this.logueo = data;
            console.log(this.logueo);
            this.loadingCtrl.dismiss();
            this.loginHuella();//validacion de huella

            //if (data) {
            //document.location.href = 'index.html'; 
            //} 
          },
          (error) => {
            this.logueo = null;
            this.loadingCtrl.dismiss();
            let subtitulo = error;
            console.log(error);
            this.alertaSigErr(subtitulo.error[0].notes);
          }
        );
    });
  }

  loginHuella() {
    console.log('entra a ciclo');
    this.faio.isAvailable()
      .then(result => {//si hay huella o reconocimiento de rostro me hace la validacion de huella 

        //Fingerprint or Face Auth is available
        this.faio.show({
          //clientId: 'Fingerprint-Demo',
          //clientSecret: 'password', //Only necessary for Android
          disableBackup: true, //Only for Android(optional)
          //localizedFallbackTitle: 'Use Pin', //Only for iOS
          //localizedReason: 'Please Authenticate' //Only for iOS
          title: this.translate.instant('LOGIN.aut_biometrica'),
          cancelButtonTitle: this.translate.instant('LOGIN.cancelar')
        })
          .then((result: any) => {
            this.almacLocal();
            this.alertaToastLogin();//si la huella es la correcta
          })
          .catch((error: any) => {
            //si se dio cancelar 
            this.huella = error;
          });

      })
      .catch((err) => {
        this.almacLocal();
        this.alertaToastLogin();
      })
  }

  almacLocal() {
    localStorage.setItem('lang_app', this.logueo.langApp);
    localStorage.setItem('pref', this.pref);
    localStorage.setItem('nomPlatf', this.logueo.nomPlatf);
    localStorage.setItem('imgPlatf', this.logueo.imgPlatf);
    localStorage.setItem('colorsPlatf', this.logueo.colorsPlatf);
    localStorage.setItem('userType', this.logueo.userType);
    localStorage.setItem('id_user', this.logueo.id_user);
    localStorage.setItem('firstname', this.logueo.firstname);
    localStorage.setItem('lastname', this.logueo.lastname);
    localStorage.setItem('code_phone', this.logueo.code_phone);
    localStorage.setItem('email', this.logueo.email);
    localStorage.setItem('pais', this.logueo.pais);
    localStorage.setItem('phone', this.logueo.phone);
    localStorage.setItem('agency', this.logueo.agency);
    localStorage.setItem('nivelAgency', this.logueo.nivelAgency);
    localStorage.setItem('agencyMaster', this.logueo.agencyMaster);
    localStorage.setItem('prefAgency', this.logueo.prefAgency);
    localStorage.setItem('urlPlatform', this.logueo.urlPlatform);
    localStorage.setItem('nombreAgenMaster', this.logueo.nombreAgenMaster);
    localStorage.setItem('paramAgency', !this.logueo.paramAgency.id_broker ? 'N/A' : JSON.stringify(this.logueo.paramAgency));
    localStorage.setItem('platfNew', this.logueo.platfNew);
  }

  async alertHuella(titulo, subtitulo) {
    const alert = await this.alertController.create({
      header: titulo,
      message: subtitulo,
      buttons: ['OK']
    });
    return await alert.present();
  }

  cambiarFormatoFecha(fecha) {
    let extAño = fecha.substring(0, fecha.length - 6);
    let extMes = fecha.substring(5, fecha.length - 3);
    let extDia = fecha.substring(8, fecha.length - 0);
    extAño = (parseInt(extAño));
    extDia = (parseInt(extDia));
    extDia = (extDia < 10 ? '0' + extDia : extDia);
    let formatFecha = extDia + "-" + extMes + "-" + extAño;
    console.log('dd/mm/aaaa', formatFecha);
    return formatFecha;
  }

  async alertaSigErr(subtitulo) {
    const alert = await this.alertController.create({
      header: this.translate.instant('LOGIN.err_acceder'),
      subHeader: '' + subtitulo + '!',
      buttons: ['OK']
    });

    alert.present();
  }

  async alertaToastLogin() {
    const toast = await this.toastController.create({
      message: this.translate.instant('LOGIN.bienvenido'),
      duration: 2000,
      position: 'top'
    });

    toast.present();
    document.location.href = 'index.html';
  }

  async alertaToastCliente() {
    const toast = await this.toastController.create({
      message: this.translate.instant('LOGIN.vouch_encon'),
      duration: 3000,
      position: 'top',
    });

    toast.present();
  }


  cargaImg(imgLoader) {
    console.log('cargo img');
    this.imgLoaging = true;
  }

}
