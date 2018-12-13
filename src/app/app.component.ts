import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  format
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl'; // to register french
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { FormGroup, FormControl } from '@angular/forms';

registerLocaleData(localeNl);

const colors: any = {
  red: {
    primary: '#FF7574',
  },
  blue: {
    primary: '#FFD94E',
  },
  yellow: {
    primary: '#1990FF',
  }
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'calendar';
  public clickedDay = null;
  public c = ['#ffbcbc', '#fcebaf', '#bbdeff'];
  public index = 0;
  public data = [
    {
      'duur': 20,
      'name': 'some name',
      color: 'red'
    },
    {
      'duur': 40,
      'name': 'some name 2',
      color: 'blue'
    },
  ];

  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      'title': 'Natuurkunde',
      color: colors.red,
      cssClass: 'pink',
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      start: startOfDay(new Date()),
      'title': 'Scheikunde',
      color: colors.yellow,
      cssClass: 'yellow',
      actions: this.actions
    },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   'title': 'Filosofie',
    //   cssClass: 'blue',
    //   color: colors.blue,
    //   allDay: true
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'A draggable and resizable event',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];
  public first: any;
  
  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const [first] = this.events;
    this.first = first;
  }

  ngDoCheck(): void {
    this.cdr.detectChanges();
  }

  public getFirst(array: Array<any>): any {
    const [first] = array;

    return first.title;
  }

  // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  //   if (isSameMonth(date, this.viewDate)) {
  //     this.viewDate = date;
  //     if (
  //       (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
  //       events.length === 0
  //     ) {
  //       this.activeDayIsOpen = false;
  //     } else {
  //       this.activeDayIsOpen = true;
  //     }
  //   }
  // }

  dayClicked(event: Event) {
    console.log(event);
    event.preventDefault();
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    console.log('xxx');
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log('xxx');
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }

  public getBackgroundColor(): string {
    const colors = ['#ffbcbc', '#fcebaf', '#bbdeff'];

    return colors[(this.index++) % colors.length];
  }
}
