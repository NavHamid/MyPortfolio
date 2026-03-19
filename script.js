document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.getElementById('navbarNav');
  const togglerIcon = document.querySelector('.toggler-icon i');
  const navLinks = document.querySelectorAll('.navbar .nav-link');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const sections = document.querySelectorAll('section');
  const typedText = document.getElementById('typed-text');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const contactForm = document.getElementById('contactForm');

  // Utility function for debouncing
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Type animation
  function startHeroTypewriter() {
    if (!typedText) return;

    const texts = ['Interactive UIs', 'Scalable Backends', 'Modern Web Apps'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentText = texts[textIndex];

      if (isDeleting) {
        typedText.textContent = currentText.substring(0, charIndex--);
      } else {
        typedText.textContent = currentText.substring(0, charIndex++);
      }

      let speed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentText.length) {
        speed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        speed = 500;
      }

      setTimeout(type, speed);
    }

    type();
  }

  // Scroll handling
  function handleScroll() {
    const scrollY = window.scrollY;

    scrollTopBtn?.classList.toggle('show-btn', scrollY > 100);
    navbar?.classList.toggle('scrolled', scrollY > 100);

    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - navbar.offsetHeight - 80;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + currentSection
      );
    });
  }

  // Mobile navigation
  function initNavbar() {
    navbarToggler?.addEventListener('click', () => {
      const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
      togglerIcon.classList.toggle('bi-list', !isExpanded);
      togglerIcon.classList.toggle('bi-x', isExpanded);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse?.classList.contains('show')) {
          // Check if bootstrap is loaded
          if (typeof bootstrap !== 'undefined') {
            new bootstrap.Collapse(navbarCollapse).hide();
          } else {
            // Fallback
            navbarCollapse.classList.remove('show');
          }
          togglerIcon?.classList.replace('bi-x', 'bi-list');
        }
      });
    });
  }

  // Scroll to top
  function initScrollTop() {
    scrollTopBtn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Optimized scroll listener with requestAnimationFrame
    let scrollTimeout;
    window.addEventListener(
      'scroll',
      () => {
        if (scrollTimeout) {
          window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
      },
      { passive: true }
    );
  }

  // Scroll reveal animations
  function initAnimations() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-animate');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document
      .querySelectorAll('[scroll-animate]')
      .forEach(el => observer.observe(el));
  }

  // Theme toggle
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle?.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.classList.remove('bi-moon-fill');
      themeIcon.classList.add('bi-sun-fill');
    } else {
      themeIcon.classList.remove('bi-sun-fill');
      themeIcon.classList.add('bi-moon-fill');
    }
  }

  function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', async e => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const formAction = 'https://formsubmit.co/ajax/hamid24@navgurukul.org';

      try {
        const response = await fetch(formAction, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();

        if (response.ok) {
          alert('✅ Message sent successfully!');
          e.target.reset();
        } else {
          throw new Error(result.message || 'Failed to send');
        }
      } catch (error) {
        alert('❌ Error: ' + error.message);
      }
    });
  }
  function setCurrentYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  startHeroTypewriter();
  initNavbar();
  initScrollTop();
  initAnimations();
  initTheme();
  initContactForm();
  setCurrentYear();
});
