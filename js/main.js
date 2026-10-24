/**
 * Sourabh Rajput - Main Portfolio Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();
  initNavbar();
  initSkillsFilter();
  initCertificatesShowcase();
  initModals();
  initContactForm();
  initBackToTop();
  initAosFallback();
});

/* ================= 1. Theme Switcher ================= */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const storedTheme = localStorage.getItem('sr_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sr_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
    }
  }
}

/* ================= 2. Typing Effect ================= */
function initTypingEffect() {
  const typedTarget = document.getElementById('typedText');
  if (!typedTarget) return;

  const phrases = [
    "Software Engineer",
    "Full-Stack Developer (MERN & Next.js)",
    "Salesforce Agentblazer Champion",
    "Google Student Ambassador",
    "C++ & Algorithmic Problem Solver",
    "AI & Cloud Enthusiast"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const pauseTime = 1800;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ================= 3. Navbar Navigation ================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close when clicking link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }
}

/* ================= 4. Skills Filter ================= */
function initSkillsFilter() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ================= 5. Certificates Showcase Engine ================= */
let activeCertificates = [];
let currentCertIndex = 0;

function initCertificatesShowcase() {
  const grid = document.getElementById('certificatesGrid');
  const searchInput = document.getElementById('certSearchInput');
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const countBadge = document.getElementById('certCountBadge');

  if (!grid || typeof CERTIFICATES_DATA === 'undefined') return;

  activeCertificates = [...CERTIFICATES_DATA];

  function renderCertificates(certs) {
    grid.innerHTML = '';
    if (certs.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
          <i class="fa-solid fa-certificate" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
          <h3>No matching certificates found</h3>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">Try clearing your search query or choosing another category.</p>
        </div>
      `;
      if (countBadge) countBadge.textContent = '0 Certificates';
      return;
    }

    if (countBadge) {
      countBadge.textContent = `${certs.length} Certificate${certs.length > 1 ? 's' : ''}`;
    }

    certs.forEach((cert, index) => {
      const card = document.createElement('div');
      card.className = 'cert-card';
      card.setAttribute('data-category', cert.category);

      const hasImage = Boolean(cert.image && cert.image.trim() !== '');
      const thumbHtml = hasImage
        ? `<img class="cert-thumb" src="${cert.image}" alt="${cert.title}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'cert-thumb-placeholder\\'><i class=\\'fa-solid fa-file-shield\\'></i><span>Credential Document</span></div>';" />`
        : `<div class="cert-thumb-placeholder">
             <i class="fa-solid fa-file-pdf"></i>
             <span style="font-weight: 600; font-size: 0.85rem;">Official PDF Document</span>
           </div>`;

      const verifyBtnHtml = cert.verifyUrl
        ? `<a href="${cert.verifyUrl}" target="_blank" rel="noopener" class="cert-btn" title="Verify Online">
             <i class="fa-solid fa-arrow-up-right-from-square"></i> Verify
           </a>`
        : '';

      const tagsHtml = cert.tags ? cert.tags.slice(0, 3).map(t => `<span class="skill-tag">${t}</span>`).join('') : '';

      card.innerHTML = `
        <div class="cert-thumb-container" onclick="openCertModalByIndex(${index})">
          ${thumbHtml}
          <div class="cert-thumb-overlay">
            <i class="fa-solid fa-magnifying-glass-plus"></i> Click to Preview
          </div>
        </div>
        <div class="cert-body">
          <div class="cert-meta-row">
            <span class="cert-badge">${cert.badge || 'Verified'}</span>
            <span class="cert-date">${cert.date || ''}</span>
          </div>
          <h4 class="cert-title">${cert.title}</h4>
          <div class="cert-issuer"><i class="fa-solid fa-building-columns"></i> ${cert.issuer}</div>
          <p class="cert-desc">${cert.description || ''}</p>
          <div class="skill-tags" style="margin-bottom: 0.85rem;">
            ${tagsHtml}
          </div>
          <div class="cert-footer">
            <div class="cert-actions">
              <button class="cert-btn cert-btn-primary" onclick="openCertModalByIndex(${index})">
                <i class="fa-solid fa-eye"></i> View
              </button>
              ${verifyBtnHtml}
            </div>
            <a href="${cert.fileUrl || cert.image}" download class="cert-btn" title="Download Document">
              <i class="fa-solid fa-download"></i>
            </a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function filterCerts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeBtn = document.querySelector('.cert-filter-btn.active');
    const selectedCategory = activeBtn ? activeBtn.getAttribute('data-category') : 'all';

    activeCertificates = CERTIFICATES_DATA.filter(cert => {
      const matchesCategory = selectedCategory === 'all' || cert.category === selectedCategory;
      const matchesSearch = !query ||
        cert.title.toLowerCase().includes(query) ||
        cert.issuer.toLowerCase().includes(query) ||
        (cert.certId && cert.certId.toLowerCase().includes(query)) ||
        (cert.tags && cert.tags.some(t => t.toLowerCase().includes(query)));
      return matchesCategory && matchesSearch;
    });

    renderCertificates(activeCertificates);
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCerts);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCerts();
    });
  });

  // Initial render
  renderCertificates(activeCertificates);
}

/* ================= 6. Modal Lightbox System ================= */
function initModals() {
  const certModal = document.getElementById('certModal');
  const certModalClose = document.getElementById('certModalClose');
  const certBackdrop = document.getElementById('certBackdrop');
  const certPrevBtn = document.getElementById('certPrevBtn');
  const certNextBtn = document.getElementById('certNextBtn');

  const resumeModal = document.getElementById('resumeModal');
  const resumeModalClose = document.getElementById('resumeModalClose');
  const resumeBackdrop = document.getElementById('resumeBackdrop');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');

  // Certificate Modal Handlers
  window.openCertModalByIndex = function(index) {
    if (!activeCertificates || activeCertificates.length === 0) return;
    currentCertIndex = index;
    displayCertInModal(activeCertificates[currentCertIndex]);
    if (certModal) certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function displayCertInModal(cert) {
    if (!cert) return;
    const titleEl = document.getElementById('certModalTitle');
    const mediaContainer = document.getElementById('certModalMedia');
    const issuerEl = document.getElementById('certModalIssuer');
    const descEl = document.getElementById('certModalDesc');
    const certIdEl = document.getElementById('certModalId');
    const verifyLinkEl = document.getElementById('certModalVerifyLink');
    const downloadLinkEl = document.getElementById('certModalDownloadLink');

    if (titleEl) titleEl.textContent = cert.title;
    if (issuerEl) issuerEl.innerHTML = `<strong>Issuer:</strong> ${cert.issuer} &bull; <strong>Date:</strong> ${cert.date || 'Verified'}`;
    if (descEl) descEl.textContent = cert.description || '';
    if (certIdEl) certIdEl.textContent = cert.certId ? `Credential ID: ${cert.certId}` : '';

    if (downloadLinkEl) {
      downloadLinkEl.href = cert.fileUrl || cert.image;
    }

    if (verifyLinkEl) {
      if (cert.verifyUrl) {
        verifyLinkEl.href = cert.verifyUrl;
        verifyLinkEl.style.display = 'inline-flex';
      } else {
        verifyLinkEl.style.display = 'none';
      }
    }

    if (mediaContainer) {
      const isPdf = (cert.fileUrl && cert.fileUrl.endsWith('.pdf')) && (!cert.image || cert.image === '');
      if (cert.image && cert.image.trim() !== '') {
        mediaContainer.innerHTML = `<img src="${cert.image}" alt="${cert.title}" style="max-height: 58vh; max-width: 100%; object-fit: contain;" />`;
      } else if (cert.fileUrl) {
        mediaContainer.innerHTML = `<iframe src="${cert.fileUrl}" type="application/pdf" style="width: 100%; height: 58vh; border: none;"></iframe>`;
      }
    }
  }

  function nextCert() {
    if (activeCertificates.length === 0) return;
    currentCertIndex = (currentCertIndex + 1) % activeCertificates.length;
    displayCertInModal(activeCertificates[currentCertIndex]);
  }

  function prevCert() {
    if (activeCertificates.length === 0) return;
    currentCertIndex = (currentCertIndex - 1 + activeCertificates.length) % activeCertificates.length;
    displayCertInModal(activeCertificates[currentCertIndex]);
  }

  if (certNextBtn) certNextBtn.addEventListener('click', nextCert);
  if (certPrevBtn) certPrevBtn.addEventListener('click', prevCert);

  function closeCertModal() {
    if (certModal) certModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
  if (certBackdrop) certBackdrop.addEventListener('click', closeCertModal);

  // Resume Modal Handlers
  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModal) resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeResumeModal() {
    if (resumeModal) resumeModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (resumeModalClose) resumeModalClose.addEventListener('click', closeResumeModal);
  if (resumeBackdrop) resumeBackdrop.addEventListener('click', closeResumeModal);

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCertModal();
      closeResumeModal();
    } else if (certModal && certModal.classList.contains('active')) {
      if (e.key === 'ArrowRight') nextCert();
      if (e.key === 'ArrowLeft') prevCert();
    }
  });
}

/* ================= 7. Contact Form ================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formAlert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const subject = document.getElementById('formSubject').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !message) {
      showAlert('Please fill in all required fields.', 'error');
      return;
    }

    // Compose mailto as instant native backup
    const mailtoUrl = `mailto:sr5956145@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact from ' + name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    showAlert('Thank you! Launching your email client to send message to Sourabh...', 'success');
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 600);
  });

  function showAlert(text, type) {
    if (!alertBox) return;
    alertBox.textContent = text;
    alertBox.style.display = 'block';
    alertBox.style.padding = '0.75rem 1rem';
    alertBox.style.borderRadius = '8px';
    alertBox.style.marginBottom = '1rem';
    alertBox.style.fontSize = '0.9rem';
    alertBox.style.fontWeight = '600';

    if (type === 'error') {
      alertBox.style.background = 'rgba(239, 68, 68, 0.15)';
      alertBox.style.color = '#ef4444';
      alertBox.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    } else {
      alertBox.style.background = 'rgba(16, 185, 129, 0.15)';
      alertBox.style.color = '#10b981';
      alertBox.style.border = '1px solid rgba(16, 185, 129, 0.3)';
    }

    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 6000);
  }
}

/* ================= 8. Back to Top Button ================= */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================= 9. Lightweight Scroll Animation Fallback ================= */
function initAosFallback() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section, .stat-item, .project-card, .cert-card, .edu-card').forEach(el => {
    observer.observe(el);
  });
}
