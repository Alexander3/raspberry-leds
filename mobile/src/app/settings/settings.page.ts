import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { environment } from "../../environments/environment";
import { StateService } from "../state.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  servers = [
    {
      name: 'dev',
      wsUrl: 'ws://10.0.0.9:8080/ws',
    },
    {
      name: 'rpi',
      wsUrl: 'ws://10.0.0.39:8080/ws',
    },
    {
      name: 'esp-lamp',
      wsUrl: 'ws://10.0.0.7:81',
    }
  ]
  selectedServer
  prod: boolean;

  constructor(public router: Router, public api: ApiService, private state: StateService) {
    this.prod = environment.production
    state.subscribe(({wsUrl}) => {
      this.selectedServer = this.servers.find(s => s.wsUrl === wsUrl)
    })
  }


  ngOnInit() {
  }

  setServer($event) {
    this.state.next({wsUrl: $event.detail.value.wsUrl})
  }
}
