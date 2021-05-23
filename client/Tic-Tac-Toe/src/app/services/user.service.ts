import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  current_user
  constructor(private cookieService: CookieService) { 
    // this.cookieService.set('userName', this.current_user)
  }
}
