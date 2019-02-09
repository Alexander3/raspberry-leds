import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {retry} from "rxjs/operators";
import {StateService} from "./state.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private offset: number;
  private url: string;

  constructor(private http: HttpClient, state: StateService) {
    this.offset = new Date().getTimezoneOffset();
    state.subscribe(({djangoUrl})=>{this.url = djangoUrl})
  }

  setColor(color) {
    return this.http.post(this.url + '/set-color', {color}).pipe(
      retry()
    )
  }

  wave() {
    return this.http.post(this.url + '/wave', {}).pipe(
    ).subscribe(console.log, console.log)
  }

  setAlarm(time) {
    const [h, m] = time.split(':')
    return this.http.post(this.url + '/set-alarm', {
      hour: parseInt(h),
      minute: parseInt(m),
      tzOffset: this.offset
    }).pipe(
    ).subscribe(console.log, console.log)
  }

  wakeMeUp() {
    return this.http.post(this.url + '/wake-me', {}).pipe(
    ).subscribe(console.log, console.log)
  }

  stopCelery() {
    return this.http.post(this.url + '/stop-celery', {}).pipe(
    ).subscribe(console.log, console.log)
  }
}
