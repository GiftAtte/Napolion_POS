import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-out-of-stock',
  templateUrl: './out-of-stock.component.html',
  styleUrls: ['./out-of-stock.component.scss']
})
export class OutOfStockComponent {
 constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
 ){
console.log(data.data)
 }
}
