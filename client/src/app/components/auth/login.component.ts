import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService, DialogService} from "../../services";
import {finalize} from "rxjs/operators";
import {Account} from "../../models";

@Component({
  selector: 'app-auth',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  myform: FormGroup;
  isLoading = false;
  isLoggedIn = false;
  account: Account;
  nextDate: Date;
  message: {title:string, message: string} = null;

  private dialogData = {title: 'Invalid Credentials',
    message: 'The key&username combination entered is not valid.Please try again.'};

  constructor(private authService: AuthService,
              private dialogService: DialogService) {
    this.authService.$loggedAccount.subscribe((acc) => this.account = acc);
    this.authService.$messages.subscribe((msg) => this.message = msg);
    this.prepareCountdown();
  }

  private prepareCountdown() {
    const tomorrow = new Date();
    tomorrow.setDate((new Date()).getDate()+1);
    tomorrow.setUTCHours(0, 0, 0);
    this.nextDate = tomorrow;
  }

  public login() {
    this.isLoading = true;
    const account = {user: this.myform.get('email').value,
                      privateKey: this.myform.get('password').value, publicKey: ''};
    this.authService.authenticate(account)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe( () => this.isLoggedIn = true,
        (err) => this.dialogService.showSimpleDialogWith(this.dialogData));
  }

  public logout() {
    this.dialogService.showDialogWithYesNo({title: 'Logout ?', message: 'You wish to logout ?'})
      .subscribe((result) => {
        if (result) {
          this.isLoggedIn = false;
          this.authService.logOut();
        }
      });
  }

  public remove() {
    this.dialogService.showDialogWithYesNo({title: 'Remove from queue ?',
      message: 'You wish to remove this user from queue ? This results in a logout.If you will login again, you will get in queue for bot.'})
      .subscribe((result) => {
        if (result) {
          this.authService.removeUser()
            .subscribe((msg) => {
              this.authService.logOut();
              this.isLoggedIn = false;
              this.dialogService.showSimpleDialogWith(msg);
            });
        }
      });
  }

  ngOnInit() {
    this.myform = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }
}

