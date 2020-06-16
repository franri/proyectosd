import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../entities/user';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlLogIn = 'http://localhost:8081/users/signin';
  private urlSignUp = 'http://localhost:8081/users/new';
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  signUp(user: string, password: string) {
    return this.http.post<User>(this.urlSignUp, {user, password});
  }

  login(user: string, password: string) {
    return this.http.post<User>(this.urlLogIn, {user, password})
      .pipe(map(usr => {
        localStorage.setItem('currentUser', JSON.stringify(usr));
        this.currentUserSubject.next(usr);
        return usr;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

}
