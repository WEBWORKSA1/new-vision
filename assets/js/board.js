/* New.Vision — Vision Board Maker */
(function(){
  "use strict";
  var $=function(s){return document.querySelector(s)},$$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
  var board=$("#board");if(!board)return;
  var GRADS=["linear-gradient(135deg,#7c5cff,#22d3ee)","linear-gradient(135deg,#ff6b9d,#ffb86b)","linear-gradient(135deg,#34d399,#22d3ee)","linear-gradient(135deg,#0c0b1d,#5b3df0)","linear-gradient(135deg,#ffb86b,#ffe29a)","linear-gradient(135deg,#1e3a8a,#22d3ee)","linear-gradient(135deg,#f43f5e,#7c5cff)","linear-gradient(135deg,#10b981,#065f46)"];
  var BGS={"Midnight":"#0c0b1d","Paper":"#f6f2ea","Blush":"#fde2e4","Ocean":"#0b3954","Forest":"#1f3b2d","Sand":"#e9dcc9"};
  var EMOJI=["✨","🏡","💼","💰","✈️","❤️","🧘","🏃","📚","🎨","🌱","🎓","🚀","🌍","👨‍👩‍👧","🍎","🎯","🎵","🐶","☀️","💪","🧠","🏆","📈"];
  var TEMPLATES={
    "Balanced Year":[["🧘","Calm mind, strong body",0],["💼","Work I'm proud of",3],["💰","Savings on autopilot",4],["❤️","Present with my people",1],["✈️","One trip that changes me",5],["📚","24 books",2],["🌱","Grow every day",6],["🏡","A home that feels like rest",7],["✨","This is my year",0]],
    "Career Leap":[["🚀","Launch the side project",0],["📈","Raise my income 30%",5],["🎓","New certification",3],["🤝","10 coffee chats",1],["🎯","Ship weekly",6],["🧠","Deep work mornings",2]],
    "Health Reset":[["🏃","Run a 10K",2],["🍎","Cook 5 nights a week",4],["😴","7.5 hours sleep",5],["💧","Water before coffee",0],["🧘","10 min daily stillness",3],["💪","Strength 3x/week",6]],
    "Money Goals":[["💰","6-month emergency fund",4],["📈","Invest every payday",5],["🧾","Debt-free by December",1],["🏡","House deposit",7],["🎁","Generous giving",2],["🧠","Learn how money works",0]],
    "Travel & Adventure":[["🌍","3 new countries",5],["🏔️","Sunrise on a mountain",3],["🌊","Learn to surf",0],["🚆","Slow train journey",2],["📸","Photo book of the year",1],["✈️","Say yes to the trip",6]],
    "Family & Love":[["👨‍👩‍👧","Sunday family dinners",1],["❤️","Weekly date night",6],["🐶","Adopt a dog",4],["🏡","Garden we eat from",7],["📞","Call parents weekly",0],["🎉","Host friends monthly",2]]
  };
  var state=NV.store.get("board",null)||{layout:9,title:"My Vision",bg:"#0c0b1d",tiles:[]};
  var editing=-1,dragFrom=-1;

  function ensure(){while(state.tiles.length<state.layout)state.tiles.push(null);state.tiles=state.tiles.slice(0,state.layout)}
  function save(){if(!NV.store.set("board",state))NV.toast("Storage is full — try fewer or smaller photos.")}
  function render(){ensure();board.className="board l"+state.layout;board.style.setProperty("--board-bg",state.bg);
    var light=["#f6f2ea","#fde2e4","#e9dcc9"].indexOf(state.bg)>-1;
    var html='<h2 class="board-title" style="color:'+(light?"#1b1a33":"#fff")+'">'+esc(state.title)+'</h2>';
    state.tiles.forEach(function(t,i){
      if(!t){html+='<div class="tile" draggable="true" data-i="'+i+'" tabindex="0" role="button" aria-label="Add to tile '+(i+1)+'"><span class="t-add">＋ Add</span></div>';return}
      var bg=t.img?"url("+t.img+")":t.grad||GRADS[0];
      html+='<div class="tile filled" draggable="true" data-i="'+i+'" tabindex="0" role="button" aria-label="Edit tile '+(i+1)+'" style="background:'+(t.img?"":bg)+';'+(t.img?"background-image:"+bg+";":"")+'">'+
        (t.img?'<i style="position:absolute;inset:0;background:linear-gradient(transparent 45%,#0008)"></i>':"")+
        '<div class="t-text">'+(t.emoji?'<span class="t-emoji">'+t.emoji+'</span>':"")+esc(t.text||"")+'</div></div>'});
    board.innerHTML=html;$("#bTitle").value=state.title;
    $$(".layout-btn").forEach(function(b){b.classList.toggle("btn-dark",+b.dataset.l===state.layout);b.classList.toggle("btn-ghost",+b.dataset.l!==state.layout)});
    var filled=state.tiles.filter(Boolean).length;$("#bCount").textContent=filled+" / "+state.layout+" tiles filled";
  }
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

  /* modal */
  var modal=$("#tileModal"),cur={};
  function openTile(i){editing=i;cur=Object.assign({grad:GRADS[i%GRADS.length]},state.tiles[i]||{});$("#tText").value=cur.text||"";
    $$("#gradRow .swatch").forEach(function(s){s.classList.toggle("on",s.dataset.g===cur.grad)});$("#tPreview").style.background=cur.img?"url("+cur.img+") center/cover":cur.grad;
    $("#tPreview").innerHTML='<span class="t-emoji">'+(cur.emoji||"")+'</span>';modal.classList.add("open");$("#tText").focus()}
  function close(){modal.classList.remove("open");editing=-1}
  $("#gradRow").innerHTML=GRADS.map(function(g){return '<button type="button" class="swatch" data-g="'+g+'" style="background:'+g+'" aria-label="Gradient"></button>'}).join("");
  $("#emojiRow").innerHTML=EMOJI.map(function(e){return '<button type="button" data-e="'+e+'">'+e+'</button>'}).join("")+'<button type="button" data-e="" title="No icon">⦸</button>';
  $("#bgRow").innerHTML=Object.keys(BGS).map(function(k){return '<button type="button" class="swatch" data-bg="'+BGS[k]+'" title="'+k+'" style="background:'+BGS[k]+'"></button>'}).join("");
  modal.addEventListener("click",function(e){var g=e.target.closest("[data-g]"),em=e.target.closest("[data-e]");
    if(g){cur.grad=g.dataset.g;cur.img=null;$$("#gradRow .swatch").forEach(function(s){s.classList.toggle("on",s===g)});$("#tPreview").style.background=cur.grad}
    if(em){cur.emoji=em.dataset.e;$("#tPreview").innerHTML='<span class="t-emoji">'+cur.emoji+'</span>'}
    if(e.target===modal||e.target.closest("[data-close]"))close();
    if(e.target.closest("#tSave")){cur.text=$("#tText").value.trim();state.tiles[editing]=(cur.text||cur.emoji||cur.img)?{text:cur.text,emoji:cur.emoji,grad:cur.grad,img:cur.img||null}:null;save();render();close()}
    if(e.target.closest("#tClear")){state.tiles[editing]=null;save();render();close()}});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&modal.classList.contains("open"))close()});
  $("#tImg").addEventListener("change",function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){
      var s=Math.min(1,700/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*s;c.height=im.height*s;c.getContext("2d").drawImage(im,0,0,c.width,c.height);
      cur.img=c.toDataURL("image/jpeg",.8);$("#tPreview").style.background="url("+cur.img+") center/cover"};im.src=r.result};r.readAsDataURL(f);this.value=""});

  /* board interactions */
  board.addEventListener("click",function(e){var t=e.target.closest(".tile");if(t)openTile(+t.dataset.i)});
  board.addEventListener("keydown",function(e){var t=e.target.closest(".tile");if(t&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openTile(+t.dataset.i)}});
  board.addEventListener("dragstart",function(e){var t=e.target.closest(".tile");if(t){dragFrom=+t.dataset.i;e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",dragFrom)}});
  board.addEventListener("dragover",function(e){var t=e.target.closest(".tile");if(t){e.preventDefault();$$(".tile").forEach(function(x){x.classList.toggle("drag-over",x===t)})}});
  board.addEventListener("drop",function(e){var t=e.target.closest(".tile");if(!t||dragFrom<0)return;e.preventDefault();var to=+t.dataset.i,a=state.tiles[dragFrom];state.tiles[dragFrom]=state.tiles[to];state.tiles[to]=a;dragFrom=-1;save();render()});
  board.addEventListener("dragend",function(){$$(".tile").forEach(function(x){x.classList.remove("drag-over")})});

  $$(".layout-btn").forEach(function(b){b.addEventListener("click",function(){state.layout=+b.dataset.l;save();render()})});
  $("#bTitle").addEventListener("input",function(){state.title=this.value||"My Vision";save();var h=$(".board-title");if(h)h.textContent=state.title});
  $("#bgRow").addEventListener("click",function(e){var s=e.target.closest("[data-bg]");if(s){state.bg=s.dataset.bg;save();render()}});
  $("#tplSel").innerHTML='<option value="">Choose a starter template…</option>'+Object.keys(TEMPLATES).map(function(k){return "<option>"+k+"</option>"}).join("");
  $("#tplSel").addEventListener("change",function(){var t=TEMPLATES[this.value];if(!t)return;
    if(state.tiles.some(Boolean)&&!confirm("Replace your current tiles with this template?")){this.value="";return}
    state.layout=t.length>6?9:6;state.title=this.value==="Balanced Year"?"My "+(new Date().getMonth()>8?new Date().getFullYear()+1:new Date().getFullYear())+" Vision":this.value;
    state.tiles=t.map(function(x){return{emoji:x[0],text:x[1],grad:GRADS[x[2]]}});save();render();NV.toast("Template loaded — click any tile to make it yours.");this.value=""});
  $("#bReset").addEventListener("click",function(){if(confirm("Clear the whole board?")){state={layout:9,title:"My Vision",bg:"#0c0b1d",tiles:[]};save();render()}});
  $("#bPrint").addEventListener("click",function(){window.print()});

  /* export PNG */
  $("#bExport").addEventListener("click",function(){
    var cols=state.layout===12?4:3,rows=Math.ceil(state.layout/cols),S=420,G=24,P=48,H=130,W=P*2+cols*S+(cols-1)*G,HH=P+H+rows*S+(rows-1)*G+P+40;
    var c=document.createElement("canvas");c.width=W;c.height=HH;var x=c.getContext("2d");x.fillStyle=state.bg;x.fillRect(0,0,W,HH);
    var light=["#f6f2ea","#fde2e4","#e9dcc9"].indexOf(state.bg)>-1;x.fillStyle=light?"#1b1a33":"#fff";x.font="600 72px Fraunces, Georgia, serif";x.textAlign="center";x.textBaseline="middle";x.fillText(state.title,W/2,P+H/2);
    var jobs=state.tiles.map(function(t,i){return new Promise(function(res){var cx=P+(i%cols)*(S+G),cy=P+H+Math.floor(i/cols)*(S+G);
      x.save();rr(x,cx,cy,S,S,30);x.clip();
      if(!t){x.fillStyle=light?"#00000010":"#ffffff14";x.fillRect(cx,cy,S,S);x.restore();return res()}
      var done=function(){var gr=x.createLinearGradient(0,cy+S*.45,0,cy+S);gr.addColorStop(0,"rgba(0,0,0,0)");gr.addColorStop(1,t.img?"rgba(0,0,0,.55)":"rgba(0,0,0,0)");x.fillStyle=gr;x.fillRect(cx,cy,S,S);
        x.fillStyle="#fff";x.textAlign="center";var ty=cy+S/2;if(t.emoji){x.font="110px serif";x.fillText(t.emoji,cx+S/2,cy+S/2-(t.text?50:0));ty=cy+S/2+70}
        if(t.text){x.font="600 38px Fraunces, Georgia, serif";x.shadowColor="rgba(0,0,0,.5)";x.shadowBlur=14;wrap(x,t.text,cx+S/2,t.emoji?ty:cy+S/2,S-50,44);x.shadowBlur=0}x.restore();res()};
      if(t.img){var im=new Image();im.onload=function(){var r=Math.max(S/im.width,S/im.height),w=im.width*r,h=im.height*r;x.drawImage(im,cx+(S-w)/2,cy+(S-h)/2,w,h);done()};im.onerror=done;im.src=t.img}
      else{x.fillStyle=gradFrom(x,t.grad,cx,cy,S);x.fillRect(cx,cy,S,S);done()}})});
    Promise.all(jobs).then(function(){x.fillStyle=light?"#1b1a3399":"#ffffff99";x.font="500 24px Inter, Arial";x.textAlign="right";x.fillText("made with New.Vision",W-P,HH-P/1.3);
      c.toBlob(function(b){NV.download("my-vision-board.png",b);NV.toast("Your vision board PNG is downloading. Set it as your wallpaper!")})})});
  function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
  function gradFrom(x,g,cx,cy,S){var m=(g||GRADS[0]).match(/#[0-9a-f]{6}/gi)||["#7c5cff","#22d3ee"];var gr=x.createLinearGradient(cx,cy,cx+S,cy+S);gr.addColorStop(0,m[0]);gr.addColorStop(1,m[1]||m[0]);return gr}
  function wrap(x,t,cx,cy,mw,lh){var w=t.split(" "),lines=[],l="";w.forEach(function(word){var tt=l?l+" "+word:word;if(x.measureText(tt).width>mw&&l){lines.push(l);l=word}else l=tt});lines.push(l);
    var y0=cy-(lines.length-1)*lh/2;lines.forEach(function(ln,i){x.fillText(ln,cx,y0+i*lh)})}
  render();
})();
