import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

interface State {
  wsUrl: string,
  djangoUrl: string,
}


export const servers = [
    {
      name: 'dev',
      wsUrl: 'ws://10.0.0.9:8080/ws',
      djangoUrl: 'http://10.0.0.9:8000',
    },
    {
      name: 'esp-lamp',
      wsUrl: 'ws://10.0.0.7:81',
      djangoUrl: null,
    },
    {
      name: 'esp-lamp2',
      wsUrl: 'ws://10.0.0.5:81',
      djangoUrl: null,
    }
  ];

@Injectable({
  providedIn: 'root'
})
export class StateService extends BehaviorSubject<State> {
  constructor() {
    const url = new URL(location.origin)
    let self = {
      name: 'self',
      wsUrl: `ws://${url.hostname}:8080/ws`,
      djangoUrl: `http://${url.hostname}:8000`,
    };
    servers.push(self);
    const initialJson = localStorage.getItem('app-state') || JSON.stringify(self);
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
