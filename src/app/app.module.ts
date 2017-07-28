import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule, JsonpModule } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';

import { MyApp } from './app.component';
import { AuthPage } from '../pages/auth/auth';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { MessagePage } from '../pages/message/message';
import { ChatPage } from '../pages/message/chat/chat';
import { ModalContentPage } from '../pages/message-modal/message-modal';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    AuthPage,
    HomePage,
    ListPage,
    MessagePage,
    ModalContentPage,
    ChatPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    JsonpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AuthPage,
    HomePage,
    ListPage,
    MessagePage,
    ModalContentPage,
    ChatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
