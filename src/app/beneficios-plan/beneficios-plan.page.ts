import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-beneficios-plan',
  templateUrl: './beneficios-plan.page.html',
  styleUrls: ['./beneficios-plan.page.scss'],
})

export class BeneficiosPlanPage implements OnInit, OnDestroy {

  public descBenefi;
  public COLOR_MENU_BACKEND;
  public nombrePlan;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public translate: TranslateService) {
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    this.descBenefi = navParams.get('beneficios');
    this.nombrePlan = navParams.get('nombrePlan');
    //console.log(this.descBenefi, this.COLOR_MENU_BACKEND, this.nombrePlan)

    for (let i = 0; i < this.descBenefi.length; i++) {
      this.descBenefi[i].name = this.decodeHTML(this.descBenefi[i].name);
      this.descBenefi[i].Type_beneficio = this.decodeHTML(this.descBenefi[i].Type_beneficio);
      this.descBenefi[i].valor = this.decodeHTML(this.descBenefi[i].valor);
    }
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  decodeHTML(html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad GetCoveragesPage');
  }

  async cerrarModal() {
    this.modalCtrl.dismiss();
  }

}
