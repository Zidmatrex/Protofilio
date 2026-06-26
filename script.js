const loader = document.querySelector('.page-loader');
const backToTopButton = document.querySelector('.back-to-top');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const typingText = document.querySelector('.typing-text');
const year = document.getElementById('year');
const resumeLinks = [document.getElementById('resumeLink'), document.getElementById('resumeSectionLink')];
const profileImage = document.getElementById('profileImage');

const typingWords = ['qualified leads', 'pipeline momentum', 'trust-based conversations', 'valuable opportunities'];
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const current = typingWords[typingIndex];
  typingText.textContent = current.slice(0, charIndex);

  if (!isDeleting && charIndex < current.length) {
    charIndex += 1;
    setTimeout(typeLoop, 65);
  } else if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 40);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      typingIndex = (typingIndex + 1) % typingWords.length;
    }
    setTimeout(typeLoop, 900);
  }
}

async function updateResumeLink() {
  const candidates = ['assets/cv.pdf', 'assets/resume.pdf', 'assets/CV.pdf'];
  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { method: 'HEAD' });
      if (response.ok) {
        resumeLinks.forEach((link) => {
          if (link) {
            link.href = candidate;
          }
        });
        return;
      }
    } catch (error) {
      // Fallback to placeholder link.
    }
  }
}

async function updateProfileImage() {
  const candidates = ['assets/profile.jpg', 'assets/profile.jpeg', 'assets/profile.webp', 'assets/profile.png'];
  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { method: 'HEAD' });
      if (response.ok) {
        profileImage.src = candidate;
        return;
      }
    } catch (error) {
      // Keep the placeholder image.
    }
  }
}

function revealElements() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (entry.target.querySelector('.skill-bar span')) {
            entry.target.querySelectorAll('.skill-bar span').forEach((bar) => {
              const width = bar.dataset.width;
              if (!bar.style.width) {
                bar.style.width = width;
              }
            });
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  reveals.forEach((item) => observer.observe(item));
}

function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = Number(el.dataset.target || 0);
          const duration = 1400;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = `${value}${target === 100 ? '+' : ''}`;
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = `${target}${target === 100 ? '+' : ''}`;
            }
          };

          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.7 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function initNavigation() {
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('is-open');
  });

  document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

function initBackToTop() {
  const toggleVisibility = () => {
    if (window.scrollY > 520) {
      backToTopButton.classList.add('is-visible');
    } else {
      backToTopButton.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  backToTopButton?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  toggleVisibility();
}

function initFaq() {
  document.querySelectorAll('.faq-item summary').forEach((summary) => {
    summary.addEventListener('click', () => {
      const details = summary.parentElement;
      document.querySelectorAll('.faq-item').forEach((item) => {
        if (item !== details) {
          item.removeAttribute('open');
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  year.textContent = new Date().getFullYear();
  initNavigation();
  initBackToTop();
  initFaq();
  revealElements();
  animateCounters();
  typeLoop();
  updateResumeLink();
  updateProfileImage();

  window.setTimeout(() => {
    loader?.classList.add('is-hidden');
  }, 700);
});
