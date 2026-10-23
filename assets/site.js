(function () {
  'use strict';

  /* Réglages : remplis ces champs pour afficher Instagram, WhatsApp ou envoyer les demandes automatiquement. */
  var CONFIG = {
    email: 'bouba.ousmanad@gmail.com',
    instagram: 'https://www.instagram.com/focus4performance/',
    whatsapp: '',         // ex. '32470123456' : indicatif + numéro, sans + ni espaces
    coachVideo: '',       // facultatif : ex. 'images/coach-video.mp4', un court extrait sans son qui remplace la photo du coach
    endpoint: '',         // facultatif : adresse qui reçoit les demandes en JSON (POST)
    endpointHeaders: {}   // facultatif : en-têtes demandés par cette adresse
  };

  var root = document.documentElement;
  var readyTimer = setTimeout(function () { root.classList.add('is-ready'); }, 2600);

  /* Logos et photo : le monogramme reste affiché si l’image manque. */
  function watchImage(img, onOk, onFail) {
    if (!img) return;
    if (img.complete) { (img.naturalWidth ? onOk : onFail)(); return; }
    img.addEventListener('load', onOk, { once: true });
    img.addEventListener('error', onFail, { once: true });
  }
  document.querySelectorAll('.brand-mark > img').forEach(function (img) {
    watchImage(img, function () { img.parentNode.classList.add('has-img'); }, function () { img.remove(); });
  });
  var photo = document.querySelector('.coach-photo img');
  watchImage(photo, function () { photo.parentNode.classList.add('has-photo'); }, function () { photo.remove(); });

  /* Liens de contact */
  document.querySelectorAll('[data-contact-email]').forEach(function (a) {
    a.href = 'mailto:' + CONFIG.email;
    a.textContent = CONFIG.email;
  });
  if (CONFIG.instagram) {
    document.querySelectorAll('[data-instagram]').forEach(function (a) {
      a.href = CONFIG.instagram; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false;
    });
    document.querySelectorAll('[data-instagram-item]').forEach(function (el) { el.hidden = false; });
  }
  if (CONFIG.whatsapp) {
    document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
      a.href = 'https://wa.me/' + CONFIG.whatsapp; a.target = '_blank'; a.rel = 'noopener';
    });
    document.querySelectorAll('[data-whatsapp-item]').forEach(function (el) { el.hidden = false; });
  }
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* Messages Instagram : les liens ig.me ouvrent l’app sur téléphone ; sur ordinateur, on ouvre le profil. */
  var desktop = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (desktop && CONFIG.instagram) {
    document.querySelectorAll('[data-dm]').forEach(function (a) { a.href = CONFIG.instagram; });
  }

  /* Manifeste : élargissement au premier passage */
  var manifesto = document.querySelector('.manifesto');
  if (manifesto && 'IntersectionObserver' in window) {
    var mo = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { manifesto.classList.add('is-in'); mo.disconnect(); }
    }, { threshold: 0.35 });
    mo.observe(manifesto);
  } else if (manifesto) manifesto.classList.add('is-in');

  /* Quelle est ton excuse ? */
  var excuses = document.querySelector('[data-excuses]');
  if (excuses) {
    excuses.querySelectorAll('.excuse-list span').forEach(function (el, i) { el.style.setProperty('--i', i); });
    if ('IntersectionObserver' in window) {
      var eo = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { excuses.classList.add('is-in'); eo.disconnect(); }
      }, { threshold: 0.3 });
      eo.observe(excuses.querySelector('.excuse-list'));
    } else excuses.classList.add('is-in');
  }

  /* Menu mobile */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      var txt = menuBtn.querySelector('.mb-txt');
      (txt || menuBtn).textContent = open ? 'Fermer' : 'Menu';
      root.classList.toggle('menu-open', open);
    };
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
    });
  }

  /* En-tête : transparent sur la photo d’ouverture, plein dès qu’on défile. */
  var majEntete = function () { root.classList.toggle('is-scrolled', (window.pageYOffset || document.documentElement.scrollTop) > 24); };
  majEntete();
  window.addEventListener('scroll', majEntete, { passive: true });

  /* Titre : « Limits off. » prend toute la largeur disponible, puis s’étire au chargement. */
  var display = document.querySelector('[data-display]');
  var far = document.querySelector('[data-far]');
  var trail = display ? display.querySelector('.trail') : null;
  var probe = null;
  function archivoLoaded() {
    var ok = false;
    if (document.fonts && document.fonts.forEach) {
      document.fonts.forEach(function (f) { if (/archivo/i.test(f.family) && f.status === 'loaded') ok = true; });
    }
    return ok;
  }
  function fitDisplay() {
    if (!display || !far) return;
    if (!probe) {
      probe = document.createElement('span');
      probe.className = 'fit-probe';
      probe.setAttribute('aria-hidden', 'true');
      probe.textContent = far.textContent;
      document.body.appendChild(probe);
    }
    display.style.fontSize = '';
    var size = parseFloat(getComputedStyle(display).fontSize);
    probe.style.fontSize = size + 'px';
    var need = probe.getBoundingClientRect().width;
    var avail = display.clientWidth;
    if (need > avail && need > 0) {
      size = size * avail / need * 0.995;
      display.style.fontSize = size.toFixed(2) + 'px';
    }
    if (trail) {
      display.classList.remove('no-trail');
      display.classList.toggle('no-trail', trail.getBoundingClientRect().width < size * 0.8);
    }
  }
  function startHero() {
    root.classList.toggle('no-archivo', !archivoLoaded());
    fitDisplay();
    clearTimeout(readyTimer);
    requestAnimationFrame(function () { root.classList.add('is-ready'); });
  }
  if (far) far.addEventListener('animationend', function () { root.classList.add('hero-done'); });
  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1800); })]).then(startHero, startHero);
  if (document.fonts && document.fonts.addEventListener) {
    document.fonts.addEventListener('loadingdone', function () {
      if (archivoLoaded()) root.classList.remove('no-archivo');
      fitDisplay();
    });
  }
  var resizeTimer;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(fitDisplay, 120); });

  /* Ouverture de l’accueil : les photos suivantes se chargent après la page, puis se relaient en fondu. */
  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-slides] .hero-slide'));
  var sansMouvement = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slides.length > 1 && !sansMouvement) {
    var chargeSlides = function () {
      var attentes = slides.slice(1).map(function (sl) {
        sl.querySelectorAll('[data-srcset]').forEach(function (x) { x.setAttribute('srcset', x.getAttribute('data-srcset')); x.removeAttribute('data-srcset'); });
        var im = sl.querySelector('img');
        if (im.getAttribute('data-src')) { im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); }
        return im.decode ? im.decode().catch(function () {}) : Promise.resolve();
      });
      Promise.all(attentes).then(function () {
        var prets = slides.filter(function (sl, k) { return k === 0 || sl.querySelector('img').naturalWidth > 0; });
        if (prets.length < 2) return;
        var i = 0;
        setInterval(function () {
          if (document.hidden) return;
          prets[i].classList.remove('is-on');
          i = (i + 1) % prets.length;
          prets[i].classList.add('is-on');
        }, 6500);
      });
    };
    var plusTard = function () { setTimeout(chargeSlides, 1200); };
    if (document.readyState === 'complete') plusTard(); else window.addEventListener('load', plusTard);
  }

  /* Programmes : « Parler de ce programme » pré-remplit le formulaire. */
  document.querySelectorAll('[data-programme]').forEach(function (a) {
    a.addEventListener('click', function () { prefill('', a.getAttribute('data-programme'), ''); });
  });

  /* Barre d’action mobile : visible après l’ouverture, masquée au formulaire. */
  var sticky = document.querySelector('[data-sticky]');
  var hero = document.querySelector('.hero, .page-hero');
  var contact = document.getElementById('contact');
  if (sticky && !contact && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { sticky.classList.toggle('is-visible', !es[0].isIntersecting); }).observe(hero);
  }
  if (sticky && hero && contact && 'IntersectionObserver' in window) {
    var heroIn = true, contactIn = false;
    var update = function () { sticky.classList.toggle('is-visible', !heroIn && !contactIn); };
    new IntersectionObserver(function (es) { heroIn = es[0].isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(function (es) { contactIn = es[0].isIntersecting; update(); }, { rootMargin: '0px 0px -25% 0px' }).observe(contact);
  }

  /* Pré-remplit le formulaire de demande. */
  /* Le formulaire est sur la page Contact : depuis une autre page, la demande y est transmise. */
  function prefill(profil, programme, texte) {
    if (!document.getElementById('demande')) {
      try { sessionStorage.setItem('fp-demande', JSON.stringify({ profil: profil, programme: programme, texte: texte })); } catch (e) {}
      return;
    }
    var fp = document.getElementById('f-profil');
    var fg = document.getElementById('f-programme');
    var fo = document.getElementById('f-objectif');
    if (fp && profil) fp.value = profil;
    if (fg && programme) fg.value = programme;
    if (fo && texte) fo.value = fo.value.trim() ? fo.value.trim() + '\n\n' + texte : texte;
  }

  /* Aperçu de l’app : onglets Séance, État du jour, Progression. */
  var phone = document.querySelector('[data-phone]');
  var PHONE_LABELS = {
    seance: 'Aperçu de FOCUS LAB, écran Séance : la prochaine séance BUILD avec ses exercices, séries et intensités',
    etat: 'Aperçu de FOCUS LAB, écran État du jour : indice de forme, sommeil, énergie, stress et courbatures',
    progression: 'Aperçu de FOCUS LAB, écran Progression : exemple de charge de travail sur huit semaines, ratio de charge et records'
  };
  var tabs = document.querySelectorAll('.lab-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var name = tab.getAttribute('data-screen');
      tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(t === tab)); });
      document.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== name; });
      if (phone && PHONE_LABELS[name]) phone.setAttribute('aria-label', PHONE_LABELS[name]);
    });
  });

  /* Trouve ton programme */
  var quiz = document.querySelector('[data-quiz]');
  if (quiz) {
    var PROGRAMMES = {
      poids: { name: 'VERSUS', goal: 'Perte de poids', profil: 'Perte de poids (VERSUS)', objectif: 'perdre du poids',
        text: 'VERSUS, c’est toi contre toi-même : des entraînements structurés, une nutrition adaptée sans régime extrême et un suivi qui tient dans la durée.' },
      muscle: { name: 'BUILD', goal: 'Prise de masse', profil: 'Prise de masse (BUILD)', objectif: 'prendre du muscle',
        text: 'BUILD, c’est construire ton physique : plus de masse, plus de force et une progression mesurable, bloc après bloc.' },
      condition: { name: 'PERFORMANCE', goal: 'Conditionnement', profil: 'Conditionnement (PERFORMANCE)', objectif: 'améliorer ma condition',
        text: 'PERFORMANCE te rend plus endurant, plus fort et plus complet : conditionnement et capacité athlétique, pour le ring, le terrain ou HYROX.' },
      echeance: { name: 'Préparation d’objectif', goal: 'Combat, saison, tests', profil: 'Autre', objectif: 'préparer une échéance',
        text: 'Tout le travail est planifié à rebours de ta date : tests de départ, points d’étape et affûtage pour être prêt le jour J.' }
    };
    var LABELS = {
      contexte: { combat: 'sports de combat', football: 'football', intervention: 'police, armée', course: 'course à pied', salle: 'salle ou fitness', aucun: 'sans sport en particulier' },
      niveau: { debut: 'débutant', regulier: 'entraînement régulier', competiteur: 'compétiteur' },
      lieu: { salle: 'en salle', maison: 'à la maison', dehors: 'dehors ou sur le terrain', mixte: 'dans plusieurs lieux' },
      frequence: { '2': '2 séances par semaine', '3-4': '3 ou 4 séances par semaine', '5': '5 séances ou plus par semaine' }
    };
    var NIVEAU_TEXT = {
      debut: 'On commence par poser la technique et une base solide.',
      regulier: 'On structure ta progression en blocs, avec des charges suivies séance après séance.',
      competiteur: 'On cale la charge sur ton calendrier sportif et ta récupération.'
    };
    var PROFIL_CONTEXTE = { combat: 'Sports de combat', football: 'Football', intervention: 'Métier d’intervention (police, armée)', course: 'Course à pied' };

    var steps = Array.prototype.slice.call(quiz.querySelectorAll('[data-step]'));
    var result = quiz.querySelector('[data-result]');
    var back = quiz.querySelector('[data-quiz-back]');
    var bar = quiz.querySelector('[data-quiz-bar]');
    var count = quiz.querySelector('[data-quiz-count]');
    var live = quiz.querySelector('[data-quiz-live]');
    var answers = {};
    var current = 0;

    var summary = function () {
      return [LABELS.contexte[answers.contexte], LABELS.niveau[answers.niveau], LABELS.lieu[answers.lieu], LABELS.frequence[answers.frequence]]
        .filter(Boolean).join(', ');
    };
    var showStep = function (i, moveFocus) {
      current = i;
      steps.forEach(function (s, k) { s.hidden = k !== i; });
      result.hidden = true;
      back.hidden = i === 0;
      bar.style.width = ((i + 1) / steps.length * 100) + '%';
      count.textContent = (i + 1) + ' sur ' + steps.length;
      var h = steps[i].querySelector('h3');
      if (moveFocus) {
        h.focus({ preventScroll: true });
        live.textContent = 'Question ' + (i + 1) + ' sur ' + steps.length + ' : ' + h.textContent;
      }
    };
    var showResult = function () {
      var p = PROGRAMMES[answers.objectif] || PROGRAMMES.muscle;
      quiz.querySelector('[data-r-name]').textContent = p.name;
      var dmLabel = quiz.querySelector('[data-r-dm]');
      if (dmLabel) dmLabel.textContent = p.name === 'Préparation d’objectif' ? 'Ou écris-moi en DM sur Instagram' : 'Ou écris «\u00a0' + p.name + '\u00a0» en DM sur Instagram';
      quiz.querySelector('[data-r-goal]').textContent = p.goal;
      quiz.querySelector('[data-r-profile]').textContent = 'Ton profil : ' + summary() + '.';
      quiz.querySelector('[data-r-text]').textContent = p.text + ' ' + (NIVEAU_TEXT[answers.niveau] || '');
      steps.forEach(function (s) { s.hidden = true; });
      result.hidden = false;
      back.hidden = true;
      bar.style.width = '100%';
      count.textContent = 'Résultat';
      result.querySelector('h3').focus({ preventScroll: true });
      live.textContent = 'Ton programme : ' + p.name;
      var top = quiz.getBoundingClientRect().top;
      if (top < 0) quiz.scrollIntoView({ block: 'start' });
    };

    quiz.addEventListener('click', function (e) {
      var opt = e.target.closest('.quiz-opt');
      if (!opt) return;
      var step = opt.closest('[data-step]');
      answers[step.getAttribute('data-step')] = opt.getAttribute('data-value');
      step.querySelectorAll('.quiz-opt').forEach(function (o) { o.setAttribute('aria-pressed', String(o === opt)); });
      if (current < steps.length - 1) showStep(current + 1, true); else showResult();
    });
    back.addEventListener('click', function () { if (current > 0) showStep(current - 1, true); });
    quiz.querySelector('[data-r-restart]').addEventListener('click', function () {
      answers = {};
      quiz.querySelectorAll('.quiz-opt').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      showStep(0, true);
    });
    quiz.querySelector('[data-r-send]').addEventListener('click', function () {
      var p = PROGRAMMES[answers.objectif] || PROGRAMMES.muscle;
      prefill(PROFIL_CONTEXTE[answers.contexte] || p.profil, p.name,
        'D’après « Trouve ton programme » : ' + p.objectif + ' (' + summary() + ').');
    });
    showStep(0, false);
  }

  /* Running Club : pré-remplit la demande. */
  document.querySelectorAll('[data-club]').forEach(function (a) {
    a.addEventListener('click', function () { prefill('Course à pied', 'Je ne sais pas encore', 'Je veux rejoindre le Running Club.'); });
  });

  /* Vidéo du coach : chargée seulement si coach-video.mp4 existe et que la section approche. */
  var vid = document.querySelector('.coach-photo > video[data-src]');
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (vid && (calm || !CONFIG.coachVideo)) vid.remove();
  else if (vid) {
    var loadVideo = function () {
      var src = document.createElement('source');
      src.src = CONFIG.coachVideo;
      src.type = 'video/mp4';
      src.addEventListener('error', function () { vid.remove(); }, { once: true });
      vid.addEventListener('loadeddata', function () {
        vid.parentNode.classList.add('has-video');
        var pr = vid.play();
        if (pr && pr.catch) pr.catch(function () {});
      }, { once: true });
      vid.appendChild(src);
      vid.load();
    };
    if ('IntersectionObserver' in window) {
      var vo = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { vo.disconnect(); loadVideo(); }
      }, { rootMargin: '300px 0px' });
      vo.observe(vid.parentNode);
    } else loadVideo();
  }

  /* Nutrition : « Demander mon plan nutrition » pré-remplit la demande. */
  document.querySelectorAll('[data-nutri-cta]').forEach(function (a) {
    a.addEventListener('click', function () { prefill('', '', 'Je veux un plan nutrition calculé pour mon objectif.'); });
  });


  /* Apparitions au défilement : chaque groupe arrive en cascade, les photos se posent en douceur. */
  if ('IntersectionObserver' in window && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var CIBLES = ['.section-head > *', '.head-copy > *', '.pillar', '.tile', '.prog-cards > li', '.plan', '.included', '.price-note', '.profile',
      '.step', '.rules', '.loop-note', '.features > div', '.faq details', '.faq-layout > :first-child', '.lab-head > *', '.lab-phone',
      '.coach-photo', '.coach-copy > *', '.quiz', '.g-item', '.band-copy > *', '.excuses-photo', '.excuses-copy > *',
      '.club-copy > *', '.club-photo', '.contact-intro > *', '.form', '.cta-inner > *', '.next-link', '.footer-top > *', '.duo > li'];
    var vus = [];
    document.querySelectorAll(CIBLES.join(',')).forEach(function (el) {
      if (el.hidden || el.closest('.hero, .page-hero, .site-nav') || el.classList.contains('head-copy') || vus.indexOf(el) > -1) return;
      vus.push(el);
    });
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    vus.forEach(function (el) {
      var freres = Array.prototype.filter.call(el.parentNode.children, function (x) { return vus.indexOf(x) > -1; });
      el.style.setProperty('--d', Math.min(Math.max(freres.indexOf(el), 0), 6) * 90 + 'ms');
      el.classList.add('rv');
      if (el.matches('.tile, .prog-cards > li, .g-item, .coach-photo, .excuses-photo, .club-photo')) el.classList.add('rv-zoom');
      ro.observe(el);
    });
  }

  /* Formulaire de demande */
  var form = document.getElementById('demande');
  if (form) {
    try {
      var transmis = JSON.parse(sessionStorage.getItem('fp-demande') || 'null');
      sessionStorage.removeItem('fp-demande');
      if (transmis) prefill(transmis.profil, transmis.programme, transmis.texte);
    } catch (e) {}
  }
  var statusEl = form ? form.querySelector('.form-status') : null;
  function say(msg, kind) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (kind ? ' is-' + kind : '');
  }
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = {};
    new FormData(form).forEach(function (v, k) { d[k] = String(v).trim(); });
    if (d.website) return;
    delete d.website;

    var lignes = ['Prénom : ' + d.prenom, 'E-mail : ' + d.email];
    if (d.telephone) lignes.push('Téléphone : ' + d.telephone);
    lignes.push('Profil : ' + d.profil, 'Programme : ' + d.programme);
    if (d.echeance) lignes.push('Échéance : ' + d.echeance);
    lignes.push('', d.objectif);
    var texte = lignes.join('\n');
    var btn = form.querySelector('[type="submit"]');

    if (CONFIG.endpoint) {
      btn.disabled = true;
      say('Envoi en cours…');
      fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, CONFIG.endpointHeaders),
        body: JSON.stringify(Object.assign({ source: 'coach.html' }, d))
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        form.reset();
        say('Demande envoyée. Je te réponds dès que possible.', 'ok');
      }).catch(function () {
        say('La demande n’est pas partie. Vérifie ta connexion, ou écris à ' + CONFIG.email + '.', 'error');
      }).then(function () { btn.disabled = false; });
      return;
    }
    if (CONFIG.whatsapp) {
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent('Demande Focus & Performance\n\n' + texte), '_blank', 'noopener');
      say('WhatsApp s’ouvre avec ta demande prête : il ne te reste qu’à l’envoyer.', 'ok');
      return;
    }
    window.location.href = 'mailto:' + CONFIG.email +
      '?subject=' + encodeURIComponent('Demande de préparation physique, ' + d.prenom) +
      '&body=' + encodeURIComponent(texte);
    say('Ta messagerie s’ouvre avec ta demande prête : il ne te reste qu’à l’envoyer. Rien ne s’ouvre ? Écris à ' + CONFIG.email + '.', 'ok');
  });
})();
