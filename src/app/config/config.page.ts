import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ToastController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { IlsadminService } from '../providers/ilsadmin.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit, OnDestroy {

  public COLOR_MENU_BACKEND;
  public appVersionVar;
  public toggledDark: boolean;
  public so;
  public ip;
  public idioma;
  public lenguajes: any = [
    {
      name: 'español',
      value: 'spa',
    }, {
      name: 'ingles',
      value: 'eng',
    }
  ];

  constructor(public appVersion: AppVersion,
    public toastCtrl: ToastController,
    public device: Device,
    public ilsAdminProvider: IlsadminService,
    public translate: TranslateService) {
    this.idioma = translate.currentLang;
    this.COLOR_MENU_BACKEND = localStorage.getItem('COLOR_MENU_BACKEND');
    localStorage.getItem('themeDark') == 'true' ? this.toggledDark = true : this.toggledDark = false;
    this.appVersion.getVersionNumber().then(value => {
      this.appVersionVar = value;
    }).catch(err => {
    });
    this.so = this.device.platform;
  }

  arribaRefresh(event) {
    setTimeout(() => {
      event.target.complete(this.ngOnInit());
    }, 1500);
  }

  ngOnInit() {
    this.ilsAdminProvider.getIpUser().subscribe(
      (data) => {
        if (!data[0].notes) {
          this.ip = data;
        }
      },
      (err) => {
        //console.log(err);
      });
  }

  ngOnDestroy() {
    this.toggledDark = null;
  }

  colorTheme() {
    console.log(this.toggledDark, localStorage.getItem('themeDark'))
    if (String(this.toggledDark) != localStorage.getItem('themeDark')) {
      localStorage.setItem('themeDark', String(this.toggledDark));
      let message = this.translate.instant('CONFIG.text_teme_dark');
      let duration = 2000;
      let position = 'top';
      this.alertToast(message, duration, position);
    }
  }

  async  alertToast(message, duration, position) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.present();

    setTimeout(() => {
      document.location.href = 'index.html';
    }, 2000);
  }

  async paramIdioma(idioma) {
    localStorage.setItem('lang_app', idioma)
  }

}
