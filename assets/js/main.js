/* New.Vision — core site script */
(function(){
  "use strict";
  var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  window.NV=window.NV||{};

  /* ---------- storage (safe) ---------- */
  NV.store={get:function(k,d){try{var v=localStorage.getItem("nv_"+k);return v?JSON.parse(v):d}catch(e){return d}},
            set:function(k,v){try{localStorage.setItem("nv_"+k,JSON.stringify(v));return true}catch(e){return false}}};

  /* ---------- toast ---------- */
  NV.toast=function(msg){var t=$("#toast");if(!t){t=document.createElement("div");t.id="toast";t.className="toast";t.setAttribute("role","status");document.body.appendChild(t)}
    t.textContent=msg;t.classList.add("show");clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove("show")},3800)};

  /* ---------- theme ---------- */
  var theme=NV.store.get("theme",null)||(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
  document.documentElement.setAttribute("data-theme",theme);
  document.addEventListener("click",function(e){var b=e.target.closest("[data-theme-toggle]");if(!b)return;
    theme=theme==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",theme);NV.store.set("theme",theme)});

  /* ---------- nav ---------- */
  var burger=$(".burger"),menu=$(".menu");
  if(burger&&menu){burger.addEventListener("click",function(){var o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",o)})}
  var here=location.pathname.split("/").pop()||"index.html";
  $$(".menu a").forEach(function(a){if(a.getAttribute("href").split("/").pop()===here)a.setAttribute("aria-current","page")});

  /* ---------- reveal on scroll ---------- */
  if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target)}})},{threshold:.12});
    $$(".reveal").forEach(function(el){io.observe(el)})}else{$$(".reveal").forEach(function(el){el.classList.add("in")})}

  /* ---------- counters ---------- */
  $$("[data-count]").forEach(function(el){var end=+el.dataset.count,suf=el.dataset.suffix||"",st=null;
    function step(ts){if(!st)st=ts;var p=Math.min((ts-st)/1400,1);el.textContent=Math.floor(end*(1-Math.pow(1-p,3))).toLocaleString()+suf;if(p<1)requestAnimationFrame(step)}
    var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){requestAnimationFrame(step);o.disconnect()}});o.observe(el)});

  /* ---------- countdown to next new year ---------- */
  var cd=$("[data-countdown]");
  if(cd){var tick=function(){var now=new Date(),ny=new Date(now.getFullYear()+1,0,1),d=ny-now;
      var D=Math.floor(d/864e5),H=Math.floor(d/36e5)%24,M=Math.floor(d/6e4)%60,S=Math.floor(d/1e3)%60;
      cd.innerHTML="<div><b>"+D+"</b><span>days</span></div><div><b>"+H+"</b><span>hours</span></div><div><b>"+M+"</b><span>min</span></div><div><b>"+S+"</b><span>sec</span></div>";
      $$("[data-next-year]").forEach(function(x){x.textContent=ny.getFullYear()})};tick();setInterval(tick,1000)}
  $$("[data-year]").forEach(function(x){x.textContent=new Date().getFullYear()});

  /* ---------- daily content (self-updating via data/daily.json, date-seeded fallback) ---------- */
  NV.seed=function(n){var d=new Date(),s=d.getFullYear()*372+d.getMonth()*31+d.getDate();return s%n};
  var dailyEl=$("[data-daily]");
  if(dailyEl){var base=dailyEl.dataset.base||"";
    fetch(base+"data/daily.json",{cache:"no-store"}).then(function(r){return r.json()}).then(fill).catch(function(){fill(null)});
  }
  function fill(data){var iso=new Date(),td=iso.getFullYear()+"-"+("0"+(iso.getMonth()+1)).slice(-2)+"-"+("0"+iso.getDate()).slice(-2);if(data&&data.date!==td)data=null;
    var ARTS=[["How to Make a Vision Board That Actually Works","guides/how-to-make-a-vision-board.html"],["Do Vision Boards Work? The Research","guides/do-vision-boards-work-science.html"],["SMART vs OKRs vs WOOP","guides/smart-goals-vs-okrs-vs-woop.html"],["120 Vision Board Ideas","guides/vision-board-ideas.html"],["The Wheel of Life Guide","guides/wheel-of-life-guide.html"],["Resolutions That Stick","guides/new-years-resolutions-that-stick.html"],["12-Month Career Vision Plan","guides/career-vision-plan.html"],["Money Vision Board","guides/money-vision-board.html"],["Personal Vision Statement Examples","guides/personal-vision-statement-examples.html"],["Affirmations That Work","guides/affirmations-that-work.html"]];
    if(!data){var fa=ARTS[NV.seed(ARTS.length)];data={featured:{title:fa[0],url:fa[1]}}}
    var P=NV.PROMPTS||[];var p=data&&data.prompt?data.prompt:P[NV.seed(P.length||1)];
    var a=data&&data.affirmation?data.affirmation:(NV.AFF_DAILY||[])[NV.seed((NV.AFF_DAILY||[1]).length)];
    var pe=$("[data-daily-prompt]"),ae=$("[data-daily-aff]"),de=$("[data-daily-date]");
    if(pe&&p)pe.textContent=p;if(ae&&a)ae.textContent=a;if(de)de.textContent=new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
    if(data&&data.featured){var fe=$("[data-daily-feature]");if(fe){fe.href=(dailyEl.dataset.base||"")+data.featured.url;fe.textContent=data.featured.title}}}
  NV.PROMPTS=["Describe one ordinary Tuesday in your ideal life a year from now. What are you doing at 10am?","What would you attempt this year if you knew you could not fail?","Which single habit, done daily, would make every other goal easier?","Name three people you want to spend more time with next year — and why.","What do you want to stop doing, so you have room for what you want to start?","Picture yourself on December 31st, proud. What did you finish?","Which area of your life gets the least attention right now? Give it one small action today.","What would your future self thank you for doing this week?","Write the headline you'd love to read about yourself 12 months from now.","What skill, learned this year, would change your income or your options?","Where do you want to wake up on your next birthday?","What does 'enough' look like for you — in money, work and time?","Which fear is quietly making your decisions for you?","What is one promise you can keep to yourself every day for 30 days?","Describe the home you want to come back to every evening.","Who do you need to become to reach your biggest goal?","What would you do with one extra free hour every day?","List five small wins from the past month. What pattern do they share?","Which goal are you holding only because someone else expects it?","What does a healthy, energetic version of you do before breakfast?","If your year had a one-word theme, what would it be?"];
  NV.AFF_DAILY=["I build my future with small actions I take today.","I am allowed to want more and to work calmly toward it.","My focus is a choice, and today I choose what matters.","I keep promises to myself, one day at a time.","Progress, not perfection, is my standard.","I am becoming the person my goals require.","My life is getting clearer every time I act.","I welcome new opportunities and I am ready for them."];

  /* ---------- lazy YouTube ---------- */
  document.addEventListener("click",function(e){var b=e.target.closest(".video button");if(!b)return;var v=b.parentNode,id=v.dataset.id;
    v.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+(v.dataset.title||"Video")+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>'});
  $$(".video[data-id]").forEach(function(v){v.style.backgroundImage="url(https://i.ytimg.com/vi/"+v.dataset.id+"/hqdefault.jpg)"});

  /* ---------- forms (endpoint assembled at runtime; address never in markup) ---------- */
  var k=[116,118,106,53,115,112,104,116,110,71,56,104,122,114,121,118,126,105,108,126];
  function ep(){return "https://formsubmit.co/ajax/"+k.map(function(c){return String.fromCharCode(c-7)}).reverse().join("")}
  NV.send=function(fields,subject){var body=Object.assign({_subject:"[New.Vision] "+(subject||"Form submission"),_template:"table",_captcha:"false",page:location.href,submitted:new Date().toISOString()},fields);
    return fetch(ep(),{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(body)}).then(function(r){if(!r.ok)throw new Error("send");return r.json()})};
  document.addEventListener("submit",function(e){var f=e.target;if(!f.matches("form[data-form]"))return;e.preventDefault();
    if(f.querySelector(".hp input")&&f.querySelector(".hp input").value)return;
    if(!f.checkValidity()){f.reportValidity();return}
    var data={};new FormData(f).forEach(function(v,key){if(key==="_hp")return;data[key]=data[key]?data[key]+", "+v:v});
    var btn=f.querySelector("[type=submit]"),old=btn?btn.innerHTML:"";if(btn){btn.disabled=true;btn.innerHTML="Sending…"}
    NV.send(data,f.dataset.form).then(function(){
      NV.toast(f.dataset.success||"Thank you! We received your message and will reply soon.");
      if(f.dataset.redirect){location.href=f.dataset.redirect;return}
      var ok=f.parentNode.querySelector(".form-success");if(ok){f.hidden=true;ok.hidden=false}else f.reset();
    }).catch(function(){NV.toast("Sorry — that didn't go through. Please check your connection and try again.")})
      .finally(function(){if(btn){btn.disabled=false;btn.innerHTML=old}})});

  /* ---------- multi-step forms ---------- */
  $$("[data-steps]").forEach(function(f){var steps=$$(".step",f),bar=$$(".steps-bar span",f),i=0;
    function show(n){steps.forEach(function(s,j){s.classList.toggle("active",j===n)});bar.forEach(function(b,j){b.classList.toggle("on",j<=n)});i=n}
    f.addEventListener("click",function(e){if(e.target.closest("[data-next]")){var req=$$("[required]",steps[i]);for(var r=0;r<req.length;r++){if(!req[r].checkValidity()){req[r].reportValidity();return}}show(Math.min(i+1,steps.length-1))}
      if(e.target.closest("[data-prev]"))show(Math.max(i-1,0))});show(0)});

  /* ---------- prefill from query (?topic=) ---------- */
  var q=new URLSearchParams(location.search);$$("[data-prefill]").forEach(function(el){var v=q.get(el.dataset.prefill);if(v)el.value=v});

  /* ---------- careers role prefill ---------- */
  document.addEventListener("click",function(e){var b=e.target.closest("[data-role]");if(!b)return;var r=$("#j-role");if(r){var t=document.createElement("textarea");t.innerHTML=b.dataset.role;r.value=t.value}});

  /* ---------- share ---------- */
  document.addEventListener("click",function(e){var b=e.target.closest("[data-share]");if(!b)return;var d={title:document.title,url:location.href,text:b.dataset.share||document.title};
    if(navigator.share)navigator.share(d).catch(function(){});else if(navigator.clipboard){navigator.clipboard.writeText(d.url);NV.toast("Link copied to clipboard")}});

  /* ---------- cookie notice ---------- */
  var ck=$(".cookie");if(ck&&!NV.store.get("cookie",false)){setTimeout(function(){ck.classList.add("show")},900)}
  document.addEventListener("click",function(e){if(e.target.closest("[data-cookie]")){NV.store.set("cookie",e.target.closest("[data-cookie]").dataset.cookie);ck&&ck.classList.remove("show")}});

  /* ---------- streak (retention) ---------- */
  var today=new Date().toDateString(),st=NV.store.get("streak",{d:null,n:0});
  if(st.d!==today){var y=new Date(Date.now()-864e5).toDateString();st.n=(st.d===y)?st.n+1:1;st.d=today;NV.store.set("streak",st)}
  $$("[data-streak]").forEach(function(x){x.textContent=st.n});

  /* ---------- download helper ---------- */
  NV.download=function(name,content,type){var b=content instanceof Blob?content:new Blob([content],{type:type||"text/plain"});var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)};
  NV.ics=function(title,desc,date){function f(d){return d.toISOString().replace(/[-:]/g,"").split(".")[0]+"Z"}
    var s=new Date(date);s.setHours(9,0,0,0);var e=new Date(s.getTime()+36e5);var esc=function(t){return String(t).replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")};
    return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//New.Vision//Planner//EN","BEGIN:VEVENT","UID:"+Date.now()+"@new.vision","DTSTAMP:"+f(new Date()),"DTSTART:"+f(s),"DTEND:"+f(e),"SUMMARY:"+esc(title),"DESCRIPTION:"+esc(desc),"BEGIN:VALARM","TRIGGER:-PT0M","ACTION:DISPLAY","DESCRIPTION:"+esc(title),"END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n")};
})();
