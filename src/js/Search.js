import{Disk as y}from"./Object.js";(function(){let f=[[120,-20,20,5,5,20,-20,120],[-20,-40,-5,-5,-5,-5,-40,-20],[20,-5,15,3,3,15,-5,20],[5,-5,3,3,3,3,-5,5],[5,-5,3,3,3,3,-5,5],[20,-5,15,3,3,15,-5,20],[-20,-40,-5,-5,-5,-5,-40,-20],[120,-20,20,5,5,20,-20,120]];const a=y.BLACK;self.addEventListener("message",t=>{switch(t.data.type){case"search":const r=t.data.table;const n=l(u(r),a,5);self.postMessage({type:"search",pos:n});break;case"corner":let e=t.data.order==a?1:-1;switch(t.data.corner){case"LU":f[0][1]=20*e;f[1][1]=40*e;f[1][0]=20*e;break;case"RU":f[0][6]=20*e;f[1][6]=40*e;f[1][7]=20*e;break;case"LD":f[6][0]=20*e;f[6][1]=40*e;f[7][1]=20*e;break;case"RD":f[6][7]=20*e;f[6][6]=40*e;f[7][6]=20*e;break}break}});function s(t,r){let n=true;for(let e=0;e<t.length;e++){if(t[e].includes(r))n=false}return n}function l(r,n,l){let f;let o=Number.NEGATIVE_INFINITY;let e=t(r,n);let u=e[0];for(let t of e){let e=b(r,n,t.x,t.y);if(s(e,I(a)))return{order:n,x:t.x,y:t.y};f=-i(e,I(a),l-1,false);if(f>o){o=f;u=t}}return Object.assign({order:n},u)}function i(r,n,l,e){if(l==0)return h(r,n);let f;let o=Number.NEGATIVE_INFINITY;let u=t(r,n);for(let t of u){let e=b(r,n,t.x,t.y);f=-i(e,I(n),l-1,false);o=Math.max(o,f)}if(o==Number.NEGATIVE_INFINITY){if(e)return h(r,n);return-i(r,n,l,true)}return o}function e(r,n,l){let f;let o=Number.NEGATIVE_INFINITY;let u=Infinity;let e=t(r,n);let i=e[0];for(let t of e){let e=b(r,n,t.x,t.y);if(s(e,I(a)))return{order:n,x:t.x,y:t.y};f=-c(e,I(n),l-1,-u,-o,false);if(o==f){if(Math.random()>.5){o=f;i=t}}else if(o<f){o=f;i=t}}return Object.assign({order:n},i)}function c(r,n,l,f,o,e){if(l==0)return h(r,n);let u;let i=Number.NEGATIVE_INFINITY;let a=t(r,n);for(let t of a){let e=b(r,n,t.x,t.y);u=-c(e,I(n),l-1,-o,-f,false);if(u>=o)return u;f=Math.max(f,u);i=Math.max(i,u)}if(i==Number.NEGATIVE_INFINITY){if(e)return h(r,n);return-c(r,n,l,-o,-f,true)}return i}function t(r,n){let l=[];for(let t=0;t<8;t++){for(let e=0;e<8;e++){if(o(r,n,e,t)){l.push({x:e,y:t})}}}return l}function I(e){if(!(e==y.WHITE||e==y.BLACK))return false;return e==y.WHITE?y.BLACK:y.WHITE}function o(t,r,n,l){if(t[l][n]==y.EMPTY){const f=[-1,-1,-1,0,0,1,1,1];const o=[-1,0,1,-1,1,-1,0,1];for(let e=0;e<8;e++){if(N(t,r,n,l,o[e],f[e])>0)return true}}return false}function N(e,t,r,n,l,f){let o=0;let u=n+f;let i=r+l;while(0<=u&&u<8&&0<=i&&i<8){if(e[u][i]==I(t)){o+=1}else if(e[u][i]==t){return o}else{return 0}u+=f;i+=l}return 0}function E(t,e,r,n,l,f){let o=r+l;let u=e+n;for(let e=0;e<f;e++){t[o][u]=T(t[o][u]);o+=l;u+=n}return t}function T(e){if(e==y.EMPTY)return;return e==y.WHITE?y.BLACK:y.WHITE}function b(n,r,l,f){const o=[-1,-1,-1,0,0,1,1,1];const u=[-1,0,1,-1,1,-1,0,1];let i=new Array(8);for(let r=0;r<8;r++){let t=new Array(8);for(let e=0;e<8;e++){t[e]=n[r][e]}i[r]=t}i[f][l]=r;for(let t=0;t<8;t++){let e=N(n,r,l,f,u[t],o[t]);if(e>0)i=E(i,l,f,u[t],o[t],e)}return i}function u(n){let e=new Array(8);for(let r=0;r<8;r++){let t=[];for(let e=0;e<8;e++){t.push(n.table[r*8+e].state)}e[r]=t}return e}function h(r,e){let n=[0,0,0];for(let t=0;t<8;t++){for(let e=0;e<8;e++){n[r[t][e]]+=f[t][e]}}let t=n[0];let l=n[1];return e==y.BLACK?l-t:t-l}function r(r){const e=[-1,-1,-1,0,0,1,1,1];const t=[-1,0,1,-1,1,-1,0,1];for(let t=0;t<r.height;t++){for(let e=0;e<r.height;e++){if(o(u(r),a,e,t)){console.log(`x: ${e}, y: ${t}`);return true}}}return false}})();
