import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login/:pref', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'list-orders', loadChildren: './list-orders/list-orders.module#ListOrdersPageModule' },
  { path: 'popover-fecha', loadChildren: './popover-fecha/popover-fecha.module#PopoverFechaPageModule' },
  { path: 'detalleorden', loadChildren: './detalleorden/detalleorden.module#DetalleordenPageModule' },
  { path: 'beneficios-plan', loadChildren: './beneficios-plan/beneficios-plan.module#BeneficiosPlanPageModule' },
  { path: 'network-page', loadChildren: './network-page/network-page.module#NetworkPagePageModule' },
  { path: 'contacto/:titulo', loadChildren: './contacto/contacto.module#ContactoPageModule' },
  { path: 'cotizador', loadChildren: './cotizador/cotizador.module#CotizadorPageModule' },
  { path: 'graficas', loadChildren: './graficas/graficas.module#GraficasPageModule' },
  { path: 'config', loadChildren: './config/config.module#ConfigPageModule' },
  { path: 'info-emision', loadChildren: './info-emision/info-emision.module#InfoEmisionPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor() {
  }

  validadorPag() {
    if (localStorage.getItem('userType') == '1') {
      console.log('logueado master');
      return this.master();
    } else if (localStorage.getItem('userType') == '2') {
      console.log('logueado broker admin');
      return this.brokerAdmin();
    } else if (localStorage.getItem('userType') == '5') {
      console.log('logueado broker access');
      return this.brokerAccess();
    } else if (localStorage.getItem('userType') == '13') {
      console.log('logueado admin');
      return this.admin();
    } else {
      console.log('sin loguear');
      return this.noLogin();
    }
  }

  master() {
    return [
      { path: 'list-orders', title: 'vouchers', icon: 'card' },
      { path: 'cotizador', title: 'cotizador', icon: 'airplane' },
      { path: 'graficas', title: 'graficas', icon: 'stats-chart' },
      { path: 'contacto', title: 'plataforma', icon: 'finger-print' },
      { path: 'config', title: 'configuracion', icon: 'options' }
    ];
  }

  admin() {
    return [
      { path: 'list-orders', title: 'vouchers', icon: 'card' },
      { path: 'graficas', title: 'graficas', icon: 'stats-chart' },
      { path: 'contacto', title: 'plataforma', icon: 'finger-print' },
      { path: 'config', title: 'configuracion', icon: 'options' }
    ];
  }

  brokerAdmin() {
    return [
      { path: 'list-orders', title: 'vouchers', icon: 'card' },
      { path: 'cotizador', title: 'cotizador', icon: 'airplane' },
      { path: 'contacto', title: 'agente', icon: 'finger-print' },
      { path: 'config', title: 'configuracion', icon: 'options' }
    ];
  }

  brokerAccess() {
    return [
      { path: 'list-orders', title: 'vouchers', icon: 'card' },
      { path: 'cotizador', title: 'cotizador', icon: 'airplane' },
      { path: 'contacto', title: 'agente', icon: 'finger-print' },
      { path: 'config', title: 'configuracion', icon: 'options' }
    ];
  }

  noLogin() {
    return [
      { path: 'login/TK', title: 'inicio', icon: 'home' },
      { path: 'contacto', title: 'informacion', icon: 'finger-print' },
      { path: 'config', title: 'configuracion', icon: 'options' }
    ];
  }

}
