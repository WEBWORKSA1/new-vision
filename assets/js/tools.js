/* New.Vision — Goal Planner, Wheel of Life, Affirmations, Future Letter */
(function(){
  "use strict";
  var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  function esc(s){return String(s||"").replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

  /* ================= GOAL PLANNER ================= */
  var gp=$("#goalForm");
  if(gp){
    var goals=NV.store.get("goals",[]);
    var d=new Date();d.setMonth(d.getMonth()+6);$("#gDeadline").value=d.toISOString().slice(0,10);
    gp.addEventListener("submit",function(e){e.preventDefault();if(!gp.checkValidity()){gp.reportValidity();return}
      var g={id:Date.now(),area:$("#gArea").value,what:$("#gWhat").value.trim(),measure:$("#gMeasure").value.trim(),why:$("#gWhy").value.trim(),deadline:$("#gDeadline").value,obstacle:$("#gObstacle").value.trim(),plan:$("#gPlan").value.trim(),progress:0};
      goals.unshift(g);NV.store.set("goals",goals);showResult(g);renderGoals();gp.reset();$("#gDeadline").value=d.toISOString().slice(0,10)});
    function milestones(g){var end=new Date(g.deadline),now=new Date(),span=end-now,out=[];if(span<=0)return [];
      [.25,.5,.75,1].forEach(function(p,i){var dt=new Date(now.getTime()+span*p);out.push({date:dt,label:["Foundation","Momentum","Stretch","Finish line"][i],pct:p*100})});return out}
    function statement(g){var dl=new Date(g.deadline).toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"});
      return "By "+dl+", I will "+g.what.replace(/\.$/,"")+(g.measure?", measured by "+g.measure.replace(/\.$/,""):"")+" — because "+(g.why||"it matters to me").replace(/\.$/,"")+"."}
    function showResult(g){var ms=milestones(g),r=$("#goalResult");
      r.innerHTML='<div class="card"><span class="tag">'+esc(g.area)+'</span><h3 style="margin-top:.7rem">Your SMART goal</h3><p style="color:var(--ink);font-size:1.1rem">'+esc(statement(g))+'</p>'+
        '<h4 style="font-family:var(--font);margin-top:1rem">Milestones</h4><ul class="timeline" style="margin-top:.7rem">'+ms.map(function(m){return "<li><b>"+m.label+"</b> — "+m.date.toLocaleDateString(undefined,{month:"short",day:"numeric"})+" ("+m.pct+"% done)</li>"}).join("")+'</ul>'+
        (g.obstacle||g.plan?'<h4 style="font-family:var(--font)">WOOP if-then plan</h4><p><b>If</b> '+esc(g.obstacle||"I get stuck")+', <b>then</b> I will '+esc(g.plan||"take the smallest next step")+'.</p>':"")+
        '<div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem"><button class="btn btn-dark btn-sm" data-ics="'+g.id+'">📅 Add check-ins to calendar</button><button class="btn btn-ghost btn-sm" data-txt="'+g.id+'">⬇ Download plan</button><a class="btn btn-primary btn-sm" href="coaching.html?topic='+encodeURIComponent(g.area)+'">Get a coach for this goal →</a></div></div>';
      r.scrollIntoView({behavior:"smooth",block:"start"})}
    function renderGoals(){var w=$("#goalList");if(!goals.length){w.innerHTML='<p style="color:var(--muted)">No saved goals yet. Your goals are stored privately in this browser.</p>';return}
      w.innerHTML=goals.map(function(g){return '<div class="goal-item"><div style="display:flex;justify-content:space-between;gap:1rem"><h4>'+esc(g.what)+'</h4><button class="icon-btn" style="width:32px;height:32px;font-size:.9rem" data-del="'+g.id+'" aria-label="Delete goal">✕</button></div>'+
        '<small style="color:var(--muted)">'+esc(g.area)+' · due '+esc(g.deadline)+'</small><div class="progress" style="margin:.6rem 0"><i style="width:'+g.progress+'%"></i></div>'+
        '<input type="range" min="0" max="100" step="5" value="'+g.progress+'" data-prog="'+g.id+'" aria-label="Progress"> <small>'+g.progress+'% complete</small> · <a href="#" data-view="'+g.id+'">View plan</a></div>'}).join("")}
    document.addEventListener("click",function(e){var t;
      if(t=e.target.closest("[data-del]")){goals=goals.filter(function(g){return g.id!=t.dataset.del});NV.store.set("goals",goals);renderGoals()}
      if(t=e.target.closest("[data-view]")){e.preventDefault();showResult(find(t.dataset.view))}
      if(t=e.target.closest("[data-ics]")){var g=find(t.dataset.ics),ms=milestones(g);var cal=ms.map(function(m){return NV.ics("New.Vision check-in: "+m.label+" — "+g.what,statement(g)+"\nMilestone: "+m.pct+"% complete.",m.date)});
        var merged=cal.map(function(c,i){var lines=c.split("\r\n");return i===0?lines.slice(0,-1).join("\r\n"):lines.slice(3,-1).join("\r\n")}).join("\r\n")+"\r\nEND:VCALENDAR";
        NV.download("goal-checkins.ics",merged,"text/calendar");NV.toast("Calendar file downloaded — open it to add 4 check-in reminders.")}
      if(t=e.target.closest("[data-txt]")){var g2=find(t.dataset.txt);NV.download("my-goal-plan.txt","NEW.VISION GOAL PLAN\n\n"+statement(g2)+"\n\nArea: "+g2.area+"\nObstacle: "+(g2.obstacle||"-")+"\nIf-then plan: "+(g2.plan||"-")+"\n\nMilestones:\n"+milestones(g2).map(function(m){return "- "+m.label+": "+m.date.toDateString()}).join("\n"))}});
    document.addEventListener("input",function(e){var t=e.target.closest("[data-prog]");if(!t)return;var g=find(t.dataset.prog);g.progress=+t.value;NV.store.set("goals",goals);t.nextElementSibling.textContent=g.progress+"% complete";t.parentNode.querySelector(".progress i").style.width=g.progress+"%";if(g.progress===100)NV.toast("🎉 Goal complete! Time to set the next one.")});
    function find(id){return goals.filter(function(g){return g.id==id})[0]}
    renderGoals();
  }

  /* ================= WHEEL OF LIFE ================= */
  var wc=$("#wheelCanvas");
  if(wc){
    var AREAS=[["Career","💼"],["Money","💰"],["Health","💪"],["Relationships","❤️"],["Family & Friends","👨‍👩‍👧"],["Personal Growth","🌱"],["Fun & Recreation","🎉"],["Home & Environment","🏡"]];
    var COL=["#7c5cff","#22d3ee","#34d399","#ff6b9d","#ffb86b","#a78bfa","#f59e0b","#60a5fa"];
    var TIPS={"Career":"Block 2 hours this week for the work that builds your reputation, not just your inbox.","Money":"Automate a transfer to savings the day you get paid — even 5% counts.","Health":"Pick one keystone habit: a 20-minute walk after lunch, every day for 30 days.","Relationships":"Schedule one undistracted hour with someone you love this week. Phones away.","Family & Friends":"Send three 'thinking of you' messages today — it takes two minutes.","Personal Growth":"Choose one skill and give it 15 focused minutes a day for a month.","Fun & Recreation":"Put something purely fun on your calendar and protect it like a meeting.","Home & Environment":"Clear one surface completely. Small order creates big calm."};
    var vals=NV.store.get("wheel",AREAS.map(function(){return 5}));
    $("#wheelSliders").innerHTML=AREAS.map(function(a,i){return '<div class="slider-row"><label for="w'+i+'">'+a[1]+" "+a[0]+'</label><input id="w'+i+'" type="range" min="1" max="10" value="'+vals[i]+'" data-w="'+i+'"><b id="wv'+i+'">'+vals[i]+'</b></div>'}).join("");
    $("#wheelSliders").addEventListener("input",function(e){var i=e.target.dataset.w;if(i==null)return;vals[i]=+e.target.value;$("#wv"+i).textContent=vals[i];NV.store.set("wheel",vals);draw()});
    function draw(){var x=wc.getContext("2d"),W=wc.width,c=W/2,R=W/2-130,n=AREAS.length;x.clearRect(0,0,W,W);
      var dark=document.documentElement.getAttribute("data-theme")==="dark";
      for(var ring=1;ring<=10;ring++){x.beginPath();x.arc(c,c,R*ring/10,0,Math.PI*2);x.strokeStyle=dark?"#ffffff18":"#1b1a3315";x.stroke()}
      for(var i=0;i<n;i++){var a0=-Math.PI/2+i*2*Math.PI/n,a1=a0+2*Math.PI/n;
        x.beginPath();x.moveTo(c,c);x.arc(c,c,R*vals[i]/10,a0+.02,a1-.02);x.closePath();x.fillStyle=COL[i]+"cc";x.fill();
        x.beginPath();x.moveTo(c,c);x.lineTo(c+Math.cos(a0)*R,c+Math.sin(a0)*R);x.strokeStyle=dark?"#ffffff30":"#1b1a3325";x.stroke();
        var am=(a0+a1)/2;x.fillStyle=dark?"#efeefe":"#1b1a33";x.font="600 14px Inter, Arial";x.textAlign="center";x.textBaseline="middle";
        x.fillText(AREAS[i][1]+" "+AREAS[i][0],c+Math.cos(am)*(R+34),c+Math.sin(am)*(R+34));
        x.font="700 16px Inter, Arial";x.fillStyle="#fff";x.fillText(vals[i],c+Math.cos(am)*R*vals[i]/10*.7,c+Math.sin(am)*R*vals[i]/10*.7)}
      var avg=vals.reduce(function(a,b){return a+b},0)/n,sd=Math.sqrt(vals.reduce(function(a,b){return a+Math.pow(b-avg,2)},0)/n),bal=Math.max(0,Math.round(100-sd*18));
      var low=vals.indexOf(Math.min.apply(null,vals)),high=vals.indexOf(Math.max.apply(null,vals));
      $("#wheelScore").innerHTML='<div class="grid g2" style="gap:.8rem"><div class="card" style="padding:1rem"><small>Life satisfaction</small><b style="font-size:2rem;display:block;font-family:var(--font-d)">'+avg.toFixed(1)+'/10</b></div><div class="card" style="padding:1rem"><small>Balance score</small><b style="font-size:2rem;display:block;font-family:var(--font-d)">'+bal+'%</b></div></div>'+
        '<div class="card" style="margin-top:.8rem"><span class="tag">Focus first</span><h3 style="margin-top:.6rem">'+AREAS[low][1]+" "+AREAS[low][0]+' ('+vals[low]+'/10)</h3><p>'+TIPS[AREAS[low][0]]+'</p><p style="margin-top:.6rem">Your strongest area is <b>'+AREAS[high][0]+'</b>. Use that strength to lift the weakest one.</p></div>'}
    draw();
    $("#wheelPng").addEventListener("click",function(){wc.toBlob(function(b){NV.download("wheel-of-life.png",b)})});
    $("#wheelReset").addEventListener("click",function(){vals=AREAS.map(function(){return 5});NV.store.set("wheel",vals);$$("[data-w]").forEach(function(s,i){s.value=5;$("#wv"+i).textContent=5});draw()});
    $("#wheelCoach").addEventListener("click",function(){var low=vals.indexOf(Math.min.apply(null,vals));location.href="coaching.html?topic="+encodeURIComponent(AREAS[low][0])});
  }

  /* ================= AFFIRMATIONS ================= */
  var ao=$("#affOut");
  if(ao){
    var A={
      "Confidence":["I trust myself to figure things out.","I speak with calm, clear confidence.","I am worthy of the space I take up.","My voice matters and I use it well.","I handle new challenges one step at a time."],
      "Career":["I do work that creates real value.","Opportunities find me because I show up prepared.","I am building a career I'm proud of.","I learn fast and I grow faster.","My skills are in demand and I keep sharpening them."],
      "Money":["I make thoughtful choices with money.","My income grows as my value grows.","I save and invest with consistency.","Money is a tool I use with clarity and purpose.","I am building lasting financial security."],
      "Health":["I treat my body with care and respect.","Every healthy choice compounds.","I move my body because it feels good.","I rest without guilt and wake with energy.","I nourish myself well today."],
      "Love":["I give and receive love freely.","I attract relationships built on respect.","I am patient, kind and present with the people I love.","I deserve deep, honest connection.","My heart is open and my boundaries are clear."],
      "Calm":["I breathe in calm and breathe out tension.","I can pause before I respond.","This moment is enough.","I let go of what I cannot control.","Peace is a practice and I practise it today."],
      "Focus":["I give my full attention to what matters most.","I finish what I start.","Distractions pass; my priorities stay.","One task, done well, is my win today.","I protect my time like it is valuable — because it is."],
      "Gratitude":["I notice the good that is already here.","I am grateful for how far I've come.","Small joys are everywhere today.","I thank the people who help me grow.","My life is full of quiet gifts."]};
    var fav=NV.store.get("favAff",[]),cat="Confidence",last="";
    $("#affCats").innerHTML=Object.keys(A).map(function(k,i){return '<label class="opt"><input type="radio" name="affcat" value="'+k+'"'+(i===0?" checked":"")+'><span>'+k+'</span></label>'}).join("");
    $("#affCats").addEventListener("change",function(e){cat=e.target.value;gen()});
    function gen(){var list=A[cat],n=$("#affName").value.trim(),pick;do{pick=list[Math.floor(Math.random()*list.length)]}while(pick===last&&list.length>1);last=pick;
      var out=n?n+", "+(/^I[ ']/.test(pick)?pick:pick.charAt(0).toLowerCase()+pick.slice(1)):pick;$("#affOut").innerHTML="<span>"+esc(out)+"</span>";ao.dataset.text=out}
    $("#affGen").addEventListener("click",gen);$("#affName").addEventListener("change",gen);
    $("#affCopy").addEventListener("click",function(){if(navigator.clipboard){navigator.clipboard.writeText(ao.dataset.text||"");NV.toast("Copied — paste it into your lock screen or notes.")}});
    $("#affFav").addEventListener("click",function(){var t=ao.dataset.text;if(t&&fav.indexOf(t)<0){fav.unshift(t);NV.store.set("favAff",fav.slice(0,30));renderFav();NV.toast("Saved to your favourites")}});
    function renderFav(){$("#affFavs").innerHTML=fav.length?fav.map(function(f,i){return '<li style="margin:.4rem 0">'+esc(f)+' <button class="btn btn-ghost btn-sm" data-unfav="'+i+'" aria-label="Remove">✕</button></li>'}).join(""):'<li style="color:var(--muted)">No favourites yet.</li>'}
    document.addEventListener("click",function(e){var t=e.target.closest("[data-unfav]");if(t){fav.splice(+t.dataset.unfav,1);NV.store.set("favAff",fav);renderFav()}});
    var all=[].concat.apply([],Object.keys(A).map(function(k){return A[k]}));$("#affDaily").textContent=all[NV.seed(all.length)];
    gen();renderFav();
  }

  /* ================= FUTURE LETTER ================= */
  var fl=$("#letterForm");
  if(fl){
    var PR=["Dear future me, right now I'm most excited about…","The thing I'm most afraid of today is… I hope by now you've learned…","Here's what I promise to have started by the time you read this…","Remember this feeling: …","These are the people I'm grateful for today…","My biggest goal is… and here's my plan…"];
    var draft=NV.store.get("letter",{});if(draft.text)$("#lText").value=draft.text;
    var def=new Date();def.setFullYear(def.getFullYear()+1);$("#lDate").value=draft.date||def.toISOString().slice(0,10);
    function count(){var w=$("#lText").value.trim().split(/\s+/).filter(Boolean).length;$("#lCount").textContent=w+" words"}
    $("#lText").addEventListener("input",function(){count();NV.store.set("letter",{text:this.value,date:$("#lDate").value})});count();
    $$("[data-years]").forEach(function(b){b.addEventListener("click",function(){var dd=new Date();dd.setMonth(dd.getMonth()+(+b.dataset.years*12));$("#lDate").value=dd.toISOString().slice(0,10)})});
    $("#lInspire").addEventListener("click",function(){var t=$("#lText");t.value=(t.value?t.value+"\n\n":"")+PR[Math.floor(Math.random()*PR.length)];t.focus();count()});
    fl.addEventListener("submit",function(e){e.preventDefault();var t=$("#lText").value.trim(),dt=$("#lDate").value;if(t.length<20){NV.toast("Write a little more — at least a few sentences.");return}
      var written=new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});
      NV.download("letter-to-future-me.ics",NV.ics("💌 Open your letter from "+written,"A letter from your past self (written "+written+"):\n\n"+t,dt),"text/calendar");
      setTimeout(function(){NV.download("letter-to-future-me.txt","Letter to my future self\nWritten: "+written+"\nOpen on: "+dt+"\n\n"+t)},400);
      $("#lDone").hidden=false;NV.toast("Sealed! Open the calendar file to schedule delivery.")});
  }
})();
