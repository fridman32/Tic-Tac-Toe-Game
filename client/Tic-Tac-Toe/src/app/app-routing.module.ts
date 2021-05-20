import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from "./lobby/lobby.component";
import { MenuComponent } from "./menu/menu.component";
import { GameComponent } from "./game/game.component";
import { SignUpComponent } from "./sign-up/sign-up.component";

const routes: Routes = [
  {path: '', redirectTo: 'menu', pathMatch:'full'},
  {path: 'game', component: GameComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'lobby', component: LobbyComponent},
  {path: 'signUp', component: SignUpComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
