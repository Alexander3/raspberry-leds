import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StateService extends BehaviorSubject<any> {
  constructor() {
    const initialJson = localStorage.getItem('app-state') || JSON.stringify({
      wsUrl: 'ws://10.0.0.7:81',
    });
    super(JSON.parse(initialJson));
    localStorage.setItem('app-state', initialJson)
  }

  next(value: any): void {
    const newState = {
      ...this.value,
      ...value,
    };
    super.next(newState);
    localStorage.setItem('app-state', JSON.stringify(newState))
  }
}
