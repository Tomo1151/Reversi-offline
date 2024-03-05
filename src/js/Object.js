export class Disk{static WHITE=0;static BLACK=1;static EMPTY=2;x;y;state=Disk.EMPTY;constructor(t,e){this.x=t;this.y=e}put(t){if(this.state!=Disk.EMPTY)return false;t==Disk.WHITE?this.state=Disk.WHITE:this.state=Disk.BLACK}reverse(){if(this.state==Disk.EMPTY)return false;this.state==Disk.WHITE?this.state=Disk.BLACK:this.state=Disk.WHITE}}export class Board{#shockThreshold=200;width;height;table=new Array;constructor(t,e){this.width=t;this.height=e;for(let s=0;s<e;s++){for(let e=0;e<t;e++){let t=new Disk(e,s);this.table.push(t)}}this.init()}get shockThreshold(){return this.#shockThreshold}init(){this.getDisk(3,3).put(Disk.WHITE);this.getDisk(4,3).put(Disk.BLACK);this.getDisk(3,4).put(Disk.BLACK);this.getDisk(4,4).put(Disk.WHITE)}count(e){if(e==Disk.WHITE||e==Disk.BLACK){return this.table.filter(t=>t.state==e).length}else{return false}}raffle(t,e,r,s){let l=[];for(let h=0;h<8;h++){for(let i=0;i<8;i++){if(this.getDisk(i,h).state==Disk.EMPTY)continue;let s=Math.sqrt((i*100+50-e)**2+(h*100+50-r)**2);if(s<this.#shockThreshold){let t=this.getDisk(i,h).state==Disk.BLACK?3.5:.75;let e=1-s/this.#shockThreshold/t;if(Math.random()<e){this.getDisk(i,h).reverse();l.push({x:i,y:h})}}}}return l}getOpponent(t){if(!(t==Disk.WHITE||t==Disk.BLACK))return false;return t==Disk.WHITE?Disk.BLACK:Disk.WHITE}getDisk(e,s){return this.table.find(t=>t.x==e&&t.y==s)}countReversible(t,e,s,i,h){let r=0;let l=s+h;let k=e+i;while(0<=l&&l<this.height&&0<=k&&k<this.width){if(this.getDisk(k,l).state==this.getOpponent(t)){r+=1}else if(this.getDisk(k,l).state==t){return r}else{return 0}l+=h;k+=i}return 0}putJudgement(e,s,i){if(this.getDisk(s,i).state==Disk.EMPTY){const h=[-1,-1,-1,0,0,1,1,1];const r=[-1,0,1,-1,1,-1,0,1];for(let t=0;t<8;t++){if(this.countReversible(e,s,i,r[t],h[t])>0)return true}}return false}reverseDisks(t,e,s,i,h){let r=e+i;let l=t+s;for(let t=0;t<h;t++){this.getDisk(l,r).reverse();r+=i;l+=s}}putDisk(s,i,h){if(this.putJudgement(s,i,h)){const r=[-1,-1,-1,0,0,1,1,1];const l=[-1,0,1,-1,1,-1,0,1];if(this.getDisk(i,h).state!=Disk.EMPTY)return false;this.getDisk(i,h).state=s;for(let e=0;e<8;e++){let t=this.countReversible(s,i,h,l[e],r[e]);if(t>0)this.reverseDisks(i,h,l[e],r[e],t)}return true}return false}info(){let e=new Array(this.width*this.height);for(let t=0;t<e.length;t++){e[t]=this.table[t].state}return{width:this.width,height:this.height,table:e}}view(){for(let i=0;i<this.height;i++){let s="";for(let e=0;e<this.width;e++){let t=this.table[this.width*i+e].state;switch(t){case Disk.WHITE:s+="〇　";break;case Disk.BLACK:s+="◉　";break;default:s+="・　";break}}console.log(s)}}}
