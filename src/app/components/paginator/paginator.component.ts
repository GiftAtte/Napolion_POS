import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit{
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 500;
  @Input() limit: number = 20
  pages:number[]=[]
  @Output()
  pageChanged: EventEmitter<number> = new EventEmitter<number>();


  ngOnInit(): void{
    const pageCount = Math.ceil(this.totalItems / this.limit);
   this.pages= this.pageRange(1, pageCount)
    console.log(this.pages)
  }

  pageRange(start: number, end: number): number[]{
    return [...Array(end).keys()].map(el=>el+start)
  }
}
