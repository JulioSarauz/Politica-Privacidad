document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  setTimeout(function() {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
  createParticles();
  initScrollReveal();
  initNavbar();
  initCounters();
  initCompetenceBars();
});

function loadTheme() {
  var saved = localStorage.getItem('sz-theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcons(true);
  }
}

function toggleTheme() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('sz-theme', 'light');
    updateThemeIcons(false);
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('sz-theme', 'dark');
    updateThemeIcons(true);
  }
}

function updateThemeIcons(isDark) {
  var desktopBtn = document.querySelector('#themeToggle i');
  var mobileIcon = document.getElementById('mobileThemeIcon');
  var mobileText = document.getElementById('mobileThemeText');
  if (desktopBtn) {
    desktopBtn.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }
  if (mobileIcon) {
    mobileIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }
  if (mobileText) {
    mobileText.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
  }
}

function createParticles() {
  var container = document.getElementById('particles');
  for (var i = 0; i < 30; i++) {
    var particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (6 + Math.random() * 6) + 's';
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
}

function initScrollReveal() {
  var reveals = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(function(el) {
    observer.observe(el);
  });
}

function initNavbar() {
  var navbar = document.getElementById('navbar');
  var links = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    var current = '';
    sections.forEach(function(section) {
      var sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    links.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  });
}

function initCounters() {
  var counters = document.querySelectorAll('.stat-number');
  var observed = false;
  var observer = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !observed) {
      observed = true;
      counters.forEach(function(counter) {
        var target = parseInt(counter.getAttribute('data-count'));
        var duration = 2000;
        var startTime = null;
        function animate(currentTime) {
          if (!startTime) startTime = currentTime;
          var progress = Math.min((currentTime - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.floor(eased * target);
          if (target >= 1000) {
            counter.textContent = current.toLocaleString('es-EC') + '+';
          } else {
            counter.textContent = current + '+';
          }
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }
        requestAnimationFrame(animate);
      });
    }
  }, { threshold: 0.5 });
  if (counters.length > 0) {
    observer.observe(counters[0].closest('.hero-stats'));
  }
}

function initCompetenceBars() {
  var bars = document.querySelectorAll('.competence-bar');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var bar = entry.target;
        bar.style.setProperty('--bar-width', bar.getAttribute('data-width'));
        bar.classList.add('animated');
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(function(bar) {
    observer.observe(bar);
  });
}

function toggleMenu() {
  var menu = document.getElementById('mobileMenu');
  var hamburger = document.getElementById('hamburger');
  menu.classList.toggle('open');
  hamburger.classList.toggle('open');
}

function downloadCV() {
  var link = document.createElement('a');
  link.href = '/cv-saby/saby_cv.pdf';
  link.download = 'CV_Sabina_Zhiminaicela.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function openModal() {
  var modal = document.getElementById('modalOverlay');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  var modal = document.getElementById('modalOverlay');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function switchTab(tabName, btn) {
  document.querySelectorAll('.tab-content').forEach(function(tab) {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  document.getElementById('tab-' + tabName).classList.add('active');
  btn.classList.add('active');
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});
