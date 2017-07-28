import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {  ModalController,NavController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { MessageService } from '../../services/message.service';
import { ChatPage } from '../../pages/message/chat/chat';
import * as _ from 'underscore/underscore';

@Component({
   selector:'page-content-modal',
   templateUrl:'message-modal.html',
   providers:[MessageService]
 })
 
 export class ModalContentPage{

     public connections:any = [];
     private response:any = [];
     private errorMessage:any = '';
     public  selectedConnections:any = [];
     private connectiondatalist:any = [];
     public confirmed:boolean = false;
     public firstname:string = '';
     //private preparedConnections:any = [];

     constructor(public navCtrl: NavController,private messageService:MessageService,private nativeStorage: NativeStorage,public alertCtrl: AlertController,public loadingCtrl: LoadingController,public modalCtrl: ModalController) { 

           
     }
        
      ngOnInit(){

              let loader = this.loadingCtrl.create({
                            content: "Please wait...",
                            duration: 3000,
                            dismissOnPageChange: true
                            });
               loader.present();

                this.nativeStorage.getItem('AuthResponse')
                .then(
                    data => {
                        let key = '';
                        let pageno = 1;
                        let preparedConnections = [];
                        this.firstname = data.property['auth-data'].givenName;
                        console.log('fistname'+this.firstname);
                        this.messageService.getYourConnections(key,pageno,10,'N', 'N', 'N', 'N', 'N',data).subscribe(
                        response => {
                        
                            this.connections = response.data.connectionList;
                            let connectionsvalue = this.selectedConnections;
                            if (this.connections !== null) {
                                   preparedConnections = this.connections.map(function (item) {
                                    var isSelected = _.some(connectionsvalue, { 'encSiebelNr': item.encSiebelNr });
                                    return {
                                        'name': item.fullName,
                                        'firstName': item.firstName,
                                        'imageUrl': item.pictureUrl,
                                        'encSiebelNr': item.encSiebelNr,
                                        'checked': isSelected
                                    };
                                });
                            }

                            //console.log('prepared connections:'+JSON.stringify(preparedConnections));
                            this.connections = preparedConnections;
                            this.connectiondatalist = preparedConnections;
                 
                        }, 
                        err => {
                                let alert = this.alertCtrl.create({
                                title: 'Message Failure',
                                subTitle: err,
                                buttons: ['OK']
                                });
                                alert.present();
                          
                            this.errorMessage = <any>err;
                        });
                            },
                        error => console.error(error)
                    );
      }  

      getItems(ev:any){

                // set val to the value of the searchbar
                    this.connections = this.connectiondatalist;
                    let val = ev.target.value;      
                    // if the value is an empty string don't filter the items
                    if (val && val.trim() != '') {
                    this.connections = this.connections.filter((item) => {
                        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
                    })
                    }
      }

      addToSelected(item){

        
            let checkboxvalue = this.confirmed;
            if (!item.checked) {
                for(let i = 0;i<this.selectedConnections.length;i++){

                    if(this.selectedConnections[i].encSiebelNr === item.encSiebelNr){

                        this.selectedConnections.splice(this.selectedConnections.indexOf(item),1);
                    }
                }


            } else {
                this.selectedConnections.push(item);
            }
      } 

      createNew(){

                let participants =
                this.selectedConnections.map(function (conn) {
                    return conn.firstName;
                });
                //console.log('this firstname :'+this.firstname);
                participants.push(this.firstname);
                let msgTitle = participants.join(', ');
               // let titleencarray = [];


               // this.messageService.(msgTitle,
               //console.log('this selected are:'+JSON.stringify(this.selectedConnections));
                let encsiebel = this.selectedConnections.map(function (conn) {
                    return conn.encSiebelNr;
                });
                //   titleencarray.push(encsiebel);
                //   titleencarray.push(msgTitle);

                

                
                //console.log('participants are:'+participants);
                this.navCtrl.push(ChatPage,{'Titletoshow':msgTitle,'encsiebelvalue':encsiebel,'stateParamId':''});

      }
 }