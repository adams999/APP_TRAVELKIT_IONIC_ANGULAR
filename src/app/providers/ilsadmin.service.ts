import { Injectable } from '@angular/core';
import { throwError, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Device } from '@ionic-native/device/ngx';
import { Platform } from '@ionic/angular';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class IlsadminService {

  private myObservable = new Subject<string>();
  public currentData;

  constructor(public http: HttpClient,
    public device: Device,
    public platform: Platform) {
    this.infoDispositivo();
    this.currentData = this.myObservable.asObservable();
    console.log('Hello IlsAdminProvider Provider', localStorage.getItem('platfApp'));
  }

  infoDispositivo() {
    if (localStorage.getItem('so') == null || localStorage.getItem('so') == undefined || localStorage.getItem('so') == '' && !this.platform.is('desktop')) {
      this.platform.ready().then((data) => {
        localStorage.setItem("so", this.device.platform);
        localStorage.setItem("v_so", this.device.version);
        localStorage.setItem("manuf", this.device.manufacturer);
        localStorage.setItem("modelo", this.device.model);
        localStorage.setItem("uuid", this.device.uuid);
      });
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  // private option(){
  //   let headers = new Headers();
  //   headers.append("Content-Type", "application/json");
  //   headers.append("Content-Type", "application/x-www-form-urlencoded");
  //   return headers;
  // }

  eventGeneral(pagina: string) {
    this.myObservable.next(pagina);
  }

  private funApiUrl() {
    let apiUrl = 'https://ilsadmin.com/app/api/v1/';
    return apiUrl;
  }

  private apiToken() {
    let token = 'token=M9DAG8JGI46II7KJ';
    let platfApp = '&platfApp=' + localStorage.getItem('platfApp');
    let versionApp = '&versionAppApi=' + localStorage.getItem('versionAppApi');
    let id_user = '&id_user=' + localStorage.getItem('id_user');
    let prefixApp = '&prefixApp=' + localStorage.getItem('prefixApp');
    let userType = '&userType=' + localStorage.getItem('userType');
    let agency = '&agency=' + localStorage.getItem('agency');
    let nivelAgency = '&nivelAgency=' + localStorage.getItem('nivelAgency');
    let agencyMaster = '&agencyMaster=' + localStorage.getItem('agencyMaster');
    let prefAgency = '&prefAgency=' + localStorage.getItem('prefAgency');
    let so = "&so=" + localStorage.getItem("so");
    let v_so = "&v_so=" + localStorage.getItem("v_so");
    let manuf = "&manuf=" + localStorage.getItem("manuf");
    let modelo = "&modelo=" + localStorage.getItem("modelo");
    let uuid = "&uuid=" + localStorage.getItem("uuid");
    let lang_app = "&lang_app=" + localStorage.getItem("lang_app");
    let themeDark = "&themeDark=" + localStorage.getItem("themeDark");
    return token + platfApp + versionApp + id_user + prefixApp + userType + agency + nivelAgency + agencyMaster + prefAgency + so + v_so + manuf + modelo + uuid + lang_app + themeDark;
  }

  //------------------------------------------------------------------GET-----------------------------------------------------------------

  // checkVersionApp(){
  //   return this.http.get(this.funApiUrl() + 'checkVersionApp?' + this.apiToken() ); //funcion de las primeras versiones de la app para la verificacion aqui no se valida la plataforma ni el prefijo
  // }

  checkVersionAppA(prefijo, plataforma) {
    return this.http.get(this.funApiUrl() + 'checkVersionAppA?' + 'prefix=' + prefijo + '&' + 'plataforma=' + (plataforma != undefined ? plataforma : 'AND') + '&' + this.apiToken());
  }

  getAgencyParam(pref) {
    return this.http.get(this.funApiUrl() + 'getAgencyParam?' + this.apiToken() + '&prefix=' + pref);
  }

  getClients() {
    return this.http.get(this.funApiUrl() + 'getClients?' + this.apiToken());
  }

  getOrders(pref, min, max, codeBus, docBus, userType, startDate, endDate, nomBus, source, estatus = '', agencyFilter = '') {
    console.log(pref, min, max, codeBus, docBus, startDate, endDate, nomBus);
    return this.http.get(this.funApiUrl() + 'getOrders?' + 'prefix=' + pref + '&' + this.apiToken() + (min ? "&min=" + min : "&min=" + 0) + (max ? "&max=" + max : '') + (codeBus ? "&code=" + codeBus : '') + (docBus ? "&document=" + docBus : '') + (userType ? "&userType=" + userType : '') + (startDate ? "&startDate=" + startDate : '') + (endDate ? "&endDate=" + endDate : '') + (nomBus ? "&name=" + nomBus : '') + (source ? "&source=" + source : '') + (estatus ? "&estatus=" + estatus : '') + (agencyFilter ? "&agencyFilter=" + agencyFilter : ''));
  }

  //api para que me retorne la data de un plan por su id
  getPlan(idPlan, pref) {
    return this.http.get(this.funApiUrl() + 'getPlan?' + this.apiToken() + (idPlan ? '&idPlan=' + idPlan : '') + (pref ? '&prefix=' + pref : ''));
  }
  //api para que me retorne la data del vendedor de la orden mostrada
  getVendedor(idVendedor, pref) {
    return this.http.get(this.funApiUrl() + 'getVendedor?' + this.apiToken() + (idVendedor ? '&idVendedor=' + idVendedor : '') + (pref ? '&prefix=' + pref : ''));
  }

  //funciones de cotizador
  getCategories(pref) {
    return this.http.get(this.funApiUrl() + 'getCategories?' + this.apiToken() + '&prefix=' + pref);
  }

  getCountries(pref) {
    return this.http.get(this.funApiUrl() + 'getCountries?' + this.apiToken() + '&prefix=' + pref);
  }

  getTerritorios(pref) {
    return this.http.get(this.funApiUrl() + 'getTerritorios?' + this.apiToken() + '&prefix=' + pref);
  }

  getIntervaloFechas(pref, idCategory, paisOrigen) {
    return this.http.get(this.funApiUrl() + 'getIntervaloFechas?' + this.apiToken() + '&prefix=' + pref + '&paisOrigen=' + paisOrigen + '&idCategory=' + idCategory);
  }

  getIntervaloDeEdades(pref, country, idCategory) {
    return this.http.get(this.funApiUrl() + 'getIntervaloDeEdades?' + this.apiToken() + '&prefix=' + pref + '&country=' + country + '&idCategory=' + idCategory);
  }

  getPrices(pref, origin, destiny, startDate, endDate, category, ages, bloque) {
    return this.http.get(this.funApiUrl() + 'getPrices?' + this.apiToken() + '&prefix=' + pref + (origin ? '&origin=' + origin : '') + (destiny ? '&destiny=' + destiny : '') + (startDate ? '&startDate=' + startDate : '') + (endDate ? '&endDate=' + endDate : '') + (category ? '&category=' + category : '') + (ages ? '&ages=' + ages : '') + (bloque ? '&bloque=' + bloque : ''));
  }

  GetPricesApiQuoteGeneral(pref, origin, destiny, startDate, endDate, category, ages, bloque, idPlan, dataPreOrder) {
    return this.http.get(this.funApiUrl() + 'GetPricesApiQuoteGeneral?' + this.apiToken() + '&prefix=' + pref + (origin ? '&origin=' + origin : '') + (destiny ? '&destiny=' + destiny : '') + (startDate ? '&startDate=' + startDate : '') + (endDate ? '&endDate=' + endDate : '') + (category ? '&category=' + category : '') + (ages ? '&ages=' + ages : '') + (bloque ? '&bloque=' + bloque : '') + (idPlan ? '&idPlan=' + idPlan : '') + (dataPreOrder ? '&dataPreOrder=' + dataPreOrder : ''));
  }

  getCoverages(pref, plan, lenguaje) {
    return this.http.get(this.funApiUrl() + 'getCoverages?' + this.apiToken() + '&prefix=' + pref + '&plan=' + plan + '&lenguaje=' + lenguaje);
  }

  getInformIls(data) {
    return this.http.get(this.funApiUrl() + 'getInformIls?' + this.apiToken(), data);
  }

  // graficas
  getChartVouchersPie(pref, startDate, endDate) {
    return this.http.get(this.funApiUrl() + 'getChartVouchersPie?' + this.apiToken() + '&prefix=' + pref + '&startDate=' + startDate + '&endDate=' + endDate);
  }

  // graficas con desglose para todos los status de las ordenes ILS
  getChartVouchersStatus(pref, startDate, endDate) {
    return this.http.get(this.funApiUrl() + 'getChartVouchersStatus?' + this.apiToken() + '&prefix=' + pref + '&startDate=' + startDate + '&endDate=' + endDate);
  }

  //datos de usuario loguado
  getDatosUser(pref, id_user) {
    return this.http.get(this.funApiUrl() + 'getDatosUser?' + this.apiToken() + '&prefix=' + pref + '&id_user=' + id_user);
  }

  //parametros de agencia master
  getParamAgencyMaster(pref, id_user, agency) {
    return this.http.get(this.funApiUrl() + 'getParamAgencyMaster?' + this.apiToken() + '&prefix=' + pref + '&id_user=' + id_user + '&agency=' + agency);
  }

  getGrafGenAgen(startDate, endDate, typeClient) {
    return this.http.get(this.funApiUrl() + 'getGrafGenAgen?' + this.apiToken() + '&startDate=' + startDate + '&endDate=' + endDate + '&typeClient=' + typeClient);
  }

  getGrafGenAgenGeneral(yearBus, mesBus, typeClient) {
    return this.http.get(this.funApiUrl() + 'getGrafGenAgenGeneral?' + this.apiToken() + '&yearBus=' + yearBus + '&mesBus=' + mesBus + '&typeClient=' + typeClient);
  }

  getInformUserIls(idUser) {
    return this.http.get(this.funApiUrl() + 'getInformUserIls?' + this.apiToken() + '&id_user=' + idUser);
  }

  getIpUser() {
    return this.http.get(this.funApiUrl() + 'getIpUser?' + this.apiToken());
  }

  logoutApp() {
    return this.http.get(this.funApiUrl() + 'logoutApp?' + this.apiToken());
  }

  getUpgrades(ipPlan, prefijo) {
    return this.http.get(this.funApiUrl() + 'getUpgrades?' + this.apiToken() + '&prefix=' + prefijo + '&idPlan=' + ipPlan);
  }

  getOverageInFactors(prefijo) {
    return this.http.get(this.funApiUrl() + 'getOverageInFactors?' + this.apiToken() + '&prefix=' + prefijo);
  }

  getCuponDescuento(prefijo, categoria, idPlan, cupon, subTotal, destino, numpasajeros, moneda_local, tasa_cambio) {
    return this.http.get(this.funApiUrl() + 'getCuponDescuento?' + this.apiToken() + '&prefix=' + prefijo + (categoria ? '&categoria=' + categoria : '') + (idPlan ? '&idPlan=' + idPlan : '') + (cupon ? '&cupon=' + cupon : '') + (subTotal ? '&subTotal=' + subTotal : '') + (destino ? '&destino=' + destino : '') + (numpasajeros ? '&numpasajeros=' + numpasajeros : '') + (moneda_local ? '&moneda_local=' + moneda_local : '') + (tasa_cambio ? '&tasa_cambio=' + tasa_cambio : ''));
  }

  getCuponDescuentoNC(prefijo, categoria, idPlan, cupon, subTotal, destino, numpasajeros, moneda_local, tasa_cambio) {
    return this.http.get(this.funApiUrl() + 'getCuponDescuentoNC?' + this.apiToken() + '&prefix=' + prefijo + (categoria ? '&categoria=' + categoria : '') + (idPlan ? '&idPlan=' + idPlan : '') + (cupon ? '&cupon=' + cupon : '') + (subTotal ? '&subTotal=' + subTotal : '') + (destino ? '&destino=' + destino : '') + (numpasajeros ? '&numpasajeros=' + numpasajeros : '') + (moneda_local ? '&moneda_local=' + moneda_local : '') + (tasa_cambio ? '&tasa_cambio=' + tasa_cambio : ''));
  }

  getTermCond(prefijo, idPlan) {
    return this.http.get(this.funApiUrl() + 'getTermCond?' + this.apiToken() + '&prefix=' + prefijo + (idPlan ? '&idPlan=' + idPlan : ''));
  }

  getListMethodPagoApp(prefijo) {
    return this.http.get(this.funApiUrl() + 'getListMethodPagoApp?' + this.apiToken() + '&prefix=' + prefijo);
  }

  getInfoSocialsPlatform(prefijo) {
    return this.http.get(this.funApiUrl() + 'getInfoSocialsPlatform?' + this.apiToken() + '&prefix=' + prefijo);
  }

  getCondicionadosApp(prefijo) {
    return this.http.get(this.funApiUrl() + 'getCondicionadosApp?' + this.apiToken() + '&prefix=' + prefijo);
  }

  getinfoTextTelef(prefijo) {
    return this.http.get(this.funApiUrl() + 'getinfoTextTelef?' + this.apiToken() + '&prefix=' + prefijo);
  }

  getGuardarOrdenEventsApp(prefijo, id_orden, email, calendario, sms, smstelefono) {
    return this.http.get(this.funApiUrl() + 'getGuardarOrdenEventsApp?' + this.apiToken() + '&prefix=' + prefijo + (id_orden ? '&id_orden=' + id_orden : '') + (email ? '&email=' + email : '') + (calendario ? '&calendario=' + calendario : '') + (sms ? '&sms=' + sms : '') + (smstelefono ? '&smstelefono=' + smstelefono : ''));
  }

  getStatusCreditAgency(prefijo) {
    return this.http.get(this.funApiUrl() + 'getStatusCreditAgency?' + this.apiToken() + '&prefix=' + prefijo);
  }

  getAgencys(prefijo) {
    return this.http.get(this.funApiUrl() + 'getAgencys?' + this.apiToken() + '&prefix=' + prefijo);
  }

  getStatesApp(pais) {
    return this.http.get(this.funApiUrl() + 'getStatesApp?' + this.apiToken() + '&pais=' + pais);
  }

  getCityApp(state) {
    return this.http.get(this.funApiUrl() + 'getCityApp?' + this.apiToken() + '&state=' + state);
  }

  //------------------------------------------------------------------POST----------------------------------------------------------------

  loginIls(data) {
    return this.http.post(this.funApiUrl() + 'loginIls?' + this.apiToken(), data);
  }

  loginUsers(data) {
    return this.http.post(this.funApiUrl() + 'login?' + this.apiToken(), data);
  }

  sendQuote(data) {
    return this.http.post(this.funApiUrl() + 'sendQuote?' + this.apiToken(), data);
  }

  sendSms(data) {
    return this.http.post(this.funApiUrl() + 'sendSms?' + this.apiToken(), data);
  }

  sendVouchEmail(data) {
    return this.http.post(this.funApiUrl() + 'sendVouchEmail?' + this.apiToken(), data);
  }

  postParamPlatform(data) {
    return this.http.post(this.funApiUrl() + 'postParamPlatform?' + this.apiToken(), data);
  }

  postInformAgency(data) {
    return this.http.post(this.funApiUrl() + 'postInformAgency?' + this.apiToken(), data);
  }

  postProcesarEmisionApp(data) {
    return this.http.post(this.funApiUrl() + 'postProcesarEmisionApp?' + this.apiToken() + '&prefix=' + localStorage.getItem('pref'), data);
  }

  postUpdatePreorden(data) {
    return this.http.post(this.funApiUrl() + 'postUpdatePreorden?' + this.apiToken() + '&prefix=' + localStorage.getItem('pref'), data);
  }

  postUpdateOrderPaypalApp(prefix, data) {
    return this.http.post(this.funApiUrl() + 'postUpdateOrderPaypalApp?' + this.apiToken() + '&prefix=' + prefix, data);
  }

  postUpdateOrden(prefix, data) {
    return this.http.post(this.funApiUrl() + 'postUpdateOrden?' + this.apiToken() + '&prefix=' + prefix, data);
  }

}
