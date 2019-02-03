import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {retry} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private offset: number;
  private url: string;

  constructor(private http: HttpClient) {
    this.offset = new Date().getTimezoneOffset();
    this.url = localStorage.getItem('server') || 'http://10.0.0.9:8000'
  }

  setServer(url) {
    this.url = url
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
