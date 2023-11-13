import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.scss']
})
export class FullCalendarComponent {
    calendarOptions: CalendarOptions = {
    plugins: [
    bootstrap5Plugin,
    dayGridPlugin
  ],
  themeSystem: 'bootstrap5', // important!
  initialView: 'dayGridMonth'
}
}