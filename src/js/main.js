"use strict";
console.log("Hello, world!");

const sleep = async (ms) => {return new Promise(res => setInterval(res, ms));}

class Player {
	#order;
	#name = 'player';
	#point = 0;

	#event_manager = new EventManager();

	constructor (order) {
		this.#order = order;

		this.addEventListener('turn_notice', () => {
			console.log(this.name + " received: turn_notice");
			// console.log(e)
		});

		this.addEventListener('put_success', (e) => {
			console.log(this.name + " received: put_success");
			// console.log(e);
			console.log(`${this.name} send: confirmed`);
			gm.dispatchEvent(new ConfirmationEvent());
		});

		this.addEventListener('put_fail', (e) => {
			console.log(this.name + " received: put_fail");
			// console.log(e);
		});

		this.addEventListener('game_over', (e) => {
			console.log(`${this.name} received: game_over`)
			console.log(e);
		});
	}

	addEventListener(event_name, callback) {
		this.#event_manager.addEventListener(event_name, callback);
	}

	dispatchEvent(event, dispatch_object) {
		this.#event_manager.dispatchEvent(event, dispatch_object);
	}

	get order() {return this.#order;}
	get name() {return this.#name;}
	set name(name) {this.#name = name;}
}


class Enemy extends Player {
	constructor (order) {
		super(order);
		this.name = 'enemy';

		this.addEventListener('turn_notice', async (e) => {
			// console.log(e);
			let board = e.board;
			let event;

			if (e.can_put) {
				const data = this.searchFirst(board);
				event = new PutNoticeEvent(data);
			} else {
				event = new PutPassEvent();
			}

			await sleep(1000);
			console.log(`enemy send: ${event.name}`);
			gm.dispatchEvent(event);
		});
	}

	checkCanPut (board) {
		const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
		const dc = [-1, 0, 1, -1, 1, -1, 0, 1];
		for (let i = 0; i < board.height; i++) {
			// console.log("b")
			for (let j = 0; j < board.height; j++) {
				if (board.putJudgement(this.order, j, i)) {
					console.log(`x: ${j}, y: ${i}`)
					return true;
				}
			}
		}
		return false;
	}

	searchFirst (board) {
		const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
		const dc = [-1, 0, 1, -1, 1, -1, 0, 1];
		for (let i = 0; i < board.height; i++) {
			// console.log("b")
			for (let j = 0; j < board.height; j++) {
				if (board.putJudgement(this.order, j, i)) {
					// console.log(`x: ${j}, y: ${i}`)
					return {
						"order": this.order,
						"x": j,
						"y": i
					};
				}
			}
		}
		return false;
	}
}


const board = new Board(8, 8);
const player = new Player(Disk.WHITE);
const enemy = new Enemy(Disk.BLACK);
const gm = new GameManager([player, enemy]);

window.addEventListener('load', () => {
});