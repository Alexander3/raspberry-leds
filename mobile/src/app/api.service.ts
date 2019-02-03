import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {retry} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = 'http://10.0.0.9:8000'
  // url = 'http://10.0.0.21:8000'

  constructor(private http: HttpClient) {
  }


  setColor(color) {
    return this.http.post(this.url + '/set-color', {color}).pipe(
      retry()
    )
  }
}
