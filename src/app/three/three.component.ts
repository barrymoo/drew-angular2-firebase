import { Component, OnInit, Input } from '@angular/core';
import { ThreeService } from '../three.service';

@Component({
  moduleId: module.id,
  selector: 'app-three',
  templateUrl: 'three.component.html',
  styleUrls: ['three.component.css'],
  providers: [ThreeService]
})
export class ThreeComponent implements OnInit {

  constructor(private threeService: ThreeService) {}

  @Input()
  public set container(value: HTMLElement){
    if (value) {
      this.threeService.init(value);
    }
  }

  ngOnInit() {
  }

}
