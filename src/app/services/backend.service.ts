import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  APARTMENT_URL,
  APT_CREATE,
  APT_JOIN,
  ASSIGNMENTS_URL,
  EXPENSES_URL,
  GROUP_SOCKET_URL,
  LOGIN_URL,
  REGISTER_URL,
  USER_DATA,
  USER_SOCKET_URL
} from "../misc/constants";
import {BehaviorSubject, map} from "rxjs";
import {Apartment, CanvasCalendarEvent, Note, SplitwiseExpenseItem, UserData} from "../misc/types";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CalendarEvent} from "angular-calendar";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  token = localStorage.getItem('token');
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userData: UserData = JSON.parse(localStorage.getItem('userData') || '{}');
  groupData: Apartment = JSON.parse(localStorage.getItem('apartment') || '{}');
  socketUser!: WebSocketSubject<{ type: string, data: UserData }>;
  socketGroup!: WebSocketSubject<{ type: string, data: Apartment }>;
  isConnected = false;
  events: CalendarEvent[] = []
  dataChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private snack: MatSnackBar,
    private router: Router,
  ) {
    if (this.token) {
      this.loggedIn.next(true);
    }
    if (this.token) {
      this.fetchUserData().subscribe(console.log)
      this.fetchApartmentData().subscribe(console.log)
    }
    this.loggedIn.subscribe(loggedIn => {
      if (!loggedIn) {
        this.router.navigate(['/login'])
      }
    })
  }

  get isLoggedIn() {
    return this.loggedIn.value
  }

  get isGroupMember(): boolean {
    return !!this.userData.apartmentId
  }

  get hasSplitWiseKey(): boolean {
    return !!this.userData.meta?.splitwiseApiKey
  }

  get hasCanvasKey(): boolean {
    return !!this.userData.meta?.canvasApiKey
  }

  get onChanges() {
    return this.dataChanged.asObservable()
  }

  login(email: string, password: string) {
    this.http.post<{ token: string }>(LOGIN_URL, {
      email,
      password,
    }).subscribe((res) => {
      this.loggedIn.next(true);
      this.token = res.token;
      localStorage.setItem('token', res.token);
      this.fetchUserData().subscribe(console.log)
      this.fetchApartmentData().subscribe(console.log)
    })
  }

  fetchUserData() {
    return this.http.get<UserData>(USER_DATA).pipe(
      map(userData => {
        this.userData = userData;
        localStorage.setItem('userData', JSON.stringify(userData));
        return userData;
      })
    )
  }

  fetchApartmentData() {
    return this.http.get<Apartment>(APARTMENT_URL).pipe(
      map(groupData => {
        this.groupData = groupData;
        localStorage.setItem('apartment', JSON.stringify(groupData));
        return groupData;
      })
    )
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.clear()
    this.userData = {} as UserData;
    this.groupData = {} as Apartment;
  }

  createApartment(value: string) {
    return this.http.post<Apartment>(APT_CREATE, {
      name: value,
    }).pipe(
      map(res => {
        this.groupData = res;
        localStorage.setItem('apartment', JSON.stringify(res));
        return res;
      })
    )
  }

  register(email: string, password: string, firstName: string, lastName: string) {
    return this.http.post<{ token: string }>(REGISTER_URL, {
      email,
      password,
      firstName,
      lastName,
    }).pipe(
      map(res => {
        this.loggedIn.next(true);
        this.token = res.token;
        localStorage.setItem('token', res.token);
        return res
      })
    )
  }

  connect() {

    // Web Socket Connections
    this.socketUser = webSocket({
      url: USER_SOCKET_URL + "?token=" + this.token,
      openObserver: {
        next: () => {
          console.log('User socket connection opened 🚀');
          this.isConnected = true;
        }
      },
      closeObserver: {
        next: () => {
          console.log('User socket connection closed 😢');
          this.isConnected = false;
        }
      }
    });

    this.socketGroup = webSocket({
      url: GROUP_SOCKET_URL + "?token=" + this.token,
      openObserver: {
        next: () => {
          console.log('Group socket connection opened 🚀');
          this.isConnected = true;
        }
      },
      closeObserver: {
        next: () => {
          console.log('Group socket connection closed 😢');
          this.isConnected = false;
        }
      }
    });

    // Web Socket Subscriptions
    this.socketUser.subscribe({
      next: res => {
        console.log("User socket", res)
        this.updateService(res.data, null)
      },
      error: this.handleError.bind(this)
    })
    this.socketGroup.subscribe({
      next: res => {
        this.updateService(null, res.data)
      },
      error: this.handleError.bind(this)
    })
  }

  disconnect() {
    this.socketUser.complete()
    this.socketGroup.complete()
    this.isConnected = false;
    console.log('Clearing local storage')
    localStorage.clear()
    this.snack.open('You have been logged out', 'OK', {duration: 3000});
  }

  updateKeys(splitwiseApiKey: string | undefined, canvasApiKey: string | undefined) {
    this.userData.meta = {
      splitwiseApiKey: splitwiseApiKey,
      canvasApiKey: canvasApiKey,
    }
    this.sendToUserSocket("keys-update", this.userData)
  }

  updateInfo(firstName: string | undefined, lastName: string | undefined) {
    this.userData.firstName = firstName || this.userData.firstName
    this.userData.lastName = lastName || this.userData.lastName
    this.sendToUserSocket("update", this.userData)
    this.updateService(this.userData, null)
  }

  joinApartment(value: string) {
    return this.http.get<Apartment>(APT_JOIN + "/" + value).pipe(
      map(res => {
        this.updateService(null, res)
        return res;
      })
    )
  }

  saveNoteToApartment(note: Note) {
    if (!this.isConnected) {
      this.snack.open('You must be Online', 'OK', {duration: 3000});
      return
    }
    let newNote = true;
    this.groupData.payload.notes = this.groupData.payload.notes.map(n => {
      if (n.id === note.id) {
        newNote = false;
        return note
      }
      return n
    })
    if (newNote) {
      this.groupData.payload.notes.push(note)
    }
    this.socketGroup.next({
      type: "update",
      data: this.groupData
    })
  }

  sendMessageToApartment(message: string) {
    if (!this.isConnected) {
      this.snack.open('You must be Online', 'OK', {duration: 3000});
      return
    }
    if (!this.groupData.payload.chatMessages) {
      this.groupData.payload.chatMessages = []
    }
    this.groupData.payload.chatMessages.push({
      message,
      sender: {
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        email: this.userData.email,
      },
      timestamp: new Date(),
    })
    this.socketGroup.next({
      type: "update",
      data: this.groupData
    })
  }

  deleteNoteFromApartment(note: Note) {
    if (!this.isConnected) {
      this.snack.open('You must be Online', 'OK', {duration: 3000});
      return
    }
    this.groupData.payload.notes = this.groupData.payload.notes.filter(n => n.id !== note.id)
    this.socketGroup.next({
      type: "update",
      data: this.groupData
    })
  }

  getMemberDetails() {
    this.socketGroup.next({
      type: "get-members",
      data: this.groupData
    })
  }

  getExpenses(): any {
    // return from(import('../../assets/sampleexpense.json')).pipe(
    //   map((data: any) => {
    //     return data.default as any[]
    //   })
    // )
    return this.http.get<{ expenses: SplitwiseExpenseItem[] }>(EXPENSES_URL).pipe(
      map(data => {
        return data.expenses
      })
    )
  }

  getCalendarEvents() {
    return this.http.get<CanvasCalendarEvent[]>(ASSIGNMENTS_URL).pipe(
      map((data) => {
        data.forEach(evnt => {
          this.events.find(e => {
            return e.id === evnt.id
          }) || this.events.push({
            id: evnt.id,
            allDay: evnt.all_day,
            start: new Date(evnt.all_day_date),
            end: new Date(evnt.all_day_date),
            title: evnt.title,
            meta: evnt.description,
          })
        })
        return data
      })
    )
  }

  private handleError(err: any) {
    console.log("User socket error", err)
    this.disconnect()
  }

  private sendToUserSocket(type: string, user: UserData) {
    this.socketUser.next({
      type,
      data: user
    })
  }

  private updateService(userData: UserData | null = null,
                        groupData: Apartment | null = null) {
    if (userData) {
      this.userData = userData;
      localStorage.setItem('userData', JSON.stringify(userData));
    }
    if (groupData) {
      this.groupData = groupData;
      localStorage.setItem('apartment', JSON.stringify(groupData));
    }
    this.dataChanged.next(true)
  }
}

