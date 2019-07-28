import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface State {
  wsUrl: string,
  djangoUrl: string,
}

@Injectable({
  providedIn: 'root'
})
export class StateService extends BehaviorSubject<State> {
  constructor() {
    const initialJson = localStorage.getItem('app-state') || JSON.stringify({
      wsUrl: 'ws://10.0.0.5:81',
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
