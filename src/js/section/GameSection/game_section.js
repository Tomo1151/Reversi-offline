import * as THREE from "three";

import GameManager from "../../game_manager.js";
import { model_load } from "../../utils.js";
import { Disk, Board } from "../../object.js";
import Section from "../section.js";
import * as Event from "../../event.js";

export default class GameSection extends Section {
	static MODE_NONE = -1;
	static MODE_PUT = 0;
	static MODE_BANG = 1;

	#selected_hitbox;
	#hitboxes = [];
	#disk_meshes = [];
	#intersects = [];
	#selected_color = new THREE.Color(0xff0000);
	#hitboxe_color = new THREE.Color(0xffffff);
	#mode;

	constructor(game_manager, renderer_manager, scene) {
		super(game_manager, renderer_manager, scene);
		this.renderer_manager.controls.enabled = true;
		const click_controller = new AbortController();
		const mousemove_controller = new AbortController();

		console.log("-- GAME SECTION --");
		window.addEventListener('mousemove', (e) => {
			// console.log("mousemove");
			if (this.game_manager.player.order != this.game_manager.current_turn) return;
			this.renderer_manager.setCursorPoint(e);
			this.renderer_manager.raycaster.setFromCamera(this.renderer_manager.mouse, this.renderer_manager.camera);

			switch (this.#mode) {
				case GameSection.MODE_PUT:
					let intersects = this.renderer_manager.raycaster.intersectObjects(this.#hitboxes);
					if (intersects.length > 0) {
						for (let hitbox of this.#hitboxes) {
							if (hitbox == intersects[0].object) {
								hitbox.material.opacity = 0.75;
								this.#selected_hitbox = hitbox;
							} else {
								hitbox.material.opacity = 0;
							}
						}
					} else {
						this.#selected_hitbox = undefined;
					}

					break;
				case GameSection.MODE_BANG:
					for (let hitbox of this.#hitboxes) hitbox.opacity = 0;
					break;
				default:
					break;
			}
		}, {signal: mousemove_controller.signal});

		this.canvas.addEventListener('mousedown', () => {
			let box = this.#selected_hitbox;
			this.canvas.addEventListener('mouseup', (e) => {
				if (this.#selected_hitbox == box && box != undefined) {
					let order = Disk.WHITE;
					let x = this.#selected_hitbox.cell_x
					let y = this.#selected_hitbox.cell_y
					// console.log(`x: ${x}, y: ${y}`);
					let data = {
						"order": order,
						"x": x,
						"y": y
					};

					// console.log(data)
					this.#selected_hitbox = undefined;

					this.game_manager.dispatchEvent(new Event.PutNoticeEvent(data));
				}
			}, {signal: click_controller.signal});
		}, {signal: click_controller.signal});

		this.game_manager.addEventListener('turn_notice', (e) => {
			if (this.game_manager.player.order != e.order) {
				for (let hitbox of this.#hitboxes) hitbox.material.opacity = 0;
				return;
			}
		});

		// Listener delete
		this.game_manager.addEventListener('game_over', () => {
				console.log("delete click callback");
				click_controller.abort();
				console.log("delete mousemove callback");
				mousemove_controller.abort();
		})

	}

	run() {
	}

	async init() {
		const ambient_light = new THREE.AmbientLight(0xffffff, 1.75);
		const directional_light0 = new THREE.DirectionalLight(0xffffff, 1);
		const directional_light1 = new THREE.DirectionalLight(0xffffff, 1);
		const directional_light2 = new THREE.DirectionalLight(0xffffff, 1);
		const directional_light3 = new THREE.DirectionalLight(0xffffff, 1);
		const lights = [directional_light0, directional_light1, directional_light2, directional_light3];
		directional_light0.position.set(25, 25, -25);
		directional_light1.position.set(-25, 25, -25);
		directional_light2.position.set(-25, 25, 25);
		directional_light3.position.set(-25, 25, -25);
		for (let light of lights) {
			light.intensity = 0.75;
			this.scene.add(light);
		}

		// this.scene.add(new THREE.AxesHelper(500));

		this.object_load();
		// await this.object_load();
	}

	async object_load() {
		await model_load('model_data/Board_low.gltf', (obj) => {
			obj.scene.scale.set(5.05, 5.05, 5.05);
			obj.scene.position.set(0, 0.5, 0);
			for (let i = 0; i < 8; i++) {
				for (let j = 0; j < 8; j++) {
					const g = new THREE.BoxGeometry(10, 1.15, 10);
					const m = new THREE.MeshStandardMaterial({
						color:0xff0000,
						opacity: 0.0,
						transparent: true
					});

					const box = new THREE.Mesh(g, m);
					box.position.set(10*j - (10*3+5), -0.02, 10*i - (10*3+5));
					box.cell_x = j;
					box.cell_y = i;
					box.is_mousedown = false;

					this.#hitboxes.push(box);
					this.scene.add(box);
				}
			}
			this.scene.add(obj.scene);
		});

		await model_load('model_data/Disk_low.gltf', (obj) => {
			let disk;
			for (let i = 0; i < 8; i++) {
				for (let j = 0; j < 8; j++) {
					disk = obj.scene.clone();
					disk.scale.set(4, 4, 4);
					disk.position.set(10*j - (10*3+5), 1.325, 10*i - (10*3+5));
					disk.visible = false;

					this.#disk_meshes.push(disk);
					this.scene.add(disk);
				}
			}
		});

		this.disk_mesh_update(this.game_manager.board.table);
	}


	disk_mesh_update(table) {
		for (let i = 0; i < table.length; i++) {
			switch (table[i].state) {
				case Disk.WHITE:
					this.#disk_meshes[i].rotation.z = 0;
					this.#disk_meshes[i].visible = true;
					break;
				case Disk.BLACK:
					this.#disk_meshes[i].rotation.z = Math.PI;
					this.#disk_meshes[i].visible = true;
					break;
			}
		}
	}

	get mode() {return this.#mode;}
	set mode(mode) {this.#mode = mode;}
}