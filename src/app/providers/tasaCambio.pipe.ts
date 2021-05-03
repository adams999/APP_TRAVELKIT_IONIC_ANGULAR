import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'TasaCambioPipe' })

export class TasaCambioPipe implements PipeTransform {
    transform(value: any, args: any): Number {
        let valor: any = 0;
        //console.log('valor pipe:', this.formatNumberDecimal(value), ' parametro:', args);
        if (args != null) {
            valor = this.formatNumberDecimal(value) * args;
            return this.formatNumberDecimal(valor);
        } else {
            return this.formatNumberDecimal(value);
        }
    }

    formatNumberDecimal(number) {
        return Number(number.toString().match(/^\d+(?:\.\d{0,2})?/));
    }
}