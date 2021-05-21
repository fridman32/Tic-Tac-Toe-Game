import { Component, OnInit, Input } from '@angular/core';
import { CellEnum } from "./CellEnum";

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Input() public piece: CellEnum = CellEnum.EMPTY;
  @Input() public row: number;
  @Input() public col: number;
  constructor() { }

  ngOnInit(): void {
  }

}
