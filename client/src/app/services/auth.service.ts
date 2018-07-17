import {Injectable} from '@angular/core';
import {Account} from '../models';
import * as steem from 'steem';
import {BehaviorSubject} from "rxjs";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AuthService {
  static base = 'api';

  private _loggedAccount = new BehaviorSubject<Account>(null);
  set loggedAccount(account: Account) { this._loggedAccount.next(account); }
  get loggedAccount() { return this._loggedAccount.value; }

  public $loggedAccount = this._loggedAccount.asObservable();

  private _messages = new BehaviorSubject(null);
  public $messages = this._messages.asObservable();

  constructor(private http: HttpClient) {
    steem.api.setOptions({ url: 'https://api.steemit.com' });
  }

  private addUser(account: Account) {
    this.http.post<{title: string, message: string}>(AuthService.base, {acc: account})
      .subscribe((msg) => this._messages.next(msg));
  }

  public removeUser() {
    return this.http.post<{title: string, message: string}>(`${AuthService.base}/delete`, {acc: this.loggedAccount});
  }

  public authenticate(account: Account) {
    return new Observable(observer => {
      steem.api.getAccounts([account.user], (err, result) => {
        if (err) { observer.error(err); return; }
        try {
          const publicKey = result[0].posting.key_auths[0][0];
          const privateKey = account.privateKey;
          steem.auth.wifIsValid(privateKey, publicKey);
          account.publicKey = publicKey;
          this.loggedAccount = account;
          this.addUser(account);
          observer.next(true);
          observer.complete();
        } catch (error) { observer.error(error); }
      })
    });
  }

  public logOut() {
    this.loggedAccount = null;
  }
}
