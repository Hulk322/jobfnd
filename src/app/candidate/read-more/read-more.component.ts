import { Component, Input, ElementRef, OnChanges, OnInit} from '@angular/core';

@Component({    
    selector: 'read-more',
    template: `
        <div [innerHTML]="currentText" style="display:inline">
        </div>
    `
            // <a style="cursor:pointer" [class.hidden]="hideToggle" (click)="toggleView()" *ngIf="text.length >= maxLength">{{isCollapsed? 'More...':'Less...'}}</a>
})

export class ReadMoreComponent implements OnChanges, OnInit {
    @Input() text: string;
    @Input() maxLength: number = 100;
    currentText: string;
    hideToggle: boolean = true;

    public isCollapsed: boolean = true;

    ngOnInit() {
        // alert(this.maxLength);
        // alert(this.text.length);
      this.isCollapsed = true;
    }

    constructor(private elementRef: ElementRef) {

    }
    toggleView() {
        this.isCollapsed = !this.isCollapsed;
        this.determineView();
    }
    determineView() {
        if (!this.text || this.text.length <= this.maxLength) {
            this.currentText = this.text;
            this.isCollapsed = false;
            this.hideToggle = true;
            return;
        }
        this.hideToggle = false;
        if (this.isCollapsed == true) {
            this.currentText = this.text.substring(0, this.maxLength) + " ";
        } else if(this.isCollapsed == false)  {
            this.currentText = this.text + " ";
        }

    }
    ngOnChanges() {
        this.determineView();       
    }
}