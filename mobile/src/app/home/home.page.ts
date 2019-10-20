import { AfterViewInit, Component } from '@angular/core';
import { retry, switchMap, tap, throttleTime } from "rxjs/operators";
import { Subject } from "rxjs";
import { Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { SoundService } from "../sound.service";
import { StateService } from "../state.service";
import { ColorPickerService } from "ngx-color-picker";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  window = window;
  change = new Subject<string>();
  selectedColor = '#000000';
  preset = [
    '#1a0500',
    '#400d00',
    '#811b00',
    '#906832',
    '#ffcf66',
    '#3F00FF',
    '#FF0000',
    '#00ff00',
    '#0000ff',
  ];

  labels = ['night', 'evening', 'sunlight', 'indigo'];
  cpWidth;
  ready = false;
  djangoUrl: string;

  constructor(public api: ApiService, private platform: Platform, public router: Router, public sound: SoundService,
              state: StateService,
              private colors: ColorPickerService
  ) {
    platform.ready().then((readySource) => {
      this.cpWidth = platform.width() - 2 * 16;
      console.log('Width: ' + platform.width());
      console.log('Height: ' + platform.height());
      setTimeout(() => this.ready = true);

      state.subscribe(({djangoUrl}) => {
        this.djangoUrl = djangoUrl;
      })

    });
  }


  set(color) {
    this.selectedColor = `#${color}`;
    this.change.next(`#${color}`)
  }


  ngAfterViewInit(): void {
    if (this.djangoUrl) {
      this.change.pipe(
        throttleTime(50),
        switchMap((val) => this.api.setColor(val)),
        retry(),
      ).subscribe(console.log, console.log)
    } else {
      this.change.pipe(
        throttleTime(50),
        tap(color => {
          this.api.checkWs();
          this.api.sendColorViaWs(color)
        })
      ).subscribe(console.log, console.log)
    }
  }

  async playMusic() {
    this.api.checkWs();
    // const url = '/assets/Nightcore - Pure O.mp3';
    const url = '/assets/Alan Walker - The Spectre.mp3';

    await this.sound.setup(url);

    this.sound.start(data => {
      this.api.sendColorViaWs(`#${fmt_hex(data[0])}${fmt_hex(data[1])}${fmt_hex(data[2])}`)
    })
  }

  brightnes(value: number) {
    const hsva = this.colors.stringToHsva(this.selectedColor);
    hsva.v = Math.min(1, Math.max(0, hsva.v + value / 100));
    this.selectedColor = this.colors.outputFormat(hsva, 'auto', null);
    this.change.next(this.selectedColor)
  }
}

function fmt_hex(num) {
  return Number(num).toString(16).padStart(2, '0')
}
