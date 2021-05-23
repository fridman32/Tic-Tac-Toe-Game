import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from "@angular/router";
import { UserService } from '../services/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  @ViewChild('message')
  private message: ElementRef
  //need to add user name!!***************
  UserList: Array<string>
  data = '';
  someNumber = 0;
  join = false
  chat = false
  userNamelist: string[] = [];
  reciver;
  sender;
  isInv: boolean;
  isDisabletTrue: boolean = false;
  invitSent: boolean;

  constructor(private router: Router,
    private socket: Socket,
    private cookieService: CookieService,
    private service: UserService) { }

  ngOnInit(): void {
    this.socket.on("login", (data) => {
      this.userNamelist = data;
      // this.sender = this.service.current_user
      this.sender = this.cookieService.get('userName')
    })

    this.socket.on('joinGame', () => { this.router.navigate(['/game']) })

    this.socket.on('newUser', (data) => {
      this.UserList = data
      this.enableList();
    });

    this.socket.on('gameInvite', (data) => {
      this.data = data;
      this.join = true;
    });

    this.socket.on('cancelInvite', (data) => {
      this.enableList();
      this.invitSent = false;
      this.join = false;
      alert(`${data} cancel is Invite`)

    })

    this.socket.on('decline', (data) => {
      this.enableList();
      this.invitSent = false;
      this.join = false;
      alert('your oponent decline your inventation')
    })
    this.socket.emit("newUser")

  }

  emitInvite(name) {
    this.reciver = name;
    if (this.sender === name) {
      alert("you cant invite yourself ...")
      return
    }
    this.socket.emit('emitInvite', {
      sender: this.sender,
      reciver: name,
      RoomNumber: 0
    });
    this.disableList();
    this.invitSent = true;
  }
  emitJoinGame(data) {
    this.socket.emit('InviteAccapted', data)
  }

  disableList() {
    for (let i = 0; i < this.userNamelist.length; i++) {
      var element = <HTMLInputElement>document.getElementById(`${i}`);
      element.disabled = true;
    }
  }

  enableList() {
    for (let i = 0; i < this.userNamelist.length; i++) {
      var element = <HTMLInputElement>document.getElementById(`${i}`);
      element.disabled = false;
    }
    this.isInv = false;
  }

  cancelInvintation() {
    this.enableList();
    this.invitSent = false;
    this.join = false;
    this.socket.emit("emitCancelInvite", {
      sender: this.sender,
      reciver: this.reciver
    })
  }

  emitDecline(data) {
    this.enableList();
    this.join = false;
    this.socket.emit('emitDecline', data)
  }

}