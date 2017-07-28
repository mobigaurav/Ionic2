import { Component, OnInit, ViewEncapsulation ,ViewChild} from '@angular/core';
import {  ModalController,NavController, Nav,NavParams} from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ModalContentPage } from '../message-modal/message-modal';
import { MessageService } from '../../services/message.service';
import { ChatPage } from '../../pages/message/chat/chat';
import * as _ from 'underscore/underscore';


@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
  providers:[MessageService]
})


export class MessagePage implements OnInit{
  @ViewChild(Nav) nav: Nav;
   public messages:any = [];
   public siebCustId:any = '';
   public targetPeople:any = [];
   private response:any = [];
   private errorMessage:any = '';
   constructor(public navCtrl: NavController,public navParams: NavParams,private messageService:MessageService,private nativeStorage: NativeStorage,public alertCtrl: AlertController,public loadingCtrl: LoadingController,public modalCtrl: ModalController) { }
   refreshPage(refresher){

        
              this.nativeStorage.getItem('AuthResponse')
              .then(
                data => {
                     
                        this.siebCustId =  data.property['auth-data'].siebcustid;
                        this.messageService.getMessages(data).subscribe(
                        response => {
                              refresher.complete();
                        let smData = response.data;
                        this.messages = smData.hits;
                        this.targetPeople = smData.targetPeople;
                        this.targetPeople = this.targetPeople.length === 0 ? this.targetPeople : _.uniq(this.targetPeople, function (e) {
                                return e.siebelNr;
                            });
                        this.populateChatParticipantLabel(this.siebCustId);
                 
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

         //this.nav.setRoot(MessagePage);
         let loader = this.loadingCtrl.create({
                            content: "Please wait...",
                            duration: 3000,
                            dismissOnPageChange: true
                            });
               loader.present();

              this.nativeStorage.getItem('AuthResponse')
              .then(
                data => {
                     
                        this.siebCustId =  data.property['auth-data'].siebcustid;
                        this.messageService.getMessages(data).subscribe(
                        response => {
                        let smData = response.data;
                        this.messages = smData.hits;
                        this.targetPeople = smData.targetPeople;
                        this.targetPeople = this.targetPeople.length === 0 ? this.targetPeople : _.uniq(this.targetPeople, function (e) {
                                return e.siebelNr;
                            });
                        this.populateChatParticipantLabel(this.siebCustId);
                 
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


      populateChatParticipantLabel(siebelno) {
         
           let targetpeople = this.targetPeople;       
           _(this.messages).each(function (msg) {

                msg.targetIdsCopy = _.clone(msg.targetIds); // Get All Target Ids
                if (!_.includes(msg.targetIdsCopy, msg.ownerList[0].siebelNr)) {
                    msg.targetIdsCopy.unshift(msg.ownerList[0].siebelNr); // Add msg Owner
                }
             
                msg.targetIdsCopy = msg.targetIdsCopy.filter(function (e) {
                    return e != siebelno;   // Remove myself
                });

                msg.chatParticipants = msg.targetIdsCopy
                    .map(function (target) {
                        return _.find(targetpeople, function (o) {
                            return o.siebelNr === target;
                        });
                    });

                if (msg.chatParticipants[0].pictureUrl === '/assets/img/default-profile-picture.gif') {
                    msg.chatParticipants[0].pictureUrl = 'assets/img/icons/user-default-x3.png';
                }

                msg.cpLength = msg.chatParticipants.length;

                if (msg.cpLength === 1) {
                    msg.chatParticipantLabel = msg.chatParticipants[0].fullName;
                } else {
                    if (msg.cpLength <= 3)
                        msg.chatParticipantLabel = msg.chatParticipants.map(function (cp) {
                            if (cp === undefined) {
                                console.error(' cp is undefined in populateChatParticipantLabel : ' + JSON.stringify(msg.chatParticipants));
                                return '';
                            }
                            return cp.fullName.split(' ')[0];
                        }).join(', ');
                    else {
                        msg.chatParticipantLabel = msg.chatParticipants.map(function (cp) {
                            if (cp === undefined) {
                                //console.log(JSON.stringify(msg.chatParticipants));
                                return '';
                            }
                            return cp.fullName.split(' ')[0];
                        }).slice(0, 3).join(', ') + ' and ' + (msg.cpLength - 3) + ' other' + (msg.cpLength > 4 ? 's' : '');
                    }
                }
        });
    }

     openMessageModal(){

        // let modal = this.modalCtrl.create(ModalContentPage);
        // modal.present;
       // this.nav.push(ModalContentPage);
       this.navCtrl.push(ModalContentPage);

    }

    viewMessage(item){
    console.log('item is following:'+JSON.stringify(item));
    let chatparticipantsarray;
     chatparticipantsarray = item.chatParticipants;
    chatparticipantsarray = chatparticipantsarray.map(function (conn) {
                    return conn.encSiebelNr;
                });
                console.log('encsibel is'+chatparticipantsarray);
      this.navCtrl.push(ChatPage,{"stateParamId":item.msgId,"encsiebelvalue":chatparticipantsarray,'chatparticipants':chatparticipantsarray});
    }
  

}

 