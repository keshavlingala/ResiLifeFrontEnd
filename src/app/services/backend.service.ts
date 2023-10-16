import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  APARTMENT_URL,
  APT_CREATE,
  APT_JOIN,
  GROUP_SOCKET_URL,
  LOGIN_URL,
  REGISTER_URL,
  USER_DATA,
  USER_SOCKET_URL
} from "../misc/constants";
import {BehaviorSubject, map} from "rxjs";
import {Apartment, Note, UserData} from "../misc/types";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {MatSnackBar} from "@angular/material/snack-bar";

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

  constructor(
    private http: HttpClient,
    private snack: MatSnackBar,
  ) {
    if (this.token) {
      this.loggedIn.next(true);
    }
    if (this.token) {
      this.fetchUserData().subscribe(console.log)
      this.fetchApartmentData().subscribe(console.log)
    }
  }

  get isLoggedIn() {
    return this.loggedIn.value
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

  isGroupMember() {

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


    this.socketUser.subscribe({
      next: res => {
        console.log("User socket", res)
        this.userData = res.data
        localStorage.setItem('userData', JSON.stringify(res));
      },
      error: err => {
        console.log("User socket error", err)
        this.snack.open('You have been logged out', 'OK', {duration: 3000});
        this.isConnected = false;
      }
    })
    this.socketGroup.subscribe({
      next: res => {
        console.log("Group socket", res)
        this.groupData = res.data
        localStorage.setItem('apartment', JSON.stringify(res));
      },
      error: err => {
        console.log("Group socket error", err)
        this.snack.open('You have been logged out', 'OK', {duration: 3000});
        this.isConnected = false;
      }
    })
  }

  disconnect() {
    this.socketUser.complete()
    this.socketGroup.complete()
    this.isConnected = false;
    this.snack.open('You have been logged out', 'OK', {duration: 3000});
  }

  updateKeys(splitwiseApiKey: string | undefined, canvasApiKey: string | undefined) {
    this.userData.meta = {
      splitwiseApiKey: splitwiseApiKey,
      canvasApiKey: canvasApiKey,
    }
    this.sendToUserSocket(this.userData)
  }

  updateInfo(firstName: string | undefined, lastName: string | undefined) {
    this.userData.firstName = firstName || this.userData.firstName
    this.userData.lastName = lastName || this.userData.lastName
    this.sendToUserSocket(this.userData)
  }

  joinApartment(value: string) {
    return this.http.get<Apartment>(APT_JOIN + "/" + value).pipe(
      map(res => {
        this.groupData = res;
        localStorage.setItem('apartment', JSON.stringify(res));
        return res;
      })
    )
  }

  saveNoteToApartment(note: Note) {
    if (!this.isConnected) {
      this.snack.open('You must be Online', 'OK', {duration: 3000});
      return
    }
    if (!this.groupData.payload.notes) {
      this.groupData.payload.notes = []
    }
    this.groupData.payload.notes.push(note)
    this.socketGroup.next({
      type: "update",
      data: this.groupData
    })
  }

  private sendToUserSocket(user: UserData) {
    this.socketUser.next({
      type: "update",
      data: user
    })
  }

  private localSetup(token: string,
                     userData: UserData | null = null,
                     groupData: Apartment | null = null) {
    this.token = token;
    localStorage.setItem('token', token);
    if (userData) {
      this.userData = userData;
      localStorage.setItem('userData', JSON.stringify(userData));
    }
    if (groupData) {
      this.groupData = groupData;
      localStorage.setItem('apartment', JSON.stringify(groupData));
    }
    this.loggedIn.next(true);
    this.connect();
  }
}

