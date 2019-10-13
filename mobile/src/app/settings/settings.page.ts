import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { environment } from "../../environments/environment";
import { servers, StateService } from "../state.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  servers=servers;
  selectedServer;
  prod: boolean;

  constructor(public router: Router, public api: ApiService, private state: StateService) {
    this.prod = environment.production
    state.subscribe(({wsUrl}) => {
      this.selectedServer = servers.find(s => s.wsUrl === wsUrl)
    })
  }


  ngOnInit() {
  }

  setServer(serverConfig) {
    this.state.next(serverConfig);
  }
}
