import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserService } from '../services/user.service';
import { CellEnum } from "../cell/CellEnum";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  // sender = ""
  // isXturn: boolean = true;
  // divID;

  // @ViewChild('message')
  // private message: ElementRef;

  // @ViewChild("game")
  // private gameCanvas: ElementRef;

  // private context: any;

  private currentPlayer: CellEnum;
  public board: CellEnum[][];
  private isGameOver: boolean;
  public statusMessage;

  constructor(private socket: Socket,
    private userService: UserService) { }

  ngOnInit(): void {
    // this.socket.on("new_message_ingame", (data) => {
    //   var d1 = document.getElementById('chat');
    //   d1.insertAdjacentHTML('beforeend', `<div> ${data.sender}: ${data.message}</div>`);
    // })
    // this.socket.on("changIMG", (data) => {
    //   // this.divID = data;
    //   this.play(data)
    //   console.log(data);
    //   // this.play(data);
    // })
    // this.sender = this.userService.current_user;
    this.newGame();
  }

  get gameOver(): boolean {
    return this.isGameOver;
  }

  newGame() {
    this.board = [];
    for (let row = 0; row < 3; row++) {
      this.board[row] = [];
      for (let col = 0; col < 3; col++) {
        this.board[row][col] = CellEnum.EMPTY;
      }
    }
    this.currentPlayer = CellEnum.X;
    this.isGameOver = false;
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
  }

  move(row: number, col: number): void {
    if (!this.isGameOver && this.board[row][col] === CellEnum.EMPTY) {
      this.board[row][col] = this.currentPlayer;
      if (this.isDrow()) {
        this.statusMessage = 'its a Drow!'
        this.isGameOver = true;
      } else if (this.isWin()) {
        this.statusMessage = `Player ${this.currentPlayer} Won !`;
        this.isGameOver = true;
      } else {
        this.currentPlayer = this.currentPlayer === CellEnum.X ? CellEnum.O : CellEnum.X;
      }
    }
  }

  isDrow(): boolean {
    for (const columns of this.board) {
      for (const col of columns) {
        if (col === CellEnum.EMPTY) {
          return false;
        }
      }
    }
    return !this.isWin();
  }

  isWin(): boolean {
    // horizontal
    for (const columns of this.board) {
      if (columns[0] === columns[1] && columns[0] === columns[2] && columns[0] !== CellEnum.EMPTY) {
        return true;
      }
    }
    //vertical
    for (let col = 0; col < this.board[0].length; col++) {
      if (
        this.board[0][col] === this.board[1][col] &&
        this.board[0][col] === this.board[2][col] &&
        this.board[0][col] !== CellEnum.EMPTY) {
        return true;
      }
    }
    //diagonals
    if (
      this.board[0][0] === this.board[1][1] &&
      this.board[0][0] === this.board[2][2] &&
      this.board[0][0] !== CellEnum.EMPTY
    ) {
      return true;
    }

    if (
      this.board[0][2] === this.board[1][1] &&
      this.board[0][2] === this.board[2][0] &&
      this.board[0][2] !== CellEnum.EMPTY
    ) {
      return true;
    }
    return false;
  }
}
  // sendMessage() {
  //   var msg = this.message.nativeElement.value
  //   console.log(msg);
  //   this.socket.emit('send_message_ingame', {
  //     sender: this.sender,
  //     message: msg
  //   });
  // }

  // play(id) {
  //   // this.divID = id;
  //   if (this.isXturn === true) {
  //     id.src = "/assets/images/X_img.png"
  //     this.isXturn = false;
  //   } else {
  //     id.src = "/assets/images/O_img.jpg"
  //     this.isXturn = true;
  //   }
  //   // this.socket.emit('setIMG', { ID: this.divID.src })
  // }

  // sendIMGsrc(id){
  //   this.socket.emit('setIMG', { ID: id })
  // }

  // isGameOver() {

  // }



