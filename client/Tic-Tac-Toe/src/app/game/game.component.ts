import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserService } from '../services/user.service';
import { CellEnum } from "../cell/CellEnum";
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  // isXturn: boolean = true;

  @ViewChild('cellID')
  private cellID: ElementRef;

  @ViewChild('message')
  private message: ElementRef

  @ViewChild('messageShow')
  private messageShow: ElementRef

  currentPlayer: CellEnum;
  public board: CellEnum[][];
  private isGameOver: boolean;
  public statusMessage;
  data = '';
  chat = false
  reciver;
  sender;
  messageData: string = "";
  turnSign = "X";
  xTurn: boolean;

  constructor(private socket: Socket,
    private router: Router,
    private userService: UserService,
    private cookieService: CookieService) { }

  ngOnInit(): void {
    this.socket.on("getMySign", (data) => {
      if (this.userService.current_user == data.sender) {
        this.currentPlayer = CellEnum.X;
        this.newGame();
      } else {
        this.currentPlayer = CellEnum.O;
        this.newGame();
      }
      console.log(this.currentPlayer);
    })
    this.socket.on("move", (data) => {
      // this.allowBTN();
      this.move(data.row, data.col);
    })
    this.socket.on("newGame", (data) => {
      this.newGame();
    })
    this.socket.on("turn", (data) => {
      this.disableBTN();
    })
    this.socket.on("message", (data) => {
      console.log(data);
      console.log("line 54");
      this.messageData = this.messageData + `<div>${data.sender}: ${data.message} <div/>`;
    })
    this.socket.on('exitGame', (data) => {
      console.log("user exit the game");
      if (data !== this.cookieService.get('userName')){   
        alert("you left the game");
        this.router.navigate(["/lobby"]);
      }else{
        alert("your oponent has left the game");
        this.router.navigate(["/lobby"]);
      }
    })
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
    // this.currentPlayer = CellEnum.X;
    this.isGameOver = false;
    console.log(this.currentPlayer + "81");
    this.statusMessage = `Player ${this.turnSign}'s turn`;
    if (this.turnSign === this.currentPlayer) {
      this.xTurn = true;
    }
  }

  move(row: number, col: number): void {
    if (!this.isGameOver && this.board[row][col] === CellEnum.EMPTY) {
      this.currentPlayer = <CellEnum>this.turnSign;
      this.board[row][col] = this.currentPlayer;
      if (this.isDrow()) {
        this.statusMessage = 'its a Drow!'
        this.isGameOver = true;
      } else if (this.isWin()) {
        this.statusMessage = `Player ${this.currentPlayer} Won !`;
        this.isGameOver = true;
      } else {
        this.currentPlayer = this.currentPlayer === CellEnum.X ? CellEnum.O : CellEnum.X;
        this.statusMessage = `Player ${this.currentPlayer}'s turn`;
      }
      this.xTurn = !this.xTurn;
      if (this.turnSign === CellEnum.X) {
        this.turnSign = CellEnum.O;
      } else {
        this.turnSign = CellEnum.X;
      }
    }
  }

  emitMove(row: number, col: number) {
    if (this.xTurn) {
      this.socket.emit('emitMove', { row: row, col: col, sender: this.userService.current_user, currentPlayer: this.turnSign })
    } else {
      alert("it is not your turn")
    }
  }


  emitNewGame() {
    this.socket.emit('emitNewGame', { sender: this.userService.current_user })
  }

  emitTurn() {
    this.socket.emit('emitTurn', { sender: this.userService.current_user })
  }
  emitMessage(inputMessage) {
    console.log(inputMessage);

    this.socket.emit('emitMessage', { sender: this.userService.current_user, message: inputMessage })
  }

  allowBTN() {
    this.cellID.nativeElement.disabled = false;
  }

  disableBTN() {
    this.cellID.nativeElement.disabled = true;
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

  // exitGame() {
  //     this.router.navigate(['/lobby'])
  // }

  emitExit() {
    // if (this.userService.current_user == this.cookieService.get('userName')) {
      this.socket.emit('emitExit', { sender: this.cookieService.get('userName') });
      // this.router.navigate(["/lobby"]);
    // }else{
    //   alert("your oponent has left the game")
    //   this.router.navigate(["/lobby"]);
    // }

  }
}