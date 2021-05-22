import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from "@angular/router";
import { UserService } from '../services/user.service';

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
  userNameFromCookie: string;
  userNamelist: string[] = [];
  reciver;
  sender;
  isInv: boolean;

  constructor(private router: Router,
    private socket: Socket,
    private service: UserService) { }

  ngOnInit(): void {
    //work
    this.socket.on("login", (data) => {
      this.userNameFromCookie = data
      this.userNamelist = data
      this.sender = this.service.current_user
    })
    //work
    this.socket.on("new_message", (data) => {
      console.log(data + "new message");
      this.data = this.data + '\n' + data.sender + ' say: ' + data.mrssage;
    })
    //wirte the number u write in the text box to the bord
    //remove this shit
    this.socket.on('recievedNumber', (data) => {
      console.log(data);
      this.data = data;
    });
    //remove this shit
    //when u join this wirt to the bord you joined room num 1
    this.socket.on('testEvent', (data) => {
      console.log(data);
      this.data = data;
    });
    //remove this shit
    //when u click to join room num 2 this wirt to the bord you joined room num 2
    this.socket.on('room2', (data) => {
      console.log(data);
      this.data = data
      //remove this shit
    }); //when u click to join room num 2 this wirt to the bord you joined room num 2
    this.socket.on('room3', (data) => {
      console.log(data);
      this.data = data
    });

    this.socket.on('joinGame', () => { this.router.navigate(['/game']) })

    this.socket.on('welcome', (data) => {
      console.log(data)
      this.data = data;
    });

    //say jhello to new user 
    this.socket.on('hi', (data) => {
      console.log(data);
      this.data = data
    });


    //#region  just doses r the importent 
    this.socket.on('newUser', (data) => { this.UserList = data });

    this.socket.on('gameInvite', (data) => {
      this.data = data;
      this.join = true;
    });

  }

  //remove this shit
  //triger the node socket.on('emitNumber') func
  emitNumber() {
    this.socket.emit("emitNumber", this.someNumber)
  }
  //remove this shit
  emitroom2() {
    this.socket.emit("emitroom2")
  }
  //remove this shit
  emitroom3() {
    this.socket.emit("emitroom3")
  }
  openChatWindow(room) {
    return 'hi';
  }
  emitInvite(name) {
    this.socket.emit('emitInvite', {
      sender: this.sender,
      reciver: name,
      RoomNumber: 0
    });
  }
  emitJoinGame(data) {
    this.socket.emit('InviteAccapted', data)
  }

  Onuserselect(name) {
    this.reciver = name;
    this.chat = true;
  }
  sendMessage() {
    var msg = this.message.nativeElement.value
    console.log(msg);
    this.socket.emit('send_message', {
      sender: this.sender,
      reciver: this.reciver,
      mrssage: msg
    });
  }


  disableList() {
    for (let i = 0; i < this.UserList.length; i++) {
      var element = <HTMLInputElement>document.getElementById(`${i}`);
      element.disabled = true;
    }
  }
  enableList() {
    for (let i = 0; i < this.UserList.length; i++) {
      var element = <HTMLInputElement>document.getElementById(`${i}`);
      element.disabled = false;
    }
    this.isInv = false;
  }

}