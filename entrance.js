// DOOMEY cinematic entrance: welding sparks + scroll-driven reveal
(function () {
  var section = document.getElementById('entrance');
  if (!section) return;
  var media = document.getElementById('entranceMedia');
  var copy = document.getElementById('entranceCopy');
  var reveal = document.getElementById('entranceReveal');
  var canvas = document.getElementById('sparks');
  var ctx = canvas.getContext('2d');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t * t * (3 - 2 * t); }

  // Optional real footage: add images/hero.mp4 to your repo and it plays automatically
  var video = document.getElementById('entranceVideo');
  fetch('images/hero.mp4', { method: 'HEAD' }).then(function (r) {
    if (r.ok && video) {       video.src = 'images/hero.mp4';       video.style.display = 'block';       var bg = document.querySelector('.entrance-bg');       if (bg) bg.style.display = 'none';       video.play().catch(function () {});     }
  }).catch(function () {});

  // ---- Sparks ----
  var W = 0, H = 0, sparks = [], running = true;
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function emit(n) {
    var ox = W * 0.72, oy = H * 0.78;
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      var s = 2 + Math.random() * 7;
      sparks.push({ x: ox, y: oy, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
                    life: 1, decay: 0.008 + Math.random() * 0.02, r: 0.6 + Math.random() * 1.6 });
    }
  }
  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    var perFrame = W < 700 ? 3 : 6;
    emit(perFrame);
    for (var i = sparks.length - 1; i >= 0; i--) {
      var p = sparks[i];
      p.vy += 0.16; p.vx *= 0.995;
      p.x += p.vx; p.y += p.vy; p.life -= p.decay;
      if (p.life <= 0 || p.y > H + 20) { sparks.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2);
      ctx.strokeStyle = 'rgba(255,' + Math.round(150 + 90 * p.life) + ',60,' + p.life + ')';
      ctx.lineWidth = p.r;
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(frame);
  }
  resize();
  window.addEventListener('resize', resize);
  if (!reduce) requestAnimationFrame(frame);

  // ---- Scroll-driven shrink into a rounded card ----
  function update() {
    if (reduce) return;
    var total = section.offsetHeight - window.innerHeight;
    var p = clamp(window.scrollY / total, 0, 1);
    var shrink = ease(clamp(p / 0.6, 0, 1));
    var vh = window.innerHeight / 100, vw = window.innerWidth / 100;

    var top = lerp(0, 11 * vh, shrink);
    var side = lerp(0, window.innerWidth < 700 ? 4 * vw : 9 * vw, shrink);
    var bottom = lerp(0, window.innerWidth < 700 ? 36 * vh : 33 * vh, shrink);
    var radius = lerp(0, 28, shrink);
    media.style.clipPath = 'inset(' + top + 'px ' + side + 'px ' + bottom + 'px ' + side + 'px round ' + radius + 'px)';

    var fade = clamp(1 - p / 0.3, 0, 1);
    copy.style.opacity = fade;
    copy.style.transform = 'translateY(' + (-p * 90) + 'px)';
    copy.style.pointerEvents = fade < 0.2 ? 'none' : 'auto';

    var r = ease(clamp((p - 0.45) / 0.35, 0, 1));
    reveal.style.opacity = r;
    reveal.style.transform = 'translateY(' + (1 - r) * 40 + 'px)';
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', update);
  update();

  // Pause sparks when the section is off screen (saves battery)
  new IntersectionObserver(function (e) {
    var vis = e[0].isIntersecting;
    if (vis && !running && !reduce) { running = true; requestAnimationFrame(frame); }
    if (!vis) running = false;
  }).observe(section);
})();
