import {AfterViewInit, Component} from '@angular/core';
import {retry, switchMap, throttleTime} from "rxjs/operators";
import {Subject} from "rxjs";
import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import {ApiService} from "../api.service";


// const backend = 'http://10.0.0.9:8000'

const backend = 'http://10.0.0.21:8000'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  change = new Subject();
  selectedColor: any;
  preset = [
    '#ffcf66',
    '#3F00FF',
    '#FF0000',
    '#00ff00',
    '#0000ff',
  ];

  labels= ['sunlight', 'indigo'];
  cpWidth;
  ready = false;

  constructor(public api: ApiService, private platform: Platform, public router: Router) {
    platform.ready().then((readySource) => {
      this.cpWidth = platform.width() - 2 * 16
      console.log('Width: ' + platform.width());
      console.log('Height: ' + platform.height());
      setTimeout(() => this.ready = true)
    });
  }


  set(color) {
    this.selectedColor=`#${color}`
    this.change.next(`#${color}`)
  }


  ngAfterViewInit(): void {
    this.change.pipe(
      throttleTime(30),
      switchMap((val) => this.api.setColor(val)),
      retry(),
    ).subscribe(console.log, console.log)
  }
}
