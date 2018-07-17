import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DialogData} from "../../models";

@Component({
  selector: 'app-error-dialog',
  template: `<h2 mat-dialog-title>{{dialogData?.title}}</h2>
                <mat-dialog-content>{{dialogData?.message}}</mat-dialog-content>
                <mat-dialog-actions>
                  <button mat-button mat-dialog-close>OK</button>
                </mat-dialog-actions>`,
  styles: []
})
export class SimpleDialogComponent {
  dialogData: DialogData;


  constructor(
    public dialogRef: MatDialogRef<SimpleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogData = data;
  }
}
