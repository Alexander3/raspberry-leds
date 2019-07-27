import { AfterViewInit, Component } from '@angular/core';
import { retry, switchMap, tap, throttleTime } from "rxjs/operators";
import { Subject } from "rxjs";
import { Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { SoundService } from "../sound.service";
import { StateService } from "../state.service";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  change = new Subject<string>();
  selectedColor: any;
  preset = [
    '#ffcf66',
    '#3F00FF',
    '#FF0000',
    '#00ff00',
    '#0000ff',
  ];

  labels = ['sunlight', 'indigo'];
  cpWidth;
  ready = false;
  private ws: WebSocket;

  constructor(public api: ApiService, private platform: Platform, public router: Router, public sound: SoundService, state: StateService) {
    platform.ready().then((readySource) => {
      this.cpWidth = platform.width() - 2 * 16
      console.log('Width: ' + platform.width());
      console.log('Height: ' + platform.height());
      setTimeout(() => this.ready = true)

      state.subscribe(({wsUrl}) => {
        if (this.ws) {
          this.ws.close()
        }
        this.ws = new WebSocket(wsUrl);
      })

    });
  }


  set(color) {
    this.selectedColor = `#${color}`
    this.change.next(`#${color}`)
  }


  ngAfterViewInit(): void {
    this.change.pipe(
      throttleTime(50),
      tap(color => this.ws.send(color)),
        // switchMap((val) => this.api.setColor(val)),
        // retry(),
      ).subscribe(console.log, console.log)
  }

  async playMusic() {
    if (this.ws.readyState !== WebSocket.OPEN) {
      console.warn('ws not ready')
      return
    }
    console.log(this.ws.readyState)
    // const url = '/assets/Nightcore - Pure O.mp3';
    const url = '/assets/Alan Walker - The Spectre.mp3';

    await this.sound.setup(url)

    this.sound.start(data => {
      this.ws.send(`#${fmt_hex(data[0])}${fmt_hex(data[1])}${fmt_hex(data[2])}`)
    })
  }
}

function fmt_hex(num) {
  return Number(num).toString(16).padStart(2, '0')
}
