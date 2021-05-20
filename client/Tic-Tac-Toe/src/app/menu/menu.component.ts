import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from "../services/user.service"

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user
  userNameCNT: number = 0;

  constructor(private http: HttpClient,
    private socket: Socket,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
  }

  login(name, pass) {
    this.user = { "name": name, "pass": pass };
    this.http.post<any>("http://localhost:1000/login", { name, pass })
      .subscribe(res => {
        //if res == stats200 send user to lobby ***with his name to socket
        console.log('loged in')
        if (res.statusCode === 200) {
          this.userService.current_user = name
          this.socket.emit("user_conncted", name)
          this.router.navigate(['/lobby'])
        }
        //else tell user his name/pass worng!!
      }, er => {
        console.log(er);
        alert(er.error.error);
      });
  }
}
