/* =========================
   CONFIG: EDITE AQUI
========================= */
const CONFIG = {
  herName: "Beatriz",
  brandTitle: "Nós dois",
  brandSub: "Um lugar só nosso",
  // Data/hora do reencontro (fuso local do celular/PC)
  meetDateISO: "2026-02-14T17:00:00", // <<< MUDE AQUI

  portraitQuotes: [
    "“Eu escolho você. Em dias bons e ruins. Hoje e sempre.”",
    "“Você é a paz que eu procurava sem saber.”",
    "“Quando penso em futuro, seu nome aparece primeiro.”",
    "“Você é meu lugar favorito.”",
    "“Eu te amo do jeito mais bonito que eu sei: cuidando.”"
  ],

  constellation: [
    { x: 18, y: 30, text: "Eu amo como você transforma o comum em especial." },
    { x: 38, y: 58, text: "Eu fico bobo com o seu jeito." },
    { x: 58, y: 24, text: "Você é minha saudade favorita." },
    { x: 76, y: 62, text: "Com você, eu me sinto em casa." },
    { x: 50, y: 78, text: "Eu te escolho todos os dias." }
  ],

  reasons: [
    { title: "Seu sorriso", body: "Ele acende qualquer dia difícil e muda meu mundo." },
    { title: "Seu coração", body: "A forma como você sente e se importa é rara." },
    { title: "Seu jeito", body: "Você tem uma presença que acalma." },
    { title: "Sua força", body: "Você enfrenta a vida e ainda assim continua sendo doce." },
    { title: "Sua voz", body: "Ela tem um efeito mágico em mim." },
    { title: "Você inteira", body: "Cada detalhe seu me faz ter certeza: é você." },
    { title: "Seu cuidado", body: "Você faz eu querer ser melhor." },
    { title: "Sua risada", body: "Meu som preferido." },
    { title: "Seu olhar", body: "Eu me perco e eu gosto." }
  ],

  photos: [
    { src: "photos/1.jpg", cap: "Esse momento mora em mim." },
    { src: "photos/2.jpg", cap: "Você deixa tudo mais bonito." },
    { src: "photos/3.jpg", cap: "Eu e você: do jeito certo." }
  ],

  timeline: [
    { when: "Um dia qualquer", title: "O começo", text: "Quando você apareceu e tudo ficou diferente." },
    { when: "Depois disso", title: "A certeza", text: "Eu percebi que eu queria te escolher sempre." },
    { when: "Hoje", title: "O que eu sinto", text: "Amor, admiração e uma vontade imensa de te ver feliz." }
  ],

  // Cartas SEM travas
  letters: [
    { title: "Carta 1", hint: "Abra quando sentir saudade.", body: "Se a saudade apertar, lembra: meu pensamento te encontra rápido. Eu te amo e eu tô aqui, sempre." },
    { title: "Carta 2", hint: "Abra quando quiser um carinho.", body: "Você é especial em detalhes que só eu vejo… e que eu guardo com carinho." },
    { title: "Carta 3", hint: "Abra quando você precisar lembrar o quanto eu te admiro.", body: "Eu tenho orgulho de você. Do seu jeito, da sua coragem, da sua luz. Eu te admiro muito." },
    { title: "Carta 4", hint: "Abra quando quiser sentir o meu abraço.", body: "Eu quero te ver, te abraçar, te olhar de perto e dizer: obrigado por existir. Eu te amo. De verdade." }
  ],

  finalTypeText: [
    "Eu sei que um site não consegue colocar em palavras tudo o que eu sinto.",
    "Mas eu queria que você tivesse uma prova: eu penso em você com carinho, com intenção, com cuidado.",
    "Você é minha parte favorita do dia.",
    "E quando a gente se ver… eu vou te abraçar como se o mundo tivesse parado só pra isso."
  ].join("\n\n")
};

/* =========================
   UTIL
========================= */
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];

const toast = (msg) => {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(()=>el.classList.remove("show"), 2400);
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* =========================
   NAV
========================= */
function go(id){
  const sections = $$("[data-section]");
  sections.forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  if(target) target.classList.add("active");

  $$(".navBtn").forEach(b => b.classList.toggle("active", b.dataset.go===id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindNav(){
  $$(".navBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>go(btn.dataset.go));
  });
  $("#startBtn").addEventListener("click", ()=>go("countdown"));
}

/* =========================
   HERO INTERACTIONS
========================= */
function bindHero(){
  const card = $("#portraitCard");
  let idx = 0;

  const cycleQuote = () => {
    idx = (idx + 1) % CONFIG.portraitQuotes.length;
    $("#portraitQuote").textContent = CONFIG.portraitQuotes[idx];
    toast("✨ Mensagem trocada");
  };

  card.addEventListener("click", cycleQuote);
  card.addEventListener("keydown", (e)=> {
    if(e.key==="Enter" || e.key===" "){ e.preventDefault(); cycleQuote(); }
  });

  $("#surpriseBtn").addEventListener("click", ()=>{
    sparkRain(24);
    toast("🌠 Surprise!");
  });
}

/* =========================
   COUNTDOWN
========================= */
function startCountdown(){
  const meet = new Date(CONFIG.meetDateISO).getTime();

  const tick = () => {
    const now = Date.now();
    let diff = meet - now;

    if (Number.isNaN(meet)) {
      $("#quoteText").textContent = "Ajuste a data do reencontro no app.js (meetDateISO).";
      return;
    }

    const past = diff <= 0;
    diff = Math.max(0, diff);

    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff / (1000*60*60)) % 24);
    const m = Math.floor((diff / (1000*60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    $("#d").textContent = d;
    $("#h").textContent = h;
    $("#m").textContent = m;
    $("#s").textContent = s;

    if(past){
      $("#footerRight").textContent = "hoje é o dia ✨";
      $("#modeLabel").textContent = "Reencontro";
    }
  };

  tick();
  setInterval(tick, 1000);
}

function bindPromises(){
  const list = $("#promiseList");
  const saved = JSON.parse(localStorage.getItem("promises") || "[]");

  const render = () => {
    list.innerHTML = "";
    const items = JSON.parse(localStorage.getItem("promises") || "[]");
    items.slice(0, 6).forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "promiseItem";
      div.innerHTML = `<b>Promessa ${i+1}:</b> ${escapeHtml(p)}`;
      list.appendChild(div);
    });
  };

  localStorage.setItem("promises", JSON.stringify(saved));
  render();

  $("#addPromiseBtn").addEventListener("click", ()=>{
    const txt = prompt("Escreve uma promessa curtinha pra ela:");
    if(!txt) return;
    const arr = JSON.parse(localStorage.getItem("promises") || "[]");
    arr.unshift(txt.trim());
    localStorage.setItem("promises", JSON.stringify(arr));
    render();
    toast("✍️ Promessa guardada");
  });

  $("#saveBtn").addEventListener("click", ()=>{
    const snapshot = {
      when: new Date().toISOString(),
      promises: JSON.parse(localStorage.getItem("promises") || "[]").slice(0,3)
    };
    localStorage.setItem("snapshot", JSON.stringify(snapshot));
    toast("✅ Salvo no dispositivo");
  });
}

/* =========================
   CONSTELLATION
========================= */
function buildConstellation(){
  const box = $("#constellation");
  box.innerHTML = "";

  const points = CONFIG.constellation.map((p, i)=>({
    ...p,
    id: `c${i}`,
    px: (p.x/100) * box.clientWidth,
    py: (p.y/100) * box.clientHeight
  }));

  // lines
  for(let i=0;i<points.length-1;i++){
    const a=points[i], b=points[i+1];
    const dx=b.px-a.px, dy=b.py-a.py;
    const len=Math.hypot(dx,dy);
    const ang=Math.atan2(dy,dx) * 180/Math.PI;

    const line=document.createElement("div");
    line.className="starLine";
    line.style.left = `${a.px}px`;
    line.style.top  = `${a.py}px`;
    line.style.width= `${len}px`;
    line.style.transform = `rotate(${ang}deg)`;
    box.appendChild(line);
  }

  points.forEach((p)=>{
    const el = document.createElement("div");
    el.className="starPoint";
    el.style.left = `${p.x}%`;
    el.style.top  = `${p.y}%`;
    el.title = "Toque aqui";
    el.addEventListener("click", ()=>{
      $("#quoteText").textContent = p.text;
      $("#quoteSig").textContent = "— eu, pensando em você";
      toast("✦ Frase revelada");
    });
    box.appendChild(el);
  });

  // dragging parallax
  let dragging=false;
  box.addEventListener("pointerdown", ()=>{ dragging=true; });
  window.addEventListener("pointerup", ()=> dragging=false);
  box.addEventListener("pointermove", (e)=>{
    if(!dragging) return;
    const r = box.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    box.style.backgroundPosition = `${50 + x*6}% ${50 + y*6}%`;
  });
}

/* =========================
   REASONS
========================= */
function buildReasons(){
  const grid = $("#reasonsGrid");

  const render = (arr) => {
    grid.innerHTML = "";
    arr.forEach((r, i)=>{
      const card = document.createElement("div");
      card.className="reason";
      card.innerHTML = `
        <div class="reasonTop">
          <div class="reasonTitle">${escapeHtml(r.title)}</div>
          <div class="badge">#${String(i+1).padStart(2,"0")}</div>
        </div>
        <div class="reasonBody">${escapeHtml(r.body)}</div>
        <div class="reveal">clique para revelar algo a mais…</div>
      `;
      card.addEventListener("click", ()=>{
        card.querySelector(".reveal").textContent =
          ["eu te amo.", "eu admiro você.", "eu me sinto melhor com você.", "você é a minha vida.", "você é minha paz."][i%5];
        sparkAt(card);
      });
      grid.appendChild(card);
    });
  };

  render(CONFIG.reasons);

  $("#shuffleReasons").addEventListener("click", ()=>{
    const a = [...CONFIG.reasons].sort(()=>Math.random()-0.5);
    render(a);
    toast("✨ Embaralhado");
  });

  $("#addReason").addEventListener("click", ()=>{
    const title = prompt("Título do motivo (ex: 'Seu sorriso'):");
    if(!title) return;
    const body = prompt("Texto do motivo:");
    if(!body) return;
    CONFIG.reasons.unshift({ title, body });
    render(CONFIG.reasons);
    toast("✅ Motivo adicionado");
  });
}

/* =========================
   GALLERY + MODAL
========================= */
function buildGallery(){
  const g = $("#gallery");
  g.innerHTML = "";

  CONFIG.photos.forEach((p, i)=>{
    const item = document.createElement("div");
    item.className="photo";
    item.innerHTML = `
      <img src="${p.src}" alt="Foto ${i+1}" loading="lazy" />
      <div class="photoCap">${escapeHtml(p.cap)}</div>
    `;
    item.addEventListener("click", ()=>{
      $("#modalImg").src = p.src;
      $("#modalCaption").textContent = p.cap;
      showModal(true);
    });
    g.appendChild(item);
  });

  $("#modalClose").addEventListener("click", ()=>showModal(false));
  $("#modalBackdrop").addEventListener("click", ()=>showModal(false));
  window.addEventListener("keydown", (e)=>{ if(e.key==="Escape") showModal(false); });

  $("#pulseGallery").addEventListener("click", ()=>{
    document.body.classList.toggle("present");
    toast("🎬 Efeito cinema");
  });

  $("#sparkBtn").addEventListener("click", ()=>{
    sparkRain(36);
    toast("🌟 Estrelas!");
  });
}

function showModal(open){
  const m = $("#modal");
  m.classList.toggle("show", open);
  m.setAttribute("aria-hidden", open ? "false" : "true");
}

/* =========================
   TIMELINE
========================= */
function buildTimeline(){
  const t = $("#timeline");
  t.innerHTML = "";
  CONFIG.timeline.forEach((it)=>{
    const d = document.createElement("div");
    d.className="tItem";
    d.innerHTML = `
      <div class="tWhen">${escapeHtml(it.when)}</div>
      <div class="tTitle">${escapeHtml(it.title)}</div>
      <div class="tText">${escapeHtml(it.text)}</div>
    `;
    d.addEventListener("click", ()=>{
      sparkAt(d);
      toast("🕰️ Lembrança tocada");
    });
    t.appendChild(d);
  });
}

/* =========================
   LETTERS (SEM TRAVAS)
========================= */
function buildLetters(){
  const grid = $("#lettersGrid");
  grid.innerHTML = "";

  CONFIG.letters.forEach((l)=>{
    const card = document.createElement("div");
    card.className = "letter";
    card.innerHTML = `
      <div class="letterLock">✉️</div>
      <div class="letterTitle">${escapeHtml(l.title)}</div>
      <div class="letterHint">${escapeHtml(l.hint)}</div>
      <div class="letterBody">${escapeHtml(l.body)}</div>
    `;

    card.addEventListener("click", ()=>{
      card.classList.toggle("open");
      sparkAt(card);
      toast(card.classList.contains("open") ? "✉️ Carta aberta" : "📩 Carta fechada");
    });

    grid.appendChild(card);
  });
}

/* =========================
   MUSIC + PRESENT MODE
========================= */
function bindMusic(){
  const audio = $("#bgm");
  const btn = $("#musicBtn");

  const setBtn = (on) => {
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.querySelector(".pillText").textContent = on ? "Tocando" : "Música";
  };

  btn.addEventListener("click", async ()=>{
    try{
      if(audio.paused){
        await audio.play();
        setBtn(true);
        toast("♫ Música ligada");
      }else{
        audio.pause();
        setBtn(false);
        toast("⏸️ Música pausada");
      }
    }catch(e){
      toast("Seu navegador bloqueou autoplay. Clique de novo 🙂");
    }
  });
}

function bindPresentMode(){
  $("#giftBtn").addEventListener("click", ()=>{
    document.body.classList.toggle("present");
    const on = document.body.classList.contains("present");
    $("#modeLabel").textContent = on ? "Presente" : "Romântico";

    if(on){
      // efeito cinema + brilho + estrelas
      sparkRain(32);
      toast("🎁 Modo presente ativado");
      // deixa o “efeito cinema” combinado
      document.body.classList.add("present");
    }else{
      toast("✨ Modo romântico ativado");
    }
  });
}


/* =========================
   TYPEWRITER FINAL MESSAGE
========================= */
function bindTypewriter(){
  $("#revealBtn").addEventListener("click", ()=>{
    typeText($("#typeLine"), CONFIG.finalTypeText, 14);
  });
}

function typeText(el, text, speed=18){
  el.textContent = "";
  let i=0;
  const tick = () => {
    el.textContent += text[i] || "";
    i++;
    if(i < text.length) requestAnimationFrame(()=>setTimeout(tick, speed));
  };
  tick();
}

/* =========================
   SPARK EFFECT
========================= */
function sparkAt(el){
  const r = el.getBoundingClientRect();
  const x = r.left + r.width*0.6;
  const y = r.top + r.height*0.3;
  spark(x, y, 16);
}

function spark(x, y, n=18){
  for(let i=0;i<n;i++){
    const p = document.createElement("div");
    p.style.position="fixed";
    p.style.left = x+"px";
    p.style.top  = y+"px";
    p.style.width="6px";
    p.style.height="6px";
    p.style.borderRadius="999px";
    p.style.background = "rgba(255,255,255,.9)";
    p.style.boxShadow = "0 0 30px rgba(185,139,255,.55)";
    p.style.zIndex= 500;
    document.body.appendChild(p);

    const ang = Math.random()*Math.PI*2;
    const dist = 40 + Math.random()*70;
    const dx = Math.cos(ang)*dist;
    const dy = Math.sin(ang)*dist;

    p.animate([
      { transform:"translate(0,0) scale(1)", opacity:1 },
      { transform:`translate(${dx}px, ${dy}px) scale(.2)`, opacity:0 }
    ], { duration: 620 + Math.random()*240, easing:"cubic-bezier(.2,.8,.2,1)" })
    .onfinish = ()=> p.remove();
  }
}

function sparkRain(n=30){
  const w = window.innerWidth;
  for(let i=0;i<n;i++){
    const x = Math.random()*w;
    const y = -20;
    const p = document.createElement("div");
    p.style.position="fixed";
    p.style.left = x+"px";
    p.style.top  = y+"px";
    p.style.width="5px";
    p.style.height="5px";
    p.style.borderRadius="999px";
    p.style.background = "rgba(255,255,255,.9)";
    p.style.boxShadow = "0 0 40px rgba(99,214,255,.45)";
    p.style.zIndex= 500;
    document.body.appendChild(p);

    const fall = window.innerHeight + 80;
    const drift = (Math.random()-0.5)*180;

    p.animate([
      { transform:"translate(0,0) scale(1)", opacity:1 },
      { transform:`translate(${drift}px, ${fall}px) scale(.1)`, opacity:0 }
    ], { duration: 1200 + Math.random()*900, easing:"cubic-bezier(.2,.8,.2,1)" })
    .onfinish = ()=> p.remove();
  }
}

/* =========================
   CUSTOM CURSOR
========================= */
function bindCursor(){
  const cur = $("#cursor");
  const enable = matchMedia("(pointer:fine)").matches;
  if(!enable) return;

  cur.style.opacity = ".95";
  window.addEventListener("mousemove", (e)=>{
    cur.style.left = e.clientX + "px";
    cur.style.top  = e.clientY + "px";
  });
}

/* =========================
   STARS CANVAS BG
========================= */
function startStars(){
  const c = $("#stars");
  const ctx = c.getContext("2d");

  let w,h,stars;
  const resize = () => {
    w = c.width = window.innerWidth * devicePixelRatio;
    h = c.height = window.innerHeight * devicePixelRatio;
    const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    stars = new Array(count).fill(0).map(()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      r: (Math.random()*1.6 + .2) * devicePixelRatio,
      a: Math.random()*0.9 + 0.1,
      s: Math.random()*0.6 + 0.2
    }));
  };
  resize();
  window.addEventListener("resize", resize);

  let t=0;
  const draw = () => {
    t += 0.003;
    ctx.clearRect(0,0,w,h);

    const g = ctx.createRadialGradient(w*0.2, h*0.2, 0, w*0.2, h*0.2, Math.max(w,h));
    g.addColorStop(0, "rgba(185,139,255,0.08)");
    g.addColorStop(0.6,"rgba(99,214,255,0.04)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for(const s of stars){
      const tw = 0.35 + Math.sin(t*2 + s.x*0.002 + s.y*0.002) * 0.35;
      ctx.globalAlpha = clamp(s.a + tw, 0.05, 0.95);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = "white";
      ctx.fill();

      s.y += s.s * devicePixelRatio * 0.20;
      if(s.y > h+10){ s.y = -10; s.x = Math.random()*w; }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  };
  draw();
}

/* =========================
   MINI GAME
========================= */
function initGame(){
  const canvas = $("#gameCanvas");
  const ctx = canvas.getContext("2d");

  let running=false, score=0, lives=3;
  let player = { x: canvas.width/2, y: canvas.height-50, w: 46, h: 14, vx: 0 };
  let hearts = [];
  let rocks = [];
  let last=0;

  const spawn = () => {
    if(Math.random()<0.55) hearts.push({ x: Math.random()*(canvas.width-20)+10, y: -20, r: 10, vy: 2.2 + Math.random()*2 });
    if(Math.random()<0.25) rocks.push({ x: Math.random()*(canvas.width-20)+10, y: -30, r: 12, vy: 3.2 + Math.random()*2.8 });
  };

  const reset = () => {
    running=false;
    score=0; lives=3;
    hearts=[]; rocks=[];
    player.x = canvas.width/2;
    $("#score").textContent = score;
    $("#lives").textContent = lives;
  };

  const hit = (a) => {
    const cx = clamp(a.x, player.x-player.w/2, player.x+player.w/2);
    const cy = clamp(a.y, player.y-player.h/2, player.y+player.h/2);
    const dx = a.x - cx, dy = a.y - cy;
    return (dx*dx + dy*dy) < (a.r*a.r);
  };

  const drawPlayer = () => {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.fillStyle = "rgba(185,139,255,.75)";
    ctx.shadowColor = "rgba(185,139,255,.35)";
    ctx.shadowBlur = 18;
    roundRect(ctx, -player.w/2, -player.h/2, player.w, player.h, 8);
    ctx.fill();
    ctx.restore();
  };

  const drawHeart = (h) => {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.shadowColor = "rgba(255,79,216,.30)";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.bezierCurveTo(-14, -6, -6, -18, 0, -8);
    ctx.bezierCurveTo(6, -18, 14, -6, 0, 6);
    ctx.fill();
    ctx.restore();
  };

  const drawRock = (r) => {
    ctx.save();
    ctx.translate(r.x, r.y);
    ctx.fillStyle = "rgba(255,255,255,.40)";
    ctx.shadowColor = "rgba(99,214,255,.18)";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(0,0,r.r,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  };

  const loop = (ts) => {
    if(!running) return;
    const dt = Math.min(32, ts-last); last = ts;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "rgba(0,0,0,.16)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    player.x += player.vx * (dt/16);
    player.x = clamp(player.x, 30, canvas.width-30);

    if(Math.random() < 0.06) spawn();

    hearts.forEach(o => o.y += o.vy * (dt/16));
    rocks.forEach(o => o.y += o.vy * (dt/16));

    hearts = hearts.filter(o => {
      if(hit(o)){
        score += 10;
        $("#score").textContent = score;

        const rect = canvas.getBoundingClientRect();
        spark(rect.left + (o.x/canvas.width)*rect.width, rect.top + (o.y/canvas.height)*rect.height, 10);

        if(score % 50 === 0) toast("💜 Você tá indo muito bem!");
        return false;
      }
      return o.y < canvas.height + 30;
    });

    rocks = rocks.filter(o => {
      if(hit(o)){
        lives -= 1;
        $("#lives").textContent = lives;
        toast("☄️ Meteoro! cuidado…");
        sparkAt($("#gameCanvas"));
        if(lives <= 0){
          running=false;
          toast("Fim de jogo — mas eu continuo te amando 😄");
        }
        return false;
      }
      return o.y < canvas.height + 40;
    });

    drawPlayer();
    hearts.forEach(drawHeart);
    rocks.forEach(drawRock);

    requestAnimationFrame(loop);
  };

  const key = (e, down) => {
    const k = e.key.toLowerCase();
    if(k==="arrowleft" || k==="a") player.vx = down ? -6 : (player.vx<0 ? 0 : player.vx);
    if(k==="arrowright"|| k==="d") player.vx = down ? 6 : (player.vx>0 ? 0 : player.vx);
  };

  window.addEventListener("keydown", (e)=> key(e,true));
  window.addEventListener("keyup", (e)=> key(e,false));

  let dragging=false, lastX=0;
  canvas.addEventListener("pointerdown", (e)=>{ dragging=true; lastX=e.clientX; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointerup", ()=> dragging=false);
  canvas.addEventListener("pointermove", (e)=>{
    if(!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    player.x += dx * (canvas.width / canvas.getBoundingClientRect().width);
  });

  $("#gameStart").addEventListener("click", ()=>{
    if(lives<=0) reset();
    running=true;
    last=performance.now();
    toast("🎮 Valendo!");
    requestAnimationFrame(loop);
  });

  $("#gameReset").addEventListener("click", ()=>{
    reset();
    toast("🔄 Reiniciado");
  });

  reset();
}

function roundRect(ctx, x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}

/* =========================
   INIT
========================= */
function init(){
  $("#herName").textContent = CONFIG.herName;
  $("#brandTitle").textContent = CONFIG.brandTitle;
  $("#brandSub").textContent = CONFIG.brandSub;

  bindNav();
  bindHero();
  bindMusic();
  bindPresentMode();
  bindCursor();

  startStars();
  startCountdown();

  bindPromises();
  buildConstellation();
  buildReasons();
  buildGallery();
  buildTimeline();
  buildLetters();

  bindTypewriter();
  initGame();

  // duplo clique continua como efeito divertido (sem segredos)
  window.addEventListener("dblclick", ()=>{
    sparkRain(18);
    toast("🌠 Estrelas!");
  });

  go("home");
}

window.addEventListener("load", init);
window.addEventListener("resize", ()=>buildConstellation());
function startParallax(){
  const root = document.documentElement;
  let targetX = 0, targetY = 0;
  let curX = 0, curY = 0;

  const updateTarget = () => {
    // rolagem bem sutil
    const scroll = window.scrollY || 0;
    targetY = -(scroll * 0.06);

    // se tiver mouse, melhora o efeito (desktop)
  };

  window.addEventListener("scroll", updateTarget, { passive: true });
  updateTarget();

  if (matchMedia("(pointer:fine)").matches){
    window.addEventListener("mousemove", (e)=>{
      const cx = (e.clientX / window.innerWidth) - 0.5;
      const cy = (e.clientY / window.innerHeight) - 0.5;
      targetX = cx * 18;
      targetY += cy * 12;
    }, { passive: true });
  }

  const loop = () => {
    // suavização
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;

    root.style.setProperty("--px", `${curX}px`);
    root.style.setProperty("--py", `${curY}px`);

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

}
