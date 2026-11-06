"use strict";
firebase.initializeApp(CFG.fb);
const auth=firebase.auth(),db=firebase.firestore();
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rid=()=>Math.random().toString(36).slice(2,9);
const clone=o=>JSON.parse(JSON.stringify(o));
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const S=352,M=16,TS=64,NP=25,SLOT_W=6*60000,STK_W=5*60000;
const DEF=()=>({coins:50,xp:0,rec:{},ow:[],sat:{},codes:{},inv:[{id:rid(),k:"seed",t:"marul",n:3},{id:rid(),k:"seed",t:"havuc",n:2}],grid:Array(NP).fill(null),pets:{},know:{},orders:[],sold:0,banned:false,tradeOpen:true,adminTs:0,bought:{s:0,i:{}},fav:{}});
let U=null,uid=null,G={tradesOpen:true,aiEnabled:true,announce:"",growth:1,weather:"",event:"",nonce:0,maintenance:false,maintMsg:"",wxAuto:true,evAuto:true,wxList:[],evList:[],eco:{},ovr:{},codes:{},shopOpen:true,petsOpen:true,labOpen:true},trades=[],tool={m:"plant"},selSeed=null,selUse=null,tab="garden",labTab="ord",unsub=[],claiming=new Set();
let ST=Object.assign({sound:true,anim:true,low:false},JSON.parse(localStorage.getItem("kb_set")||"{}"));
const lvl=()=>lvlOf(U.xp);
function applySet(){localStorage.setItem("kb_set",JSON.stringify(ST));document.body.classList.toggle("noanim",!ST.anim)}
const errMsg=e=>e&&e.code==="permission-denied"?"İzin yok: Firestore kuralları yüklenmemiş (OKUMA.txt, 3. adım).":"Hata: "+((e&&(e.code||e.message))||"bilinmiyor");

/* ---------- ses / bildirim ---------- */
let AC;function sfx(f,d=.1,t="square"){if(!ST.sound)return;try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.type=t;o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.stop(AC.currentTime+d)}catch(e){}}
function toast(t,bad){const e=document.createElement("div");e.className="t"+(bad?" bad":"");e.textContent=t;$("toast").appendChild(e);setTimeout(()=>e.remove(),3600)}
function say(t,bad){const m=$("msg");m.textContent=t;m.className="msg"+(bad?" bad":"");sfx(bad?160:520,.12)}

/* ---------- dünya: hava, etkinlik, stok ---------- */
const EM=k=>{const v=(G.eco||{})[k];return typeof v==="number"&&v>0?v:1};
const PL0=clone(PL),GR0=clone(GR),PE0=clone(PETS);
function applyOvr(){const o=G.ovr||{};[[PL,PL0,o.pl],[GR,GR0,o.gr],[PETS,PE0,o.pets]].forEach(a=>{const T=a[0],B=a[1],V=a[2]||{};Object.keys(B).forEach(k=>{Object.assign(T[k],clone(B[k]));const v=V[k];if(!v)return;Object.keys(v).forEach(f=>{const x=v[f];if(x===null||x===undefined)return;if(f==="off")T[k].off=!!x;else if(typeof x==="number"&&x>=0)T[k][f]=x})})})}
const sickCh=P=>Math.min(1,Math.max(0,(RAR[P.rar].sk||.25)*EM("sick")));
function natWeather(){const r=rng(Math.floor(Date.now()/SLOT_W)*7919+13)()*WSUM;let a=0;for(const w of WL){a+=w.p;if(r<a)return w}return WX.gunes}
function activeWeathers(){
 const n=Date.now(),out=[],seen={},add=w=>{if(w&&!seen[w.id]){seen[w.id]=1;out.push(w)}},forced=G.weather&&WX[G.weather];
 if(G.wxAuto!==false&&!forced)add(natWeather());
 if(forced)add(WX[G.weather]);
 (G.wxList||[]).forEach(o=>{if(o&&WX[o.id]&&(!o.u||o.u>n))add(WX[o.id])});
 if(!out.length)add(WX.gunes);return out}
const weatherNow=()=>activeWeathers()[0];
function activeEvents(){
 const n=Date.now(),out=[],seen={},add=id=>{if(EV[id]&&!seen[id]){seen[id]=1;out.push(Object.assign({id},EV[id]))}};
 if(G.evAuto!==false&&G.event!=="none"&&n%3600000<20*60000)add(EVL[Math.floor(n/3600000)%EVL.length]);
 if(G.event&&G.event!=="none")add(G.event);
 (G.evList||[]).forEach(o=>{if(o&&(!o.u||o.u>n))add(o.id)});
 return out}
const eventNow=()=>activeEvents()[0]||null;
function FXN(){const r={g:1,sell:1,xp:1,mut:1,gold:1,sdisc:1,gdisc:1};activeEvents().forEach(e=>{const f=e.fx||{};for(const k in r)if(f[k])r[k]*=f[k]});return r}
const stockKey=()=>Math.floor(Date.now()/STK_W)+(G.nonce||0)*100003;
function stocks(){
 const r=rng(stockKey()*31+7),es=new Set(),sd={},gr={},sm=EM("stock");activeEvents().forEach(e=>(e.seeds||[]).forEach(x=>es.add(x)));
 const qty=(R,b)=>Math.max(1,Math.round((R.q[0]+Math.floor(b*(R.q[1]-R.q[0]+1)))*sm));
 Object.keys(PL).forEach(k=>{const P=PL[k],R=RAR[P.rar],a=r(),b=r();if(P.off)return;if(P.rar==="event"){if(es.has(k))sd[k]=qty(R,b);return}if(a<R.ch)sd[k]=qty(R,b)});
 if(PL.marul&&!PL.marul.off)sd.marul=Math.max(sd.marul||0,3);
 Object.keys(GR).forEach(k=>{const R=GR[k],a=r(),b=r();if(R.craft||R.off)return;if(a<R.ch)gr[k]=qty(R,b)});
 ["ure","supfos","potas"].forEach(k=>{if(!GR[k].off)gr[k]=Math.max(gr[k]||0,3)});
 return{sd,gr};
}
const sPrice=k=>Math.max(1,Math.round(PL[k].seed*EM("seed")*FXN().sdisc)),gPrice=k=>Math.max(1,Math.round(GR[k].price*EM("gear")*FXN().gdisc));
function bought(key){const k=stockKey();if(U.bought.s!==k)U.bought={s:k,i:{}};return U.bought.i[key]||0}

/* ---------- envanter ---------- */
function addItem(e){
 e=clone(e);
 if(e.k==="fruit"){U.inv.push(Object.assign(e,{id:rid()}));return}
 const f=U.inv.find(x=>x.k===e.k&&x.t===e.t);if(f)f.n+=e.n||1;else U.inv.push({id:rid(),k:e.k,t:e.t,n:e.n||1});
}
function takeId(id,n){const i=U.inv.findIndex(x=>x.id===id);if(i<0)return null;const x=U.inv[i];if(x.k!=="fruit"&&n<x.n){x.n-=n;return{k:x.k,t:x.t,n}}U.inv.splice(i,1);return x}
const cnt=(k,t)=>(U.inv.find(x=>x.k===k&&x.t===t)||{n:0}).n;
function useOne(k,t){const x=U.inv.find(y=>y.k===k&&y.t===t);if(!x||x.n<1)return false;x.n--;if(x.n<1)U.inv.splice(U.inv.indexOf(x),1);return true}
function norm(){const m={},o=[];(U.inv||[]).forEach(x=>{if(!x.id)x.id=rid();if(x.k==="fruit"){o.push(x);return}const key=x.k+x.t;if(m[key])m[key].n+=x.n||1;else{x.n=x.n||1;m[key]=x;o.push(x)}});U.inv=o.filter(x=>x.k==="fruit"?PL[x.t]:(x.k==="seed"?PL[x.t]:GR[x.t]))}
function unit(e){if(e.k==="fruit"){let b=1;(e.m||[]).forEach(m=>b+=MUT[m].x-1);return Math.max(1,Math.round(PL[e.t].price*e.s*b*EM("sell")*FXN().sell))}if(e.k==="seed")return Math.max(1,Math.round(PL[e.t].seed*.6));return Math.max(1,Math.round(GR[e.t].price*.6))}
const total=(e,n)=>unit(e)*(e.k==="fruit"?1:(n||e.n||1));
function iv(e){
 if(e.k==="fruit"){const P=PL[e.t];return{e:P.e,n:P.ad,s:e.kg.toFixed(2)+" kg",m:(e.m||[]).map(x=>MUT[x].e).join(""),c:RAR[P.rar].c,mt:(e.m||[]).map(x=>MUT[x].ad).join(", ")}}
 if(e.k==="seed"){const P=PL[e.t];return{e:"🌱"+P.e,n:P.ad+" tohumu",s:RAR[P.rar].ad,m:"",c:RAR[P.rar].c,mt:""}}
 const g=GR[e.t];return{e:g.e,n:g.ad,s:g.f,m:"",c:"#3d5a49",mt:""};
}
function chip(e,n){const v=iv(e);return'<span class="pill" style="border-color:'+v.c+'">'+v.e+" "+esc(v.n)+(e.k!=="fruit"?" ×"+(n||e.n||1):"")+(v.m?" "+v.m:"")+(e.k==="fruit"?" "+v.s:"")+' <span class="val">'+total(e,n)+"🪙</span></span>"}

/* ---------- bilgi defteri ---------- */
function learn(id){if(!U||U.know[id]||!CON[id])return;U.know[id]=Date.now();toast("📖 Yeni bilgi: "+CON[id].t);addXp(5);sfx(820,.25);dirty()}
function addXp(n){n=Math.max(1,Math.round(n*EM("xp")*FXN().xp));const o=lvl();U.xp+=n;if(lvl()>o){toast("Seviye atladın! Seviye "+lvl()+" · yeni karolar açıldı",0);sfx(880,.3)}}

/* ---------- giriş / kayıt ---------- */
let mode="l";
function setMode(m){mode=m;$("bl").className=m==="l"?"on":"";$("br").className=m==="r"?"on":"";$("nm").hidden=m==="l";$("go").textContent=m==="l"?"Giriş yap":"Hesap oluştur";$("err").textContent=""}
$("bl").onclick=()=>setMode("l");$("br").onclick=()=>setMode("r");
$("go").onclick=async()=>{
 const e=$("em").value.trim(),p=$("pw").value,n=$("nm").value.trim();$("err").textContent="";
 try{
  if(mode==="r"){if(n.length<3)return $("err").textContent="Kullanıcı adı en az 3 karakter olmalı.";
   const c=await auth.createUserWithEmailAndPassword(e,p);await db.doc("users/"+c.user.uid).set(Object.assign(DEF(),{name:n,email:e,created:Date.now()}))}
  else await auth.signInWithEmailAndPassword(e,p);
 }catch(x){const m={"auth/email-already-in-use":"Bu e-posta zaten kayıtlı.","auth/invalid-credential":"E-posta veya şifre yanlış.","auth/wrong-password":"Şifre yanlış.","auth/user-not-found":"Bu e-posta ile hesap yok.","auth/weak-password":"Şifre en az 6 karakter olmalı.","auth/invalid-email":"E-posta geçersiz."};$("err").textContent=m[x.code]||errMsg(x)}
};
["em","pw","nm"].forEach(i=>$(i).addEventListener("keydown",e=>{if(e.key==="Enter")$("go").click()}));

function migrate(){
 if(!Array.isArray(U.inv)){const old=U.inv||{},os=U.seeds||{};U.inv=[];Object.keys(os).forEach(k=>{if(PL[k]&&os[k]>0)U.inv.push({id:rid(),k:"seed",t:k,n:os[k]})});Object.keys(old).forEach(k=>{for(let i=0;i<Math.min(old[k]||0,40);i++)if(PL[k])U.inv.push({id:rid(),k:"fruit",t:k,s:1,kg:PL[k].kg,m:[]})});if(!U.inv.length)U.inv=DEF().inv}
 if(!Array.isArray(U.grid)||U.grid.length!==NP||U.grid.some(p=>p&&p.pr===undefined))U.grid=Array(NP).fill(null);
 U.know=U.know||{};U.rec=U.rec||{};U.ow=U.ow||[];U.sat=U.sat||{};U.codes=U.codes||{};U.pets=U.pets||{};U.fav=U.fav||{};U.orders=U.orders||[];U.bought=U.bought||{s:0,i:{}};["know","rec","pets","fav","codes"].forEach(f=>{Object.keys(U[f]).forEach(k=>{if(!U[f][k])delete U[f][k]})});delete U.seeds;delete U.open;norm();
}
auth.onAuthStateChanged(async u=>{
 unsub.forEach(f=>f());unsub=[];
 if(!u){uid=null;U=null;$("auth").hidden=false;$("app").hidden=true;$("nav").hidden=true;return}
 uid=u.uid;
 try{
  const ref=db.doc("users/"+uid);let s=await ref.get();
  if(!s.exists){await ref.set(Object.assign(DEF(),{name:(u.email||"oyuncu").split("@")[0],email:u.email,created:Date.now()}));s=await ref.get()}
  U=Object.assign(DEF(),s.data());migrate();
  if(U.banned){toast("Hesabın yönetici tarafından engellendi.",1);return auth.signOut()}
  $("auth").hidden=true;$("app").hidden=false;$("nav").hidden=false;
  unsub.push(ref.onSnapshot(d=>{if(d.metadata.hasPendingWrites||!d.exists)return;const x=d.data();if((x.adminTs||0)>(U.adminTs||0)){Object.assign(U,x);migrate();toast("Yönetici hesabını güncelledi.");sfx(700,.2);head();renderTools();renderTab()}if(x.banned){toast("Hesabın engellendi.",1);auth.signOut()}},e=>rulesWarn(e)));
  unsub.push(db.doc("config/global").onSnapshot(d=>{if(d.exists)G=Object.assign(G,d.data());applyOvr();const a=$("ann");a.hidden=!G.announce;a.textContent="📢 "+G.announce;$("maint").hidden=!G.maintenance;$("maintx").textContent=G.maintMsg||"Kısa süre sonra döneceğiz.";if(["trade","lab","mix","shop","pets"].includes(tab))renderTab()},e=>rulesWarn(e)));
  unsub.push(db.collection("trades").orderBy("ts","desc").limit(60).onSnapshot(q=>{trades=q.docs.map(d=>Object.assign({id:d.id},d.data()));claim();if(tab==="trade")renderTab()},e=>rulesWarn(e)));
  buildNav();ensureOrders();head();renderTools();switchTab("garden");say("Hoş geldin "+U.name+"! Önce bir tohum seç, sonra boş karoya dokun.");
 }catch(e){toast(errMsg(e),1);$("err").textContent=errMsg(e)}
});
function rulesWarn(e){if(e&&e.code==="permission-denied"){const w=$("rulewarn");w.hidden=false;w.textContent="⚠️ Firestore izni reddedildi. Takas/duyuru çalışmaz. firestore.rules dosyasını Firebase'e yüklemelisin (OKUMA.txt, 3. adım)."}}

/* ---------- kaydet ---------- */
let sv=null;
function dirty(){clearTimeout(sv);sv=setTimeout(saveNow,3000)}
function saveNow(){if(!uid||!U)return;clearTimeout(sv);const d=clone(U);d.seen=Date.now();delete d.banned;delete d.adminTs;delete d.tradeOpen;db.doc("users/"+uid).set(d,{merge:true}).catch(e=>{if(e.code==="permission-denied")rulesWarn(e)})}
window.addEventListener("pagehide",saveNow);
document.addEventListener("visibilitychange",()=>{if(document.hidden)saveNow()});

function head(){
 $("av").textContent=(U.name||"?")[0].toUpperCase();$("un").textContent=U.name;
 const L=lvl(),a=20*(L-1)**2,b=20*L*L;$("lv").textContent="Seviye "+L+" · "+U.xp+" XP · "+plotsAllowed()+" karo";$("xb").style.width=Math.min(100,(U.xp-a)/(b-a)*100)+"%";
 const c=$("coin");c.textContent="🪙 "+U.coins;c.classList.remove("bump");void c.offsetWidth;c.classList.add("bump");
}

/* ---------- gezinme ---------- */
function buildNav(){
 const t=[["garden","🌱","Bahçe"],["lab","🧪","Lab"],["mix","⚗️","Atölye"],["shop","🛒","Dükkân"],["inv","🎒","Envanter"],["trade","🔁","Takas"],["pets","🐾","Petler"],["set","⚙️","Ayarlar"]];
 $("nav").innerHTML="";t.forEach(a=>{const b=document.createElement("button");b.id="n-"+a[0];b.innerHTML="<b>"+a[1]+"</b>"+a[2];b.onclick=()=>switchTab(a[0]);$("nav").appendChild(b)});
}
function switchTab(t){tab=t;[...$("nav").children].forEach(b=>b.className=b.id==="n-"+t?"on":"");$("v-garden").classList.toggle("on",t==="garden");$("v-dyn").classList.toggle("on",t!=="garden");if(t!=="garden")renderTab();sfx(400,.05)}
function renderTab(){if(tab==="garden")return;const p=$("v-dyn");p.innerHTML="";if((tab==="lab"||tab==="mix")&&G.labOpen===false)card(p,"🧪 Lab kapalı",'<div class="mute">Yönetici laboratuvarı geçici olarak kapattı.</div>');else({lab:labV,mix:mixV,shop:shopV,inv:invV,trade:tradeV,pets:petV,set:setV})[tab](p)}
function card(p,h,t){const d=document.createElement("div");d.className="card";d.innerHTML="<h3>"+h+"</h3>"+(t||"");p.appendChild(d);return d}
function btn(d,t,f,c){const b=document.createElement("button");b.innerHTML=t;if(c)b.className=c;b.onclick=f;d.appendChild(b);return b}
function row(d,l){const r=document.createElement("div");r.className="row";r.style.margin="6px 0";r.innerHTML='<span class="grow">'+l+"</span>";d.appendChild(r);return r}

/* ---------- eşya seçici (modal) ---------- */
function pick(o){
 const m=$("modal");m.hidden=false;const sel={};(o.pre||[]).forEach(s=>sel[s.id]=s.n);
 const list=o.list.slice().sort((a,b)=>total(b)-total(a));
 function draw(){
  m.innerHTML='<div class="sheet"><h3 style="margin-top:0">'+o.title+'</h3><div class="mute">Değer sırasına göre dizildi. '+(o.max>1?"Yığınlarda tekrar dokunarak adedi artır.":"")+'</div><div class="grid" id="pg" style="margin:8px 0"></div><div class="row" id="pb"></div></div>';
  const g=$("pg");if(!list.length)g.innerHTML='<div class="mute">Uygun eşya yok.</div>';
  list.forEach(e=>{const v=iv(e),q=sel[e.id]||0,b=document.createElement("button");b.className="it"+(q?" sel":"");b.style.borderColor=q?"":v.c;
   b.innerHTML=(q?'<span class="qty">'+(e.k==="fruit"?"✓":q)+"</span>":"")+"<b>"+v.e+" "+esc(v.n)+" "+v.m+'</b><div class="mute">'+esc(v.s)+(e.k!=="fruit"?" · sende ×"+e.n:"")+'</div><div class="val">'+total(e,1)+"🪙"+(e.k!=="fruit"?" /adet":"")+"</div>";
   b.onclick=()=>{const n=Object.keys(sel).length;if(e.k==="fruit"){if(q)delete sel[e.id];else if(n<o.max)sel[e.id]=1;else if(o.max===1){Object.keys(sel).forEach(k=>delete sel[k]);sel[e.id]=1}}else{if(!q){if(n<o.max)sel[e.id]=1;else if(o.max===1){Object.keys(sel).forEach(k=>delete sel[k]);sel[e.id]=1}}else if(q<e.n&&o.max>1)sel[e.id]=q+1;else delete sel[e.id]}draw()};g.appendChild(b)});
  const pb=$("pb");btn(pb,"Seç ("+Object.keys(sel).length+")",()=>{m.hidden=true;o.ok(Object.keys(sel).map(id=>({id,n:sel[id]})))},"gold");btn(pb,"Vazgeç",()=>{m.hidden=true});
 }
 draw();
}

/* ---------- bahçe ---------- */
const cv=$("cv"),g=cv.getContext("2d");
const R=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
const limit=()=>3+(U.pets.kaplumbaga?1:0);
const PORD=[...Array(NP).keys()].sort((a,b)=>{const d=i=>Math.abs((i%5)-2)+Math.abs(Math.floor(i/5)-2);return d(a)-d(b)||a-b});
const plotsAllowed=()=>Math.min(NP,7+(lvl()-1)*2);
const unlocked=i=>PORD.indexOf(i)<plotsAllowed();
const needLvl=i=>Math.ceil((PORD.indexOf(i)+1-7)/2)+1;
let T=0,parts=[];
function pop(i,t,c){if(!ST.anim)return;parts.push({x:M+(i%5)*TS+32,y:M+Math.floor(i/5)*TS+20,t,c:c||"#f2c14e",l:0})}
const stage=p=>{const f=p.pr/PL[p.t].grow;return f<.15?0:f<.45?1:f<1?2:3};
function art(p,x,y,i){
 const P=PL[p.t],st=stage(p),sw=ST.anim&&st>=2&&!p.dead?Math.round(Math.sin(T/500+i)*2):0,cx=x+32+sw,by=y+54,sc=Math.min(1.25,.85+p.s*.25);
 if(p.dead){R(cx-2,by-24,4,24,"#7a6a4a");R(cx-12,by-18,10,4,"#7a6a4a");R(cx+2,by-12,10,4,"#7a6a4a");return}
 const lf=p.yellow?"#d8c43a":"#4caf3d",c=P.col;
 if(st===0){R(cx-4,by-4,8,6,"#c9a26a");R(cx-2,by-6,4,3,"#c9a26a")}
 else if(st===1){R(cx-2,by-16,4,16,lf);R(cx-10,by-16,8,6,lf);R(cx+2,by-20,8,6,lf)}
 else if(st===2){R(cx-2,by-26,4,26,lf);R(cx-16,by-24,14,8,lf);R(cx+2,by-30,14,8,lf);R(cx-12,by-12,10,6,lf);R(cx+2,by-14,12,6,lf)}
 else{
  g.save();g.translate(cx,by);g.scale(sc,sc);g.translate(-cx,-by);
  if(P.sh==="leaf"){R(cx-18,by-28,36,26,"#4caf3d");R(cx-12,by-34,24,28,c);R(cx-6,by-26,12,16,"#b5f08a")}
  else if(P.sh==="root"){R(cx-12,by-30,24,14,"#3b8f2f");R(cx-4,by-38,8,10,"#4caf3d");R(cx-8,by-16,16,14,c);R(cx-4,by-4,8,6,c)}
  else if(P.sh==="bush"){R(cx-2,by-34,4,34,"#3b8f2f");[[-16,-26],[4,-26],[-8,-12]].forEach(d=>{R(cx+d[0],by+d[1],14,14,c);R(cx+d[0]+4,by+d[1]-4,6,4,"#3b8f2f")})}
  else if(P.sh==="tall"){R(cx-3,by-46,6,46,"#3b8f2f");R(cx-14,by-34,12,22,c);R(cx+3,by-28,12,18,c);R(cx-16,by-40,14,4,"#4caf3d");R(cx+3,by-22,16,4,"#4caf3d")}
  else if(P.sh==="melon"){R(cx-20,by-24,40,24,"#2e7d32");R(cx-16,by-22,32,20,c);for(let k=-12;k<14;k+=8)R(cx+k,by-22,3,20,"#1f5c24")}
  else if(P.sh==="cluster"){R(cx-2,by-40,4,14,"#3b8f2f");[[-10,-28],[2,-28],[-4,-20],[-10,-14],[2,-14],[-4,-6]].forEach(d=>R(cx+d[0],by+d[1],9,9,c))}
  else{R(cx-2,by-36,4,36,"#3b8f2f");R(cx-14,by-28,10,6,"#4caf3d");[[-12,-52],[0,-52],[-6,-58],[-6,-46]].forEach(d=>R(cx+d[0],by+d[1]+12,12,12,c));R(cx-4,by-38,8,8,"#f2c14e")}
  g.restore();
  if(ST.anim&&Math.floor(T/400)%2===0)R(x+52,y+4,8,8,"#f2c14e");else R(x+54,y+6,4,4,"#f2c14e");
 }
 if((p.m||[]).length){g.font="13px Verdana";p.m.forEach((m,k)=>{g.fillText(MUT[m].e,x+3+k*15,y+16)});if(ST.anim&&st===3){g.fillStyle=MUT[p.m[0]].c+"44";g.fillRect(x+2,y+2,60,60)}}
 if(p.yellow){R(x+48,y+4,12,12,"#d8c43a");R(x+53,y+6,2,5,"#5b3a29");R(x+53,y+12,2,2,"#5b3a29")}
 if(st<3){R(x+6,y+58,52,3,"#00000066");R(x+6,y+58,Math.min(52,p.pr/P.grow*52),3,"#3fb8af")}
}
function tile(i){
 const x=M+(i%5)*TS,y=M+Math.floor(i/5)*TS,p=U.grid[i];
 if(!unlocked(i)){R(x,y,TS,TS,"#2a2f2b");R(x+2,y+2,60,60,"#222623");g.font="bold 12px Verdana";g.fillStyle="#7d8c80";g.fillText("🔒",x+22,y+30);g.font="10px Verdana";g.fillText("Sv "+needLvl(i),x+20,y+48);return}
 R(x,y,TS,TS,"#6b4530");R(x+2,y+2,60,60,"#5b3a29");
 [[10,12],[40,20],[22,44],[50,50],[8,36]].forEach(d=>R(x+d[0],y+d[1],4,4,"#4a2e20"));
 if(p)art(p,x,y,i);
}
function overlay(W){
 if(!ST.anim)return;const t=T/1000,lo=ST.low;
 if(W.id==="yagmur"||W.id==="firtina"||W.id==="asit"){R(0,0,S,S,W.id==="asit"?"rgba(100,255,90,.08)":"rgba(10,20,40,.14)");g.strokeStyle=W.id==="asit"?"rgba(150,255,120,.6)":"rgba(140,190,255,.6)";g.lineWidth=2;for(let i=0;i<(lo?25:65);i++){const x=(i*47+t*40)%S,y=(i*91+t*420)%S;g.beginPath();g.moveTo(x,y);g.lineTo(x-3,y+10);g.stroke()}}
 if(W.id==="firtina"&&Math.floor(t*3)%9===0)R(0,0,S,S,"rgba(255,255,200,.3)");
 if(W.id==="kirag"){R(0,0,S,S,"rgba(170,220,255,.1)");g.fillStyle="#fff";for(let i=0;i<(lo?20:50);i++)g.fillRect((i*61+Math.sin(t+i)*8+S)%S,(i*37+t*30)%S,3,3)}
 if(W.id==="aurora")for(let k=0;k<3;k++){g.fillStyle="hsla("+((t*30+k*70)%360)+",90%,60%,.14)";g.fillRect(0,k*34+Math.sin(t+k)*10,S,30)}
 if(W.id==="ruzgar"){g.strokeStyle="rgba(235,235,210,.45)";g.lineWidth=2;for(let i=0;i<(lo?10:28);i++){const x=(i*53+t*160)%(S+60)-30,y=(i*71)%S;g.beginPath();g.moveTo(x,y);g.lineTo(x+28,y+Math.sin(t+i)*4);g.stroke()}}
 if(W.id==="sis"){for(let k=0;k<4;k++){g.fillStyle="rgba(220,230,235,.13)";g.fillRect(Math.sin(t*.3+k)*40-20,k*88,S+40,60)}}
 if(W.id==="sicak"){R(0,0,S,S,"rgba(255,140,40,.10)");g.strokeStyle="rgba(255,200,120,.35)";g.lineWidth=2;for(let i=0;i<(lo?4:9);i++){g.beginPath();for(let x=0;x<=S;x+=16)g.lineTo(x,i*40+20+Math.sin(t*2+x/20+i)*4);g.stroke()}}
 if(W.id==="ay"){R(0,0,S,S,"rgba(60,80,160,.18)");g.fillStyle="#f4f1d0";g.beginPath();g.arc(S-34,34,14,0,7);g.fill()}
 if(W.id==="meteor"){g.strokeStyle="rgba(255,190,120,.9)";g.lineWidth=3;for(let i=0;i<(lo?2:4);i++){const q=(t*.6+i*.27)%1,x=S*(.1+i*.25)+q*120,y=q*S;g.beginPath();g.moveTo(x,y);g.lineTo(x-26,y-40);g.stroke()}}
 if(W.id==="tutulma")R(0,0,S,S,"rgba(10,5,30,.38)");
}
function draw(){
 R(0,0,S,S,"#5f8f36");
 for(let i=0;i<50;i++){const a=(i*53)%S,b=(i*97)%S;R(a,b,3,3,i%5?"#6ea43f":"#f2d34e")}
 if(U){for(let i=0;i<NP;i++)tile(i)}
 if(ST.anim){const o=(T/60)%480-60;g.fillStyle="rgba(0,0,0,.06)";g.fillRect(o,40,90,50);g.fillRect(480-o-120,200,110,60)}
 if(U)activeWeathers().forEach(overlay);
 parts=parts.filter(p=>p.l<40);g.font="bold 14px Verdana";parts.forEach(p=>{p.l++;g.fillStyle="#000";g.fillText(p.t,p.x+1,p.y-p.l+1);g.fillStyle=p.c;g.fillText(p.t,p.x,p.y-p.l)});
 if(U&&U.pets.tilki)g.fillText("🦊",4,24);if(U&&U.pets.kaplumbaga)g.fillText("🐢",S-26,S-6);if(U&&U.pets.ari)g.fillText("🐝",S-26,22);if(U&&U.pets.baykus)g.fillText("🦉",4,S-6);if(U&&U.pets.sincap)g.fillText("🐿️",S-52,S-6);
}
let last=0;function loop(ts){requestAnimationFrame(loop);if(tab!=="garden"||!U)return;if(ts-last<1000/(ST.low?3:30))return;last=ts;T=ts;draw()}requestAnimationFrame(loop);

let lastW="",lastE="",lastStk=0;
const MUTB=.004;
function tick(){
 if(!U)return;const now=Date.now(),Ws=activeWeathers(),evs=activeEvents(),FX=FXN();let ch=0;
 if(ensureOrders()){ch=1;if(tab==="lab"&&labTab==="ord")renderTab()}
 let wg=1;Ws.forEach(w=>wg*=w.g);wg=Math.min(wg,4);
 const mb=MUTB*EM("mut")*FX.mut*(U.pets.baykus?1.3:1);
 U.grid.forEach((p,i)=>{
  if(!p||p.dead)return;const P=PL[p.t];if(!P)return;const dt=Math.min((now-p.lu)/1000,1800);p.lu=now;
  if(p.pr>=P.grow)return;
  if(p.nd===undefined)p.nd=Math.random()<sickCh(P);
  const has=p.d[P.need]>=1,blocked=p.nd&&!has;
  if(blocked&&p.pr>=P.grow*.15){p.yellow=true;return}
  p.yellow=false;const live=dt<=5,was=p.pr,sp=p.fxu>now?(p.fxm||1):1;
  const mult=(has?1.5:1)*(U.pets.tilki?1.5:1)*(G.growth||1)*FX.g*sp*(live?wg:1);
  p.pr=Math.min(blocked?P.grow*.15:P.grow,p.pr+dt*mult);ch=1;
  if(live)Ws.forEach(W=>{if(W.mut&&p.pr>0&&p.m.length<2&&!p.m.includes(W.mut)&&Math.random()<mb*(W.mc||1)*dt){p.m.push(W.mut);pop(i,MUT[W.mut].e+MUT[W.mut].ad,MUT[W.mut].c);learn(W.mut);toast(PL[p.t].ad+" "+MUT[W.mut].ad+" oldu!")}});
  if(p.pr>=P.grow&&was<P.grow){pop(i,"Hazır!","#fff");if(Math.random()<.015*FX.gold*EM("mut")&&!p.m.includes("altin")){p.m.push("altin");learn("altin")}}
 });
 if(U.pets.sincap&&U.inv.length<300){let hv=0;U.grid.forEach((p,i)=>{if(p&&!p.dead&&PL[p.t]&&p.pr>=PL[p.t].grow&&harvest(i,1))hv++});if(hv){ch=1;toast("🐿️ Sincap "+hv+" bitki hasat etti");head()}}
 const wk=Ws.map(w=>w.id).join(",");if(lastW&&lastW!==wk)toast("Hava: "+Ws.map(w=>w.e+" "+w.ad).join(" + "));lastW=wk;
 const ek=evs.map(e=>e.id).join(",");if(lastE&&lastE!==(ek||"-")){if(ek)toast("Etkinlik: "+evs.map(e=>e.e+" "+e.ad).join(" + "));if(tab==="shop")renderTab()}lastE=ek||"-";
 if(ch)dirty();
 const nat=G.wxAuto!==false&&!(G.weather&&WX[G.weather]),w=$("wx");w.style.flexWrap="wrap";
 w.innerHTML=Ws.map(x=>"<b>"+x.e+'</b><b style="font-size:13px">'+x.ad+"</b>").join(" ")+(nat?'<span class="mute">· '+fmt(SLOT_W-(now%SLOT_W))+"</span>":"")+evs.map(e=>'<span class="pill" style="border-color:#c58bff">'+e.e+" "+e.ad+"</span>").join("");
 const sk=stockKey();if(lastStk&&lastStk!==sk&&tab==="shop")renderTab();lastStk=sk;
 const cd=$("cd");if(cd)cd.textContent=fmt(STK_W-(now%STK_W));
}
const fmt=ms=>{const s=Math.ceil(ms/1000);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")};
setInterval(tick,1000);
$("wx").onclick=()=>{const l=activeWeathers().map(w=>w.e+" "+w.ad+": "+w.d).concat(activeEvents().map(e=>e.e+" "+e.ad+": "+e.d));say(l.join("  |  "))};

const HELP={plant:"Ek: bir tohum seç, boş karoya dokun ya da tohumu karoya sürükle.",use:"Kullan: bir malzeme seç ve bitkiye dokun ya da malzemeyi bitkinin üstüne sürükle. Sararan bitkinin sorununu belirtiden çöz!",harvest:"Hasat: olgun bitkiye dokun. Yanmış bitkiyi de temizler.",look:"Bak: bir bitkiye dokun, detaylarını gör."};
function renderTools(){
 const b=$("tools");b.innerHTML="";
 [["plant","🌱 Ek"],["use","🧪 Kullan"],["harvest","🧺 Hasat"],["look","🔍 Bak"]].forEach(a=>{const e=document.createElement("button");e.textContent=a[1];e.className=tool.m===a[0]?"on":"";e.onclick=()=>{tool={m:a[0]};renderTools();say(HELP[a[0]])};b.appendChild(e)});
 const p=$("pal");p.innerHTML="";
 const mk=(label,on,f,col,dr)=>{const e=document.createElement("button");e.className="pl"+(on?" on":"");e.innerHTML=label;if(col)e.style.borderColor=on?"":col;e.onclick=f;if(dr)dragify(e,(x,y,u)=>{if(u!==cv)return;const i=tileAt(x,y);if(i>=0)dr(i)});p.appendChild(e)};
 if(tool.m==="plant"){const l=U.inv.filter(x=>x.k==="seed").sort((a,b)=>unit(b)-unit(a));if(!l.some(x=>x.t===selSeed))selSeed=l[0]?l[0].t:null;if(!l.length)p.innerHTML='<span class="mute">Tohumun yok. Dükkândan al.</span>';l.forEach(x=>mk(PL[x.t].e+" "+PL[x.t].ad+" ×"+x.n,selSeed===x.t,()=>{selSeed=x.t;renderTools()},RAR[PL[x.t].rar].c,i=>{selSeed=x.t;tap(i)}))}
 if(tool.m==="use"){const l=U.inv.filter(x=>x.k==="gear");if(!l.some(x=>x.t===selUse))selUse=l[0]?l[0].t:null;if(!l.length)p.innerHTML='<span class="mute">Malzemen yok. Dükkândan al.</span>';l.forEach(x=>mk(GR[x.t].e+" "+GR[x.t].ad+" ×"+x.n,selUse===x.t,()=>{selUse=x.t;renderTools();say(GR[x.t].ad+" ("+GR[x.t].f+"): "+GR[x.t].d)},null,i=>{selUse=x.t;tap(i)}))}
 if(tool.m==="harvest")mk("🧺 Hepsini hasat et",false,harvestAll);
}
function mkFruit(p){const P=PL[p.t];return{k:"fruit",t:p.t,s:p.s,kg:Math.round(P.kg*p.s*100)/100,m:p.m.slice()}}
function harvest(i,quiet){
 const p=U.grid[i];if(!p||p.dead||p.pr<PL[p.t].grow)return false;
 if(U.inv.length>=300){say("Envanter dolu (300). Biraz sat.",1);return false}
 const f=mkFruit(p);addItem(f);U.grid[i]=null;addXp(3+Object.keys(RAR).indexOf(PL[p.t].rar)*2);f.m.forEach(learn);pop(i,"+"+PL[p.t].e,"#fff");
 if(!quiet)say(PL[p.t].ad+" hasat edildi: "+f.kg+" kg"+(f.m.length?" · "+f.m.map(m=>MUT[m].e+MUT[m].ad).join(" "):"")+" · değer "+unit(f)+" 🪙");
 return true;
}
function harvestAll(){let n=0;U.grid.forEach((p,i)=>{if(harvest(i,1))n++});say(n?n+" bitki hasat edildi!":"Olgun bitki yok.",!n);draw();dirty();head()}
function tap(i){
 if(!unlocked(i))return say("Bu karo Seviye "+needLvl(i)+" ile açılır.",1);
 const p=U.grid[i];
 if(tool.m==="plant"){
  if(p)return say("Bu karo dolu.",1);if(!selSeed||!cnt("seed",selSeed))return say("Önce bir tohum seç (veya Dükkândan al).",1);
  useOne("seed",selSeed);const s=(.8+Math.random()*.9)*(U.pets.ari?1.12:1);
  U.grid[i]={t:selSeed,pr:0,lu:Date.now(),s:Math.round(s*100)/100,d:{N:0,P:0,K:0},m:[],yellow:false,dead:false,tried:false,buf:0,nd:Math.random()<sickCh(PL[selSeed])};pop(i,"🌱");
  say(PL[selSeed].ad+" ekildi. Yaprağı sararırsa 🔍 Bak ile belirtisine bak, doğru malzemeyi ver.");renderTools();
 }else if(tool.m==="harvest"){
  if(!p)return say("Burada bitki yok.",1);
  if(p.dead){U.grid[i]=null;return say("Yanmış bitki temizlendi.")}
  if(p.pr<PL[p.t].grow)return say("Henüz olgunlaşmadı.",1);harvest(i);
 }else if(tool.m==="look"){
  if(!p)return say("Boş karo.");const P=PL[p.t];
  if(p.dead)return say("Yanmış bitki. Fazla gübre toprağın tuz derişimini artırdı, su köklerden dışarı çekildi (ozmos).",1);
  say(P.e+" "+P.ad+" ("+RAR[P.rar].ad+") · %"+Math.min(100,Math.floor(p.pr/P.grow*100))+" · büyüklük "+(P.kg*p.s).toFixed(2)+" kg"+(p.m.length?" · "+p.m.map(m=>MUT[m].e+MUT[m].ad).join(" "):"")+(p.yellow?" · ⚠️ Belirti: "+SYMP[P.need]:p.nd===false?" · ✅ Sağlıklı":"")+" · "+P.fact);
 }else{
  if(!selUse||!cnt("gear",selUse))return say("Önce bir malzeme seç (veya Dükkândan al).",1);
  if(!p||p.dead)return say("Önce bir bitki ek.",1);
  const P=PL[p.t],Gr=GR[selUse],ripe=p.pr>=P.grow;
  if(ripe)return say("Bitki olgunlaştı, malzeme gerekmez.",1);
  if(Gr.kind==="mat")return say(Gr.ad+" bitkiye verilmez; siparişler ve deneyler içindir.",1);
  if(Gr.kind==="fert"){
   const n=Gr.n;useOne("gear",selUse);p.d[n]++;
   if(p.d[n]>=limit()){
    if(p.buf>0){p.buf=(+p.buf)-1;p.d[n]--;learn("tampon");say("Tampon çözelti seni kurtardı! pH ve tuz dengesi bozulmadı. (Tampon harcandı.)")}
    else{p.dead=true;pop(i,"💥","#ff9b82");learn("ozmos");say("Bitki yandı! Fazla gübre toprağın tuz derişimini artırır, bitkinin suyu kökten dışarı çıkar (ozmos). Gübreyi ölçülü ver.",1)}
   }else if(n===P.need&&p.yellow&&!p.tried){const b=Math.max(2,Math.round((2+lvl()/2)*EM("order")));U.coins+=b;addXp(8);pop(i,"+"+b+"🪙");learn({N:"azot",P:"fosfor",K:"potasyum"}[n]);say("Doğru teşhis! Belirti: "+SYMP[n]+" → "+NUT[n].ad+" eksikmiş. +"+b+" 🪙 bonus.")}
   else if(n===P.need){pop(i,"⚡");learn({N:"azot",P:"fosfor",K:"potasyum"}[n]);say(NUT[n].ad+" verildi, bitki hızlandı (×1,5).")}
   else{if(p.yellow)p.tried=true;say(NUT[n].ad+" verildi ama bu bitkinin asıl ihtiyacı bu değil."+(p.yellow?" Belirtiye bak: "+SYMP[P.need]:" Bitki zaten sağlıklıydı; gereksiz gübre yakabilir!"),1)}
  }else if(Gr.kind==="boost"){
   useOne("gear",selUse);const cap=(!p.nd||p.d[P.need]>=1)?P.grow:P.grow*.15;p.pr=Math.min(cap,p.pr+P.grow*Gr.b);pop(i,Gr.e);if(selUse==="katalizor")learn("katalizor");say(Gr.ad+" kullanıldı: +%"+Math.round(Gr.b*100)+" ilerleme.")
  }else if(Gr.kind==="buf"){if(p.buf>0)return say("Bu bitki zaten korumalı.",1);useOne("gear",selUse);p.buf=1;pop(i,"🫧");say("Tampon eklendi: bitki bir kez fazla gübreden korunacak.")}
  else if(Gr.kind==="fx"){applyFx(i,p,P,Gr,selUse)}
  else if(Gr.kind==="gold"){if(p.m.includes("altin"))return say("Zaten Altın.",1);useOne("gear",selUse);p.m.push("altin");if(p.m.length>2)p.m.shift();pop(i,"🟡","#f2c14e");learn("altin");say("Altın mutasyonu verildi! Değer ×6.")}
  renderTools();
 }
 draw();dirty();head();
}
cv.addEventListener("click",e=>{if(!U)return;const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*S-M,y=(e.clientY-r.top)/r.height*S-M;if(x<0||y<0||x>=TS*5||y>=TS*5)return;tap(Math.floor(y/TS)*5+Math.floor(x/TS))});

/* ---------- LAB: siparişler, pH deneyi, defter, profesör ---------- */
function ensureOrders(){const n=Date.now();U.ow=(U.ow||[]).filter(t=>t>n);U.orders=(U.orders||[]).filter(id=>ORD.some(o=>o.id===id));let k=0;while(U.orders.length+U.ow.length<3){const free=ORD.filter(o=>!U.orders.includes(o.id));if(!free.length)break;U.orders.push(free[Math.floor(Math.random()*free.length)].id);k++}return k}
function labV(p){
 const s=document.createElement("div");s.className="sub";p.appendChild(s);
 [["ord","📋 Siparişler"],["kz","🧭 Kılavuz"],["ph","🧪 pH Deneyi"],["book","📖 Defter ("+Object.keys(U.know).length+"/"+Object.keys(CON).length+")"],["prof","🧙 Profesör"]].forEach(a=>btn(s,a[1],()=>{labTab=a[0];renderTab()},labTab===a[0]?"on":""));
 ({ord:ordV,kz:kzV,ph:phV,book:bookV,prof:profV})[labTab](p);
}
function ordV(p){
 card(p,"Müşteri siparişleri",'<div class="mute">Müşteri bir sorun anlatıyor. Çözümü <b>sen</b> bulup envanterindeki malzemelerden birini vereceksin. Malzemeleri Dükkân\'dan al; her malzemenin yanında formülü ve özelliği yazar. Yanlış verirsen malzeme harcanmaz, nedenini öğrenirsin.</div>'+(U.ow.length?'<div class="mute" style="margin-top:6px">⏳ '+U.ow.length+" yeni müşteri yolda (her siparişten ~90 sn sonra gelir).</div>":""));
 U.orders.forEach(id=>{const o=ORD.find(x=>x.id===id),d=card(p,o.e+" "+o.who,"<div>"+o.q+"</div>");
  const h=document.createElement("div");h.className="mute";h.style.margin="6px 0";h.hidden=true;h.textContent="💡 İpucu: "+o.h;d.appendChild(h);
  const r=document.createElement("div");r.className="row";d.appendChild(r);
  btn(r,"Malzeme ver",()=>{const l=U.inv.filter(x=>x.k==="gear");if(!l.length)return toast("Önce Dükkân'dan malzeme almalısın.",1);pick({title:o.who+" için ne vereceksin?",list:l,max:1,ok:s=>{if(!s.length)return;const e=U.inv.find(x=>x.id===s[0].id);if(!e)return;
    if(o.ok.includes(e.t)){useOne("gear",e.t);const rw=Math.max(5,Math.round((o.rw*.45+lvl())*EM("order")));U.coins+=rw;addXp(12);learn(o.c);U.orders=U.orders.filter(x=>x!==o.id);U.ow.push(Date.now()+90000);ensureOrders();say("✅ Doğru! "+o.y+" +"+rw+" 🪙",0);toast("Sipariş tamamlandı +"+rw+" 🪙");sfx(900,.3);dirty();head();renderTab()}
    else{toast("❌ "+(o.w[e.t]||"Bu malzeme sorunu çözmez: "+GR[e.t].d),1);sfx(160,.2);h.hidden=false}}})},"gold");
  btn(r,"İpucu",()=>{h.hidden=!h.hidden})});
}

/* ---------- KILAVUZ: Bitki Doktoru (cevabı vermez, düşündürür) ---------- */
const DOZ={q:"Doğru malzemeyi buldun. Peki ne kadar vermelisin?",o:[["Bitkiye 1 doz yeter; fazlası toprağın tuz derişimini artırıp bitkiyi yakar",1,""],["Ne kadar çok o kadar iyi",0,"Fazla gübre toprak çözeltisini derişik yapar; su kökten dışarı çekilir (ozmos) ve bitki yanar."],["Hiç verme, sadece sula",0,"Su eksik besin elementinin yerini tutmaz; element gerekir."]]};
const KZ={
N:{ad:"Sararan yapraklar",sym:"Yapraklar soluk sarı, büyüme yavaş.",tool:"ure",learn:"azot",st:[
 {q:"Yeşil renk bir pigmentten gelir. Yapraklar solduğuna göre bitkinin hangi görevi aksıyor olabilir?",o:[["Yeşil pigment (klorofil) ve protein yapımı",1,""],["Kök gelişimi ve enerji taşıma",0,"Kök sorunu olsaydı belirti bitkinin altında olurdu; burada yaprağın rengi solmuş."],["Meyve kalitesi ve su dengesi",0,"Su dengesi bozulunca yaprak kenarları kurur; burada tüm yaprak soluyor."]]},
 {q:"Klorofilin ve proteinlerin yapısına giren, havanın %78'ini oluşturan elementin sembolü hangisi?",o:[["N",1,""],["P",0,"P (fosfor) ATP'nin parçasıdır, enerji taşır. Klorofilin yapısında değildir."],["K",0,"K (potasyum) yapı taşı değildir; hücrenin su dengesini ayarlar."]]},
 {q:"Hangi malzemenin formülünde bu elementin sembolü var? Formüllere dikkatle bak.",o:[["Üre CO(NH₂)₂",1,""],["Süperfosfat Ca(H₂PO₄)₂",0,"Bu formülde Ca, H, P ve O var. Aradığın sembol yok."],["Potas KCl",0,"Bu formülde yalnızca K ve Cl var."],["Kireç CaCO₃",0,"Bu formülde Ca, C ve O var. Aradığın sembol yok."]]},DOZ]},
P:{ad:"Morumsu yapraklar, zayıf kökler",sym:"Yapraklar morumsu, kökler zayıf, çiçek az.",tool:"supfos",learn:"fosfor",st:[
 {q:"Kökler zayıf ve çiçek az. Hücrede enerji taşıyan molekül (ATP) hangi göreve yarar?",o:[["Kök gelişimi ve çiçeklenme için enerji",1,""],["Yeşil rengi oluşturmak",0,"Yeşil rengi klorofil verir. Burada sorun kök ve çiçeklenmede."],["Meyveyi tatlandırmak",0,"Meyve kalitesi başka bir elementin işi; belirtiye geri dön: kök ve çiçek."]]},
 {q:"ATP molekülünün yapısında bulunan element hangisi?",o:[["P",1,""],["N",0,"N klorofil ve protein yapar. ATP'nin adındaki 'fosfat' kelimesine bak."],["K",0,"K su dengesini ayarlar. ATP'nin adındaki 'fosfat' kelimesine bak."]]},
 {q:"Hangi malzemenin formülünde bu elementin sembolü var?",o:[["Süperfosfat Ca(H₂PO₄)₂",1,""],["Üre CO(NH₂)₂",0,"Bu formülde C, O, N ve H var. Aradığın sembol yok."],["Potas KCl",0,"Bu formülde yalnızca K ve Cl var."],["Sofra tuzu NaCl",0,"Bu formülde Na ve Cl var."]]},DOZ]},
K:{ad:"Kuruyan kenarlar, cılız meyve",sym:"Yaprak kenarları kurumuş, meyve cılız.",tool:"potas",learn:"potasyum",st:[
 {q:"Kenarlar kuruyor ve meyve cılız. Bu belirti hangi göreve işaret eder?",o:[["Hücrelerin su dengesi ve meyve kalitesi",1,""],["Yeşil pigment yapımı",0,"Tüm yaprak solsaydı bu olurdu. Burada sadece kenarlar kuruyor."],["Kök gelişimi",0,"Kök sorununda bitki bodur ve morumsu olur, kenarlar kurumaz."]]},
 {q:"Hücrelerdeki su dengesini ve kapakçıkları (stoma) düzenleyen element hangisi?",o:[["K",1,""],["N",0,"N klorofil ve protein yapar, su dengesini ayarlamaz."],["P",0,"P enerji taşır ve kök gelişimini destekler."]]},
 {q:"Hangi malzemenin formülünde bu elementin sembolü var?",o:[["Potas KCl",1,""],["Üre CO(NH₂)₂",0,"Bu formülde C, O, N ve H var. Aradığın sembol yok."],["Süperfosfat Ca(H₂PO₄)₂",0,"Bu formülde Ca, H, P ve O var."],["Kireç CaCO₃",0,"Bu formülde Ca, C ve O var."]]},DOZ]},
A:{ad:"Asidik toprak (pH 4)",sym:"Toprağın pH'ı 4. Bitki mineral alamıyor, yapraklar solgun.",tool:"kirec",learn:"kirec",st:[
 {q:"pH 4 ne anlama gelir?",o:[["Toprakta H⁺ fazla: asidik",1,""],["Toprakta H⁺ az: bazik",0,"pH ölçeğinde 7'den küçük değerler asidiktir."],["Nötr",0,"Nötr pH 7'dir. 4 yedinin çok altında."]]},
 {q:"Asidik toprağın pH'ını yükseltmek için nasıl bir madde eklemelisin?",o:[["Bazik bir madde: asidi nötrler",1,""],["Daha asidik bir madde",0,"Asit eklersen pH daha da düşer."],["Sadece saf su",0,"Su asidi biraz seyreltir ama nötrleştirmez. Tepkime veren bir madde gerekir."]]},
 {q:"Hangi malzeme bazik bir tuzdur ve asitle tepkimeye girer?",o:[["Kireç CaCO₃",1,""],["Kükürt S",0,"Kükürt topraktaki bakteriler tarafından asite çevrilir, pH'ı düşürür."],["Sofra tuzu NaCl",0,"NaCl nötr bir tuzdur, pH'ı pek değiştirmez."]]},
 {q:"Düzeldiğini kontrol etmek istiyorsun. Mor lahana suyu asitte hangi renkte olur?",o:[["Kırmızı / pembe",1,""],["Mavi / yeşil",0,"Mavi ve yeşil bazik ortamın rengidir."],["Renk değiştirmez",0,"Antosiyanin pH'a göre renk değiştirir; bu yüzden indikatör olarak kullanılır."]]}]},
B:{ad:"Bazik toprak (pH 9)",sym:"Toprağın pH'ı 9. Bitki demir gibi mineralleri alamıyor, yapraklar sararıyor.",tool:"kukurt",learn:"kukurt",st:[
 {q:"pH 9 ne anlama gelir?",o:[["Toprakta H⁺ az: bazik",1,""],["Toprak asidik",0,"7'den büyük pH bazik demektir."],["Nötr",0,"Nötr pH 7'dir."]]},
 {q:"Bazik toprağın pH'ını düşürmek için nasıl bir madde gerekir?",o:[["Toprakta asit oluşturan bir madde",1,""],["Bazik bir madde",0,"Baz eklersen pH daha da yükselir."],["Başka bir bazik tuz",0,"Bu da pH'ı yükseltir."]]},
 {q:"Hangi malzeme toprakta bakteriler sayesinde sülfürik aside dönüşür?",o:[["Kükürt S",1,""],["Kireç CaCO₃",0,"Kireç bazik bir tuzdur; pH'ı yükseltir."],["Sofra tuzu NaCl",0,"NaCl nötr bir tuzdur."]]},
 {q:"Kükürt eklediğin gün pH hemen düşer mi?",o:[["Hayır, bakteriler dönüştürdüğü için yavaş etki eder",1,""],["Evet, anında",0,"Kükürt önce bakteriler tarafından aside çevrilmelidir; bu zaman alır."],["Hiç etkisi olmaz",0,"Olur ama yavaş: S → sülfürik asit (H₂SO₄) dönüşümü gerekir."]]}]}
};
let kzS=null,kzAt=0;
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function kzStart(k,plant){kzS={k,i:0,plant:plant==null?null:plant,wrong:0,fb:"",ord:null};renderTab()}
function kzV(p){
 if(!kzS){
  card(p,"🧭 Bitki Doktoru",'<div class="mute">Burada sana cevabı söylemem. Sorunu sen bulacaksın: önce <b>belirtiye</b> bakarsın, sonra hangi görevin aksadığını, hangi elementin eksik olduğunu ve hangi malzemenin onu içerdiğini adım adım çıkarırsın. Yanlış seçersen neden yanlış olduğunu öğrenirsin.</div>');
  const sick=[];U.grid.forEach((pl,i)=>{if(pl&&!pl.dead&&pl.yellow)sick.push([i,pl])});
  let d=card(p,"🌱 Bahçendeki hastalar");
  if(!sick.length)d.insertAdjacentHTML("beforeend",'<div class="mute">Şu an yaprağı sararan bitkin yok. Aşağıdan alıştırma vakası seçebilirsin.</div>');
  sick.forEach(a=>{const P=PL[a[1].t];row(d,P.e+" "+P.ad+' <span class="mute">· '+SYMP[P.need]+"</span>");btn(d,"Muayene et",()=>kzStart(P.need,a[0]),"gold")});
  d=card(p,"📚 Alıştırma vakaları",'<div class="mute">Bahçede hasta yokken de pratik yapabilirsin.</div>');
  const r=document.createElement("div");r.className="row";d.appendChild(r);
  Object.keys(KZ).forEach(k=>btn(r,KZ[k].ad,()=>kzStart(k)));
  btn(d,"🎲 Rastgele vaka",()=>kzStart(Object.keys(KZ)[Math.floor(Math.random()*5)]),"gold");
  card(p,"💡 Teşhis ipuçları",'<div class="mute"><b>1) Nereye bakıyorsun?</b> Tüm yaprak mı soluyor, sadece kenarlar mı, yoksa kök/çiçek mi sorunlu?<br><b>2) Hangi renk?</b> Sarı, morumsu ve kuru kenar farklı eksiklere işaret eder.<br><b>3) Hangi görev aksıyor?</b> Besin elementlerinin her birinin farklı bir görevi var.<br><b>4) Formüle bak.</b> Malzemenin içindeki element sembolü seni cevaba götürür.<br><b>5) Fazlası zarar.</b> Doz ölçülü olmalı.</div>');
  return;
 }
 const C=KZ[kzS.k],n=C.st.length;
 if(kzS.i>=n){
  const P=kzS.plant!=null&&U.grid[kzS.plant]?PL[U.grid[kzS.plant].t]:null;
  const d=card(p,"✅ Teşhis tamam!",'<div>Vaka: <b>'+C.ad+"</b><br>Çözüm: <b>"+GR[C.tool].e+" "+GR[C.tool].ad+"</b> ("+GR[C.tool].f+")<br>Yanlış deneme: "+kzS.wrong+'</div><div class="mute" style="margin-top:6px">'+GR[C.tool].d+"</div>");
  if(!kzS.paid){kzS.paid=1;if(Date.now()-kzAt>20000){kzAt=Date.now();addXp(kzS.wrong?4:8);toast("+"+(kzS.wrong?4:8)+" XP");dirty();head()}learn(C.learn);sfx(900,.3)}
  if(P&&U.grid[kzS.plant]&&U.grid[kzS.plant].yellow){btn(d,"Bahçeye git ve uygula",()=>{tool={m:"use"};selUse=cnt("gear",C.tool)?C.tool:null;kzS=null;renderTools();switchTab("garden");say(cnt("gear",C.tool)?"Malzeme seçili. "+P.ad+" bitkisine dokun.":GR[C.tool].ad+" malzemen yok. Dükkândan al, sonra Kullan'dan bitkiye uygula.",!cnt("gear",C.tool))},"gold")}
  btn(d,"Yeni vaka",()=>{kzS=null;renderTab()});return;
 }
 const st=C.st[kzS.i];if(!kzS.ord)kzS.ord=shuf(st.o);
 const d=card(p,"Adım "+(kzS.i+1)+"/"+n+" · "+C.ad,'<div class="announce" style="margin:0 0 8px">🔎 Belirti: '+C.sym+"</div><div>"+st.q+"</div>");
 if(kzS.fb){const f=document.createElement("div");f.className="warn";f.textContent="💭 "+kzS.fb;d.appendChild(f)}
 kzS.ord.forEach(o=>btn(d,o[0],()=>{
  if(o[1]){kzS.i++;kzS.fb="";kzS.ord=null;toast("Doğru!");sfx(660,.2);renderTab()}
  else{kzS.wrong++;kzS.fb=o[2];sfx(160,.2);renderTab()}},"opt"));
 btn(d,"Menüye dön",()=>{kzS=null;renderTab()});
}

let ph={v:7,st:0,init:false},phAt=0;
function phNew(){ph.v=[2,3,4,9,10,11,12][Math.floor(Math.random()*7)];ph.st=0;ph.init=true}
function lerpC(a,b,t){const A=[1,3,5].map(i=>parseInt(a.slice(i,i+2),16)),B=[1,3,5].map(i=>parseInt(b.slice(i,i+2),16));return"#"+A.map((x,i)=>Math.round(x+(B[i]-x)*t).toString(16).padStart(2,"0")).join("")}
function phColor(v){const st=[[1,"#d62839"],[3,"#e8618c"],[5,"#b36fd1"],[7,"#6c5fd1"],[9,"#3f7fd9"],[11,"#2fb59a"],[13,"#d8d13a"]];for(let i=0;i<st.length-1;i++)if(v<=st[i+1][0])return lerpC(st[i][1],st[i+1][1],Math.max(0,(v-st[i][0])/2));return st[6][1]}
function phV(p){
 if(!ph.init)phNew();
 const d=card(p,"pH Deneyi",'<div class="mute">Beherdeki sıvı mor lahana indikatörüyle renkli. Hedef: pH\'ı bitkilerin sevdiği <b>6 – 7,5</b> aralığına getir. Az adımda başarırsan daha çok ödül!</div>');
 const b=document.createElement("div");b.className="beaker";b.style.background=phColor(ph.v);d.appendChild(b);
 const info=ph.v<3?"Güçlü asit":ph.v<6?"Asidik":ph.v<=7.5?"Nötre yakın ✅":ph.v<11?"Bazik":"Güçlü baz";
 d.insertAdjacentHTML("beforeend",'<div style="text-align:center"><b>pH '+ph.v.toFixed(1)+"</b> · "+info+" · adım: "+ph.st+'</div><div class="scale"><i style="left:calc('+((ph.v-1)/13*100)+'% - 3px)"></i></div><div class="mute" style="display:flex;justify-content:space-between"><span>1 asit</span><span>7 nötr</span><span>14 baz</span></div>');
 const r=document.createElement("div");r.className="row";r.style.marginTop="8px";d.appendChild(r);
 const done=ph.v>=6&&ph.v<=7.5;
 const step=f=>{f();ph.st++;learn("ph");if(ph.v>=6&&ph.v<=7.5){const rw=Date.now()-phAt>60000?Math.max(2,10-ph.st):0;if(rw)phAt=Date.now();U.coins+=rw;addXp(rw?6:1);toast("Hedefe ulaştın!"+(rw?" +"+rw+" 🪙":" (ödül için 1 dk bekle)"));say("pH "+ph.v.toFixed(1)+": nötre yakın. Her 1 pH birimi 10 kat H⁺ farkıdır.");dirty();head();sfx(900,.3)}renderTab()};
 btn(r,"🍋 Limon suyu (asit)",()=>step(()=>ph.v=Math.max(1,ph.v-1))).disabled=done;
 btn(r,"🥄 Kabartma sodası (baz)",()=>step(()=>ph.v=Math.min(13.5,ph.v+1))).disabled=done;
 btn(r,"💧 Su (seyrelt)",()=>step(()=>ph.v=Math.round((ph.v+(7-ph.v)*.3)*10)/10)).disabled=done;
 btn(r,done?"Yeni deney":"Yeni sıvı",()=>{phNew();renderTab()},done?"gold":"");
 d.insertAdjacentHTML("beforeend",'<div class="mute" style="margin-top:8px">Not: Su, asidi/bazı sadece seyreltir, pH\'ı yavaşça 7\'ye yaklaştırır; asit-baz tepkimesi kadar etkili değildir.</div>');
}
function bookV(p){
 card(p,"Bilgi Defteri",'<div class="mute">Oynarken yeni kavramlar açılır. Kilitli olanın nasıl açılacağı yazar.</div>');
 Object.keys(CON).forEach(k=>{const c=CON[k],ok=U.know[k];card(p,ok?"📖 "+c.t:"🔒 ???",'<div class="'+(ok?"":"mute")+'">'+(ok?c.x:"Nasıl açılır: "+c.how)+"</div>")});
}
const KB=[[/asit|baz|ph/i,"pH, çözeltideki H⁺ miktarının ölçüsüdür. 7 nötr, altı asit, üstü bazdır. Limon asit, kabartma sodası bazdır."],[/azot|nitrojen/i,"Azot klorofilin ve proteinlerin parçasıdır. Eksikse yapraklar soluk sarı olur. Üre iyi bir azot kaynağıdır."],[/fosfor/i,"Fosfor ATP'nin parçasıdır; kök ve çiçeklenme için gerekir. Eksikse yapraklar morumsu olur."],[/potasyum/i,"Potasyum hücrelerin su dengesini ve meyve kalitesini düzenler."],[/ozmos|tuz|yan/i,"Toprakta tuz derişimi artarsa su köklerden dışarı çekilir. Bitki susuzluktan yanar (ozmos)."],[/fotosentez|karbondioksit|co2/i,"Fotosentez: 6CO₂ + 6H₂O + ışık → C₆H₁₂O₆ + 6O₂."],[/katalizör/i,"Katalizör tepkimeyi hızlandırır ama tükenmez. Aktivasyon enerjisini düşürür."],[/tampon/i,"Tampon çözelti pH'ın değişmesine direnir; zayıf asit ve eşlenik bazından oluşur."],[/element|periyodik/i,"Periyodik tabloda elementler atom numarasına göre dizilir. Aynı sütundakilerin özellikleri benzerdir."],[/atom/i,"Atom; çekirdekte proton ve nötron, çevresinde elektronlardan oluşur."],[/iyon/i,"İyon, elektron alıp vermiş yüklü atomdur. NaCl suda Na⁺ ve Cl⁻ iyonlarına ayrışır."],[/donma|buz/i,"Suyun donma noktası 0 °C'dir; tuz çözününce düşer. Buz suda yüzer çünkü donarken hacmi artar."]];
function localAnswer(q){const f=KB.find(k=>k[0].test(q));return f?f[1]:"Bunu tam bilmiyorum. 📖 Defter'e bakabilir ya da sorunu başka kelimelerle sorabilirsin. (Gelişmiş Profesör için yöneticiye ai-proxy kurdurt.)"}
function profV(p){
 const d=card(p,"🧙 Profesör Zarbüstus",'<div class="mute">9. sınıf seviyesinde kısa cevap verir.'+(CFG.aiUrl?"":" (Yerel mod: bağlı YZ yok, kısa bilgiyle cevaplar.)")+"</div>");
 const i=document.createElement("input");i.placeholder="Örn: Asit ile baz birleşince ne olur?";i.maxLength=140;d.appendChild(i);
 const o=document.createElement("div");o.className="mute";o.style.marginTop="8px";let at=0;
 const ask=async()=>{
  const q=i.value.trim();if(q.length<3)return;
  if(!G.aiEnabled)return o.textContent="Yönetici Profesör'ü şu an kapattı.";
  if(Date.now()-at<6000)return o.textContent="Biraz bekle, Profesör nefes alıyor.";at=Date.now();
  if(!CFG.aiUrl){o.textContent=localAnswer(q);return}
  o.textContent="Profesör düşünüyor...";
  try{const r=await fetch(CFG.aiUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({q})});if(!r.ok)throw new Error("HTTP "+r.status);const j=await r.json();o.textContent=j.text||localAnswer(q)}
  catch(e){o.textContent="YZ'ye ulaşılamadı ("+e.message+"). Yerel cevap: "+localAnswer(q)}
 };
 btn(d,"Sor",ask);i.addEventListener("keydown",e=>{if(e.key==="Enter")ask()});d.appendChild(o);
}

/* ---------- dükkân ---------- */
function shopV(p){
 if(G.shopOpen===false)return card(p,"🛒 Dükkân",'<div class="mute">Yönetici dükkânı geçici olarak kapattı.</div>');
 const st=stocks();
 card(p,"🛒 Dükkân",'<div class="mute">Stok her 5 dakikada yenilenir: <b id="cd">'+fmt(STK_W-(Date.now()%STK_W))+"</b>. Nadir tohumlar nadiren gelir; etkinlik tohumları sadece etkinlikte satılır.</div>");
 activeEvents().forEach(ev=>card(p,ev.e+" Etkinlik: "+ev.ad,'<div class="mute">'+ev.d+"</div>"));
 const mkBuy=(d,key,price,left,give,need)=>{const lk=need&&lvl()<need;const b=btn(d,lk?"🔒 Seviye "+need+" gerekli":"Satın al: "+price+" 🪙 ("+left+" kaldı)",()=>{if(U.coins<price||lk)return;U.coins-=price;U.bought.i[key]=bought(key)+1;give();dirty();head();renderTools();renderTab();sfx(600,.1)});b.disabled=lk||U.coins<price||left<1};
 let h=card(p,"🌱 Tohumlar");
 Object.keys(st.sd).sort((a,b)=>PL[b].seed-PL[a].seed).forEach(k=>{const P=PL[k],left=st.sd[k]-bought("s_"+k);const d=document.createElement("div");d.className="card";d.style.borderColor=RAR[P.rar].c;d.innerHTML="<b>"+P.e+" "+P.ad+'</b> <span class="tag" style="color:'+RAR[P.rar].c+";border-color:"+RAR[P.rar].c+'">'+RAR[P.rar].ad+'</span><div class="mute">Satış değeri ≈ '+Math.round(P.price*EM("sell")*FXN().sell)+" 🪙 · büyüme "+P.grow+" sn · ihtiyaç: "+NUT[P.need].ad+" · sende ×"+cnt("seed",k)+"</div>";h.appendChild(d);mkBuy(d,"s_"+k,sPrice(k),left,()=>addItem({k:"seed",t:k,n:1}),RAR[P.rar].lv)});
 h=card(p,"🧪 Lab malzemeleri");
 Object.keys(st.gr).forEach(k=>{const Gr=GR[k],left=st.gr[k]-bought("g_"+k);const d=document.createElement("div");d.className="card";d.innerHTML="<b>"+Gr.e+" "+Gr.ad+'</b> <span class="mute">'+Gr.f+'</span><div class="mute">'+Gr.d+" · sende ×"+cnt("gear",k)+"</div>";h.appendChild(d);mkBuy(d,"g_"+k,gPrice(k),left,()=>addItem({k:"gear",t:k,n:1}))});
}

/* ---------- envanter ---------- */
let invF="all";
function invV(p){
 const worth=U.inv.reduce((s,e)=>s+total(e),0);
 card(p,"🎒 Envanter",'<div class="mute">'+U.inv.length+"/300 · toplam değer ≈ <b>"+worth+" 🪙</b> · ❤️ ile kilitlediğin meyve toplu satışta satılmaz. Aynı meyveyi art arda satarsan fiyat düşer (pazar doygunluğu; her 15 sn'de 1 adet toparlanır).</div>");
 const s=document.createElement("div");s.className="sub";p.appendChild(s);
 [["all","Hepsi"],["fruit","🍎 Meyve"],["seed","🌱 Tohum"],["gear","🧪 Malzeme"]].forEach(a=>btn(s,a[1],()=>{invF=a[0];renderTab()},invF===a[0]?"on":""));
 const l=U.inv.filter(e=>invF==="all"||e.k===invF).sort((a,b)=>total(b)-total(a));
 if(invF==="all"||invF==="fruit"){const fr=U.inv.filter(e=>e.k==="fruit"&&!U.fav[e.id]);if(fr.length)btn(p,"Kilitsiz tüm meyveleri sat (+"+quote(fr)+" 🪙)",()=>{const v=sellList(fr);dirty();head();toast("+"+v+" 🪙");sfx(780,.15);renderTab()},"gold")}
 const g=document.createElement("div");g.className="grid";g.style.marginTop="8px";p.appendChild(g);
 if(!l.length)g.innerHTML='<div class="mute">Burada bir şey yok.</div>';
 l.forEach(e=>{const v=iv(e),c=document.createElement("div");c.className="it";c.style.borderColor=v.c;
  c.innerHTML=(e.k!=="fruit"?'<span class="qty">×'+e.n+"</span>":"")+"<b>"+v.e+" "+esc(v.n)+" "+v.m+'</b><div class="mute">'+esc(v.s)+(v.mt?" · "+v.mt:"")+'</div><div class="val">'+total(e)+" 🪙</div>";
  const r=document.createElement("div");r.className="row";r.style.marginTop="4px";c.appendChild(r);
  if(e.k==="fruit"){btn(r,U.fav[e.id]?"❤️":"🤍",()=>{if(U.fav[e.id])delete U.fav[e.id];else U.fav[e.id]=1;dirty();renderTab()}).className="pl";btn(r,"Sat",()=>{if(U.fav[e.id])return toast("Kilitli meyve. Önce kilidi aç.",1);const v=sellList([e]);dirty();head();toast("+"+v+" 🪙"+(satNow(e.t)>4?" (pazar doygun)":""));sfx(780,.15);renderTab()}).className="pl"}
  g.appendChild(c)});
 card(p,"Petler",Object.keys(PETS).filter(k=>U.pets[k]).map(k=>'<span class="pill">'+PETS[k].e+" "+PETS[k].ad+"</span>").join("")||'<span class="mute">Henüz pet yok.</span>');
 card(p,"İstatistik",'<div class="mute">Seviye '+lvl()+" · "+U.xp+" XP · satılan meyve: "+(U.sold||0)+" · bilgi: "+Object.keys(U.know).length+"/"+Object.keys(CON).length+"</div>");
}
function petV(p){
 if(G.petsOpen===false)return card(p,"🐾 Petler",'<div class="mute">Yönetici pet satışını geçici olarak kapattı.</div>');
 Object.keys(PETS).forEach(k=>{const P=PETS[k];if(P.off)return;const pr=Math.round(P.fiyat*EM("pet")),lk=lvl()<(P.lv||1),d=card(p,P.e+" "+P.ad,'<div class="mute">'+P.bilgi+" · Gerekli seviye: "+(P.lv||1)+"</div>");
  const b=btn(d,U.pets[k]?"Sahipsin ✅":lk?"🔒 Seviye "+P.lv+" gerekli":"Evcilleştir: "+pr+" 🪙",()=>{if(U.coins<pr||lk||U.pets[k])return;U.coins-=pr;U.pets[k]=true;dirty();head();renderTab();toast(P.ad+" bahçende!");sfx(900,.3);if(k==="tilki")learn("katalizor");if(k==="kaplumbaga")learn("tampon")});b.disabled=U.pets[k]||lk||U.coins<pr})}

/* ---------- takas ---------- */
const canTrade=()=>G.tradesOpen&&U.tradeOpen!==false;
let tf={give:[],coins:0,want:"",min:0},tsort="new";
const askVal=t=>(t.ask.coins||0)+(t.ask.fruit?t.ask.fruit.min:0);
function giveVal(items){return items.reduce((a,e)=>a+total(e),0)}
function fairTxt(v,a){if(!v)return"";if(a<=0)return"Karşılık yok.";const r=a/v;return r<.6?'<span class="good">Alıcıya çok cazip (ucuz)</span>':r<=1.3?'<span class="good">Adil görünüyor</span>':'<span class="bad">Pahalı olabilir, kimse kabul etmeyebilir</span>'}
function tradeV(p){
 if(!canTrade())card(p,"Takas kapalı",'<div class="mute">'+(!G.tradesOpen?"Yönetici takası geçici olarak kapattı.":"Hesabında takas kapalı.")+"</div>");
 tf.give=tf.give.filter(g=>U.inv.some(x=>x.id===g.id));
 const items=tf.give.map(g=>Object.assign({},U.inv.find(x=>x.id===g.id),{n:g.n}));
 let d=card(p,"Yeni teklif",'<div class="mute">Vereceğin eşyaları envanterinden seç. Teklif açıkken eşyalar emanette bekler.</div>');
 const gl=document.createElement("div");gl.style.margin="8px 0";gl.innerHTML=items.length?items.map(e=>chip(e,e.n)).join(""):'<span class="mute">Henüz eşya seçmedin.</span>';d.appendChild(gl);
 btn(d,"📦 Envanterden seç",()=>pick({title:"Vereceğin eşyalar (en fazla 6)",list:U.inv,max:6,pre:tf.give,ok:s=>{tf.give=s;renderTab()}}));
 d.insertAdjacentHTML("beforeend",'<div class="mute" style="margin-top:8px">İstediğim:</div>');
 const ci=document.createElement("input");ci.type="number";ci.min=0;ci.max=1000000;ci.placeholder="Coin (🪙)";ci.value=tf.coins||"";d.appendChild(ci);
 const ws=document.createElement("select");ws.innerHTML='<option value="">+ Meyve isteme</option>'+Object.keys(PL).map(k=>'<option value="'+k+'">'+PL[k].e+" "+PL[k].ad+" meyvesi iste</option>").join("");ws.value=tf.want;d.appendChild(ws);
 const mi=document.createElement("input");mi.type="number";mi.min=0;mi.placeholder="İstenen meyvenin en az değeri (🪙)";mi.value=tf.min||"";d.appendChild(mi);
 const fr=document.createElement("div");fr.className="mute";fr.style.margin="6px 0";d.appendChild(fr);
 const upd=()=>{tf.coins=Math.max(0,Math.min(1e6,+ci.value|0));tf.want=ws.value;tf.min=tf.want?Math.max(1,+mi.value|0):0;mi.hidden=!tf.want;const v=giveVal(items),a=tf.coins+tf.min;fr.innerHTML=items.length?"Verdiğin değer: <b>"+v+" 🪙</b> · İstediğin: <b>"+a+" 🪙</b> · "+fairTxt(v,a):""};
 [ci,ws,mi].forEach(e=>e.oninput=upd);upd();
 btn(d,"Teklifi yayınla",offer,"gold").disabled=!canTrade();
 d=card(p,"Pazar (açık teklifler)");
 const sr=document.createElement("div");sr.className="sub";d.appendChild(sr);[["new","En yeni"],["val","Değerine göre"]].forEach(a=>btn(sr,a[1],()=>{tsort=a[0];renderTab()},tsort===a[0]?"on":""));
 let op=trades.filter(t=>t.status==="open"&&t.from!==uid);if(tsort==="val")op.sort((a,b)=>giveVal(b.give)-giveVal(a.give));
 if(!op.length)d.insertAdjacentHTML("beforeend",'<div class="mute">Şu an başkasının teklifi yok.</div>');
 op.forEach(t=>{const c=document.createElement("div");c.className="card";c.style.background="#1c2f26";const v=giveVal(t.give);
  c.innerHTML="<b>"+esc(t.fromName)+'</b> veriyor:<div>'+t.give.map(e=>chip(e,e.n)).join("")+'</div><div class="mute">İstiyor: '+(t.ask.coins?t.ask.coins+" 🪙 ":"")+(t.ask.fruit?"+ "+PL[t.ask.fruit.t].e+" "+PL[t.ask.fruit.t].ad+" (≥"+t.ask.fruit.min+"🪙)":"")+" · değer "+v+" 🪙 · "+fairTxt(v,askVal(t))+"</div>";
  d.appendChild(c);const a=btn(c,"Kabul et",()=>accept(t));a.disabled=!canTrade()||U.coins<(t.ask.coins||0)});
 d=card(p,"Tekliflerim");const my=trades.filter(t=>t.from===uid&&t.status==="open");
 if(!my.length)d.insertAdjacentHTML("beforeend",'<div class="mute">Açık teklifin yok.</div>');
 my.forEach(t=>{const r=row(d,t.give.map(e=>chip(e,e.n)).join("")+' <span class="mute">→ '+(t.ask.coins||0)+" 🪙"+(t.ask.fruit?" + "+PL[t.ask.fruit.t].e:"")+"</span>");btn(r,"İptal",()=>cancel(t),"red")});
}
async function offer(){
 if(!tf.give.length)return toast("Önce eşya seç.",1);if(!tf.coins&&!tf.want)return toast("Bir karşılık iste (coin veya meyve).",1);
 if(trades.filter(t=>t.from===uid&&t.status==="open").length>=3)return toast("En fazla 3 açık teklifin olabilir.",1);
 const out=[];for(const g of tf.give){const x=takeId(g.id,g.n);if(x)out.push(clone(x))}
 const doc={from:uid,fromName:U.name,give:out.map(e=>e.k==="fruit"?{k:"fruit",t:e.t,s:e.s,kg:e.kg,m:e.m||[]}:{k:e.k,t:e.t,n:e.n}),ask:{coins:tf.coins,fruit:tf.want?{t:tf.want,min:tf.min}:null},status:"open",claimed:false,ts:Date.now()};
 try{await db.collection("trades").add(doc);saveNow();tf={give:[],coins:0,want:"",min:0};toast("Teklif yayınlandı.");sfx(700,.2);renderTab()}
 catch(e){out.forEach(addItem);toast(errMsg(e),1);rulesWarn(e);renderTab()}
}
function accept(t){
 if(!canTrade())return;const ask=t.ask||{};
 const finish=async sel=>{
  if(U.coins<(ask.coins||0))return toast("Yeterli coin yok.",1);
  const pay=sel.map(s=>U.inv.find(x=>x.id===s.id)).filter(Boolean).map(e=>clone(e));
  if(ask.fruit&&!pay.length)return toast("Bir meyve seçmelisin.",1);
  try{await db.runTransaction(async tx=>{const r=db.doc("trades/"+t.id),s=await tx.get(r);if(!s.exists||s.data().status!=="open")throw new Error("gone");tx.update(r,{status:"accepted",to:uid,toName:U.name,pay:{coins:ask.coins||0,items:pay}})});
   pay.forEach(e=>takeId(e.id,1));U.coins-=ask.coins||0;t.give.forEach(addItem);addXp(6);saveNow();head();toast("Takas tamamlandı!");sfx(900,.3);renderTab()}
  catch(e){toast(e.message==="gone"?"Teklif artık geçerli değil.":errMsg(e),1)}
 };
 if(ask.fruit){const l=U.inv.filter(x=>x.k==="fruit"&&x.t===ask.fruit.t&&unit(x)>=ask.fruit.min);if(!l.length)return toast(PL[ask.fruit.t].ad+" meyven yok veya değeri yetersiz (≥"+ask.fruit.min+").",1);pick({title:"Karşılık olarak hangi meyveyi vereceksin?",list:l,max:1,ok:finish})}else finish([]);
}
async function cancel(t){
 try{await db.runTransaction(async tx=>{const r=db.doc("trades/"+t.id),s=await tx.get(r);if(!s.exists||s.data().status!=="open")throw new Error("gone");tx.update(r,{status:"cancelled",claimed:true})});t.give.forEach(addItem);saveNow();toast("Teklif iptal edildi, eşyalar iade.");renderTab()}
 catch(e){toast(e.message==="gone"?"Teklif zaten kabul edilmiş.":errMsg(e),1)}
}
function claim(){if(!U)return;trades.filter(t=>t.from===uid&&t.status==="accepted"&&!t.claimed&&!claiming.has(t.id)).forEach(async t=>{
 claiming.add(t.id);
 try{await db.doc("trades/"+t.id).update({claimed:true});const pay=t.pay||{};U.coins+=pay.coins||0;(pay.items||[]).forEach(addItem);addXp(6);saveNow();head();toast(esc(t.toName)+" teklifini kabul etti! +"+(pay.coins||0)+" 🪙"+((pay.items||[]).length?" + meyve":""));sfx(900,.3)}catch(e){claiming.delete(t.id)}})}

/* ---------- ayarlar ---------- */
function setV(p){
 const d=card(p,"Genel ayarlar");
 const tg=(k,l)=>{const r=row(d,l);btn(r,ST[k]?"Açık":"Kapalı",()=>{ST[k]=!ST[k];applySet();renderTab()},ST[k]?"on":"")};
 tg("sound","Ses efektleri");tg("anim","Animasyonlar");tg("low","Düşük performans modu");
 const kd=card(p,"🎁 Hediye kodu",'<div class="mute">Yöneticinin verdiği kodu gir.</div>');const ki=document.createElement("input");ki.placeholder="KOD";ki.maxLength=20;kd.appendChild(ki);btn(kd,"Kullan",()=>redeem(ki.value),"gold");
 const a=card(p,"Hesap",'<div class="mute">'+esc(U.email||"")+"</div>");
 const i=document.createElement("input");i.value=U.name;i.maxLength=16;a.appendChild(i);
 btn(a,"Adı kaydet",()=>{if(i.value.trim().length<3)return toast("En az 3 karakter.",1);U.name=i.value.trim();saveNow();head();toast("Ad güncellendi.")});
 btn(a,"Çıkış yap",()=>{saveNow();setTimeout(()=>auth.signOut(),300)},"red");
}

/* ---------- pazar doygunluğu ---------- */
const SAT_DEC=15000,satMul=n=>Math.max(.4,1-n*.03);
function satNow(t){const x=U.sat[t];return x?Math.max(0,x.n-(Date.now()-x.ts)/SAT_DEC):0}
function quote(list){const tmp={};let v=0;list.forEach(e=>{const n=tmp[e.t]!==undefined?tmp[e.t]:satNow(e.t);v+=Math.max(1,Math.round(unit(e)*satMul(n)));tmp[e.t]=n+1});return v}
function sellList(list){let v=0;list.forEach(e=>{const n=satNow(e.t);v+=Math.max(1,Math.round(unit(e)*satMul(n)));U.sat[e.t]={n:n+1,ts:Date.now()};takeId(e.id,1)});U.coins+=v;U.sold+=list.length;addXp(list.length*2);return v}

/* ---------- sürükle-bırak ---------- */
function tileAt(cx,cy){const r=cv.getBoundingClientRect(),x=(cx-r.left)/r.width*S-M,y=(cy-r.top)/r.height*S-M;if(x<0||y<0||x>=TS*5||y>=TS*5)return -1;return Math.floor(y/TS)*5+Math.floor(x/TS)}
function dragify(el,onDrop){
 el.style.touchAction="pan-x";
 el.addEventListener("pointerdown",ev=>{
  if(ev.button>0||el.disabled)return;const sx=ev.clientX,sy=ev.clientY;let gh=null,moved=0;
  const mv=e=>{if(!moved){if(Math.hypot(e.clientX-sx,e.clientY-sy)<8)return;moved=1;gh=document.createElement("div");gh.className="ghost";gh.textContent=el.textContent.slice(0,22);document.body.appendChild(gh)}gh.style.left=e.clientX+"px";gh.style.top=e.clientY+"px";const u=document.elementFromPoint(e.clientX,e.clientY),fl=document.querySelector(".flask");if(fl)fl.classList.toggle("over",!!(u&&u.closest&&u.closest("[data-flask]")))};
  const up=e=>{window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);window.removeEventListener("pointercancel",up);if(gh)gh.remove();const fl=document.querySelector(".flask");if(fl)fl.classList.remove("over");if(moved){el.dataset.dragged=1;setTimeout(()=>{delete el.dataset.dragged},80);if(e.type==="pointerup")onDrop(e.clientX,e.clientY,document.elementFromPoint(e.clientX,e.clientY))}};
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);window.addEventListener("pointercancel",up)});
 el.addEventListener("click",e=>{if(el.dataset.dragged){e.stopImmediatePropagation();e.preventDefault()}},true)}

/* ---------- üretilen gübrelerin bitkideki etkisi ---------- */
function applyFx(i,p,P,Gr,id){
 const f=Gr.fx||{};let used=0;const msg=[];
 if(f.feed){const n=f.feed==="any"?P.need:f.feed;
  if(n!==P.need)return say(Gr.ad+" bu bitkinin ihtiyacını karşılamaz. Belirtiye bak: "+SYMP[P.need],1);
  if(p.d[n]>=1&&!f.boost)return say("Bu bitki bu elementi zaten almış.",1);
  if(p.d[n]<1){p.d[n]=1;used=1;msg.push(NUT[n].ad+" verildi, yanma riski yok");learn({N:"azot",P:"fosfor",K:"potasyum"}[n]);if(p.yellow&&!p.tried){const b=Math.max(2,Math.round((2+lvl()/2)*EM("order")));U.coins+=b;addXp(8);msg.push("doğru teşhis +"+b+" 🪙")}}}
 if(f.boost){const cap=(!p.nd||p.d[P.need]>=1)?P.grow:P.grow*.15;if(p.pr<cap){p.pr=Math.min(cap,p.pr+P.grow*f.boost);used=1;msg.push("+%"+Math.round(f.boost*100)+" ilerleme")}}
 if(f.speed){p.fxm=f.speed;p.fxu=Date.now()+f.dur*1000;used=1;msg.push("×"+f.speed+" hız ("+Math.round(f.dur/60)+" dk)")}
 if(f.size){if(p.s>=2.5)msg.push("zaten en büyük boyda");else{p.s=Math.min(2.5,Math.round(p.s*f.size*100)/100);used=1;msg.push("büyüklük ×"+f.size)}}
 if(f.mut){used=1;if(p.m.length>=2)msg.push("mutasyon yuvaları dolu, boşa gitti");else{const pool=activeWeathers().map(w=>w.mut).filter(Boolean).concat(["islak","soklu","donmus","fosforlu"]).filter(m=>!p.m.includes(m));if(Math.random()<f.mut&&pool.length){const m=pool[Math.floor(Math.random()*pool.length)];p.m.push(m);pop(i,MUT[m].e+MUT[m].ad,MUT[m].c);learn(m);msg.push(MUT[m].e+" "+MUT[m].ad+" mutasyonu!")}else msg.push("mutasyon tutmadı")}}
 if(f.buf){p.buf=(+p.buf||0)+f.buf;used=1;msg.push("koruma ×"+f.buf)}
 if(f.heal&&(p.nd||p.yellow)){p.nd=false;p.yellow=false;used=1;msg.push("bitki iyileşti")}
 if(!used)return say(Gr.ad+" şu an bu bitkide işe yaramaz.",1);
 useOne("gear",id);pop(i,Gr.e);addXp(2);say(Gr.ad+": "+msg.join(", ")+".");renderTools()}

/* ---------- ATÖLYE: sürükle-bırak gübre üretimi ---------- */
let mx={s:[null,null,null],msg:""};
const mxUse=t=>mx.s.filter(x=>x===t).length;
function mxAdd(t){const i=mx.s.indexOf(null);if(i<0)return toast("Şişe dolu (3 yuva).",1);if(cnt("gear",t)-mxUse(t)<1)return toast("Bu malzemeden başka yok.",1);mx.s[i]=t;sfx(500,.06);renderTab()}
function mxMix(){
 const ids=mx.s.filter(Boolean).sort();if(ids.length<2){mx.msg="En az 2 malzeme koy.";return renderTab()}
 const key=ids.join(",");let hit=null;Object.keys(RCP).forEach(k=>{if(RCP[k].in.slice().sort().join(",")===key)hit=k});
 if(!hit){const has=t=>ids.includes(t),near=Object.keys(RCP).some(k=>{const nd=RCP[k].in.slice();let m=0;ids.forEach(t=>{const j=nd.indexOf(t);if(j>=0){nd.splice(j,1);m++}});return m>=2});
  mx.msg=has("kirec")&&has("ure")?"Kireç ile üre karışınca azot amonyak gazı olarak kaçabilir: işe yarar bir şey çıkmadı.":has("kirec")&&has("kukurt")&&!has("su")?"Baz ile asit kaynağı birbirini nötrler ama ortam (çözücü) yoksa tepkime başlamaz.":near?"Doğru yoldasın! Bu karışım bilinen bir tarife yakın; malzemelerden biri eksik ya da fazla.":"Reaksiyon yok. Malzemeler birbirine etki etmiyor. (Hiçbir şey harcanmadı.)";
  sfx(160,.2);return renderTab()}
 const nd={};ids.forEach(t=>nd[t]=(nd[t]||0)+1);
 for(const t in nd)if(cnt("gear",t)<nd[t]){mx.msg="Yeterli malzeme yok.";return renderTab()}
 ids.forEach(t=>useOne("gear",t));addItem({k:"gear",t:hit,n:RCP[hit].q});
 const first=!U.rec[hit];if(first)U.rec[hit]=Date.now();
 if(first){addXp(15);toast("🧪 Yeni tarif keşfedildi: "+GR[hit].ad)}else addXp(2);
 learn(RCP[hit].k);mx.s=[null,null,null];mx.msg=(first?"🎉 Yeni tarif! ":"✅ ")+GR[hit].e+" "+GR[hit].ad+" ×"+RCP[hit].q+" üretildi. "+GR[hit].d;
 sfx(900,.3);dirty();head();renderTab()}
function mixV(p){
 let d=card(p,"⚗️ Gübre Atölyesi",'<div class="mute">Malzemeleri <b>sürükleyip şişeye bırak</b> (ya da dokun). En fazla 3 malzeme. Tarifi bilmiyorsan deney yap: yanlış karışımda hiçbir şey harcanmaz. Ürettiğin gübreleri bahçede bitkilere uygula!</div>');
 const fl=document.createElement("div");fl.className="flask";fl.dataset.flask="1";d.appendChild(fl);
 mx.s.forEach((t,i)=>{const sl=document.createElement("div");sl.className="slot"+(t?" f":"");sl.innerHTML=t?GR[t].e+"<br>"+esc(GR[t].ad):"＋";sl.onclick=()=>{if(mx.s[i]){mx.s[i]=null;renderTab()}};fl.appendChild(sl)});
 const r=document.createElement("div");r.className="row";d.appendChild(r);btn(r,"⚗️ Karıştır",mxMix,"gold");btn(r,"Boşalt",()=>{mx.s=[null,null,null];mx.msg="";renderTab()});
 if(mx.msg){const m=document.createElement("div");m.className="announce";m.style.marginTop="8px";m.textContent=mx.msg;d.appendChild(m)}
 d=card(p,"🧪 Malzemelerin",'<div class="mute">Sürükle → şişe</div>');
 const mats=U.inv.filter(x=>x.k==="gear"&&!GR[x.t].craft);
 if(!mats.length)d.insertAdjacentHTML("beforeend",'<div class="mute">Malzemen yok. Dükkândan al.</div>');
 const pl=document.createElement("div");pl.style.cssText="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px";d.appendChild(pl);
 mats.forEach(x=>{const left=x.n-mxUse(x.t),b=document.createElement("button");b.className="pl";b.innerHTML=GR[x.t].e+" "+esc(GR[x.t].ad)+' <span class="mute">'+GR[x.t].f+"</span> ×"+left;b.disabled=left<1;b.onclick=()=>mxAdd(x.t);dragify(b,(cx,cy,u)=>{if(u&&u.closest&&u.closest("[data-flask]"))mxAdd(x.t)});pl.appendChild(b)});
 d=card(p,"🌈 Ürettiğin gübreler");const cr=U.inv.filter(x=>x.k==="gear"&&GR[x.t].craft);
 if(!cr.length)d.insertAdjacentHTML("beforeend",'<div class="mute">Henüz bir şey üretmedin.</div>');
 cr.forEach(x=>{const Gx=GR[x.t],r2=row(d,Gx.e+" <b>"+esc(Gx.ad)+"</b> ×"+x.n+'<div class="mute">'+esc(Gx.d)+"</div>");btn(r2,"Bahçede dene",()=>{tool={m:"use"};selUse=x.t;renderTools();switchTab("garden");say(Gx.ad+" seçili. Bitkiye dokun ya da bitkinin üstüne sürükle.")},"gold")});
 d=card(p,"📖 Tarif defteri ("+Object.keys(U.rec).filter(k=>RCP[k]).length+"/"+Object.keys(RCP).length+")");
 Object.keys(RCP).forEach(k=>{const R=RCP[k];row(d,U.rec[k]?GR[k].e+" <b>"+esc(GR[k].ad)+"</b> ×"+R.q+'<div class="mute">'+R.in.map(t=>GR[t].e+" "+esc(GR[t].ad)).join(" + ")+" → "+esc(GR[k].d)+"</div>":'🔒 <b>???</b> <span class="mute">('+R.in.length+' malzeme)</span><div class="mute">İpucu: '+esc(R.h)+"</div>")});
}

/* ---------- hediye kodu ---------- */
function redeem(raw){const code=String(raw||"").trim().toUpperCase().replace(/[^A-Z0-9]/g,""),c=(G.codes||{})[code];
 if(!code||!c||c.off)return toast("Geçersiz kod.",1);if(c.u&&c.u<Date.now())return toast("Kodun süresi dolmuş.",1);if(U.codes[code])return toast("Bu kodu zaten kullandın.",1);
 U.codes[code]=Date.now();const got=[];
 if(c.c>0){U.coins+=c.c|0;got.push((c.c|0)+" 🪙")}
 if(c.s&&PL[c.s]){addItem({k:"seed",t:c.s,n:Math.max(1,(c.sn|0)||1)});got.push(PL[c.s].e+" "+PL[c.s].ad+" tohumu")}
 if(c.g&&GR[c.g]){addItem({k:"gear",t:c.g,n:Math.max(1,(c.gn|0)||1)});got.push(GR[c.g].e+" "+GR[c.g].ad)}
 saveNow();head();renderTools();toast("🎁 Kod kabul edildi: "+got.join(", "));sfx(900,.3)}

(function(){const st=document.createElement("style");st.textContent=".ghost{position:fixed;z-index:99;pointer-events:none;transform:translate(-50%,-130%);background:#f2c14e;color:#14211b;font-weight:bold;padding:5px 9px;border:3px solid #14211b;font-size:13px}.flask{display:flex;gap:8px;justify-content:center;margin:10px 0;padding:10px;border:3px dashed var(--teal);background:#0f1a15}.flask.over{background:#1c3a2c;border-color:var(--gold)}.slot{width:76px;min-height:76px;border:3px solid var(--line);background:var(--pan);display:flex;align-items:center;justify-content:center;font-size:12px;text-align:center;padding:2px;cursor:pointer;color:var(--ink)}.slot.f{border-color:var(--gold)}";document.head.appendChild(st)})();
applySet();
