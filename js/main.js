/* ============================
   PRAGYAN EDUSEC — Main JavaScript
   Animations, Interactions, Effects
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initMobileMenu();
  initCounters();
  // initParticles(); // Removing circular particles
  initCircuitBackground();
  initContactForm();
});

/* ============================
   Navbar Scroll Effect
   ============================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* ============================
   Scroll Reveal Animations
   ============================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');

  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve so animation replays if scrolled back
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ============================
   Mobile Menu Toggle
   ============================ */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (!toggle || !navLinks) return;

  function openMenu() {
    toggle.classList.add('active');
    navLinks.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ============================
   Animated Counters
   ============================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const steps = 60;
  const stepTime = duration / steps;
  let current = 0;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, stepTime);
}

/* ============================
   Particle Background Effect
   ============================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 8000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ============================
   Contact Form Validation
   ============================ */
function initContactForm() {
  // Use 'message-form' id (section anchor uses 'contact-section' to avoid id conflict)
  const form = document.getElementById('message-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Validate name
    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      valid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      showError(email, 'Please enter a valid email');
      valid = false;
    }

    // Validate message
    if (!message.value.trim()) {
      showError(message, 'Please enter your message');
      valid = false;
    }

    if (valid) {
      // Show loading state
      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="loading-spinner"></span> Sending...';
      btn.disabled = true;

      // Prepare form data
      const formData = new FormData(form);

      // 15-second timeout so button never stays stuck forever
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Send to backend
      fetch('api/contact.php', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })
      .then(response => {
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error('Server returned status ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        if (data.status === 'success') {
          btn.innerHTML = '✓ Message Sent!';
          btn.style.background = '#22c55e';
          form.reset();
        } else {
          btn.innerHTML = '✕ Error';
          btn.style.background = '#ef4444';
          alert(data.message || 'Something went wrong. Please try again.');
        }
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error('Form submit error:', error);
        btn.innerHTML = '✕ Failed to Send';
        btn.style.background = '#ef4444';
        if (error.name === 'AbortError') {
          alert('Request timed out. The server is taking too long. Please try again.');
        } else {
          alert('Could not connect to the server. Please check your internet connection and try again.');
        }
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      });
    }
  });

  function showError(input, message) {
    input.classList.add('error');
    input.style.borderColor = '#ef4444';
    const error = document.createElement('span');
    error.className = 'form-error';
    error.style.cssText = 'color:#ef4444;font-size:0.8rem;margin-top:4px;display:block;';
    error.textContent = message;
    input.parentElement.appendChild(error);
  }
}

/* ============================
   Smooth Scroll for Anchors
   ============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
