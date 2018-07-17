import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material";
import {DialogData} from "../models";
import {SimpleDialogComponent, DialogComponent} from "../components/dialog";

@Injectable()
export class DialogService {

  constructor(public dialog: MatDialog) {}

  public showSimpleDialogWith(data: DialogData): void {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      width: '250px',
      data: data
    });
    //
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }

  public showDialogWithYesNo(data: DialogData) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: data
    });
    return dialogRef.afterClosed();
  }

}
