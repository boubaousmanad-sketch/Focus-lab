import re, os

REPO = '/home/claude/focus-lab'
P = '/tmp/claude-0/-home-claude/a8ab77e8-2763-54d7-845d-2a0874861fba/scratchpad/premium/'
APP = 'https://focus-on-performance.bouba-ousmanad.chatgpt.site'
PAGES = ['index', 'programmes', 'methode', 'nutrition', 'le-coach', 'contact']


def sub(s, a, b, n=1):
    assert s.count(a) == n, (a[:80], s.count(a))
    return s.replace(a, b)


def pic(base, sizes_list, w, h, sizes, alt='', lazy=True, prio=False):
    """<picture> avec AVIF et WebP. sizes_list : [(largeur, nom_avif, nom_webp)]"""
    avif = ', '.join('images/%s %dw' % (a, sw) for sw, a, _ in sizes_list)
    webp = ', '.join('images/%s %dw' % (wb, sw) for sw, _, wb in sizes_list)
    src = 'images/' + sizes_list[-1][2]
    extra = ' loading="lazy"' if lazy else ''
    if prio:
        extra += ' fetchpriority="high"'
    return ('<picture><source type="image/avif" srcset="%s" sizes="%s"><img src="%s" srcset="%s" sizes="%s" alt="%s" width="%d" height="%d"%s decoding="async"></picture>'
            % (avif, sizes, src, webp, sizes, alt, w, h, extra))


IMG = {
    'kb-dos': ([(500, 'seance-kettlebells-dos-500.avif', 'seance-kettlebells-dos-500.webp'), (1000, 'seance-kettlebells-dos-1000.avif', 'seance-kettlebells-dos.webp')], 1000, 1777),
    'cardio': ([(450, 'seance-cardio-450.avif', 'seance-cardio-450.webp'), (900, 'seance-cardio-900.avif', 'seance-cardio.webp')], 900, 1599),
    'squat-dos': ([(640, 'hero-squat-dos-640.avif', 'hero-squat-dos-640.webp'), (828, 'hero-squat-dos-828.avif', 'hero-squat-dos-828.webp'), (1100, 'hero-squat-dos-1100.avif', 'hero-squat-dos.webp')], 1100, 1954),
    'piste-sourire': ([(500, 'excuses-piste-500.avif', 'excuses-piste-500.webp'), (1000, 'excuses-piste-1000.avif', 'excuses-piste.webp')], 1000, 1777),
    'piste-course': ([(600, 'running-piste-600.avif', 'running-piste-600.webp'), (1100, 'running-piste-1100.avif', 'running-piste.webp')], 1100, 1954),
    'developpe': ([(500, 'seance-developpe-500.avif', 'seance-developpe-500.webp'), (1000, 'seance-developpe-1000.avif', 'seance-developpe.webp')], 1000, 1333),
    'versus': ([(480, 'cover-versus-480.avif', 'cover-versus-480.webp'), (960, 'cover-versus-960.avif', 'cover-versus.webp')], 960, 640),
    'build': ([(480, 'cover-build-480.avif', 'cover-build-480.webp'), (960, 'cover-build-960.avif', 'cover-build.webp')], 960, 640),
    'performance': ([(480, 'cover-performance-480.avif', 'cover-performance-480.webp'), (960, 'cover-performance-960.avif', 'cover-performance.webp')], 960, 640),
}


def img(key, sizes, alt='', lazy=True, prio=False):
    l, w, h = IMG[key]
    return pic(key, l, w, h, sizes, alt, lazy, prio)


NAV = [('programmes', 'Programmes'), ('methode', 'Méthode'), ('nutrition', 'Nutrition'), ('le-coach', 'Le coach'), ('contact', 'Contact')]


def header(page):
    items = ''.join('        <li><a href="/%s.html"%s>%s</a></li>\n' % (k, ' aria-current="page"' if k == page else '', t) for k, t in NAV)
    return '''<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="/">
      <span class="brand-mark">
        <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18.75" fill="#000" stroke="#C9A24D" stroke-width="1.5"/><text x="20" y="25.4" text-anchor="middle" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="15" font-weight="800" fill="#EDEAE3">F<tspan fill="#C9A24D">P</tspan></text></svg>
        <img src="images/logo-fp-177.webp" alt="" width="59" height="38" decoding="async">
      </span>
      <span>Focus &amp; Performance</span>
    </a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav"><span class="mb-lines" aria-hidden="true"></span><span class="mb-txt">Menu</span></button>
    <nav class="site-nav" id="site-nav" aria-label="Navigation principale">
      <ul>
''' + items + '''        <li class="nav-client"><a href="''' + APP + '''/index.html">Espace client</a></li>
      </ul>
      <div class="nav-foot">
        <a class="btn btn-gold" href="/contact.html">Parler de mon objectif</a>
        <p>Namur · en ligne · hybride</p>
      </div>
    </nav>
    <a class="btn btn-gold header-cta" href="/contact.html">Parler de mon objectif</a>
  </div>
</header>
'''


FOOTER = '''<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <p class="footer-claim"><span class="fc-1">Focus on.</span><span class="fc-2">Limits off.</span></p>
      <a class="btn btn-gold" href="/contact.html">Parler de mon objectif</a>
    </div>
    <div class="footer-grid">
      <div class="footer-brand">
        <picture><source type="image/avif" srcset="images/logo-focus-on-264.avif 264w, images/logo-focus-on-396.avif 396w" sizes="132px"><img class="footer-logo" src="images/logo-focus-on-264.webp" srcset="images/logo-focus-on-264.webp 264w, images/logo-focus-on-396.webp 396w" sizes="132px" alt="Focus &amp; Performance : Focus on. Limits off. Mindset, progression, performance." width="640" height="607" loading="lazy" decoding="async"></picture>
        <p>Préparation physique sur mesure, à Namur et en ligne.</p>
      </div>
      <nav aria-label="Explorer le site">
        <p class="footer-h">Explorer</p>
        <ul>
          <li><a href="/programmes.html">Programmes</a></li>
          <li><a href="/methode.html">Méthode</a></li>
          <li><a href="/nutrition.html">Nutrition</a></li>
          <li><a href="/le-coach.html">Le coach</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </nav>
      <nav aria-label="Espaces">
        <p class="footer-h">Espaces</p>
        <ul>
          <li><a href="''' + APP + '''/index.html">Espace client FOCUS&nbsp;LAB</a></li>
          <li><a href="/espace-coach/" rel="nofollow">Espace coach</a></li>
          <li><a href="''' + APP + '''/journal.html">Le fil du coach</a></li>
        </ul>
      </nav>
      <div>
        <p class="footer-h">Contact</p>
        <ul>
          <li><a data-contact-email href="mailto:bouba.ousmanad@gmail.com">bouba.ousmanad@gmail.com</a></li>
          <li data-instagram-item hidden><a data-instagram href="#">Instagram</a></li>
          <li><a href="/le-coach.html#running-club">Running Club</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-legal">
      <p>© <span data-year>2026</span> Focus &amp; Performance, Bouba&nbsp;Ousmana</p>
      <a href="''' + APP + '''/confidentialite.html">Confidentialité</a>
    </div>
  </div>
</footer>
'''

MARQUEE_WORDS = ['Focus on', 'Limits off', 'Discipline', 'Progression', 'Résultats', 'Plus loin. Ensemble.']
MARQUEE = ('  <div class="marquee" id="suite" aria-hidden="true"><div class="marquee-track">'
           + ''.join('<span>%s</span>' % w for w in MARQUEE_WORDS * 2) + '</div></div>\n')

PROGS = [
    ('versus', 'Perte de poids', 'VERSUS', 'Toi contre toi-même.'),
    ('build', 'Prise de masse', 'BUILD', 'Ne rêve pas ton physique. Construis-le.'),
    ('performance', 'Conditionnement', 'PERFORMANCE', 'Plus endurant. Plus fort. Plus complet.'),
]
PROG_SECTION = '''  <section class="section progs" aria-labelledby="progs-titre">
    <div class="wrap">
      <div class="section-head head-split">
        <div class="head-copy">
          <p class="eyebrow">Programmes</p>
          <h2 id="progs-titre">Un programme pour chaque objectif.</h2>
        </div>
        <a class="text-link" href="/programmes.html">Voir tous les programmes</a>
      </div>
    </div>
    <ul class="prog-cards">
''' + ''.join('''      <li><a class="prog-card" href="/programmes.html#offres" data-accent="%s">
        <span class="prog-media">%s</span>
        <span class="prog-body"><span class="prog-goal">%s</span><span class="prog-name">%s</span><span class="prog-line">%s</span><span class="prog-more">Découvrir</span></span>
      </a></li>
''' % (k, img(k, '(min-width: 960px) 380px, 84vw'), g, n, l) for k, g, n, l in PROGS) + '''    </ul>
  </section>
'''

TILES = [
    ('/methode.html', 'cardio', '01', 'Méthode', 'Comprendre, construire, observer, ajuster. Et l’app FOCUS&nbsp;LAB.'),
    ('/nutrition.html', 'squat-dos', '02', 'Nutrition', 'Tes besoins et ton plan repas, calculés pour ton objectif.'),
    ('/le-coach.html', 'piste-sourire', '03', 'Le coach', 'Bouba Ousmana, sa façon de travailler, tes questions.'),
    ('/le-coach.html#running-club', 'piste-course', '04', 'Running Club', 'Des sorties en groupe, quel que soit ton niveau.'),
]
DECOUVRIR = '''  <section class="section decouvrir" aria-labelledby="decouvrir-titre">
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">L’univers</p>
        <h2 id="decouvrir-titre">Découvre Focus &amp;&nbsp;Performance.</h2>
      </div>
      <ul class="tiles">
''' + ''.join('''        <li class="tile">
          <a href="%s">
            %s
            <span class="tile-k">%s</span>
            <span class="tile-t">%s</span>
            <span class="tile-d">%s</span>
          </a>
        </li>
''' % (href, img(k, '(min-width: 960px) 290px, 50vw'), n, t, d) for href, k, n, t, d in TILES) + '''      </ul>
    </div>
  </section>
'''

CTA = '''  <section class="cta-photo" aria-labelledby="cta-titre">
    <figure class="cta-bg">''' + img('developpe', '100vw') + '''</figure>
    <div class="wrap cta-inner">
      <p class="eyebrow">Premier échange</p>
      <h2 id="cta-titre">Prêt à commencer&#8239;?</h2>
      <p class="lead">Quelques lignes sur ton objectif suffisent. Je te réponds pour fixer un premier échange, et le tarif est annoncé avant tout engagement.</p>
      <div class="hero-actions">
        <a class="btn btn-gold" href="/contact.html">Parler de mon objectif</a>
        <a class="btn btn-ghost" href="/programmes.html#trouve">Trouver mon programme</a>
      </div>
    </div>
  </section>
'''

HEROS = {
    'programmes': ('kb-dos', 'Bouba Ousmana de dos, une kettlebell dans chaque main', 'Programmes', 'Programmes.',
                   'VERSUS, BUILD, PERFORMANCE ou une échéance à préparer&nbsp;: un programme construit pour ton objectif, suivi séance après séance dans FOCUS&nbsp;LAB.'),
    'methode': ('cardio', 'Séance de cardio sur un simulateur d’escalier', 'Méthode', 'Méthode.',
                'Comprendre, construire, observer, ajuster&nbsp;: ta préparation part de ton niveau réel et avance avec toi, séance après séance.'),
    'nutrition': ('squat-dos', 'Bouba Ousmana au rack de squat, de dos', 'Nutrition', 'Nutrition.',
                  'Tes besoins et ton plan repas, calculés pour ton objectif, puis ajustés avec moi selon tes résultats.'),
    'le-coach': ('piste-sourire', 'Bouba Ousmana sourit sur la piste d’athlétisme', 'Le coach', 'Le coach.',
                 'Bouba Ousmana, coach en préparation physique à Namur et en ligne. Et le Running Club Focus &amp; Performance.'),
    'contact': ('piste-course', 'Course sur la piste d’athlétisme', 'Contact', 'Contact.',
                'Parle-moi de ton objectif&nbsp;: je te réponds pour fixer un premier échange.'),
}
NEXT = {'programmes': ('/methode.html', 'Méthode'), 'methode': ('/nutrition.html', 'Nutrition'), 'nutrition': ('/le-coach.html', 'Le coach'),
        'le-coach': ('/contact.html', 'Contact'), 'contact': ('/programmes.html', 'Programmes')}


def page_hero(page):
    k, alt, crumb, title, lead = HEROS[page]
    return '''  <section class="page-hero" aria-labelledby="page-titre">
    <figure class="ph-media">''' + img(k, '(min-width: 960px) 46vw, 100vw', alt, lazy=False, prio=True) + '''</figure>
    <div class="wrap ph-inner">
      <nav class="ph-crumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><span aria-current="page">''' + crumb + '''</span></nav>
      <h1 class="ph-title" id="page-titre"><span class="ln"><span>''' + title + '''</span></span></h1>
      <p class="ph-lead">''' + lead + '''</p>
    </div>
  </section>
'''


def preload(page):
    k = HEROS[page][0]
    l, w, h = IMG[k]
    ss = ', '.join('images/%s %dw' % (a, sw) for sw, a, _ in l)
    return '<link rel="preload" as="image" type="image/avif" imagesrcset="%s" imagesizes="(min-width: 960px) 46vw, 100vw" fetchpriority="high">\n' % ss


def next_block(page):
    href, t = NEXT[page]
    return '''  <section class="next-page" aria-label="Page suivante">
    <div class="wrap"><a class="next-link" href="''' + href + '''"><span class="eyebrow">Page suivante</span><span class="next-title">''' + t + '''</span></a></div>
  </section>
'''


# ---------- CSS et JS partagés ----------
css = open(P + 'site.css', encoding='utf-8').read().lstrip('\n')
css = sub(css, 'url("fonts/archivo-latin.woff2")', 'url("/fonts/archivo-latin.woff2")')
css += open(P + 'premium.css', encoding='utf-8').read()
css += '.head-split .head-copy{display:grid;gap:18px}\n.marquee{scroll-margin-top:var(--hh)}\n.site-footer ul a{word-break:break-word}\n'
os.makedirs(REPO + '/assets', exist_ok=True)
open(REPO + '/assets/site.css', 'w', encoding='utf-8').write(css)

js = open(P + 'site.js', encoding='utf-8').read()
js = sub(js, """      menuBtn.textContent = open ? 'Fermer' : 'Menu';
    };""", """      var txt = menuBtn.querySelector('.mb-txt');
      (txt || menuBtn).textContent = open ? 'Fermer' : 'Menu';
      root.classList.toggle('menu-open', open);
    };""")
js = sub(js, "  /* Titre : « Limits off. » prend toute la largeur disponible, puis s’étire au chargement. */",
"""  /* En-tête : transparent sur la photo d’ouverture, plein dès qu’on défile. */
  var majEntete = function () { root.classList.toggle('is-scrolled', (window.pageYOffset || document.documentElement.scrollTop) > 24); };
  majEntete();
  window.addEventListener('scroll', majEntete, { passive: true });

  /* Titre : « Limits off. » prend toute la largeur disponible, puis s’étire au chargement. */""")
js = sub(js, "  var hero = document.querySelector('.hero');", "  var hero = document.querySelector('.hero, .page-hero');")
a = js.index('  /* Apparitions au défilement : chaque bloc arrive en douceur, les tuiles l’une après l’autre. */')
b = js.index('  /* Formulaire de demande */')
js = js[:a] + """  /* Apparitions au défilement : chaque groupe arrive en cascade, les photos se posent en douceur. */
  if ('IntersectionObserver' in window && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    var CIBLES = ['.section-head > *', '.head-copy > *', '.pillar', '.tile', '.prog-cards > li', '.plan', '.included', '.price-note', '.profile',
      '.step', '.rules', '.loop-note', '.features > div', '.faq details', '.faq-layout > :first-child', '.lab-head > *', '.lab-phone',
      '.coach-photo', '.coach-copy > *', '.quiz', '.g-item', '.band-copy > *', '.excuses-photo', '.excuses-copy > *',
      '.club-copy > *', '.club-photo', '.contact-intro > *', '.form', '.cta-inner > *', '.next-link', '.footer-top > *'];
    var vus = [];
    document.querySelectorAll(CIBLES.join(',')).forEach(function (el) {
      if (el.closest('.hero, .page-hero, .site-nav') || el.classList.contains('head-copy') || vus.indexOf(el) > -1) return;
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

""" + js[b:]
open(REPO + '/assets/site.js', 'w', encoding='utf-8').write(js)

# ---------- Pages ----------
for page in PAGES:
    f = REPO + '/' + page + '.html'
    s = open(f, encoding='utf-8').read()
    s = re.sub(r'<style>.*?</style>\n', '<link rel="stylesheet" href="/assets/site.css">\n', s, count=1, flags=re.S)
    s = re.sub(r'<script>\n\(function \(\) \{.*?</script>\n', '<script src="/assets/site.js"></script>\n', s, count=1, flags=re.S)
    s = re.sub(r'<header class="site-header">.*?</header>\n', lambda m: header(page), s, count=1, flags=re.S)
    s = re.sub(r'<footer class="site-footer">.*?</footer>\n', lambda m: FOOTER, s, count=1, flags=re.S)
    if page != 'index':
        s = sub(s, '<link rel="preload" href="fonts/archivo-latin.woff2"', preload(page) + '<link rel="preload" href="fonts/archivo-latin.woff2"')
    a = s.index('<main id="contenu">\n') + len('<main id="contenu">\n')
    z = s.index('</main>')
    body = s[a:z]
    if page == 'index':
        hero = re.search(r'  <section class="hero" id="top">.*?\n  </section>\n', body, re.S).group(0)
        hero = sub(hero, '\n  </section>\n', '\n    <a class="scroll-cue" href="#suite" aria-label="Voir la suite"></a>\n  </section>\n')
        mani = re.search(r'  <section class="manifesto".*?\n  </section>\n', body, re.S).group(0)
        body = hero + MARQUEE + mani + PROG_SECTION + DECOUVRIR + CTA
    else:
        body = page_hero(page) + body + next_block(page)
    s = s[:a] + body + s[z:]
    s = s.replace('<link rel="preload" href="fonts/archivo-latin.woff2"', '<link rel="preload" href="/fonts/archivo-latin.woff2"')
    open(f, 'w', encoding='utf-8').write(s)
    print(page, len(s))
