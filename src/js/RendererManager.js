import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";


export default class RendererManager {
	static SCREEN_WIDTH;
	static SCREEN_HEIGHT;

	#gameManager;

	#renderer;
	#camera;
	#controls;
	#mouse;
	#raycaster;

	constructor (gameManager) {
		// set game manager
		this.#gameManager = gameManager;

		// def renderer
		this.#renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById('main-canvas'),
			antialias: false,
			alpha: true,
		});
		// this.#renderer.setPixelRatio(1);
		this.#renderer.setPixelRatio(window.devicePixelRatio);
		this.#renderer.setSize(window.innerWidth, window.innerHeight);

		// def camera
		this.#camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 200);
		this.#camera.position.set(50, 50, 50);

		// def controls
		this.#controls = new OrbitControls(this.#camera, this.#renderer.domElement);
		this.#controls.maxDistance = 135;
		this.#controls.minDistance = 30;
		this.#controls.maxZoom = 2;
		this.#controls.minZoom = 1.25;
		this.#controls.maxPolarAngle = Math.PI/2;
		// this.#controls.enableDamping = true;
		// this.#controls.dampingFactor = 0.2;


		// def mouse vec
		this.#mouse = new THREE.Vector2({x: 0, y: 0});

		// def raycaster
		this.#raycaster = new THREE.Raycaster();

		window.addEventListener('resize', () => {
			this.#renderer.setSize(window.innerWidth, window.innerHeight);
			this.#renderer.setPixelRatio(window.devicePixelRatio);
			this.#camera.aspect = window.innerWidth / window.innerHeight;
			this.#camera.updateProjectionMatrix();
		});
	}

	getIntersectObject(objects) {
		return this.#raycaster.intersectObjects(objects);
	}

	setCursorPoint(mousemove_event) {
		this.#mouse.x = (mousemove_event.clientX / window.innerWidth) * 2 - 1;
		this.#mouse.y = (mousemove_event.clientY / window.innerHeight) * -2 + 1;

		return this.#mouse;
	}

	render(scene) {
		this.#renderer.render(scene, this.#camera);
	}

	get renderer() {return this.#renderer;}
	get raycaster() {return this.#raycaster;}
	get mouse() {return this.#mouse;}
	get camera() {return this.#camera;}
	get controls() {return this.#controls;}
}