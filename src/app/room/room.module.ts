import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room/room.component';
import { ReservationComponent } from './reservation/reservation.component';



@NgModule({
  declarations: [
    RoomComponent,
    ReservationComponent
  ],
  imports: [
    CommonModule
  ]
})
export class RoomModule { }
