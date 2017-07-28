import { Component, OnInit, ViewEncapsulation ,ViewChild} from '@angular/core';
import {  ModalController,NavController, Nav,NavParams} from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { MessageService } from '../../../services/message.service';

import * as _ from 'underscore/underscore';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers:[MessageService]
})

export class ChatPage implements OnInit{

    private paramid:string = '';
    public messageContainer:any = {};
    public chatParticipantLabel:string = '';
    public encsiebleid:any;
   //public timestampdirection:any = 0;
    private response:any = [];
    private errorMessage:any = '';

    public userInfo = {};
    public messages = [];
    public participants = [];
    public startRecord = 0;
    public messageLoaded = false;
    public msgId = '';
    public newMessage = {
      message: '',
      attachedImages: [],
      autoLinkerList:[]
    };

    public oldestMessageTimeStamp = 0;
    public latestMessageTimeStamp = 0;


     constructor(public navCtrl: NavController,public navParams: NavParams,private messageService:MessageService,private nativeStorage: NativeStorage,public alertCtrl: AlertController,public loadingCtrl: LoadingController,public modalCtrl: ModalController) { 

             this.paramid = navParams.get('stateParamId');
             this.chatParticipantLabel =  navParams.get('Titletoshow');
             this.encsiebleid =  navParams.get('encsiebelvalue');
             this.participants =  navParams.get('chatparticipants');
              console.log('paramid value jere'+this.paramid);
             console.log('encsible value jere'+this.encsiebleid);
             if(this.paramid == '' || this.paramid == undefined){
                this.messageContainer.msgtitle = this.chatParticipantLabel;
                this.messageContainer.encsibleidvalue = this.encsiebleid;
             }
             
            //  else if( this.encsiebleid != null && this.encsiebleid!=undefined){

            //        this.messageContainer.encsibleidvalue = this.encsiebleid;
            //  }
   }

   doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
  
              this.nativeStorage.getItem('AuthResponse')
              .then(
                data => {
             
                      this.messageService.getMessageThread(this.paramid,this.oldestMessageTimeStamp,'oldest',data).subscribe(
                        response => {

                             refresher.complete();
                             console.log('response data'+JSON.stringify(response.data.messageThread));
                            if (response.data.messageThread !== null) {
                                this.messages = this.messages.concat(response.data.messageThread);
                                console.log('messages are'+this.messages);
                                if (response.data.messageThread.length > 0)
                                 this.oldestMessageTimeStamp = response.data.messageThread[response.data.messageThread.length - 1].updatets;
                                _(this.messages).forEach(function(val) {
                                    val.author.imageUrl = _.find(this.participants,
                                        function (o) {
                                            return o.siebelNr === val.author.siebelNr;
                                        }).pictureUrl;
                                });
                            }

                            
            
                        }, 
                        err => {

                              refresher.complete();
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

   ngOnInit(){

         //console.log('navparamid is:'+this.paramid);
          if(this.paramid == undefined || this.paramid == ''){

                            // this.messageContainer = this.messageService.getMessageContainer();
                            // console.log('message contaniner'+JSON.stringify(this.messageContainer));
                          
                          
                      }else{

                            let loader = this.loadingCtrl.create({
                            content: "Please wait...",
                            duration: 3000,
                            dismissOnPageChange: true
                            });
               loader.present();

              this.nativeStorage.getItem('AuthResponse')
              .then(
                data => {

                     
                      this.messageService.getMessageThread(this.paramid,'','',data).subscribe(
                        response => {
                                
                                 if (response.data.messageThread.length > 0) {
                                    this.latestMessageTimeStamp = response.data.messageThread[0].updatets;
                                    this.oldestMessageTimeStamp = response.data.messageThread[response.data.messageThread.length - 1].updatets;
                                }

                                this.messages = response.data.messageThread;
                                this.messageService.getMessageParticipants(this.paramid,data).subscribe(
                                response => {

                                    this.participants = response.data.targetPeople;
                                    if (this.participants.length <= 3) {
                                        this.chatParticipantLabel = this.participants.map(function(cp) {
                                            if (cp === undefined)
                                            {
                                                return '';
                                            }
                                            return cp.firstName;
                                        }).join(', ');
                                    } else {
                                        this.chatParticipantLabel = this.participants.map(function(cp) {
                                                if (cp === undefined)
                                                {
                                                    return '';
                                                }
                                                return cp.firstName;
                                            }).slice(0, 3).join(', ') + ' and ' + (this.participants.length - 3) + ' other' + (this.participants.length > 4 ? 's' : '');
                                    }

                _(this.messages).forEach(function(val) {
                    val.author.imageUrl = _.find(this.participants,
                        function (o) {
                            return o.siebelNr === val.author.siebelNr;
                        }).pictureUrl;
                });

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

       
   }

   replyMessage(messageText){

        if(messageText = '')
          return;


     messageText = this.newMessage.message;

      let loader = this.loadingCtrl.create({
                                content: "Please wait...",
                                duration: 3000,
                                dismissOnPageChange: true
                                });
                  loader.present();
               messageText = messageText.replace(/&nbsp;/g, ' ');
              this.nativeStorage.getItem('AuthResponse')
              .then(
                data => {
                    console.log('messageContainer'+JSON.stringify(this.messageContainer));
                    if(Object.keys(this.messageContainer).length>0){
                        
                        this.messageService.sendMessage(messageText,this.newMessage.message['autolinkerlist'],this.messageContainer.encsibleidvalue,data).subscribe(
                        response => {
                                
                                //console.log('response is:'+JSON.stringify(response));
                                  this.paramid = response.data.messageVO.msgId;
                                  if(this.paramid != '' || this.paramid!=undefined){

                                      this.messageContainer = {};
                                  }
                                  setTimeout (() => {
                                    this.newMessage.message = '';
                                    messageText = '';
                                    this.newMessage.autoLinkerList = [];
                                  }, 500)
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
                  }else{

                   this.messageService.replyMessage(messageText,this.newMessage.message['autolinkerlist'],this.paramid,data).subscribe(
                        response => {
                                
                               console.log('reply response is achieved:');

                        this.newMessage.message = '';
                        messageText = '';
                        this.newMessage.autoLinkerList = [];
                        setTimeout(() => {

                         console.log('latest timestamp is:'+this.latestMessageTimeStamp);
                        this.messageService.getMessageThread(this.paramid,this.latestMessageTimeStamp,'latest',data).subscribe(
                        response => {

                                console.log('latest response is:'+JSON.stringify(response));
                                  if (response.data.messageThread !== null) {
                                    this.messages = this.messages.concat(response.data.messageThread);
                                    if (response.data.messageThread.length > 0)
                                        this.latestMessageTimeStamp = response.data.messageThread[0].updatets;
                                    _(this.messages).forEach(function (val) {
                                        val.author.imageUrl = _.find(this.participants,
                                            function (o) {
                                                return o.siebelNr === val.author.siebelNr;
                                            }).pictureUrl;
                                    });
                                }
                              
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

                               
                        }, 500);
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
                  }
              },
            error => console.error(error)
          );
                

   }



}