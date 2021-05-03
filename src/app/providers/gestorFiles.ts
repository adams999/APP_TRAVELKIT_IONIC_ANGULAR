import { Injectable } from '@angular/core';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export class GestorFiles {

    constructor(private document: DocumentViewer,
        private file: File,
        private ft: FileTransfer,
        private fileOpener: FileOpener,
        private platform: Platform) {
    }

    async verPDFDownApp(url: string, namePDF: string = 'PDF') {
        let path = null;
        if (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone')) {
            path = this.file.documentsDirectory;
        } else {
            path = this.file.dataDirectory;
        }
        const transfer = this.ft.create();

        return new Promise((resolve, reject) => {
            transfer.download(url, path + namePDF + '.pdf')
                .then((data) => {
                    let url = data.toURL();
                    if (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone')) {
                        return resolve(this.document.viewDocument(url, 'application/pdf', {}));//aqui es para abrir con iphone
                    } else {
                        return resolve(this.fileOpener.open(url, 'application/pdf'));//aqui es para abrir con android 
                    }
                }, (err) => {
                    return reject('');

                }).catch((err) => {
                    return reject('');
                });
        })

    }

}
