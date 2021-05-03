import { Component, OnInit, OnDestroy } from '@angular/core';
import { IlsadminService } from '../providers/ilsadmin.service';
import { ToastController, ModalController, LoadingController, NavParams, NavController } from '@ionic/angular';
import { BeneficiosPlanPage } from '../beneficios-plan/beneficios-plan.page';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-descripcion',
  templateUrl: './popover-descripcion.component.html',
  styleUrls: ['./popover-descripcion.component.scss']
})

export class PopoverDescripcionComponent implements OnInit, OnDestroy {

  public COLOR_MENU_BACKEND;
  public parametros: any;
  public navbarTitle;
  public beneficios;
  public pref;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public ilsAdminProvider: IlsadminService,
    public translate: TranslateService) {
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.navbarTitle = navParams.get('navbarTitle');

    if (localStorage.getItem('pref')) {
      this.pref = localStorage.getItem('pref');
    } else if (!localStorage.getItem('pref')) {
      this.pref = navParams.get('pref');
    }

    this.parametros = navParams.get('parametros');
    console.log(this.parametros, this.navbarTitle)
  }

  ngOnInit() {
    this.ionViewDidLoad();
  }

  ngOnDestroy() {
    console.log('destruyo popoverdescripcion');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverDescripcionPage');
  }

  async verDetallePrecio(idPlan, nombrePlan) {
    console.log(idPlan, this.pref);

    let loader = await this.loadingCtrl.create({
      message: this.translate.instant('POPOVER-DESCRIPCION.cargando_detalle'),
      duration: 50000
    });

    loader.present().then(() => {
      this.ilsAdminProvider.getCoverages(this.pref, idPlan, "spa")
        .subscribe(
          (data) => {
            this.beneficios = data;

            if (this.beneficios[0].message == "NOT RESULTS") {
              console.log("PLAN SIN BENEFICIOS");
              let alerta = this.translate.instant('POPOVER-DESCRIPCION.p_sin_benef');
              this.avisoToast(alerta);
              loader.dismiss();
              return;
            } else if (this.beneficios[0].name && this.beneficios[0].valor) {
              console.log('PLAN CON BENEFICIOS', data);
              decodeURIComponent(this.beneficios);
              this.modalBenefDesc(this.beneficios, nombrePlan);
            }
            loader.dismiss();
            console.log(this.beneficios[1].valor, nombrePlan);
          },
          (error) => {
            console.log(error);
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

    toast.present();
  }

  async modalBenefDesc(beneficios, nombrePlan) {
    console.log(beneficios, nombrePlan)
    let modalBeneficios = await this.modalCtrl.create({
      component: BeneficiosPlanPage,
      componentProps: { beneficios: beneficios, nombrePlan: nombrePlan }
    });

    return await modalBeneficios.present();
  }


}
