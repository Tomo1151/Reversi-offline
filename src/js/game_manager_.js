import * as THREE from "three";

import RendererManager from "./renderer_manager.js";
import SectionManager from "./section_manager.js";
import Section from "./section/section.js";
import TitleSection from "./section/TitleSection/title_section.js";
import GameSection from "./section/GameSection/game_section.js";
import Player from "./player.js";
import Enemy from "./enemy.js";
import * as Event from "./event.js";
import { Disk, Board } from "./object.js";

export default class GameManager extends THREE.EventDispatcher {
	static BEFORE_START = 0;
	static IN_GAME = 1;
	static GAME_OVER = 2;
	static GAME_STATE;

	#frame;
	#start_time;
	#end_time;
	#scene;
	#current_section;

	#renderer_manager;
	#section_manager;

	#board;
	#player;
	#enemy;

	#current_turn = Disk.BLACK;

	constructor() {
		super();
		this.addEventListener('test', (e) => {
			console.log(e)
			console.log(this)
			this.dispatchEvent({'type': 'test2', 'data': {'x': 1, 'y': 2}})
		});

		this.#frame = 0;

		this.#renderer_manager = new RendererManager(this);
		this.#section_manager = new SectionManager();

		this.#scene = new THREE.Scene();
		this.#section_manager.scene = this.#scene;
		this.#section_manager.renderer_manager = this.#renderer_manager;
		this.#current_section = new GameSection(this, this.#renderer_manager, this.#scene);
		this.#section_manager.change_section(this.#current_section);
		this.GAME_STATE = GameManager.BEFORE_START;

		// def Game Events
		document.getElementById('start_button').addEventListener('click', () => {
			let time = new Date();
			this.#start_time = time;

			this.dispatchEvent(new Event.GameStartEvent());
		});

		this.addEventListener('game_start', async (e) => {
			if (this.GAME_STATE != GameManager.BEFORE_START) return;

			console.log("\n[Event]: game_start");
			this.GAME_STATE = GameManager.IN_GAME;
			this.#board = new Board(8, 8);
			this.#enemy = new Enemy(this, Disk.BLACK);
			this.#player = new Player(this, Disk.WHITE);

			this.#current_section.disk_mesh_update(this.#board.table);
			this.dispatchEvent(new Event.TurnNoticeEvent(Disk.BLACK, this.#board, true))
		});

		this.addEventListener('turn_notice', (e) => {
			// console.log(`[Event] : ${e.type}`)
		});

		this.addEventListener('put_notice', (data) => {
			if (this.GAME_STATE != GameManager.IN_GAME) return;

			// 置かれた情報
			let order = data["order"];
			let result_event;
			let x = data["x"];
			let y = data["y"];

			// 手番じゃないプレイヤーからのイベントは無視
			if (order !== this.#current_turn) return;

			console.log("game_manager received: put_notice");

			if (this.checkCanPut(x, y)) {
				this.put(x, y);
				console.log("game_manager send: put_success");
				this.dispatchEvent(new Event.PutSuccessEvent(this.#current_turn));
			} else {
				console.log("game_manager send: put_fail");
				this.dispatchEvent(new Event.PutFailEvent(this.#current_turn));
			}
		});

		this.addEventListener('confirmed', (e) => {
			console.log("game_manager received: confirmed");
			this.#current_section.disk_mesh_update(this.#board.table);
			this.dispatchEvent(new Event.TurnChangeEvent());
		});

		this.addEventListener('put_pass', () => {
			console.log("game_manager received: put_pass");
			this.dispatchEvent(new Event.TurnChangeEvent());
		})

		this.addEventListener('turn_change', () => {
			console.log("game_manager received: turn_change");
			console.log("");
			console.log(`[${this.#current_turn == 0 ? "Enemy's" : "Player's"} turn]`);

			// 情報書き換え
			this.changeTurn();

			if (this.checkGameOver()) {
				this.dispatchEvent(new Event.GameOverEvent());
			} else {
				// 新たな手番へターンを報告
				this.dispatchEvent(new Event.TurnNoticeEvent(this.#current_turn, this.#board, this.checkTable(this.#current_turn)));

				if (this.#current_turn == Disk.WHITE && !this.checkTable(this.#current_turn)) {
					this.pass();
				}
			}

		});

	}

	run() {
		const tick = () => {
			this.#frame += 1;
			this.#renderer_manager.render(this.#scene);
			requestAnimationFrame(tick)
		}

		tick();
	}

	game_init() {
	}

	checkGameOver () {
		if (!this.checkTable(Disk.BLACK) && !this.checkTable(Disk.WHITE)) {
			this.GAME_STATE = GameManager.GAME_OVER;
			return true;
		} else {
			return false;
		}
	}

	checkTable (order) {
		for (let i = 0; i < this.#board.height; i++) {
			for (let j = 0; j < this.#board.width; j++) {
				if (this.#board.putJudgement(order, j, i)) {
					return true;
				}
			}
		}
		return false;
	}

	checkCanPut(x, y) {
		return this.#board.putJudgement(this.#current_turn, x, y);
	}

	put (x, y) {
		this.#board.putDisk(this.#current_turn, x, y);
		// this.board.view();
	}

	pass () {
		let button = document.getElementById('pass_button');
		button.style.display = 'block';
		button.addEventListener('click', () => {
			this.dispatchEvent(new Event.PutPassEvent());
			button.style.display = 'none';
		});
	}

	changeTurn () {
		this.#current_turn == Disk.BLACK ? this.#current_turn = Disk.WHITE : this.#current_turn = Disk.BLACK;

		let div = document.getElementById('order_div');
		if (this.#current_turn == Disk.BLACK) {
			div.children[0].innerText = 'BLACK';
			div.classList.remove('order-white');
			div.classList.add('order-black');
		} else {
			div.children[0].innerText = 'WHITE';
			div.classList.remove('order-black');
			div.classList.add('order-white');
		}
	}
}