// Imports
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw'

@Injectable()
export class MessageService {
     // Resolve HTTP using the constructor
     constructor (private http: Http) {}
     // private instance variable to hold base url
     private messageUrl = 'https://ieee-collabratecapi.ieee.org/v1/'; 
     public messageContainer:any = {};

     getMessages(tokenObject):Observable<any>{
                   
                   //console.log('tokenObject is:'+JSON.stringify(tokenObject));
                   let authTokenValue = tokenObject.property['auth-token'];
                   let authDataValue = tokenObject.property['auth-data'];
                   let awsapikey = tokenObject.property.awsapi.access_token;
                   let startThread = 0;
                   let fetchFirstThread = false;
                   let payload = {"startRecord":startThread,"fetchFirstThread":fetchFirstThread};
                   authDataValue = JSON.stringify(authDataValue);
                   console.log('authdata value:'+authDataValue);
                   let headers = new Headers({'Content-Type': 'application/json','ctSSOToken':authTokenValue,'ctSSOAuthData':authDataValue,'x-api-key':awsapikey}); // ... Set content type to JSON
                   let options   = new RequestOptions({ headers: headers}); // Create a request option
                   let getmessageapi = this.messageUrl+'message/getAllMessages';
                   return this.http.post(getmessageapi,payload,options) // ...using post request
                         .map(this.extractData) // ...and calling .json() on the response to return data
                         .catch(this.handleError); //...errors if any


     }

     getYourConnections(key,pageno,pagelimit,val1,val2,val3,val4,val5,tokenObject):Observable<any>{

                   let authTokenValue = tokenObject.property['auth-token'];
                   let authDataValue = tokenObject.property['auth-data'];
                   let awsapikey = tokenObject.property.awsapi.access_token;
                   authDataValue = JSON.stringify(authDataValue);
                   let headers = new Headers({'Content-Type': 'application/json','ctSSOToken':authTokenValue,'ctSSOAuthData':authDataValue,'x-api-key':awsapikey}); // ... Set content type to JSON
                   let options   = new RequestOptions({ headers: headers}); // Create a request option
                   //this.messageUrl = this.messageUrl+'connections/connect/search?'+'key='+key+'&page='+pageno+'&items='+pagelimit+'&society='+val1+'&section='+val2+'&location='+val3+'&myMentors='+val4+'&myMentees='+val5+'&custKey='+'';
                   let getconnectionsapi = this.messageUrl+'connections/connect/search?'+'key='+key+'&page='+pageno+'&items='+pagelimit+'&society='+val1+'&section='+val2+'&location='+val3+'&myMentors='+val4+'&myMentees='+val5+'&custKey='+'';
                   return this.http.get(getconnectionsapi,options) // ...using post request
                         .map(this.extractData) // ...and calling .json() on the response to return data
                         .catch(this.handleError); //...errors if any

     }

     set MessageContainer(infoarray){

            // this.messageContainer = {};
            // this.messageContainer.msgTitleText = msgTitleText;
            // this.messageContainer.encSelList = encSelList;
            console.log('inforarray is:'+infoarray);
            this.messageContainer = {};
            this.messageContainer.msgTitleText = infoarray[0];
            this.messageContainer.encSelList = infoarray[1];
             

     }

    get getMessageContainer() {
        return this.messageContainer;
    }

    getMessageThread(msgId,messageTimeStamp, timeStampDirection,tokenObject):Observable<any>{

                   let authTokenValue = tokenObject.property['auth-token'];
                   let authDataValue = tokenObject.property['auth-data'];
                   let awsapikey = tokenObject.property.awsapi.access_token;
                   let payload = messageTimeStamp ? (timeStampDirection === 'oldest' ? {
                            'msgId': msgId,
                            'oldestMessageTimeStamp': messageTimeStamp
                         } : {
                            'msgId': msgId,
                            'latestMessageTimeStamp': messageTimeStamp
                         }) : {
                            'msgId': msgId
                         };
                   //let payload = {"startRecord":startThread,"fetchFirstThread":fetchFirstThread};
                   authDataValue = JSON.stringify(authDataValue);
                   let headers = new Headers({'Content-Type': 'application/json','ctSSOToken':authTokenValue,'ctSSOAuthData':authDataValue,'x-api-key':awsapikey}); // ... Set content type to JSON
                   let options   = new RequestOptions({ headers: headers}); // Create a request option
                   //this.messageUrl = this.messageUrl+'message/'+'getMessageThread';
                   let messagethreadapi  = this.messageUrl+'message/'+'getMessageThread';
                   return this.http.post(messagethreadapi,payload,options) // ...using post request
                         .map(this.extractData) // ...and calling .json() on the response to return data
                         .catch(this.handleError); //...errors if any
    }

     sendMessage(messagetext,autolinkerlist,encSelList,tokenObject):Observable<any>{

                   let authTokenValue = tokenObject.property['auth-token'];
                   let authDataValue = tokenObject.property['auth-data'];
                   let awsapikey = tokenObject.property.awsapi.access_token;
                   let payload = {"desc":messagetext,'autoLinkerList':autolinkerlist,"encSelList":encSelList};
                   //let payload = {"startRecord":startThread,"fetchFirstThread":fetchFirstThread};
                   authDataValue = JSON.stringify(authDataValue);
                   let headers = new Headers({'Content-Type': 'application/json','ctSSOToken':authTokenValue,'ctSSOAuthData':authDataValue,'x-api-key':awsapikey}); // ... Set content type to JSON
                   let options   = new RequestOptions({ headers: headers}); // Create a request option
                   //this.messageUrl = this.messageUrl+'message/'+'sendMessage';
                   let sendmessageapi = this.messageUrl+'message/'+'sendMessage';
                   return this.http.post(sendmessageapi,payload,options) // ...using post request
                         .map(this.extractData) // ...and calling .json() on the response to return data
                         .catch(this.handleError); //...errors if any
    }

    replyMessage(messagetext,autolinkerlist,messageid,tokenObject):Observable<any>{

              let authTokenValue = tokenObject.property['auth-token'];
                   let authDataValue = tokenObject.property['auth-data'];
                   let awsapikey = tokenObject.property.awsapi.access_token;
                   let payload = {"desc":messagetext,'autoLinkerList':autolinkerlist,"msgId":messageid};
                   //let payload = {"startRecord":startThread,"fetchFirstThread":fetchFirstThread};
                   authDataValue = JSON.stringify(authDataValue);
                   let headers = new Headers({'Content-Type': 'application/json','ctSSOToken':authTokenValue,'ctSSOAuthData':authDataValue,'x-api-key':awsapikey}); // ... Set content type to JSON
                   let options   = new RequestOptions({ headers: headers}); // Create a request option
                   //this.messageUrl = this.messageUrl+'message/'+'replyMessage';
                   let replymessageapi = this.messageUrl+'message/'+'replyMessage';
                   return this.http.post(replymessageapi,payload,options) // ...using post request
                         .map(this.extractData) // ...and calling .json() on the response to return data
                         .catch(this.handleError); //...errors if any
    }

    getMessageParticipants(msgId,tokenObject):Observable<any>{

                   let authTokenValue = tokenObject.property['auth-token'];
                   let authDataValue = tokenObject.property['auth-data'];
                   let awsapikey = tokenObject.property.awsapi.access_token;
                   let payload = {'msgId': msgId};
                   //let payload = {"startRecord":startThread,"fetchFirstThread":fetchFirstThread};
                   authDataValue = JSON.stringify(authDataValue);
                   let headers = new Headers({'Content-Type': 'application/json','ctSSOToken':authTokenValue,'ctSSOAuthData':authDataValue,'x-api-key':awsapikey}); // ... Set content type to JSON
                   let options   = new RequestOptions({ headers: headers}); // Create a request option
                   //this.messageUrl = this.messageUrl+'message/'+'replyMessage';
                   let getparticipantsapi = this.messageUrl+'message/'+'getMessageParticipants';
                   return this.http.post(getparticipantsapi,payload,options) // ...using post request
                         .map(this.extractData) // ...and calling .json() on the response to return data
                         .catch(this.handleError); //...errors if any
    }

      private extractData(res:Response) {
        //console.log('response is following'+JSON.stringify(res));
        let body = res.json();
        return body || [];
    }

     private handleError(error:any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        //console.log('error is'+JSON.stringify(error));
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

   

}