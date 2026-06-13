/* ============================================================
   Catch & Release Seamless Gutters — interactions
   ============================================================ */
(function(){
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('.header');
  const onScroll = () => {
    if(window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mm-overlay');
  const toggleMenu = (open) => {
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
  overlay.addEventListener('click', () => toggleMenu(false));
  menu.querySelectorAll('a, .mm-close').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if(reduce){
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const dur = 1600;
    const dec = (target % 1 !== 0) ? 1 : 0;
    const start = performance.now();
    const numEl = el.querySelector('.num') || el;
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      numEl.textContent = val.toLocaleString('en-US', {minimumFractionDigits:dec, maximumFractionDigits:dec});
      if(p < 1) requestAnimationFrame(step);
      else numEl.textContent = target.toLocaleString('en-US', {minimumFractionDigits:dec, maximumFractionDigits:dec});
    };
    requestAnimationFrame(step);
  };
  if(reduce){
    counters.forEach(el => {
      const numEl = el.querySelector('.num') || el;
      numEl.textContent = parseFloat(el.dataset.count).toLocaleString('en-US');
    });
  } else {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ animateCount(e.target); cio.unobserve(e.target); } });
    }, {threshold:0.6});
    counters.forEach(el => cio.observe(el));
  }

  /* ---------- Hero parallax ---------- */
  const heroBg = document.querySelector('.hero-bg');
  if(heroBg && !reduce){
    let ticking = false;
    window.addEventListener('scroll', () => {
      if(!ticking){
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if(y < window.innerHeight){ heroBg.style.transform = `translateY(${y * 0.18}px)`; }
          ticking = false;
        });
        ticking = true;
      }
    }, {passive:true});
  }

  /* ---------- Button ripple ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      const span = document.createElement('span');
      span.className = 'ripple';
      const size = Math.max(r.width, r.height) * 2.2;
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - r.left) + 'px';
      span.style.top = (e.clientY - r.top) + 'px';
      btn.appendChild(span);
      setTimeout(() => span.remove(), 650);
    });
  });

  /* ---------- CTA ripple field ---------- */
  const rfield = document.querySelector('.ripple-field');
  if(rfield && !reduce){
    const spawn = () => {
      const w = document.createElement('span');
      w.className = 'rwave';
      const size = 120 + Math.random()*220;
      w.style.width = w.style.height = size + 'px';
      w.style.left = (Math.random()*100) + '%';
      w.style.top = (Math.random()*100) + '%';
      w.style.marginLeft = (-size/2) + 'px';
      w.style.marginTop = (-size/2) + 'px';
      w.style.animationDuration = (5 + Math.random()*4) + 's';
      rfield.appendChild(w);
      setTimeout(() => w.remove(), 9000);
    };
    for(let i=0;i<4;i++) setTimeout(spawn, i*1400);
    setInterval(spawn, 1600);
  }

  /* ---------- Lightbox ---------- */
  const lb = document.querySelector('.lightbox');
  const lbInner = lb.querySelector('.lb-inner');
  const galItems = [...document.querySelectorAll('.gal-item')];
  let lbIndex = 0;
  const galData = galItems.map(it => ({
    label: it.dataset.label || '',
    tag: it.dataset.tag || '',
    src: (it.querySelector('img') || {}).src || ''
  }));
  const renderLB = () => {
    const d = galData[lbIndex];
    lbInner.innerHTML = `
      <img class="lb-img" src="${d.src}" alt="${d.label}">
      <div class="lb-cap"><span class="lb-tag">${d.tag}</span> ${d.label}</div>`;
  };
  const openLB = (i) => { lbIndex = i; renderLB(); lb.classList.add('open'); document.body.style.overflow='hidden'; };
  const closeLB = () => { lb.classList.remove('open'); document.body.style.overflow=''; };
  const moveLB = (dir) => { lbIndex = (lbIndex + dir + galData.length) % galData.length; renderLB(); };
  galItems.forEach((it,i) => it.addEventListener('click', () => openLB(i)));
  lb.querySelector('.lb-close').addEventListener('click', closeLB);
  lb.querySelector('.lb-prev').addEventListener('click', () => moveLB(-1));
  lb.querySelector('.lb-next').addEventListener('click', () => moveLB(1));
  lb.addEventListener('click', (e) => { if(e.target === lb) closeLB(); });
  document.addEventListener('keydown', (e) => {
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') closeLB();
    if(e.key === 'ArrowLeft') moveLB(-1);
    if(e.key === 'ArrowRight') moveLB(1);
  });

  /* ---------- Contact form — EmailJS ---------- */
  // EmailJS setup: uses your public key + service/template IDs
  // To activate: sign up free at emailjs.com, create a service + template, paste IDs below
  const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // <-- replace after setup
  const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // <-- replace after setup
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // <-- replace after setup

  if(typeof emailjs !== 'undefined'){
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const form = document.querySelector('#estimate-form');
  if(form){
    const showErr = (field, msg) => {
      field.classList.add('err');
      const m = field.querySelector('.msg'); if(m) m.textContent = msg;
    };
    const clearErr = (field) => {
      field.classList.remove('err');
      const m = field.querySelector('.msg'); if(m) m.textContent = '';
    };
    form.querySelectorAll('input,select,textarea').forEach(inp => {
      inp.addEventListener('input', () => clearErr(inp.closest('.field')));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let ok = true;
      const req = [
        ['name','Please enter your name'],
        ['phone','Please enter your phone number'],
        ['email','Please enter a valid email'],
      ];
      req.forEach(([n,msg]) => {
        const inp = form.elements[n];
        const field = inp.closest('.field');
        let valid = inp.value.trim() !== '';
        if(n === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim());
        if(n === 'phone') valid = inp.value.replace(/\D/g,'').length >= 7;
        if(!valid){ showErr(field, msg); ok = false; } else clearErr(field);
      });
      if(!ok){
        const firstErr = form.querySelector('.field.err');
        if(firstErr) firstErr.scrollIntoView({block:'center', behavior:'smooth'});
        return;
      }

      // Disable button while sending
      const submitBtn = form.querySelector('[type="submit"]');
      const origHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending… <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" style="animation:spin 1s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';

      const templateParams = {
        from_name:    form.elements['name'].value.trim(),
        from_phone:   form.elements['phone'].value.trim(),
        from_email:   form.elements['email'].value.trim(),
        address:      form.elements['address'].value.trim() || 'Not provided',
        service:      form.elements['service'].value || 'Not specified',
        message:      form.elements['message'].value.trim() || 'No message',
        to_email:     'silvacameron62@gmail.com',
        reply_to:     form.elements['email'].value.trim(),
      };

      try {
        if(typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'){
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        } else {
          // Fallback: mailto link when EmailJS not yet configured
          const subject = encodeURIComponent(`New Quote Request from ${templateParams.from_name}`);
          const body = encodeURIComponent(
            `Name: ${templateParams.from_name}\nPhone: ${templateParams.from_phone}\nEmail: ${templateParams.from_email}\nAddress: ${templateParams.address}\nService: ${templateParams.service}\n\nMessage:\n${templateParams.message}`
          );
          window.location.href = `mailto:silvacameron62@gmail.com?subject=${subject}&body=${body}`;
        }
        // Show success
        const card = form.closest('.form-card');
        form.style.display = 'none';
        card.querySelector('.form-success').classList.add('show');
      } catch(err) {
        console.error('EmailJS error:', err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = origHTML;
        // Show error message inline
        const errBanner = document.createElement('p');
        errBanner.style.cssText = 'color:#e53e3e;text-align:center;margin-top:12px;font-weight:600;';
        errBanner.textContent = 'Something went wrong. Please call us at 772-588-4825.';
        form.querySelector('.form-foot').after(errBanner);
        setTimeout(() => errBanner.remove(), 6000);
      }
    });
  }

  /* ---------- Footer year ---------- */
  const yr = document.querySelector('#year'); if(yr) yr.textContent = new Date().getFullYear();

  /* ---------- Active nav highlight ---------- */
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav a')];
  if(sections.length){
    const sio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          navLinks.forEach(l => l.style.color = '');
          const active = navLinks.find(l => l.getAttribute('href') === '#'+e.target.id);
          if(active) active.style.color = 'var(--green)';
        }
      });
    }, {threshold:0.5});
    sections.forEach(s => sio.observe(s));
  }

})();

/* spin keyframe for loading state */
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);
