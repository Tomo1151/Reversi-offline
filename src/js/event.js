class CustomEvent {
	#name;

	constructor (name) {
		this.#name = name;
	}

	get name() {return this.#name;}
}

class GameStartEvent extends CustomEvent {
	static EVENT_NAME = "game_start";

	constructor () {
		super (GameStartEvent.EVENT_NAME);
	}
}

class TurnNoticeEvent extends CustomEvent {
	static EVENT_NAME = "turn_notice";
	#board;

	constructor (data) {
		super (TurnNoticeEvent.EVENT_NAME);
		this.#board = data;
	}

	get board () {return this.#board;}
}

class PutNoticeEvent extends CustomEvent {
	static EVENT_NAME = "put_notice";
	#order;
	#x;
	#y;

	constructor (data) {
		super (PutNoticeEvent.EVENT_NAME);
		this.#order = data["order"];
		this.#x = data["x"];
		this.#y = data["y"];
	}

	get order () {return this.#order;}
	get x () {return this.#x;}
	get y () {return this.#y;}
}

class PutFailEvent extends CustomEvent {
	static EVENT_NAME = "put_fail";

	constructor (data) {
		super (PutFailEvent.EVENT_NAME);
	}
}

class PutSuccessEvent extends CustomEvent {
	static EVENT_NAME = "put_success";

	constructor (data) {
		super (PutSuccessEvent.EVENT_NAME);
	}
}

class EventManager {
	#listeners = [];

	constructor () {}

	addEventListener(event_name, callback) {
		if (event_name in this.#listeners) {
			this.#listeners[event_name].push(callback);
		} else {
			this.#listeners[event_name] = [callback];
		}
	}

	dispatchEvent(event, dispatch_object) {
		if (event.name in this.#listeners) {
			this.#listeners[event.name].forEach((func) => {func(event)});
		} else {
			console.log(`this object doen't has listener: ${event.name}`);
		}
	}
}