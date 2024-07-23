import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

    constructor() { }

    getFileNameFromFileUrlServer(url: string) : string{
        const lastSlashIndex = url.lastIndexOf('/');
        const encodedFileName = url.substring(lastSlashIndex + 1);
        const decodedFileName = decodeURIComponent(encodedFileName);
        return decodedFileName;
    }
}
