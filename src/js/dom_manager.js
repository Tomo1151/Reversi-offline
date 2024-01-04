import * as Event from "./event.js"
import { Disk } from "./object.js";
import { sleep } from "./utils.js";
import GameManager from "./game_manager.js";
import GameSection from "./section/GameSection/game_section.js";
import Player from "./player.js";

export default class DOMManager {
	#game_manager;
	#renderer_manager;

	#title_screen_dom;
	#start_button;

	#ingame_ui_container;
	#order_dom;
	#ingame_buttons;
	#put_button;
	#pass_button;
	#bang_button;
	#minimap_button;

	#minimap;

	#result_screen_dom;
	#restart_button;

	#player_anger;
	#player_anger_dom;

	constructor(game_manager, renderer_manager) {
		this.#game_manager = game_manager;
		this.#renderer_manager = renderer_manager;

		this.#title_screen_dom = document.getElementById('title_screen');
		this.#start_button = document.getElementById('start_button');
		this.#ingame_ui_container = document.getElementById('ingame_ui');
		this.#order_dom = document.getElementById('order_div');
		this.#ingame_buttons = document.getElementById('action_button');
		this.#put_button = this.#ingame_buttons.children[0];
		this.#pass_button = this.#ingame_buttons.children[1];
		this.#bang_button = this.#ingame_buttons.children[2];
		this.#minimap_button = this.#ingame_buttons.children[3];
		this.#result_screen_dom = document.getElementById('result_screen');
		this.#restart_button = document.getElementById('restart_button');
		this.#player_anger_dom = document.getElementById('meter_value');
		this.#minimap = this.#game_manager.minimap;
		this.#player_anger_dom.style.height = `0%`;
		this.hide(this.#bang_button);

		this.#game_manager.addEventListener('turn_notice', (e) => {
			if (e.order != this.#game_manager.player.order) return;

			console.log(`ANGER: ${this.#game_manager.player.anger}`)

			if (e.can_put) {
				this.#put_button.classList.remove('disabled');
				this.#pass_button.classList.add('disabled');
				this.#bang_button.classList.remove('disabled');
				if(this.#game_manager.player.anger >= Player.PATIENCE) this.show(this.#bang_button);
			} else {
				this.#put_button.classList.add('disabled');
				this.#pass_button.classList.remove('disabled');
				this.#bang_button.classList.add('disabled');
			}
		});

		this.#game_manager.addEventListener('put_success', (e) => {
			if (e.order == this.#game_manager.player.order) {
				this.#put_button.classList.add('disabled');
				this.#pass_button.classList.add('disabled');
				this.#bang_button.classList.add('disabled');
			}
		});

		this.#game_manager.addEventListener('bang_success', (e) => {
			if (e.order == this.#game_manager.player.order) {
				this.#put_button.classList.add('disabled');
				this.#pass_button.classList.add('disabled');
				this.#bang_button.classList.add('disabled');
				this.hide(this.#bang_button);
			}
		});

		this.#game_manager.addEventListener('game_over', async (e) => {
			// console.log(e)
			await sleep(1500);
			this.#put_button.classList.remove('active');
			this.#put_button.classList.add('disabled');
			this.#bang_button.classList.remove('active');
			this.#bang_button.classList.add('disabled');
			this.draw_result_screen(e.result);
		});

		this.#game_manager.addEventListener('game_restart', () => {
			console.log('GAME RESTART');
			// this.hide(this.#order_dom);
			// this.hide(this.#ingame_buttons);
			this.hide(this.#result_screen_dom);
			this.hide(this.#ingame_ui_container);
			this.show(this.#title_screen_dom);
		});
	}

	addDOMEventListeners() {
		const caution_screen = document.querySelector('.caution');
		const on_orientation_change = () => {
			let width = window.innerWidth;
			let height = window.innerHeight;
			if (width < height) [width, height] = [height, width];
			document.getElementById('main-canvas').style.width = width;
			document.getElementById('main-canvas').style.height = height;

			this.#renderer_manager.renderer.setSize(window.innerWidth, window.innerHeight);
			this.#renderer_manager.renderer.setPixelRatio(window.devicePixelRatio);
			this.#renderer_manager.camera.aspect = window.innerWidth / window.innerHeight;
			this.#renderer_manager.camera.updateProjectionMatrix();
		}

		window.addEventListener('DOMContentLoaded', () => {
			if (screen.orientation.type.indexOf('landscape') == -1) {
				this.show(caution_screen, true);
			}
		});

		screen.orientation.addEventListener('change', async () => {
			if (screen.orientation.type.indexOf('landscape') == -1) {
				caution_screen.classList.remove('fadeOut');
				this.show(caution_screen, true);
			} else {
				await sleep(650);
				on_orientation_change();
				caution_screen.classList.add('fadeOut');
				await sleep(1000);
				this.hide(caution_screen);
			}
		});

		// def Game Events
		document.getElementById('start_button').addEventListener('click', () => {
			// Setting DOMs
			console.log("* send: game_start");console.log("");
			this.order_update();

			this.hide(this.#title_screen_dom);
			// this.show(this.#ingame_buttons);
			// this.show(this.#order_dom, true);
			// this.#minimap.show();
			this.show(this.#ingame_ui_container);
			// this.#bang_button.style.visibility = "visible";

			this.#game_manager.dispatchEvent(new Event.GameStartEvent());
		});

		/*
		 * GameSection
		 */
		this.#put_button.addEventListener('click', () => {
			if (this.#game_manager.current_turn != this.#game_manager.player.order) return;
			this.#bang_button.classList.remove('active');
			this.#put_button.classList.toggle('active');
			this.#game_manager.minimap.deactivate();
			this.#game_manager.current_section.toggle_mode(GameSection.MODE_PUT);
			// console.log(`MODE: ${this.mode}`);
		});

		this.#pass_button.addEventListener('click', () => {
			if (this.#game_manager.current_turn != this.#game_manager.player.order || this.#game_manager.checkTable(this.#game_manager.player.order)) return;
			this.#game_manager.dispatchEvent(new Event.PutPassEvent(this.#game_manager.player.order));
			document.getElementById('pass_button').classList.add('disabled');
		});

		this.#bang_button.addEventListener('click', () => {
			if (this.#game_manager.current_turn != this.#game_manager.player.order) return;
			// this.#game_manager.current_section.mode = GameSection.MODE_BANG;
			this.#put_button.classList.remove('active');
			this.#bang_button.classList.toggle('active');
			this.#game_manager.minimap.toggle_activate();
			this.#game_manager.current_section.toggle_mode(GameSection.MODE_BANG);

			// console.log(`MODE: ${this.mode}`);
		});
		this.#minimap_button.addEventListener('click', () => {
			if (this.#game_manager.current_section.mode == GameSection.MODE_BANG) return;
			this.#game_manager.minimap.toggle();
			this.#minimap_button.classList.toggle('active');
		})

		/*
		 * ResultSection
		 */
		this.#restart_button.addEventListener('click', (e) => {
			// console.log(e);
			this.#game_manager.dispatchEvent(new Event.GameRestartEvent());
		});
	}

	draw_result_screen(result) {
		let dom_result_winner = document.getElementById('winner');
		let dom_result_score = document.getElementById('score');
		let dom_result_black = document.getElementById('order_black');
		let dom_result_white = document.getElementById('order_white');
		let dom_result_time = document.getElementById('time');

		let dt = this.#game_manager.end_time.getTime() - this.#game_manager.start_time.getTime();
		let dh = dt / (1000*60*60);
		let dm = (dh - Math.floor(dh)) * 60;
		let ds = (dm - Math.floor(dm)) * 60;

		let result_str = '';

		// this.hide(this.#order_dom);
		// this.hide(this.#ingame_buttons);
		this.hide(this.#ingame_ui_container);
		this.show(this.#result_screen_dom);

		if (result.result == 'draw') {
			result_str = '引き分け!';
		} else {
			result_str = `${result.result}の勝ち!`;
		}

		dom_result_winner.innerText = result_str;
		dom_result_score.innerText = this.#game_manager.player.point;
		dom_result_white.innerText = `${this.get_player_name()} : ${result.white}`;
		dom_result_black.innerText = `${this.#game_manager.enemy.name} : ${result.black}`;
		dom_result_time.innerText = `${('00' + Math.floor(dh)).slice(-2)}:${('00' + Math.floor(dm)).slice(-2)}:${('00' + Math.round(ds)).slice(-2)}`;
	}

	show(dom, is_flex = false) {
		if (is_flex) {
			dom.style.display = "flex";
		} else {
			dom.style.display = "block";
		}
	}

	get_player_name() {
		return document.getElementById('player_name').value || 'Player';
	}

	order_update(){
		let p = document.getElementById('order');
		// console.log(p)
		if (this.#game_manager.current_turn == Disk.BLACK) {
			p.children[0].innerText = '黒';
			p.classList.remove('order-white');
			p.classList.add('order-black');
		} else {
			p.children[0].innerText = '白';
			p.classList.remove('order-black');
			p.classList.add('order-white');
		}
	}

	anger_update() {
		let anger_value = this.#game_manager.player.anger;
		this.#player_anger_dom.style.height = `${anger_value}%`;
	}

	hide(dom) {
		dom.style.display = "none";
	}

	mode_reset() {
		this.#put_button.classList.remove('active');
		this.#bang_button.classList.remove('active');
		this.#game_manager.current_section.mode = GameSection.MODE_NONE;
	}
}