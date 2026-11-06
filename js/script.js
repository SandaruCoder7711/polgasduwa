/* ==========================================================================
   POLGASDUWA ARANYA SENASANA - INTERACTIVE JAVASCRIPT
   Slider, Mobile Navigation, Gallery Lightbox, Modals & Dynamic Features
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  
  // --------------------------------------------------------------------------
  // 1. HERO SLIDER (Slide Show)
  // --------------------------------------------------------------------------
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 6000; // 6 seconds per slide

  function showSlide(index) {
    if (!slides.length) return;
    
    // Wrap around
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
        const img = slide.querySelector('.slide-bg-img');
        if (img) {
          img.classList.remove('ken-burns');
          void img.offsetWidth; // trigger reflow
          img.classList.add('ken-burns');
        }
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, slideDuration);
  }

  function pauseSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    showSlide(0);
    startSlideShow();

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startSlideShow();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startSlideShow();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        startSlideShow();
      });
    });

    const sliderContainer = document.querySelector('.hero-slider-section');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', pauseSlideShow);
      sliderContainer.addEventListener('mouseleave', startSlideShow);

      // Touch / Swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
          showSlide(currentSlide + 1);
          startSlideShow();
        } else if (touchEndX - touchStartX > 50) {
          showSlide(currentSlide - 1);
          startSlideShow();
        }
      }, { passive: true });
    }
  }

  // --------------------------------------------------------------------------
  // 2. STICKY NAVBAR & SCROLL BEHAVIOR
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;

    // Sticky Nav
    if (header) {
      if (scrollY > 150) {
        header.classList.add('sticky-active');
      } else {
        header.classList.remove('sticky-active');
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER & DROPDOWN TOGGLE
  // --------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-navigation');
  const dropdownParents = document.querySelectorAll('.nav-item.has-dropdown');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function () {
      mainNav.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (mainNav.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target) && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // Mobile accordion for dropdowns
  dropdownParents.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 820) {
          e.preventDefault();
          item.classList.toggle('open-dropdown');
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 4. GALLERY FILTERING & LIGHTBOX MODAL
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  // Filter gallery items
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filterValue = this.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.classList.add('animate-fade-in-up');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      const caption = this.querySelector('.gallery-overlay h5');
      if (lightboxModal && lightboxImg && img) {
        lightboxImg.src = img.src;
        if (lightboxCaption && caption) {
          lightboxCaption.textContent = caption.textContent;
        }
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close Lightbox
  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', function () {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    lightboxModal.addEventListener('click', function (e) {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. SEARCH MODAL
  // --------------------------------------------------------------------------
  const searchTriggers = document.querySelectorAll('.btn-search-trigger');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  searchTriggers.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (searchModal) {
        searchModal.classList.add('active');
        if (searchInput) searchInput.focus();
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (searchClose && searchModal) {
    searchClose.addEventListener('click', function () {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    searchModal.addEventListener('click', function (e) {
      if (e.target === searchModal) {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Escape key closes modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      }
      if (searchModal && searchModal.classList.contains('active')) {
        searchModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // --------------------------------------------------------------------------
  // 6. CONTACT FORM SUBMISSION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('hermitageContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Inquiry...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent with Blessings';
        submitBtn.classList.remove('btn-primary');
        submitBtn.classList.add('btn-gold');

        alert('තෙරුවන් සරණයි! Thank you for reaching out to Polgasduwa Aranya Senasana. Your message has been received with reverent gratitude. The resident Sangha coordinator will reply shortly.');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.add('btn-primary');
          submitBtn.classList.remove('btn-gold');
        }, 4000);
      }, 1000);
    });
  }

  // --------------------------------------------------------------------------
  // 7. ANIMATED NUMBER COUNTERS
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-num');
  let counted = false;

  function countUp() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target') || stat.textContent, 10);
      const suffix = stat.getAttribute('data-suffix') || '+';
      let current = 0;
      const step = Math.ceil(target / 40);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          stat.textContent = target + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = current + suffix;
        }
      }, 35);
    });
  }

  const statsSection = document.querySelector('.dev-stats-grid');
  if (statsSection) {
    window.addEventListener('scroll', function () {
      if (!counted) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
          countUp();
          counted = true;
        }
      }
    });
  }

});
