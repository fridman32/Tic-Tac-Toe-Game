import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { MenuComponent } from './menu/menu.component';
import { LobbyComponent } from './lobby/lobby.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CellComponent } from './cell/cell.component';

const socketioConfig: SocketIoConfig = { url: 'http://localhost:1000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    MenuComponent,
    LobbyComponent,
    SignUpComponent,
    CellComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(socketioConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
