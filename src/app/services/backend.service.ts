import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {APT_CREATE, LOGIN_URL, REGISTER_URL, USER_DATA} from "../misc/constants";
import {BehaviorSubject, map} from "rxjs";
import {Apartment, UserData} from "../misc/types";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  token = localStorage.getItem('token');
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userData: UserData = JSON.parse(localStorage.getItem('userData') || '{}');

  constructor(
    private http: HttpClient,
  ) {
    if (this.token) {
      this.loggedIn.next(true);
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
      this.fetchUserData().subscribe(res => {
        console.log(res)
      })
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

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('token');
  }

  isGroupMember() {

  }


  createApartment(value: string) {
    return this.http.post<Apartment>(APT_CREATE, {
      name: value,
    })
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
        this.fetchUserData().subscribe(res => {
          console.log(res)
        })
        return res
      })
    )
  }
}
