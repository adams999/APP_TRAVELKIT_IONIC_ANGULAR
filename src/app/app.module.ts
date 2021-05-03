////////////////////////////////// componentes para ionic propios
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

////////////////////////////componentes nativos
import { BrowserTab } from '@ionic-native/browser-tab/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
//import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Network } from '@ionic-native/network/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { Device } from '@ionic-native/device/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';

/////////////////////////////////servicios o proveedores de datos
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IlsadminService } from './providers/ilsadmin.service';
import { GestorFiles } from './providers/gestorFiles';
import { Countries } from './providers/countries';
import { CodPhones } from './providers/codigo-phones';
import { NgxPayPalModule } from 'ngx-paypal';

/////////////////////////////// traduccion
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

///////////////////////////////componentes para popover, modals, hojas de accion
import { PopoverComponent } from './popover/popover.component';
import { PopoverDescripcionComponent } from './popover-descripcion/popover-descripcion.component';
import { BeneficiosPlanPageModule } from './beneficios-plan/beneficios-plan.module';
import { GetPlansComponent } from './get-plans/get-plans.component';
import { PopoverTelSmsComponent } from './popover-tel-sms/popover-tel-sms.component';
import { FormPagoComponent } from './form-pago/form-pago.component';

import { TasaCambioPipe } from './providers/tasaCambio.pipe';

export function HttpLoaderFactory(http: HttpClient) {///ruta de traducciones
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent,
    PopoverComponent,
    PopoverDescripcionComponent,
    PopoverTelSmsComponent,
    FormPagoComponent,
    GetPlansComponent,
    TasaCambioPipe],
  entryComponents: [PopoverComponent,
    PopoverDescripcionComponent,
    PopoverTelSmsComponent,
    FormPagoComponent,
    GetPlansComponent
  ],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BeneficiosPlanPageModule,
    FormsModule,
    NgxPayPalModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    IlsadminService,
    GestorFiles,
    FingerprintAIO,
    BrowserTab,
    InAppBrowser,
    Countries,
    CodPhones,
    //BackgroundMode,
    AppVersion,
    Network,
    DatePicker,
    SocialSharing,
    AppUpdate,
    Device,
    File,
    FileTransfer,
    DocumentViewer,
    FileOpener
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
