// Chat Widget Script
(function () {
  // ---- Font
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap';
  document.head.appendChild(fontLink);

  // ---- Styles
  const styles = `
  .n8n-chat-widget {
    --chat--color-primary:#ff6bcb;
    --chat--color-secondary:#7367f0;
    --chat--color-glass:rgba(255,255,255,0.7);
    --chat--color-font:#232946;
    --shadow:0 12px 48px rgba(115,103,240,.18);
    --radius:28px;
    font-family:'Sora',system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  }
  .n8n-chat-widget .chat-toggle{
    position:fixed;
    right:calc(env(safe-area-inset-right,0) + 16px);
    bottom:calc(env(safe-area-inset-bottom,0) + 16px);
    width:60px;height:60px;border-radius:50%;
    background:linear-gradient(135deg,var(--chat--color-primary),var(--chat--color-secondary));
    color:#fff;border:none;cursor:pointer;box-shadow:0 8px 32px rgba(115,103,240,.25);z-index:999;
    display:grid;place-items:center;transition:transform .2s;
  }
  .n8n-chat-widget .chat-toggle:active{ transform:scale(.95) }
  .n8n-chat-widget .chat-toggle svg{ width:28px;height:28px; fill:currentColor }

  .n8n-chat-widget .backdrop{
    position:fixed; inset:0; background:rgba(0,0,0,.25);
    backdrop-filter:blur(2px);
    opacity:0; pointer-events:none; transition:opacity .15s; z-index:998;
  }
  .n8n-chat-widget .backdrop.open{ opacity:1; pointer-events:auto }

  .n8n-chat-widget .chat-container{
    position:fixed; right:16px; bottom:96px;
    width:min(420px,95vw); height:640px; max-height:85vh;
    border-radius:var(--radius);
    background:var(--chat--color-glass); backdrop-filter:blur(16px);
    border:2px solid rgba(255,255,255,.3); box-shadow:var(--shadow);
    overflow:hidden; display:none; flex-direction:column; z-index:1000;
    animation:popIn .25s ease;
  }
  .n8n-chat-widget .chat-container.open{ display:flex }
  @keyframes popIn{ from{ transform:translateY(16px); opacity:0 } to{ transform:none; opacity:1 } }

  .n8n-chat-widget .brand-header{
    padding:14px 16px; display:flex; align-items:center; gap:12px; position:relative;
    background:rgba(255,255,255,.6); border-bottom:1px solid rgba(0,0,0,.06);
  }
  .n8n-chat-widget .mascot{ width:36px;height:36px;border-radius:50%;
    background:linear-gradient(135deg,#ffb86b,#ff6bcb); display:grid; place-items:center; font-size:20px }
  .n8n-chat-widget .brand-header span{ font-size:17px; font-weight:700; color:var(--chat--color-font) }
  .n8n-chat-widget .close-button{
    position:absolute; right:10px; top:50%; transform:translateY(-50%);
    background:none;border:none;color:var(--chat--color-font); cursor:pointer; font-size:22px; opacity:.6
  }
  .n8n-chat-widget .close-button:hover{ opacity:1 }

  .n8n-chat-widget .chat-messages{
    flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px;
    -webkit-overflow-scrolling:touch; background:transparent;
  }
  .n8n-chat-widget .chat-message{
    max-width:78%; padding:12px 16px; border-radius:18px; font-size:15px; line-height:1.5; word-break:break-word;
    box-shadow:0 2px 8px rgba(115,103,240,.08);
  }
  .n8n-chat-widget .chat-message.user{
    background:linear-gradient(135deg,#7367f0,#ff6bcb); color:#fff; align-self:flex-end;
  }
  .n8n-chat-widget .chat-message.bot{
    background:var(--chat--color-glass); color:var(--chat--color-font); align-self:flex-start; border:1px solid #ffd4e8;
  }

  .n8n-chat-widget .chat-input{
    padding:10px; display:flex; gap:8px; align-items:center;
    border-top:1px solid rgba(0,0,0,.06);
    padding-bottom:calc(10px + env(safe-area-inset-bottom,0));
    background:rgba(255,255,255,.85);
  }
  .n8n-chat-widget .chat-input textarea{
    flex:1; padding:11px 13px; border:1px solid #e0e0e0; border-radius:14px; background:#fff;
    color:var(--chat--color-font); resize:none; font:inherit; font-size:15px; outline:none; max-height:35vh;
  }
  .n8n-chat-widget .chat-input textarea:focus{ border-color:#ff6bcb }
  .n8n-chat-widget .chat-input button{
    background:linear-gradient(135deg,#ff6bcb,#7367f0); color:#fff; border:none; border-radius:50%; width:44px;height:44px;
    display:grid; place-items:center; font-size:20px; cursor:pointer;
  }

  /* ===== Mobile: Fullscreen Sheet & 100svh ===== */
  @media (max-width:640px){
    .n8n-chat-widget .chat-toggle{ width:56px;height:56px }
    .n8n-chat-widget .chat-container{
      inset:0; width:100vw; height:100svh; border-radius:0; right:auto; bottom:auto;
      background:#ffffff; border:none; box-shadow:none;
    }
    .n8n-chat-widget .brand-header{ padding:14px 16px }
    .n8n-chat-widget .chat-messages{ padding:14px }
    .n8n-chat-widget .chat-message{ max-width:88%; font-size:16px }
  }
  @media (prefers-reduced-motion:reduce){ .n8n-chat-widget .chat-container{ animation:none } }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // ---- DOM
  const root = document.createElement('div');
  root.className = 'n8n-chat-widget';
  document.body.appendChild(root);

  const backdrop = document.createElement('div');
  backdrop.className = 'backdrop';
  root.appendChild(backdrop);

  const toggle = document.createElement('button');
  toggle.className = 'chat-toggle';
  toggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M24 12a2 2 0 0 1 2 2v8h8a2 2 0 1 1 0 4h-8v8a2 2 0 1 1-4 0v-8h-8a2 2 0 1 1 0-4h8v-8a2 2 0 0 1 2-2z" fill="currentColor"/></svg>`;
  root.appendChild(toggle);

  const sheet = document.createElement('div');
  sheet.className = 'chat-container';
  root.appendChild(sheet);

  const header = document.createElement('div');
  header.className = 'brand-header';
  header.innerHTML = `<div class="mascot">🤖</div><span>ChatBot</span><button class="close-button" aria-label="Close">×</button>`;
  sheet.appendChild(header);

  const list = document.createElement('div');
  list.className = 'chat-messages';
  sheet.appendChild(list);

  const input = document.createElement('div');
  input.className = 'chat-input';
  input.innerHTML = `<textarea placeholder="Schreib hier…" rows="1"></textarea><button type="button" aria-label="Senden">➤</button>`;
  sheet.appendChild(input);

  const textarea = input.querySelector('textarea');
  const sendBtn  = input.querySelector('button');

  // ---- Helpers
  const toBottom = () => list.scrollTop = list.scrollHeight;
  const lockScroll = () => { document.body.style.overflow='hidden'; document.documentElement.style.overscrollBehavior='none'; };
  const unlockScroll = () => { document.body.style.overflow=''; document.documentElement.style.overscrollBehavior=''; };

  // Auto-resize textarea
  function autoresize(){
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, window.innerHeight*0.35) + 'px';
  }
  textarea.addEventListener('input', autoresize);

  // VisualViewport (iOS/Android Keyboard)
  const vv = window.visualViewport;
  function applyViewportHeight(){
    if (window.matchMedia('(max-width:640px)').matches) {
      const h = vv ? vv.height : window.innerHeight;
      sheet.style.height = h + 'px';
      toBottom();
    } else {
      sheet.style.height = ''; // Desktop: CSS regelt
    }
  }
  if (vv) {
    vv.addEventListener('resize', applyViewportHeight);
    vv.addEventListener('scroll', applyViewportHeight);
  }
  window.addEventListener('orientationchange', applyViewportHeight);

  // ---- Open / Close
  const open = () => {
    sheet.classList.add('open');
    backdrop.classList.add('open');
    lockScroll();
    applyViewportHeight();
    setTimeout(toBottom, 50);
  };
  const close = () => {
    sheet.classList.remove('open');
    backdrop.classList.remove('open');
    unlockScroll();
  };

  toggle.addEventListener('click', open);
  backdrop.addEventListener('click', close);
  header.querySelector('.close-button').addEventListener('click', close);

  // ---- Demo Send (hier deine Backend-Anbindung einhängen)
  function addMessage(role, text){
    const el = document.createElement('div');
    el.className = 'chat-message ' + role;
    el.textContent = text;
    list.appendChild(el);
    toBottom();
  }

  function send(){
    const msg = textarea.value.trim();
    if(!msg) return;
    textarea.value=''; autoresize();
    addMessage('user', msg);

    // TODO: Hier deinen n8n-Call einbauen (fetch zu deinem Webhook)
    // fetch('https://DEIN-N8N/webhook/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message: msg}) })
    //   .then(r=>r.json()).then(d=>addMessage('bot', d.reply || '…'))
    //   .catch(()=>addMessage('bot','⚠️ Netzwerkfehler'));
  }

  sendBtn.addEventListener('click', send);
  textarea.addEventListener('keydown', (e)=>{
    if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); }
  });

})();
