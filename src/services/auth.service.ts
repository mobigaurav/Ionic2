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
export class AuthService {
     // Resolve HTTP using the constructor
     constructor (private http: Http) {}
     // private instance variable to hold base url
     
     private authUrl = 'https://mobileauthqa.ieee.org/v1/auth/IEEE-Collabratec'; 

     authenticateUser(usernamevalue,passwordvalue):Observable<any>{

                   //let payload = {username:usernamevalue,password:passwordvalue};
                   let payload = "username="+usernamevalue+"&password="+passwordvalue;
                   let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','Origin':'https://mobileauthqa.ieee.org','Referer':'https://mobileauthqa.ieee.org/','Accept':'*' }); // ... Set content type to JSON
                   //console.log('payload is'+payload);
                   let options   = new RequestOptions({ headers: headers}); // Create a request option
                   return this.http.post(this.authUrl,payload,options) // ...using post request
                         .map(this.extractData) // ...and calling .json() on the response to return data
                         .catch(this.handleError); //...errors if any


     }

      private extractData(res:Response) {
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