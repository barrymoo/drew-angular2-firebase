/// <reference path="../../typings/globals/three/index.d.ts" />
import { Injectable } from '@angular/core';
import { Vector2, Vector3, Quaternion, Scene, PerspectiveCamera, WebGLRenderer } from 'three';

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

    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    container.appendChild(this.renderer.domElement);

    this.controls = new TrackballControls;
    this.controls.init(this.camera, this.renderer.domElement);
    // this.controls.rotateSpeed = 10;
    // this.controls.zoomSpeed = 5;
    // this.controls.panSpeed = 5;
    // this.controls.staticMoving = true;
    // this.controls.keys = [65, 83, 68];

    this.render();
    this.animate();

  }

  constructor() {}

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this));
    //this.controls.update();
  }

}

class TrackballControls {
  public domElement: HTMLElement;
  public object: PerspectiveCamera;
  public enabled: boolean = true;

  public STATE: any = {NONE: -1, ROTATE: 0, PAN: 2, TOUCH_ROTATE:3, TOUCH_ZOOM_PAN: 4};
  public screen: any = {left: 0, top: 0, width: 0, height: 0};

  public rotateSpeed: number = 1.0;
  public zoomSpeed: number = 1.2;
  public panSpeed: number = 0.3;

  public noRotate: boolean = false;
  public noZoom: boolean = false;
  public noPan: boolean = false;

  public staticMoving: boolean = false;
  public dynamicDampingFactor: number = 0.2;

  public minDistance: number = 0;
  public maxDistance: number = Infinity;

  public keys: Array<number> = [65 /*A*/, 83 /*S*/, 68 /*D*/];

  public target: Vector3 = new Vector3();

  public EPS: number = 0.000001;

  public lastPosition: Vector3 = new Vector3();

  public state: number = this.STATE.NONE;
  private prevState: number = this.STATE.NONE;

  private eye: Vector3 = new Vector3();

  private movePrev: Vector2 = new Vector2();
  private moveCurr: Vector2 = new Vector2();

  private lastAxis: Vector3 = new Vector3();
  private lastAngle: number = 0;

  private zoomStart: Vector2 = new Vector2();
  private zoomEnd: Vector2 = new Vector2();

  private touchZoomDistanceStart: number = 0;
  private touchZoomDistanceEnd: number = 0;

  private panStart: Vector2 = new Vector2();
  private panEnd: Vector2 = new Vector2();

  public target0: any;
  public position0: any;
  public up0: any;

  public changeEvent: Event = new Event('change');
  public startEvent: Event = new Event('start');
  public endEvent: Event = new Event('end');

  public init(object: PerspectiveCamera, domElement: HTMLElement) {
    this.object = object;
    this.domElement = domElement;
    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();

  	this.domElement.addEventListener('mousedown', this.mousedown, false);
  	this.domElement.addEventListener('mousewheel', this.mousewheel, false);
  	this.domElement.addEventListener('MozMousePixelScroll', this.mousewheel, false);

  	this.domElement.addEventListener('touchstart', this.touchstart, false);
  	this.domElement.addEventListener('touchend', this.touchend, false);
  	this.domElement.addEventListener('touchmove', this.touchmove, false);

  	window.addEventListener('keydown', this.keydown, false);
  	window.addEventListener('keyup', this.keyup, false);

  	this.handleResize();
  	this.update();
  }

  public handleResize = () => {
    let box = this.domElement.getBoundingClientRect();
    let d = this.domElement.ownerDocument.documentElement;
    this.screen.left = box.left + window.pageXOffset - d.clientLeft;
    this.screen.top = box.top + window.pageYOffset - d.clientTop;
    this.screen.width =  box.width;
    this.screen.height = box.height;
  }

  public getMouseOnScreen: any = (function () {
    let vector = new Vector2();

    return function getMouseOnScreen(pageX, pageY) {
      vector.set(
        (pageX - this.screen.left) / this.screen.width,
        (pageY - this.screen.top) / this.screen.height
      );
      return vector;
    };
  }());

  public getMouseOnCircle: any = (function () {
    let vector = new Vector2();
    return function getMouseOnCircle(pageX, pageY) {
      vector.set(
        ((pageX - this.screen.width * 0.5 - this.screen.left) / (this.screen.width * 0.5)),
        ((this.screen.height + 2 * (this.screen.top - pageY)) / this.screen.width)
      );
      return vector;
    };
  }());

  public rotateCamera: any = (function() {
    let axis: Vector3 = new Vector3();
    let quaternion: Quaternion = new Quaternion();
    let eyeDirection: Vector3 = new Vector3();
    let objectUpDirection: Vector3 = new Vector3();
    let objectSidewaysDirection: Vector3 = new Vector3();
    let moveDirection: Vector3 = new Vector3();
    let angle: number;

    return function rotateCamera() {

      moveDirection.set(this.moveCurr.x - this.movePrev.x, this.moveCurr.y - this.movePrev.y, 0 );
      angle = moveDirection.length();

      if (angle) {
        this.eye.copy(this.object.position).sub(this.target);

        eyeDirection.copy(this.eye).normalize();
        objectUpDirection.copy(this.object.up).normalize();
        objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize();

        objectUpDirection.setLength(this.moveCurr.y - this.movePrev.y);
        objectSidewaysDirection.setLength(this.moveCurr.x - this.movePrev.x);

        moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));

        axis.crossVectors(moveDirection, this.eye).normalize();

        angle *= this.rotateSpeed;
        quaternion.setFromAxisAngle(axis, angle);

        this.eye.applyQuaternion(quaternion);
        this.object.up.applyQuaternion(quaternion);

        this.lastAxis.copy(axis);
        this.lastAngle = angle;
      } else if (! this.staticMoving && this.lastAngle) {
        this.lastAngle *= Math.sqrt(1.0 - this.dynamicDampingFactor);
        this.eye.copy(this.object.position).sub(this.target);
        quaternion.setFromAxisAngle(this.lastAxis, this.lastAngle);
        this.eye.applyQuaternion(quaternion);
        this.object.up.applyQuaternion(quaternion);

      }
      this.movePrev.copy(this.moveCurr);
      };
    }());

  public zoomCamera() {
    let factor: number = 0;
    if (this.state === this.STATE.TOUCH_ZOOM_PAN) {
      factor = this.touchZoomDistanceStart / this.touchZoomDistanceEnd;
      this.touchZoomDistanceStart = this.touchZoomDistanceEnd;
      this.eye.multiplyScalar(factor);
    } else {
      factor = 1.0 + (this.zoomEnd.y - this.zoomStart.y) * this.zoomSpeed;
      if (factor !== 1.0 && factor > 0.0) {
        this.eye.multiplyScalar(factor);
        if (this.staticMoving) {
          this.zoomStart.copy(this.zoomEnd);
        } else {
          this.zoomStart.y += (this.zoomEnd.y - this.zoomStart.y) * this.dynamicDampingFactor;
        }
      }
    }
  };

  public panCamera: any = (function() {
    let mouseChange: Vector2 = new Vector2();
    let objectUp: Vector3 = new Vector3();
    let pan: Vector3 = new Vector3();

    return function panCamera() {

      mouseChange.copy(this.panEnd).sub(this.panStart);

      if (mouseChange.lengthSq()) {

        mouseChange.multiplyScalar(this.eye.length() * this.panSpeed);

        pan.copy(this.eye).cross(this.object.up).setLength(mouseChange.x);
        pan.add(objectUp.copy(this.object.up).setLength(mouseChange.y));

        this.object.position.add(pan);
        this.target.add(pan);

        if (this.staticMoving) {
          this.panStart.copy(this.panEnd);
        } else {
          this.panStart.add(mouseChange.subVectors(this.panEnd, this.panStart).multiplyScalar(this.dynamicDampingFactor));
        }
      }
    };
  }());

  public checkDistances() {
    if (! this.noZoom || ! this.noPan) {
      if (this.eye.lengthSq() > this.maxDistance * this.maxDistance) {
        this.object.position.addVectors(this.target, this.eye.setLength(this.maxDistance));
        this.zoomStart.copy(this.zoomEnd);
      }
      if (this.eye.lengthSq() < this.minDistance * this.minDistance) {
        this.object.position.addVectors(this.target, this.eye.setLength(this.minDistance));
        this.zoomStart.copy(this.zoomEnd);
      }
    }
  };

  public update() {
    this.eye.subVectors(this.object.position, this.target);
    if (!this.noRotate) {
      this.rotateCamera();
    }
    if (!this.noZoom) {
      this.zoomCamera();
    }
    if (!this.noPan) {
      this.panCamera();
    }
    this.object.position.addVectors(this.target, this.eye);
    this.checkDistances();
    this.object.lookAt(this.target);
    if (this.lastPosition.distanceToSquared(this.object.position) > this.EPS) {
      dispatchEvent(this.changeEvent);
      this.lastPosition.copy(this.object.position);
    }
  };

  public reset = () => {
    this.state = this.STATE.NONE;
    this.prevState = this.STATE.NONE;
    this.target.copy(this.target0);
    this.object.position.copy(this.position0);
    this.object.up.copy(this.up0);
    this.eye.subVectors(this.object.position, this.target);
    this.object.lookAt(this.target);
    dispatchEvent(this.changeEvent);
    this.lastPosition.copy(this.object.position);
  };

  public keydown = (event: KeyboardEvent) => {
    if (this.enabled === false) return;
    window.removeEventListener('keydown', this.keydown);
    this.prevState = this.state;
    if (this.state !== this.STATE.NONE) {
      return;
    } else if (event.keyCode === this.keys[ this.STATE.ROTATE ] && ! this.noRotate) {
      this.state = this.STATE.ROTATE;
    } else if (event.keyCode === this.keys[ this.STATE.ZOOM ] && ! this.noZoom) {
      this.state = this.STATE.ZOOM;
    } else if (event.keyCode === this.keys[ this.STATE.PAN ] && ! this.noPan) {
      this.state = this.STATE.PAN;
    }
  };


  public keyup = (event: KeyboardEvent) => {
    if (this.enabled === false) return;
    this.state = this.prevState;
    window.addEventListener('keydown', this.keydown, false);
  };


  public mousedown = (event: MouseEvent) => {
    if (this.enabled === false) return;
    event.preventDefault();
    event.stopPropagation();
    if (this.state === this.STATE.NONE) {
      this.state = event.button;
    }

    if (this.state === this.STATE.ROTATE && ! this.noRotate) {
      this.moveCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));
      this.movePrev.copy(this.moveCurr);
    } else if (this.state === this.STATE.ZOOM && ! this.noZoom) {
      this.zoomStart.copy(this.getMouseOnScreen(event.pageX, event.pageY));
      this.zoomEnd.copy(this.zoomStart);
    } else if (this.state === this.STATE.PAN && ! this.noPan) {
      this.panStart.copy(this.getMouseOnScreen(event.pageX, event.pageY));
      this.panEnd.copy(this.panStart);
    }
    document.addEventListener('mousemove', this.mousemove, false);
    document.addEventListener('mouseup', this.mouseup, false);
    dispatchEvent(this.startEvent);
  };

  public mousemove = (event: MouseEvent) => {
    if (this.enabled === false) return;
    event.preventDefault();
    event.stopPropagation();
    if (this.state === this.STATE.ROTATE && ! this.noRotate) {
      this.movePrev.copy(this.moveCurr);
      this.moveCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));
    } else if (this.state === this.STATE.ZOOM && ! this.noZoom) {
      this.zoomEnd.copy(this.getMouseOnScreen(event.pageX, event.pageY));
    } else if (this.state === this.STATE.PAN && ! this.noPan) {
      this.panEnd.copy(this.getMouseOnScreen(event.pageX, event.pageY));
    }
  };

  public mouseup = (event: MouseEvent) => {
    if (this.enabled === false) return;
    event.preventDefault();
    event.stopPropagation();
    this.state = this.STATE.NONE;
    document.removeEventListener('mousemove', this.mousemove);
    document.removeEventListener('mouseup', this.mouseup);
    dispatchEvent(this.endEvent);
  };

  public mousewheel = (event: MouseEvent) => {
		if (this.enabled === false) return;
		event.preventDefault();
		event.stopPropagation();
		let delta: number = 0;
		if (event.detail) {
			// Firefox
			delta = - event.detail / 3;
		}
		this.zoomStart.y += delta * 0.01;
		dispatchEvent(this.startEvent);
		dispatchEvent(this.endEvent);
	};

	public touchstart = (event: TouchEvent) => {
		if (this.enabled === false) return;
		switch (event.touches.length) {
			case 1:
				this.state = this.STATE.TOUCH_ROTATE;
				this.moveCurr.copy(this.getMouseOnCircle(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY));
				this.movePrev.copy(this.moveCurr);
				break;
			default: // 2 or more
				this.state = this.STATE.TOUCH_ZOOM_PAN;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				this.touchZoomDistanceEnd = this.touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);
				var x = (event.touches[ 0 ].pageX + event.touches[ 1 ].pageX) / 2;
				var y = (event.touches[ 0 ].pageY + event.touches[ 1 ].pageY) / 2;
				this.panStart.copy(this.getMouseOnScreen(x, y));
				this.panEnd.copy(this.panStart);
				break;
		}
		dispatchEvent(this.startEvent);
	};

	public touchmove = (event: TouchEvent) => {
		if (this.enabled === false) return;
		event.preventDefault();
		event.stopPropagation();

		switch (event.touches.length) {
			case 1:
				this.movePrev.copy(this.moveCurr);
				this.moveCurr.copy(this.getMouseOnCircle(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY));
				break;

			default: // 2 or more
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				this.touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);
				var x = (event.touches[ 0 ].pageX + event.touches[ 1 ].pageX) / 2;
				var y = (event.touches[ 0 ].pageY + event.touches[ 1 ].pageY) / 2;
				this.panEnd.copy(this.getMouseOnScreen(x, y));
				break;
		}
	};

	public touchend = (event: TouchEvent) => {
		if (this.enabled === false) return;
		switch (event.touches.length) {
			case 0:
				this.state = this.STATE.NONE;
				break;

			case 1:
				this.state = this.STATE.TOUCH_ROTATE;
				this.moveCurr.copy(this.getMouseOnCircle(event.touches[ 0 ].pageX, event.touches[ 0 ].pageY));
				this.movePrev.copy(this.moveCurr);
				break;
		}
		dispatchEvent( this.endEvent );
	};

	private dispose() {
		this.domElement.removeEventListener('mousedown', this.mousedown, false);
		this.domElement.removeEventListener('mousewheel', this.mousewheel, false);
		this.domElement.removeEventListener('MozMousePixelScroll', this.mousewheel, false); // firefox

		this.domElement.removeEventListener('touchstart', this.touchstart, false);
		this.domElement.removeEventListener('touchend', this.touchend, false);
		this.domElement.removeEventListener('touchmove', this.touchmove, false);

		document.removeEventListener('mousemove', this.mousemove, false);
		document.removeEventListener('mouseup', this.mouseup, false);

		window.removeEventListener('keydown', this.keydown, false);
		window.removeEventListener('keyup', this.keyup, false);
	};
}
