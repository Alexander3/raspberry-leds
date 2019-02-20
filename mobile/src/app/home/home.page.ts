import {AfterViewInit, Component} from '@angular/core';
import {retry, switchMap, throttleTime} from "rxjs/operators";
import {Subject} from "rxjs";
import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import {ApiService} from "../api.service";
import {SoundService} from "../sound.service";
import {StateService} from "../state.service";
import {ColorPickerService} from "ngx-color-picker";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  change = new Subject();
  selectedColor = '#000000';
  preset = [
    '#ffcf66',
    '#806733',
    '#403319',
    '#0d0a05',
    '#1a0800',
    '#3F00FF',
    '#FF0000',
    '#ffff00',
    '#00ff00',
    '#00ffff',
    '#0000ff',
    '#ff00ff',
  ];

  labels = ['sunlight', 'indigo'];
  cpWidth;
  ready = false;
  private ws: WebSocket;

  constructor(public api: ApiService, private platform: Platform, public router: Router, public sound: SoundService,
              state: StateService,
              private colors: ColorPickerService
  ) {
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
      throttleTime(10),
      switchMap((val) => this.api.setColor(val)),
      retry(),
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
      this.ws.send(JSON.stringify(data))
    })
  }

  brightnes(value: number) {
    const hsva = this.colors.stringToHsva(this.selectedColor)
    hsva.v = Math.min(1, Math.max(0, hsva.v + value / 100))
    this.selectedColor = this.colors.outputFormat(hsva, 'auto', null)
    this.change.next(this.selectedColor)
  }
}
