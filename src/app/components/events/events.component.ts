import {Component} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {CalendarEvent} from "angular-calendar";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {yellow} from "../../misc/constants";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  events: CalendarEvent[] = [];
  newEvent = new FormGroup({
    title: new FormControl('', [Validators.required]),
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
  })

  constructor(
    private backendService: BackendService,
  ) {
    this.events = this.backendService.events
  }

  addEvent() {
    const {start, end, title} = this.newEvent.value
    console.log({start, end})
    this.backendService.events.push({
      // @ts-ignore
      start: new Date(start),
      // @ts-ignore
      end: new Date(end),
      title: title || '',
      color: {...(yellow)}
    })
  }
}
