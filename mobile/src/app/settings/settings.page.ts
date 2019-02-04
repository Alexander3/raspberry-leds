import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../api.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  servers = [
    {
      name: 'dev',
      url: 'http://10.0.0.9:8000',
    },
    {
      name: 'prod',
      url: 'http://10.0.0.21:8000',
    }
  ]
  selectedServer
  prod: boolean;

  constructor(public router: Router, public api: ApiService) {

    this.selectedServer = localStorage.getItem('server') || this.servers[0].url
    this.prod = environment.production
  }


  ngOnInit() {
  }

  setServer($event) {
    localStorage.setItem('server', $event.detail.value)
    this.api.setServer($event.detail.value)
  }
}
