import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
  providers:[AuthService]
})


export class AuthPage{

    username:string = '';
    password:string = '';
    errormessage:string = '';
    mode:'Observable';
    constructor(public navCtrl: NavController,public navParams: NavParams,private authService:AuthService,private nativeStorage: NativeStorage,public alertCtrl: AlertController,public loadingCtrl: LoadingController) {
           this.username = 'mobigaurav@gmail.com';
           this.password = 'qaIEEE';
    }

    private response:any = [];
    private errorMessage:any = '';

    Authenticate(){

         let loader = this.loadingCtrl.create({
                content: "Please wait...",
                duration: 3000,
                dismissOnPageChange: true
                });
                loader.present();

        if(this.username == '' || this.password == ''){

               let alert = this.alertCtrl.create({
                                        title: 'Login',
                                        subTitle: "Please enter username and password to login",
                                        buttons: ['OK']
                                        });
                                        alert.present();
        }else{

                 this.authService.authenticateUser(this.username,this.password).subscribe(
                                response => {
                                    // Emit list event
                                 console.log('payload is following:'+response);
                                 this.navCtrl.setRoot(HomePage);
                                 this.nativeStorage.setItem('AuthResponse', {property: response})
                                    .then(
                                        () => console.log('Stored item!'),
                                        error => console.error('Error storing item', error)
                                    );
                                   
                                }, 
                                err => {

                                        let alert = this.alertCtrl.create({
                                        title: 'Authentication Failed',
                                        subTitle: err,
                                        buttons: ['OK']
                                        });
                                        alert.present();
                                  
                                    this.errorMessage = <any>err;
                                });
        }

       
    }


}

