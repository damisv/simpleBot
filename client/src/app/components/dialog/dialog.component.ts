import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DialogData} from "../../models";

@Component({
  selector: 'app-error-dialog',
  template: `<h2 mat-dialog-title>{{dialogData?.title}}</h2>
                <mat-dialog-content>{{dialogData?.message}}</mat-dialog-content>
                <mat-dialog-actions>
                  <button mat-raised-button mat-dialog-close>No</button>
                  <button mat-raised-button [mat-dialog-close]="true">Yes</button>
                </mat-dialog-actions>`,
  styles: []
})
export class DialogComponent {
  dialogData: DialogData;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogData = data;
  }
}
