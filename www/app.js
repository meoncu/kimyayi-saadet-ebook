/**
 * Kimyâ-yı Saâdet (İmam Gazâlî) 752 Sayfa Tam Metin Okuyucu
 * Local Database, Exact Page Navigation (1-752), Typography & Reading Progress Engine
 */

(function () {
  'use strict';

  const BOOK_DATA = window.BOOK_DATA || window.BOOK_DATABASE || { total_pages: 752, pages: [], sections: [] };

  // 1. CONFIGURATION & LOCAL STORAGE
  const STORAGE_KEY_SETTINGS = 'ks_reader_settings_752';
  const STORAGE_KEY_PROGRESS = 'ks_reader_progress_752';

  const DEFAULT_SETTINGS = {
    fontSize: 18,
    fontFamily: 'font-serif',
    theme: 'theme-sepia',
    lineHeight: 1.7,
    brightness: 0
  };

  const DEFAULT_PROGRESS = {
    currentPage: 1,
    scrollOffset: 0,
    scrollPercent: 0,
    lastReadTime: Date.now()
  };

  let settings = Object.assign({}, DEFAULT_SETTINGS);
  let progress = Object.assign({}, DEFAULT_PROGRESS);
  let currentPage = 1;
  let isNavBarsVisible = true;
  let scrollSaveTimeout = null;

  // DOM Elements
  const viewport = document.getElementById('reader-viewport');
  const bookContent = document.getElementById('book-content');
  const topNav = document.getElementById('top-nav');
  const bottomBar = document.getElementById('bottom-reading-bar');
  const progressBar = document.getElementById('reading-progress-bar');
  const brightnessOverlay = document.getElementById('brightness-overlay');

  const navSectionTitle = document.getElementById('nav-section-title');
  const navChapterTitle = document.getElementById('nav-chapter-title');
  const navPageDisplay = document.getElementById('nav-page-display');
  const btnPageBadge = document.getElementById('btn-page-badge');

  // Resume Banner
  const resumeChapterText = document.getElementById('resume-chapter-text');
  const resumeProgressText = document.getElementById('resume-progress-text');
  const btnResumeReading = document.getElementById('btn-resume-reading');

  // Footer Navigation
  const btnPrevPage = document.getElementById('btn-prev-page');
  const btnNextPage = document.getElementById('btn-next-page');
  const footerPageIndicator = document.getElementById('footer-page-indicator');

  // Bottom Bar
  const bottomProgressPercent = document.getElementById('bottom-progress-percent');
  const bottomReadingStats = document.getElementById('bottom-reading-stats');
  const btnBottomPageBadge = document.getElementById('btn-bottom-page-badge');
  const btnQuickFontDec = document.getElementById('btn-quick-font-dec');
  const btnQuickFontInc = document.getElementById('btn-quick-font-inc');
  const quickFontDisplay = document.getElementById('quick-font-display');
  const btnQuickTheme = document.getElementById('btn-quick-theme');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  // Page Jump Modal
  const pageJumpModal = document.getElementById('page-jump-modal');
  const jumpPageInput = document.getElementById('jump-page-input');
  const jumpPageSlider = document.getElementById('jump-page-slider');
  const sliderCurrentVal = document.getElementById('slider-current-val');
  const btnConfirmJump = document.getElementById('btn-confirm-jump');
  const btnCloseJump = document.getElementById('btn-close-jump');

  // Drawer
  const tocDrawer = document.getElementById('toc-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const btnToc = document.getElementById('btn-toc');
  const btnCloseToc = document.getElementById('btn-close-toc');
  const tabSections = document.getElementById('tab-sections');
  const tabAllPages = document.getElementById('tab-all-pages');
  const tocSectionsList = document.getElementById('toc-sections-list');
  const tocPagesList = document.getElementById('toc-pages-list');
  const drawerJumpInput = document.getElementById('drawer-jump-input');
  const btnDrawerJump = document.getElementById('btn-drawer-jump');

  // Settings Modal
  const settingsModal = document.getElementById('settings-modal');
  const btnFontSettings = document.getElementById('btn-font-settings');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const sliderFontSize = document.getElementById('slider-font-size');
  const labelFontSize = document.getElementById('label-font-size');
  const btnSliderFontDec = document.getElementById('btn-slider-font-dec');
  const btnSliderFontInc = document.getElementById('btn-slider-font-inc');
  const sliderBrightness = document.getElementById('slider-brightness');
  const labelBrightness = document.getElementById('label-brightness');

  // Search
  const searchModal = document.getElementById('search-modal');
  const btnSearch = document.getElementById('btn-search');
  const btnCloseSearch = document.getElementById('btn-close-search');
  const searchInput = document.getElementById('in-book-search-input');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const searchResultsStats = document.getElementById('search-results-stats');
  const searchResultsList = document.getElementById('search-results-list');
  const toast = document.getElementById('toast');

  // ==========================================================================
  // 2. STORAGE ENGINE
  // ==========================================================================
  const Storage = {
    load() {
      try {
        const st = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (st) settings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(st));
        const pr = localStorage.getItem(STORAGE_KEY_PROGRESS);
        if (pr) progress = Object.assign({}, DEFAULT_PROGRESS, JSON.parse(pr));
      } catch (e) {
        console.warn('Storage load fallback', e);
      }
    },
    saveSettings() {
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      } catch (e) {}
    },
    saveProgress() {
      try {
        progress.currentPage = currentPage;
        progress.lastReadTime = Date.now();
        localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
      } catch (e) {}
    }
  };

  // ==========================================================================
  // 3. TYPOGRAPHY & THEMES
  // ==========================================================================
  function applySettings() {
    document.documentElement.style.setProperty('--font-base-size', `${settings.fontSize}px`);
    quickFontDisplay.textContent = `${settings.fontSize}px`;
    labelFontSize.textContent = `${settings.fontSize} px`;
    sliderFontSize.value = settings.fontSize;

    document.body.classList.remove('font-serif', 'font-amiri', 'font-sans');
    document.body.classList.add(settings.fontFamily);
    document.querySelectorAll('.font-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.font === settings.fontFamily);
    });

    document.body.classList.remove('theme-white', 'theme-sepia', 'theme-night', 'theme-oled');
    document.body.classList.add(settings.theme);
    document.querySelectorAll('.theme-circle').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === settings.theme);
    });

    document.documentElement.style.setProperty('--line-height', settings.lineHeight);
    document.querySelectorAll('.segment-btn').forEach(btn => {
      btn.classList.toggle('active', parseFloat(btn.dataset.lh) === settings.lineHeight);
    });

    brightnessOverlay.style.opacity = (settings.brightness / 100).toString();
    sliderBrightness.value = settings.brightness;
    labelBrightness.textContent = `%${settings.brightness}`;
  }

  function setFontSize(newSize) {
    settings.fontSize = Math.max(14, Math.min(34, newSize));
    applySettings();
    Storage.saveSettings();
  }

  function setTheme(t) {
    settings.theme = t;
    applySettings();
    Storage.saveSettings();
  }

  // ==========================================================================
  // 4. PAGE RENDERING & CONTINUOUS SCROLL
  // ==========================================================================
  // Renders a batch of pages around targetPage for smooth continuous vertical flow
  const BATCH_SIZE = 8;

  function loadPage(pageNumber, restoreScroll = false) {
    if (!BOOK_DATA || !BOOK_DATA.pages) return;
    const totalPages = BOOK_DATA.total_pages || 752;
    currentPage = Math.max(1, Math.min(totalPages, pageNumber));

    const pageObj = BOOK_DATA.pages[currentPage - 1];
    if (!pageObj) return;

    // Update Top / Bottom Nav Indicators
    navSectionTitle.textContent = pageObj.section_title;
    navChapterTitle.textContent = `Kimyâ-yı Saâdet`;
    navPageDisplay.textContent = `Sayfa ${currentPage} / ${totalPages}`;
    bottomReadingStats.textContent = `Sayfa ${currentPage} / ${totalPages}`;
    footerPageIndicator.textContent = `Sayfa ${currentPage} / ${totalPages}`;

    btnPrevPage.disabled = (currentPage <= 1);
    btnNextPage.disabled = (currentPage >= totalPages);

    // Calculate start & end for continuous window
    const startP = Math.max(1, currentPage - 1);
    const endP = Math.min(totalPages, startP + BATCH_SIZE - 1);

    renderPagesRange(startP, endP);

    if (restoreScroll && progress.scrollOffset > 0) {
      setTimeout(() => { viewport.scrollTop = progress.scrollOffset; }, 60);
    } else {
      setTimeout(() => {
        const el = document.getElementById(`page-anchor-${currentPage}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else viewport.scrollTop = 0;
      }, 50);
    }

    updateResumeUI();
    Storage.saveProgress();
  }

  function renderBlock(text, isFirst) {
    if (!text) return '';
    const trimmed = text.trim();

    // H1 Heading (# ) - Major Divisions (Unvanlar ve Rükünler)
    if (trimmed.startsWith('# ')) {
      const title = trimmed.replace(/^#\s+/, '');
      return `
        <div class="book-heading-h1-wrap">
          <span class="heading-badge">KİMYÂ-YI SAÂDET</span>
          <h1 class="book-h1">${escapeHtml(title)}</h1>
          <div class="heading-ornament">✦ &bull; ❖ &bull; ✦</div>
        </div>
      `;
    }

    // H2 Heading (## ) - Asıllar
    if (trimmed.startsWith('## ')) {
      const title = trimmed.replace(/^##\s+/, '');
      return `
        <div class="book-heading-h2-wrap">
          <span class="heading-badge-h2">ASIL</span>
          <h2 class="book-h2">${escapeHtml(title)}</h2>
        </div>
      `;
    }

    // H3 Heading (### ) - Bölümler ve Konu Başlıkları
    if (trimmed.startsWith('### ')) {
      const title = trimmed.replace(/^###\s+/, '');
      return `
        <div class="book-heading-h3-wrap">
          <h3 class="book-h3">${escapeHtml(title)}</h3>
        </div>
      `;
    }

    // Quranic Verse / Hadith Callout (> )
    if (trimmed.startsWith('> ')) {
      const content = trimmed.replace(/^>\s+/, '');
      return `
        <blockquote class="book-callout-verse">
          <div class="callout-icon">📖</div>
          <div class="callout-text">${escapeHtml(content)}</div>
        </blockquote>
      `;
    }

    // Standard flowing paragraph
    return `<p class="book-p ${isFirst ? 'first-p' : ''}">${escapeHtml(trimmed)}</p>`;
  }

  function renderPagesRange(startP, endP) {
    let html = '';
    for (let p = startP; p <= endP; p++) {
      const pageData = BOOK_DATA.pages[p - 1];
      if (!pageData) continue;

      html += `
        <section class="page-container" id="page-anchor-${p}" data-page="${p}">
          <div class="page-divider-badge">
            <span class="badge-line"></span>
            <span class="badge-text">📖 Sayfa ${p} / 752 • ${escapeHtml(pageData.section_title)}</span>
            <span class="badge-line"></span>
          </div>
          <div class="page-body">
      `;

      let hasFirstPara = false;
      pageData.paragraphs.forEach((para) => {
        const isHeaderOrCallout = para.startsWith('#') || para.startsWith('>');
        const isFirst = (!hasFirstPara && !isHeaderOrCallout && p === 14);
        if (!isHeaderOrCallout && !hasFirstPara) hasFirstPara = true;
        html += renderBlock(para, isFirst);
      });

      html += `
          </div>
        </section>
      `;
    }

    // Add "Daha Fazla Sayfa Yükle" button if endP < total_pages
    if (endP < (BOOK_DATA.total_pages || 752)) {
      html += `
        <div style="text-align: center; margin: 30px 0;">
          <button id="btn-load-more" class="btn-primary-action" style="margin: 0 auto; padding: 12px 24px;">
            Sonraki Sayfaları Göster (${endP + 1} - ${Math.min(752, endP + BATCH_SIZE)})
          </button>
        </div>
      `;
    }

    bookContent.innerHTML = html;

    const btnMore = document.getElementById('btn-load-more');
    if (btnMore) {
      btnMore.addEventListener('click', () => {
        loadPage(endP + 1);
      });
    }
  }

  function setupScrollTracking() {
    let lastScroll = 0;

    viewport.addEventListener('scroll', () => {
      const curScroll = viewport.scrollTop;
      const maxScroll = viewport.scrollHeight - viewport.clientHeight;
      const pct = maxScroll > 0 ? Math.min(100, Math.round((curScroll / maxScroll) * 100)) : 0;

      progressBar.style.width = `${pct}%`;
      bottomProgressPercent.textContent = `%${pct}`;

      // Detect current visible page based on elements in viewport
      const pageContainers = document.querySelectorAll('.page-container');
      pageContainers.forEach(container => {
        const rect = container.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          const visiblePage = parseInt(container.dataset.page, 10);
          if (visiblePage && visiblePage !== currentPage) {
            currentPage = visiblePage;
            const total = BOOK_DATA.total_pages || 752;
            navPageDisplay.textContent = `Sayfa ${currentPage} / ${total}`;
            bottomReadingStats.textContent = `Sayfa ${currentPage} / ${total}`;
            footerPageIndicator.textContent = `Sayfa ${currentPage} / ${total}`;
            const pageData = BOOK_DATA.pages[currentPage - 1];
            if (pageData) navSectionTitle.textContent = pageData.section_title;
          }
        }
      });

      // Discreet auto-hide bars
      if (Math.abs(curScroll - lastScroll) > 35) {
        if (curScroll > lastScroll && curScroll > 120) {
          setBarsVisible(false);
        } else {
          setBarsVisible(true);
        }
        lastScroll = curScroll;
      }

      clearTimeout(scrollSaveTimeout);
      scrollSaveTimeout = setTimeout(() => {
        progress.scrollOffset = curScroll;
        progress.scrollPercent = pct;
        progress.currentPage = currentPage;
        Storage.saveProgress();
      }, 350);
    }, { passive: true });

    viewport.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('input')) return;
      setBarsVisible(!isNavBarsVisible);
    });
  }

  function setBarsVisible(vis) {
    isNavBarsVisible = vis;
    topNav.classList.toggle('nav-hidden', !vis);
    bottomBar.classList.toggle('bar-hidden', !vis);
  }

  function updateResumeUI() {
    const pageData = BOOK_DATA.pages[currentPage - 1] || BOOK_DATA.pages[0];
    resumeChapterText.textContent = `Sayfa ${currentPage} / 752 • ${pageData.section_title}`;
    resumeProgressText.textContent = `İlerleme: %${progress.scrollPercent}`;
  }

  // ==========================================================================
  // 5. QUICK PAGE JUMP POPUP
  // ==========================================================================
  function openPageJumpModal() {
    jumpPageInput.value = currentPage;
    jumpPageSlider.value = currentPage;
    sliderCurrentVal.textContent = `Sayfa ${currentPage}`;
    pageJumpModal.classList.add('open');
    setTimeout(() => jumpPageInput.focus(), 150);
  }

  function closePageJumpModal() {
    pageJumpModal.classList.remove('open');
  }

  function executePageJump(targetPage) {
    const p = parseInt(targetPage, 10);
    if (isNaN(p) || p < 1 || p > (BOOK_DATA.total_pages || 752)) {
      showToast('Lütfen 1 ile 752 arasında bir sayfa girin');
      return;
    }
    closePageJumpModal();
    closeDrawer();
    loadPage(p);
    showToast(`Sayfa ${p}'ye gidildi`);
  }

  // ==========================================================================
  // 6. DRAWER (FİHRİST & TÜM SAYFALAR 1-752)
  // ==========================================================================
  function renderSectionsList() {
    if (!BOOK_DATA || !BOOK_DATA.sections) return;
    let html = '';
    let currentCategory = '';

    BOOK_DATA.sections.forEach(sec => {
      if (sec.category && sec.category !== currentCategory) {
        currentCategory = sec.category;
        html += `<div class="toc-category-header">❖ ${escapeHtml(currentCategory)}</div>`;
      }

      const isCur = (currentPage >= sec.start_page && currentPage <= sec.end_page);

      html += `
        <div class="toc-item ${isCur ? 'active-chapter' : ''}" data-jump-page="${sec.start_page}">
          <span class="toc-item-num">S.${sec.start_page}</span>
          <div class="toc-item-content">
            <div class="toc-item-title">
              ${escapeHtml(sec.title)}
              ${sec.badge ? `<span class="toc-item-badge">${escapeHtml(sec.badge)}</span>` : ''}
            </div>
            <div class="toc-item-section">${escapeHtml(sec.subtitle)} (s. ${sec.start_page} - ${sec.end_page})</div>
          </div>
        </div>
      `;
    });
    tocSectionsList.innerHTML = html;

    tocSectionsList.querySelectorAll('.toc-item').forEach(item => {
      item.addEventListener('click', () => {
        const p = parseInt(item.dataset.jumpPage, 10);
        closeDrawer();
        loadPage(p);
      });
    });
  }

  function renderAllPagesList() {
    // Generate fast grid of pages
    let html = '<div class="pages-grid">';
    for (let p = 1; p <= (BOOK_DATA.total_pages || 752); p++) {
      const isCur = (p === currentPage);
      html += `
        <button class="page-grid-btn ${isCur ? 'active' : ''}" data-p="${p}">
          ${p}
        </button>
      `;
    }
    html += '</div>';
    tocPagesList.innerHTML = html;

    tocPagesList.querySelectorAll('.page-grid-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.p, 10);
        closeDrawer();
        loadPage(p);
      });
    });
  }

  function openDrawer(tab = 'sections') {
    renderSectionsList();
    renderAllPagesList();
    switchDrawerTab(tab);
    tocDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
  }

  function closeDrawer() {
    tocDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
  }

  function switchDrawerTab(tabName) {
    if (tabName === 'sections') {
      tabSections.classList.add('active');
      tabAllPages.classList.remove('active');
      tocSectionsList.classList.remove('hidden');
      tocPagesList.classList.add('hidden');
    } else {
      tabAllPages.classList.add('active');
      tabSections.classList.remove('active');
      tocPagesList.classList.remove('hidden');
      tocSectionsList.classList.add('hidden');
    }
  }

  // ==========================================================================
  // 7. IN-BOOK SEARCH (ACROSS ALL 752 PAGES)
  // ==========================================================================
  function openSearch() {
    searchModal.classList.add('open');
    searchInput.value = '';
    searchResultsStats.textContent = '752 sayfa içinde aramak için en az 2 harf girin...';
    searchResultsList.innerHTML = '';
    setTimeout(() => searchInput.focus(), 150);
  }

  function closeSearch() {
    searchModal.classList.remove('open');
  }

  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      searchResultsStats.textContent = '752 sayfa içinde aramak için en az 2 harf girin...';
      searchResultsList.innerHTML = '';
      return;
    }

    const matches = [];
    const totalPages = BOOK_DATA.total_pages || 752;

    for (let p = 0; p < totalPages; p++) {
      const pageObj = BOOK_DATA.pages[p];
      if (!pageObj) continue;

      for (let i = 0; i < pageObj.paragraphs.length; i++) {
        const text = pageObj.paragraphs[i];
        const idx = text.toLowerCase().indexOf(q);
        if (idx !== -1) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(text.length, idx + q.length + 60);
          const snippet = (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');

          const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
          const highlighted = escapeHtml(snippet).replace(regex, '<mark>$1</mark>');

          matches.push({
            pageNumber: pageObj.page_number,
            section: pageObj.section_title,
            snippet: highlighted
          });

          if (matches.length >= 80) break; // Limit for speed
        }
      }
      if (matches.length >= 80) break;
    }

    searchResultsStats.textContent = `${matches.length} eşleşme bulundu (Sayfaya dokunarak gidin):`;

    if (matches.length === 0) {
      searchResultsList.innerHTML = `<div style="padding: 40px 20px; text-align: center; color: var(--text-muted);">“${escapeHtml(query)}” için eşleşme bulunamadı.</div>`;
      return;
    }

    let html = '';
    matches.forEach(m => {
      html += `
        <div class="search-result-card" data-jump="${m.pageNumber}">
          <div class="search-result-chapter">📖 Sayfa ${m.pageNumber} / 752 • ${escapeHtml(m.section)}</div>
          <div class="search-result-snippet">${m.snippet}</div>
        </div>
      `;
    });
    searchResultsList.innerHTML = html;

    searchResultsList.querySelectorAll('.search-result-card').forEach(c => {
      c.addEventListener('click', () => {
        const targetP = parseInt(c.dataset.jump, 10);
        closeSearch();
        loadPage(targetP);
      });
    });
  }

  // ==========================================================================
  // 8. EVENT LISTENERS
  // ==========================================================================
  function setupEventListeners() {
    btnResumeReading.addEventListener('click', () => {
      loadPage(progress.currentPage || 1, true);
    });

    btnPrevPage.addEventListener('click', () => {
      if (currentPage > 1) loadPage(currentPage - 1);
    });

    btnNextPage.addEventListener('click', () => {
      if (currentPage < (BOOK_DATA.total_pages || 752)) loadPage(currentPage + 1);
    });

    // Page Badge click -> opens Jump Dialog
    btnPageBadge.addEventListener('click', openPageJumpModal);
    btnBottomPageBadge.addEventListener('click', openPageJumpModal);
    btnCloseJump.addEventListener('click', closePageJumpModal);

    btnConfirmJump.addEventListener('click', () => {
      executePageJump(jumpPageInput.value);
    });

    jumpPageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executePageJump(jumpPageInput.value);
    });

    jumpPageSlider.addEventListener('input', (e) => {
      sliderCurrentVal.textContent = `Sayfa ${e.target.value}`;
      jumpPageInput.value = e.target.value;
    });

    // Drawer Jump
    btnDrawerJump.addEventListener('click', () => {
      executePageJump(drawerJumpInput.value);
    });
    drawerJumpInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executePageJump(drawerJumpInput.value);
    });

    // Drawer tabs
    btnToc.addEventListener('click', () => openDrawer('sections'));
    btnCloseToc.addEventListener('click', closeDrawer);
    drawerBackdrop.addEventListener('click', () => {
      closeDrawer();
      closeSettings();
      closePageJumpModal();
    });

    tabSections.addEventListener('click', () => switchDrawerTab('sections'));
    tabAllPages.addEventListener('click', () => switchDrawerTab('pages'));

    // Font Controls
    btnFontSettings.addEventListener('click', () => {
      settingsModal.classList.add('open');
      drawerBackdrop.classList.add('active');
    });
    btnCloseSettings.addEventListener('click', closeSettings);

    btnQuickFontDec.addEventListener('click', () => setFontSize(settings.fontSize - 1));
    btnQuickFontInc.addEventListener('click', () => setFontSize(settings.fontSize + 1));
    btnSliderFontDec.addEventListener('click', () => setFontSize(settings.fontSize - 1));
    btnSliderFontInc.addEventListener('click', () => setFontSize(settings.fontSize + 1));
    sliderFontSize.addEventListener('input', (e) => setFontSize(parseInt(e.target.value, 10)));

    document.querySelectorAll('.font-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        settings.fontFamily = chip.dataset.font;
        applySettings();
        Storage.saveSettings();
      });
    });

    document.querySelectorAll('.theme-circle').forEach(btn => {
      btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });

    const themeList = ['theme-sepia', 'theme-night', 'theme-oled', 'theme-white'];
    btnQuickTheme.addEventListener('click', () => {
      const idx = themeList.indexOf(settings.theme);
      const next = themeList[(idx + 1) % themeList.length];
      setTheme(next);
      showToast(`Tema değiştirildi`);
    });

    document.querySelectorAll('.segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        settings.lineHeight = parseFloat(btn.dataset.lh);
        applySettings();
        Storage.saveSettings();
      });
    });

    sliderBrightness.addEventListener('input', (e) => {
      settings.brightness = parseInt(e.target.value, 10);
      applySettings();
      Storage.saveSettings();
    });

    // Search
    btnSearch.addEventListener('click', openSearch);
    btnCloseSearch.addEventListener('click', closeSearch);
    btnClearSearch.addEventListener('click', () => {
      searchInput.value = '';
      performSearch('');
      searchInput.focus();
    });
    searchInput.addEventListener('input', (e) => performSearch(e.target.value));

    // Fullscreen
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      else if (document.exitFullscreen) document.exitFullscreen();
    });

    // Arrow keys
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentPage < (BOOK_DATA.total_pages || 752)) loadPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 1) loadPage(currentPage - 1);
      }
    });
  }

  function closeSettings() {
    settingsModal.classList.remove('open');
    if (!tocDrawer.classList.contains('open') && !pageJumpModal.classList.contains('open')) {
      drawerBackdrop.classList.remove('active');
    }
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ==========================================================================
  // 9. INIT
  // ==========================================================================
  function init() {
    Storage.load();
    applySettings();
    setupScrollTracking();
    setupEventListeners();

    // Register / update service worker with force update
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js?v=752_v5_final').then(reg => {
        reg.update();
      }).catch(() => {});
    }

    const startP = progress.currentPage || 1;
    loadPage(startP, true);
    updateResumeUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
