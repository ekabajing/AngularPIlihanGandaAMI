import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root'
})

export class PertanyaanService {

    constructor(
        private http: HttpClient
    ) { }

    getPertanyaanJson(){
        return this.http.get<any>("assets/pertanyaan.json");
    }
}
