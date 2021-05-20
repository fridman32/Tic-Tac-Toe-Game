import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  sender = ""
  isXturn: boolean = true;
  divID;

  @ViewChild('message')
  private message: ElementRef;

  @ViewChild("game")
  private gameCanvas: ElementRef;

  private context: any;

  constructor(private socket: Socket,
    private userService: UserService) { }

  ngOnInit(): void {
    this.socket.on("new_message_ingame", (data) => {
      var d1 = document.getElementById('chat');
      d1.insertAdjacentHTML('beforeend', `<div> ${data.sender}: ${data.message}</div>`);
    })
    this.socket.on("changIMG", (data) => {
      // this.divID = data;
      this.play(data)
      console.log(data);
      // this.play(data);
    })
    this.sender = this.userService.current_user;
  }

  rows = [

  ]

  sendMessage() {
    var msg = this.message.nativeElement.value
    console.log(msg);
    this.socket.emit('send_message_ingame', {
      sender: this.sender,
      message: msg
    });
  }

  play(id) {
    // this.divID = id;
    if (this.isXturn === true) {
      id.src = "/assets/images/X_img.png"
      this.isXturn = false;
    } else {
      id.src = "/assets/images/O_img.jpg"
      this.isXturn = true;
    }
    // this.socket.emit('setIMG', { ID: this.divID.src })
  }

  sendIMGsrc(id){
    this.socket.emit('setIMG', { ID: id })
  }

  isGameOver() {

  }
}
