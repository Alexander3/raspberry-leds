import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StateService extends BehaviorSubject<any> {
  constructor() {
    const djangoUrl = localStorage.getItem('server') || 'http://10.0.0.9:8000'
    super({
      djangoUrl,
      wsUrl: djangoUrl
        .replace('http://', 'ws://')
        .replace(':8000', ':8080/ws')

    });
    // setTimeout(()=>this.next({}), 100)
  }

  next(value: any): void {
    if ('djangoUrl' in value) {
      value.wsUrl = value.djangoUrl
        .replace('http://', 'ws://')
        .replace(':8000', ':8080/ws')
    }
    super.next({
      ...this.value,
      ...value,
    });
  }
}
