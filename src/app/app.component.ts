import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {AuthPage} from '../pages/auth/auth';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { MessagePage } from '../pages/message/message';
import { ModalContentPage } from '../pages/message-modal/message-modal';
import { ChatPage } from '../pages/message/chat/chat';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AuthPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    //used for an example of ngFor and navigation
    this.pages = [
      {title:'Home',component:HomePage},
      {title:'Chat',component:MessagePage},
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  logout(){

    this.nav.push(AuthPage);
    this.nav.setRoot(AuthPage);
  }
}
