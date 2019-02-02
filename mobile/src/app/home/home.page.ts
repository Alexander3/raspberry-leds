import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ColorPickerDirective} from "ngx-color-picker";
import {retry, switchMap, throttleTime} from "rxjs/operators";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";


// const backend = 'http://10.0.0.9:8000'

const backend = 'http://10.0.0.21:8000'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  change = new Subject();
  @ViewChild(ColorPickerDirective) picker;
  selectedColor: any;
  preset = [
    '#FF0000',
    '#00ff00',
    '#0000ff',
    '#3F00FF',
  ];

  constructor(private http: HttpClient) {
  }


  set(color) {
    this.change.next(`#${color}`)
  }


  ngAfterViewInit(): void {
    this.change.pipe(
      throttleTime(30),
      switchMap((val) => this.http.post(backend + '/set-color', {color: val})),
      retry(),
    ).subscribe(console.log, console.log)
  }
}
