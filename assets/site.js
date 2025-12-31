/* NAZO.FC shared JS
   - Drawer menu: open/close, ESC, backdrop click
   - Utility: escapeHtml, pad
   - Page-specific enhancements can be added without touching each HTML
*/
(function(){
  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  // Drawer (if present)
  const menuBtn = qs('#menuBtn');
  const closeBtn = qs('#closeBtn');
  const backdrop = qs('#backdrop');

  function openMenu(){
    document.body.classList.add('open');
    if(menuBtn) menuBtn.setAttribute('aria-expanded','true');
    if(closeBtn) closeBtn.focus();
  }
  function closeMenu(){
    document.body.classList.remove('open');
    if(menuBtn) menuBtn.setAttribute('aria-expanded','false');
    if(menuBtn) menuBtn.focus();
  }

  if(menuBtn) menuBtn.addEventListener('click', openMenu);
  if(closeBtn) closeBtn.addEventListener('click', closeMenu);
  if(backdrop) backdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && document.body.classList.contains('open')) closeMenu();
  });

  // Expose tiny utils for page scripts
  window.NAZO = window.NAZO || {};
  window.NAZO.pad = (num, len) => String(num).padStart(len, '0');
  window.NAZO.escapeHtml = (str) => String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  // BBS auto-numbering + fake posts (only on bbs.html)
  if(document.body.dataset.page === 'bbs'){
    let seed = Math.floor(Math.random() * 700) + 1200; // 1200-1899
    let jitter = Math.floor(Math.random() * 30);
    let currentNo = seed + jitter;

    const posts = qsa('.post[data-base]');
    posts.forEach((p) => {
      const base = Number(p.getAttribute('data-base') || '0');
      const badge = qs('.noBadge', p);
      const no = currentNo + base;
      if (badge) badge.textContent = `No.${window.NAZO.pad(no, 6)}`;
    });

    const form = qs('#fakePostForm');
    const list = qs('#threadList');
    function nowLike2008(){
      const mm = window.NAZO.pad(Math.floor(Math.random()*12)+1, 2);
      const hh = window.NAZO.pad(Math.floor(Math.random()*24), 2);
      const mi = window.NAZO.pad(Math.floor(Math.random()*60), 2);
      return `2009/${mm}/xx ${hh}:${mi}`;
    }
    if(form && list){
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const handle = (form.handle.value || '名無し').trim().slice(0, 32);
        const title = (form.title.value || '（無題）').trim().slice(0, 60);
        const msg = (form.msg.value || '了解です').trim().slice(0, 500);

        currentNo += Math.floor(Math.random()*3) + 1;
        const newNo = currentNo + 999;

        const el = document.createElement('article');
        el.className = 'post';
        el.innerHTML = `
          <div class="post-meta">
            <span class="post-name">${window.NAZO.escapeHtml(handle)}</span>
            <span class="badge">投稿（風）</span>
            <span class="badge">${nowLike2008()}</span>
            <span class="badge">No.${window.NAZO.pad(newNo, 6)}</span>
          </div>
          <div class="post-body">【${window.NAZO.escapeHtml(title)}】
${window.NAZO.escapeHtml(msg)}</div>
          <div class="quote">＞システム：保存されません（それがBBS）</div>
        `;
        list.insertBefore(el, list.firstChild);
        form.reset();
        alert('投稿しました（風）。※リロードで消えます');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
})();
