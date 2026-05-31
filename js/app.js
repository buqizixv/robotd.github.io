var currentLang = (new URLSearchParams(location.search).get('lang') === 'zh') ? 'zh' : (localStorage.getItem('lang') || 'en');
var currentRoute = 'home';
var currentSlug = null;
var currentCategory = null;
var articleCache = {};
var currentSearchTerm = '';

function t(key) { return (I18N[currentLang] && I18N[currentLang][key]) || key; }

function switchLang() {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  localStorage.setItem('lang', currentLang);
  var btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = t('lang_switch');
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  // If on article page with inline data, re-render in-place; otherwise reload
  if (currentRoute === 'article' && articleCache[currentSlug + '_' + currentLang]) {
    var app = document.getElementById('app');
    app.innerHTML = renderArticlePageHtml(articleCache[currentSlug + '_' + currentLang]);
    bindEvents();
    window.scrollTo(0, 0);
  } else if (currentRoute === 'home' || currentRoute === 'category') {
    // Reload with new lang param for pre-rendered content
    var url = new URL(location.href);
    if (currentLang === 'zh') url.searchParams.set('lang', 'zh'); else url.searchParams.delete('lang');
    location.href = url.toString();
  } else {
    // Fallback: render via page logic
    renderPage();
  }
}

function getCategoryLabel(slug) {
  for (var i = 0; i < CATEGORIES.length; i++) {
    if (CATEGORIES[i].slug === slug) return CATEGORIES[i][currentLang];
  }
  return slug;
}

function setMeta(id, attr, val) {
  var el = document.getElementById(id);
  if (el) { if (attr === 'content') el.content = val; else if (attr === 'href') el.href = val; }
}

function updateMetaTags(type, article) {
  var baseUrl = 'https://robotd.com';
  var homeTitle = SITE_NAME + ' — ' + t('site_tagline');
  var homeDesc = t('hero_title') + '. ' + t('hero_sub');
  var homeKw = 'robotics news, AI news, humanoid robots, industrial automation, drones, medical robotics, robot research, 机器人新闻, 人工智能';

  if (type === 'home') {
    document.title = homeTitle;
    setMeta('meta-desc', 'content', homeDesc);
    setMeta('meta-keywords', 'content', homeKw);
    setMeta('meta-canonical', 'href', baseUrl + '/');
    setMeta('meta-hreflang-en', 'href', baseUrl + '/');
    setMeta('meta-hreflang-zh', 'href', baseUrl + '/?lang=zh');
    setMeta('meta-og-title', 'content', homeTitle);
    setMeta('meta-og-desc', 'content', homeDesc);
    setMeta('meta-og-type', 'content', 'website');
    setMeta('meta-og-url', 'content', baseUrl + '/');
    setMeta('meta-og-image', 'content', '');
    setMeta('meta-og-image-alt', 'content', '');
    setMeta('meta-og-locale', 'content', 'en_US');
    setMeta('meta-tw-title', 'content', homeTitle);
    setMeta('meta-tw-desc', 'content', homeDesc);
    setMeta('meta-tw-image', 'content', '');
    injectJsonLd('website', null);
  } else if (type === 'category' && currentCategory) {
    var label = getCategoryLabel(currentCategory);
    document.title = label + ' — ' + SITE_NAME;
    var catDesc = currentLang === 'zh' ? ('最新' + label + '新闻与突破。双语 EN / 中文报道。') : ('Latest ' + label + ' news and breakthroughs. Bilingual EN/中文 coverage.');
    setMeta('meta-desc', 'content', catDesc);
    setMeta('meta-keywords', 'content', label.toLowerCase() + ', robotics, Robot D');
    setMeta('meta-canonical', 'href', baseUrl + '/category/' + currentCategory + '/');
    setMeta('meta-og-title', 'content', label + ' — ' + SITE_NAME);
    setMeta('meta-og-desc', 'content', catDesc);
    setMeta('meta-og-type', 'content', 'website');
    setMeta('meta-og-url', 'content', baseUrl + '/category/' + currentCategory + '/');
    setMeta('meta-og-image', 'content', '');
    injectJsonLd('website', null);
  } else if (type === 'article' && article) {
    var meta = article[currentLang];
    document.title = meta.title + ' — ' + SITE_NAME;
    var articleUrl = baseUrl + '/articles/' + article.slug + '.html';
    setMeta('meta-desc', 'content', meta.summary);
    var kw = (meta.keywords || '') + ', robotics, Robot D';
    setMeta('meta-keywords', 'content', kw);
    setMeta('meta-canonical', 'href', articleUrl);
    setMeta('meta-hreflang-en', 'href', articleUrl + '?lang=en');
    setMeta('meta-hreflang-zh', 'href', articleUrl + '?lang=zh');
    setMeta('meta-og-title', 'content', meta.title + ' — ' + SITE_NAME);
    setMeta('meta-og-desc', 'content', meta.summary);
    setMeta('meta-og-type', 'content', 'article');
    setMeta('meta-og-url', 'content', articleUrl);
    setMeta('meta-og-locale', 'content', currentLang === 'zh' ? 'zh_CN' : 'en_US');
    setMeta('meta-tw-title', 'content', meta.title + ' — ' + SITE_NAME);
    setMeta('meta-tw-desc', 'content', meta.summary);
    if (article.image) {
      var imgUrl = baseUrl + '/' + article.image;
      setMeta('meta-og-image', 'content', imgUrl);
      setMeta('meta-og-image-alt', 'content', meta.imageAlt || meta.title);
      setMeta('meta-tw-image', 'content', imgUrl);
    } else {
      setMeta('meta-og-image', 'content', '');
      setMeta('meta-tw-image', 'content', '');
    }
    injectJsonLd('article', article);
  }
}

function injectJsonLd(type, article) {
  var scriptEl = document.getElementById('json-ld');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.type = 'application/ld+json';
    scriptEl.id = 'json-ld';
    document.head.appendChild(scriptEl);
  }
  var baseUrl = 'https://robotd.com';
  var ld;

  if (type === 'website' || !article) {
    ld = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Robot D',
      url: baseUrl + '/',
      description: 'Your daily pulse on robotics and AI. Bilingual EN / 中文 news coverage.',
      inLanguage: ['en', 'zh']
    };
  } else {
    var meta = article.en;
    ld = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: meta.title,
      description: meta.summary,
      datePublished: article.date,
      dateModified: article.date,
      author: { '@type': 'Organization', name: 'Robot D', url: baseUrl + '/' },
      publisher: { '@type': 'Organization', name: 'Robot D', url: baseUrl + '/' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': baseUrl + '/articles/' + article.slug + '.html' },
      inLanguage: ['en', 'zh'],
      about: { '@type': 'Thing', name: article.category }
    };
    if (article.image) {
      ld.image = baseUrl + '/' + article.image;
    }
  }
  scriptEl.textContent = JSON.stringify(ld, null, 2);
}

function formatDate(dateStr) {
  var d = new Date(dateStr);
  var opts = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString(currentLang === 'zh' ? 'zh-CN' : 'en-US', opts);
}

function buildBreadcrumb(article) {
  var h = '<nav class="breadcrumb"><a href="/">' + t('breadcrumb_home') + '</a>';
  if (article) {
    h += ' / <a href="/category/' + article.category + '/">' + getCategoryLabel(article.category) + '</a>';
    h += ' / <span>' + article[currentLang].title + '</span>';
  }
  h += '</nav>';
  return h;
}

// ---- Component renders ----

function renderShell(topHtml) {
  return '<header class="site-header">' +
    '<div class="header-inner">' +
      '<a href="/" class="logo">' + SITE_NAME + '</a>' +
      '<button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '<nav class="main-nav" id="main-nav">' +
        '<a href="/">' + t('nav_home') + '</a>' +
        '<a href="/category/all/">' + t('nav_articles') + '</a>' +
        '<a href="/about.html">' + t('nav_about') + '</a>' +
        '<a href="/privacy.html">' + t('nav_privacy') + '</a>' +
      '</nav>' +
      '<button id="lang-toggle" class="lang-switch">' + t('lang_switch') + '</button>' +
    '</div>' +
  '</header>' +
  topHtml;
}

function renderShellBottom() {
  return renderFooter() + renderCookieConsent();
}

function renderFooter() {
  var catLinks = '';
  CATEGORIES.forEach(function(cat) {
    if (cat.slug !== 'all') catLinks += '<a href="/category/' + cat.slug + '/">' + cat[currentLang] + '</a>';
  });
  return '<footer class="site-footer"><div class="footer-grid">' +
    '<div class="footer-col footer-about"><strong>' + SITE_NAME + '</strong><p>' + t('footer_about') + '</p></div>' +
    '<div class="footer-col"><strong>' + t('footer_categories') + '</strong>' + catLinks + '</div>' +
    '<div class="footer-col"><strong>' + t('footer_legal') + '</strong>' +
      '<a href="/about.html">' + t('nav_about') + '</a>' +
      '<a href="/privacy.html">' + t('nav_privacy') + '</a>' +
      '<a href="/terms.html">Terms of Service</a>' +
    '</div></div>' +
    '<div class="footer-bottom"><p>' + t('footer_copyright') + '</p></div></footer>';
}

function renderCookieConsent() {
  if (localStorage.getItem('cookie-consent')) return '';
  return '<div id="cookie-consent" class="cookie-banner"><p>' + t('cookie_text') + ' <a href="/privacy.html">' + t('cookie_learn') + '</a></p>' +
    '<button id="cookie-accept" class="btn btn-accent btn-sm">' + t('cookie_ok') + '</button></div>';
}

function renderHero() {
  return '<section class="hero"><h1>' + t('hero_title') + '</h1>' +
    '<p class="hero-sub">' + t('hero_sub') + '</p>' +
    '<div class="hero-search"><input type="text" id="search-input" class="search-input" placeholder="' + t('search_placeholder') + '" autocomplete="off"></div>' +
    '</section>';
}

function renderCatTabs(activeCat) {
  var h = '<nav class="cat-tabs">';
  CATEGORIES.forEach(function(cat) {
    var active = (activeCat === cat.slug) ? ' active' : '';
    h += '<a href="/category/' + cat.slug + '/" class="' + active + '">' + cat[currentLang] + '</a>';
  });
  h += '</nav>';
  return h;
}

function renderArticleCard(article) {
  var meta = article[currentLang];
  return '<a href="/article/' + article.slug + '/" class="card">' +
    '<div class="card-category">' + getCategoryLabel(article.category) + '</div>' +
    '<h3>' + meta.title + '</h3>' +
    '<p class="card-summary">' + meta.summary + '</p>' +
    '<div class="card-meta"><time datetime="' + article.date + '">' + formatDate(article.date) + '</time>' +
    '<span class="card-link">' + t('read_more') + '</span></div></a>';
}

function renderNewsItem(article) {
  var meta = article[currentLang];
  var cls = article.featured ? ' featured' : '';
  return '<a href="/article/' + article.slug + '/" class="news-item' + cls + '">' +
    '<span class="news-item-tag">' + getCategoryLabel(article.category) + '</span>' +
    '<div class="news-item-body">' +
      '<h3>' + meta.title + '</h3>' +
      '<p>' + meta.summary + '</p>' +
      '<time datetime="' + article.date + '">' + formatDate(article.date) + '</time>' +
    '</div></a>';
}

function renderNewsList(showFeatured) {
  var articles = ARTICLE_MANIFEST.slice();
  articles.sort(function(a, b) { return b.date.localeCompare(a.date); });
  if (currentCategory && currentCategory !== 'all') {
    articles = articles.filter(function(a) { return a.category === currentCategory; });
  }
  var searchEl = document.getElementById('search-input');
  var term = searchEl ? searchEl.value.toLowerCase() : '';
  if (term) {
    articles = articles.filter(function(a) {
      var m = a[currentLang];
      return m.title.toLowerCase().indexOf(term) !== -1 || m.summary.toLowerCase().indexOf(term) !== -1;
    });
  }
  if (articles.length === 0) return '<div class="empty-state"><p>' + t('no_results') + '</p></div>';
  var h = '<div class="news-list">';
  articles.forEach(function(a) { h += renderNewsItem(a); });
  h += '</div>';
  return h;
}

function renderArticleGrid() {
  var articles = ARTICLE_MANIFEST.slice();
  articles.sort(function(a, b) { return b.date.localeCompare(a.date); });
  if (currentCategory && currentCategory !== 'all') {
    articles = articles.filter(function(a) { return a.category === currentCategory; });
  }
  var searchEl = document.getElementById('search-input');
  var term = searchEl ? searchEl.value.toLowerCase() : '';
  if (term) {
    articles = articles.filter(function(a) {
      var m = a[currentLang];
      return m.title.toLowerCase().indexOf(term) !== -1 || m.summary.toLowerCase().indexOf(term) !== -1;
    });
  }
  if (articles.length === 0) return '<div class="empty-state"><p>' + t('no_results') + '</p></div>';
  var h = '<div class="card-grid">';
  articles.forEach(function(a) { h += renderArticleCard(a); });
  h += '</div>';
  return h;
}

function buildCarouselSlides() {
  var slides = [];
  ARTICLE_MANIFEST.forEach(function(a) {
    if (a.image) slides.push(a);
  });
  slides.sort(function(a, b) { return b.date.localeCompare(a.date); });
  return slides;
}

function renderSidebar() {
  var slides = buildCarouselSlides();
  var carouselHtml = '';
  if (slides.length > 0) {
    carouselHtml = '<div class="carousel" id="carousel">' +
      '<div class="carousel-track" id="carousel-track">';
    slides.forEach(function(s, i) {
      var meta = s[currentLang];
      carouselHtml += '<a href="/article/' + s.slug + '" class="carousel-slide' + (i === 0 ? ' active' : '') + '" data-index="' + i + '">' +
        '<img src="/' + s.image + '" alt="' + (meta.imageAlt || meta.title) + '" loading="lazy">' +
        '<div class="carousel-caption"><span>' + meta.title + '</span></div>' +
        '</a>';
    });
    carouselHtml += '</div>' +
      '<div class="carousel-dots" id="carousel-dots">';
    slides.forEach(function(_, i) {
      carouselHtml += '<button class="carousel-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '" aria-label="Slide ' + (i+1) + '"></button>';
    });
    carouselHtml += '</div></div>';
  }

  // Hot / featured articles
  var featured = ARTICLE_MANIFEST.filter(function(a) { return a.featured; });
  featured.sort(function(a, b) { return b.date.localeCompare(a.date); });
  var topItems = featured.slice(0, 8);
  if (!topItems.length && !carouselHtml) return '';
  var h = '<aside class="sidebar">' + carouselHtml;
  if (topItems.length) {
    h += '<div class="sidebar-card"><h4>' + (currentLang === 'zh' ? '热门文章' : 'Hot Now') + '</h4><ul>';
    topItems.forEach(function(a) {
      var meta = a[currentLang];
      h += '<li><a href="/article/' + a.slug + '">' + meta.title + '</a><time datetime="' + a.date + '">' + formatDate(a.date) + '</time></li>';
    });
    h += '</ul></div>';
  }
  h += '</aside>';
  return h;
}

// ---- Page renders ----

function renderHomePage() {
  updateMetaTags('home', null);
  return renderShell(
    renderHero() +
    '<main class="main-content">' +
      '<div class="home-layout">' +
        '<div class="main-col">' +
          renderCatTabs('all') +
          '<div id="article-grid-container">' + renderNewsList() + '</div>' +
        '</div>' +
        renderSidebar() +
      '</div>' +
    '</main>' +
    renderShellBottom()
  );
}

function renderCategoryPageHtml() {
  var label = getCategoryLabel(currentCategory);
  updateMetaTags('category', null);
  return renderShell(
    '<main class="main-content"><section class="category-page">' +
      '<div class="home-layout">' +
        '<div class="main-col">' +
          renderCatTabs(currentCategory) +
          '<div id="article-grid-container">' + renderNewsList() + '</div>' +
        '</div>' +
        renderSidebar() +
      '</div>' +
    '</section></main>' +
    renderShellBottom()
  );
}

function renderArticlePageHtml(article) {
  var meta = article[currentLang];
  updateMetaTags('article', article);

  var imgHtml = '';
  if (article.image) {
    imgHtml = '<figure class="article-image-wrap">' +
      '<img src="/' + article.image + '" alt="' + (meta.imageAlt || meta.title) + '" class="article-image" loading="lazy" width="1200" height="675">' +
      (article.imageCredit ? '<figcaption class="image-credit">' + article.imageCredit + '</figcaption>' : '') +
      '</figure>';
  }

  return renderShell(
    '<main class="main-content"><article class="content-page">' +
      buildBreadcrumb(article) +
      imgHtml +
      '<header class="article-header">' +
        '<span class="article-category">' + getCategoryLabel(article.category) + '</span>' +
        '<h1>' + meta.title + '</h1>' +
        '<time class="article-date" datetime="' + article.date + '">' + t('published') + ' ' + formatDate(article.date) + '</time>' +
      '</header>' +
      '<div class="content-body">' + meta.body + '</div>' +
      renderPrevNextNav(article) +
    '</article>' +
    renderRelatedArticles(article) +
    '</main>' +
    renderShellBottom()
  );
}

function renderPrevNextNav(article) {
  var idx = -1;
  for (var i = 0; i < ARTICLE_MANIFEST.length; i++) {
    if (ARTICLE_MANIFEST[i].slug === article.slug) { idx = i; break; }
  }
  var h = '<nav class="content-nav">';
  if (idx > 0) {
    var prev = ARTICLE_MANIFEST[idx - 1];
    h += '<a href="/article/' + prev.slug + '" class="prev-link">← ' + prev[currentLang].title + '</a>';
  } else { h += '<span></span>'; }
  if (idx < ARTICLE_MANIFEST.length - 1) {
    var next = ARTICLE_MANIFEST[idx + 1];
    h += '<a href="/article/' + next.slug + '" class="next-link">' + next[currentLang].title + ' →</a>';
  } else { h += '<span></span>'; }
  h += '</nav>';
  return h;
}

function renderRelatedArticles(article) {
  var same = [], other = [];
  ARTICLE_MANIFEST.forEach(function(a) {
    if (a.slug === article.slug) return;
    if (a.category === article.category) same.push(a); else other.push(a);
  });
  var related = same.concat(other).slice(0, 3);
  if (!related.length) return '';
  var h = '<section class="related-section"><h2>' + t('related_articles') + '</h2><div class="card-grid">';
  related.forEach(function(a) { h += renderArticleCard(a); });
  return h + '</div></section>';
}

// ---- Async article loader ----

function loadAndRenderArticle() {
  var app = document.getElementById('app');

  // Show loading state immediately
  app.innerHTML = renderShell(
    '<main class="main-content"><div class="empty-state"><p>' + t('loading') + '</p></div></main>' +
    renderShellBottom()
  );
  bindEvents();
  window.scrollTo(0, 0);

  // Check cache
  var cacheKey = currentSlug + '_' + currentLang;
  if (articleCache[cacheKey]) {
    app.innerHTML = renderArticlePageHtml(articleCache[cacheKey]);
    bindEvents();
    window.scrollTo(0, 0);
    return;
  }

  // Fetch article JSON
  var base = window._articleBase || '/articles/';
  var url = base + currentSlug + '.json';
  console.log('Fetching:', url);
  fetch(url)
    .then(function(res) {
      console.log('Status:', res.status);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(data) {
      articleCache[currentSlug + '_en'] = data;
      articleCache[currentSlug + '_zh'] = data;
      articleCache[currentSlug + '_' + currentLang] = data;
      app.innerHTML = renderArticlePageHtml(data);
      bindEvents();
      window.scrollTo(0, 0);
    })
    .catch(function(err) {
      console.error('Article load failed:', err);
      app.innerHTML = renderShell(
        '<main class="main-content"><div class="empty-state"><p>Article not found.</p><p style="font-size:13px;color:var(--text-muted);margin-top:8px">' + (err.message || 'Load failed') + '</p><p style="margin-top:16px"><a href="/" class="btn btn-accent btn-lg">' + t('back_home') + '</a></p></div></main>' +
        renderShellBottom()
      );
      bindEvents();
    });
}

// ---- Main render ----

function renderPage() {
  if (currentRoute === 'article' && currentSlug) {
    loadAndRenderArticle();
    return;
  }

  var app = document.getElementById('app');
  if (currentRoute === 'category') {
    app.innerHTML = renderCategoryPageHtml();
  } else {
    app.innerHTML = renderHomePage();
  }
  bindEvents();

  var searchEl = document.getElementById('search-input');
  if (searchEl && currentSearchTerm) searchEl.value = currentSearchTerm;
}

// ---- Event binding ----

function bindEvents() {
  var lb = document.getElementById('lang-toggle');
  if (lb) { lb.onclick = switchLang; }

  var cb = document.getElementById('cookie-accept');
  if (cb) {
    cb.onclick = function() {
      localStorage.setItem('cookie-consent', '1');
      var banner = document.getElementById('cookie-consent');
      if (banner) banner.style.display = 'none';
    };
  }

  var mb = document.getElementById('mobile-menu-btn');
  if (mb) {
    mb.onclick = function() {
      var nav = document.getElementById('main-nav');
      if (nav) nav.classList.toggle('open');
    };
  }

  var si = document.getElementById('search-input');
  if (si) {
    si.oninput = function() {
      currentSearchTerm = this.value;
      var grid = document.getElementById('article-grid-container');
      if (grid) grid.innerHTML = renderNewsList();
    };
  }

  // Carousel
  initCarousel();
}

var carouselTimer = null;
function initCarousel() {
  if (carouselTimer) clearInterval(carouselTimer);
  var track = document.getElementById('carousel-track');
  var dots = document.querySelectorAll('#carousel-dots .carousel-dot');
  if (!track || dots.length === 0) return;

  var current = 0;
  var total = dots.length;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
  }

  dots.forEach(function(dot) {
    dot.onclick = function() { goTo(parseInt(this.getAttribute('data-index'))); };
  });

  carouselTimer = setInterval(function() { goTo(current + 1); }, 4000);
}

function parseRoute() {
  var path = window.location.pathname.replace(/\/+$/, '');
  currentSearchTerm = '';
  if (path.indexOf('/article/') === 0) {
    currentRoute = 'article';
    currentSlug = path.replace('/article/', '').replace(/\/$/, '');
    currentCategory = null;
  } else if (path.indexOf('/category/') === 0) {
    currentRoute = 'category';
    currentCategory = path.replace('/category/', '').replace(/\/$/, '');
    currentSlug = null;
  } else {
    currentRoute = 'home';
    currentSlug = null;
    currentCategory = null;
  }
}

function route() {
  parseRoute();
  renderPage();
  window.scrollTo(0, 0);
}

function navigateTo(url, push) {
  if (push !== false) history.pushState(null, '', url);
  parseRoute();
  renderPage();
  window.scrollTo(0, 0);
}

window.addEventListener('popstate', function() { parseRoute(); renderPage(); window.scrollTo(0, 0); });
window.addEventListener('DOMContentLoaded', route);

// Intercept link clicks for SPA navigation
document.addEventListener('click', function(e) {
  var link = e.target.closest('a');
  if (!link) return;
  var href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript') || link.getAttribute('download') || link.getAttribute('target') === '_blank') return;
  // Let standalone .html pages navigate normally (about, privacy, terms, etc.)
  if (href.endsWith('.html')) return;
  // Internal link — handle via SPA
  e.preventDefault();
  navigateTo(href);
});
