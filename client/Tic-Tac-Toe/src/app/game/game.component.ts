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

  // isXturn: boolean = true;

  @ViewChild('cellID')
  private cellID: ElementRef;

  @ViewChild('message')
  private message: ElementRef

  @ViewChild('messageShow')
  private messageShow: ElementRef

  private currentPlayer: CellEnum;
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
    private userService: UserService) { }

  ngOnInit(): void {
    this.socket.on("getMySign", (data) =>{
      if(this.userService.current_user == data.sender){
        this.currentPlayer = CellEnum.X;
      }else{
        this.currentPlayer = CellEnum.O;
      }
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
    // this.currentPlayer = CellEnum.X;
    this.isGameOver = false;
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
    if (this.turnSign === this.currentPlayer) {
      this.xTurn = true;
    }
  }

  move(row: number, col: number): void {
    if (this.xTurn) {
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
          this.statusMessage = `Player ${this.currentPlayer}'s turn`;
        }
        this.xTurn = !this.xTurn;
      }
    } else {
      alert("not your turn bitch !")
    }
  }

  emitMove(row: number, col: number) {
    this.socket.emit('emitMove', { row: row, col: col, sender: this.userService.current_user, currentPlayer: this.currentPlayer })
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
}