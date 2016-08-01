/// <reference path="../../typings/globals/three/index.d.ts" />
import { Injectable } from '@angular/core';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

@Injectable()
export class ThreeService {
  private width: number;
  private height: number;
  private camera: PerspectiveCamera;
  private controls: any;
  private scene: Scene;
  private renderer: WebGLRenderer;

  public init(container: HTMLElement) {
    // width and height
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // camera and controls settings
    this.camera = new PerspectiveCamera(60, this.width/this.height, 1, 1000);
    this.camera.position.set(0, 0, 10);
    this.controls.rotateSpeed = 10;
    this.controls.zoomSpeed = 5;
    this.controls.panSpeed = 5;
    this.controls.staticMoving = true;
    this.controls.keys = [65, 83, 68];
    this.controls.addEventListener('change', this.render);

    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    container.appendChild(this.renderer.domElement);
    this.render();
    this.animate();
  }

  constructor() {}

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
  }

}
