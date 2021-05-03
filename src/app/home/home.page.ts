import { Component } from '@angular/core';
import { IlsadminService } from '../providers/ilsadmin.service';
import { LoadingController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public color = '#1B4F72';

  public clientes;
  public colores={};
  public Aerror;
  public colorsPlatform;
  public logo;
  public cliente;
  public spinnerImg =[];

  constructor( public ilsAdminProvider: IlsadminService, 
    public loadingController: LoadingController,
    public navCtrl:NavController,
    public router:Router ){
      if (localStorage.getItem('pref')) {
        //this.navCtrl.navigateRoot (ListOrdersPage,{pref:localStorage.getItem('pref'),type:localStorage.getItem('userType')});
        return
      }
  }
  ngOnInit() {
    console.log('home page');

    this.ilsAdminProvider.getClients()
  	.subscribe(
		(data) => {
      this.clientes = data;
      for (const key in this.clientes) {
        if (this.clientes.hasOwnProperty(key)) {
          let element = this.clientes[key];
          element['logo_agencia'] = 'https://ilsadmin.com/app/upload_files/logo_clientes/' + element.img_cliente;
          this.spinnerImg.push(false);
          
        }
      }
      this.Aerror = null;
      console.log(this.clientes,this.spinnerImg);
  		},
  		(error) => {
        this.Aerror = error;
  			console.log(error);
  		}
    );
  }

  arribaRefresh(event) {

    setTimeout(() => {
      this.Aerror=null;
      console.log('Operacion Asincrona');
      event.target.complete(this.ngOnInit());
    }, 2000);
  }

  cargaDeImg(load,i){
    this.spinnerImg[i] = true;
  }

  listOrders(cliente){
    localStorage.setItem('nomClient', cliente.client);
   


    this.colorsPlatform = JSON.parse(cliente.colors_platform);
    this.storageParam(cliente,this.colorsPlatform); 
    this.router.navigate(['/login', cliente.prefix]);
    localStorage.setItem("COLOR_MENU_BACKEND", this.colorsPlatform.COLOR_MENU_BACKEND);   
    console.log(cliente,this.colorsPlatform);
  }
  
  storageParam(cliente, colorsPlatform){
    localStorage.setItem("COLOR_MENU_BACKEND", colorsPlatform.COLOR_MENU_BACKEND);
    localStorage.setItem("color_tr_table", colorsPlatform.color_tr_table);
    localStorage.setItem("color_font_tr", colorsPlatform.color_font_tr);
    localStorage.setItem("color_login", colorsPlatform.color_login);
    localStorage.setItem("color_menu", colorsPlatform.color_menu);
    localStorage.setItem("color_menu_barra", colorsPlatform.color_menu_barra);
    localStorage.setItem("color_menu_barra_hover", colorsPlatform.color_menu_barra_hover);
    localStorage.setItem("color_font_tab", colorsPlatform.color_font_tab);
    localStorage.setItem("color_email_font", colorsPlatform.color_email_font);
    localStorage.setItem("email_shadow_table", colorsPlatform.email_shadow_table);
    localStorage.setItem("web", cliente.web);
    localStorage.setItem("logo", 'https://ilsadmin.com/app/upload_files/logo_clientes/' + cliente.img_cliente);
  }

}
