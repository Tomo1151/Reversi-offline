import*as e from"three";import{sleep as t}from"./Utils.js";import r from"./Player.js";import{Disk as s}from"./Object.js";import*as o from"./Event.js";export default class a extends r{#worker=new Worker("./js/Search.js",{type:"module"});#count;constructor(e,t){super(e,t);this.name="COM";this.#count=0;this.#worker.addEventListener("message",e=>{if(e.data.type=="search"){this.logger.log(`enemy send: put_notice`);this.gameManager.dispatchEvent(new o.PutNoticeEvent(e.data.pos))}});this.gameManager.addEventListener("turn_notice",async e=>{if(e.order!=this.order)return;let t=e.board;this.#count++;if(e.canPut){this.#worker.postMessage({type:"search",table:t})}else{this.gameManager.dispatchEvent(new o.PutPassEvent(this.order))}});this.gameManager.addEventListener("take_corner",e=>{this.#worker.postMessage({type:"corner",order:e.order,corner:e.corner})})}init(){}}
