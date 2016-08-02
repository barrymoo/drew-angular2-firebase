/// <reference path="../../typings/globals/three/index.d.ts" />
import { Injectable } from '@angular/core';
import { Scene, PerspectiveCamera, WebGLRenderer, MeshBasicMaterial, BoxGeometry, Mesh } from 'three';
import { TrackballControls } from './trackballcontrols';

@Injectable()
export class ThreeService {
  private width: number;
  private height: number;
  private camera: PerspectiveCamera;
  private controls: any;
  private scene: Scene;
  private renderer: WebGLRenderer;
  public cube: Mesh;

  public init(container: HTMLElement) {
    // width and height
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // camera and controls settings
    this.camera = new PerspectiveCamera(60, this.width/this.height, 1, 1000);
    this.camera.position.set(0, 0, 10);

    this.scene = new Scene();
    this.renderer = new WebGLRenderer({antialias: true});
    this.renderer.setSize(this.width, this.height);
    container.appendChild(this.renderer.domElement);

    this.controls = new TrackballControls();
    this.controls.init(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 10;
    this.controls.zoomSpeed = 5;
    this.controls.panSpeed = 5;
    this.controls.staticMoving = true;

    var geometry = new BoxGeometry(1, 1, 1);
    var material = new MeshBasicMaterial({color: 0x00ff00});
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);

    this.render();
    this.animate();
  }

  constructor() {}

  public render = () => {
    this.renderer.render(this.scene, this.camera);
  }

  public animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.render();
  }

}
