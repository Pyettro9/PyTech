// ===================== ICONS =====================
lucide.createIcons();

// ===================== HEADER SCROLL =====================
const header = document.getElementById('header');
const onScroll = () => {
  if (window.scrollY > 20) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===================== MOBILE MENU =====================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});
mobileMenu.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'))
);

// ===================== SCROLL REVEAL =====================
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // pequeno stagger para itens próximos
        setTimeout(() => entry.target.classList.add('revealed'), (i % 4) * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach((el) => revealObserver.observe(el));

// ===================== CHART ANIMATION =====================
const chart = document.querySelector('.chart');
if (chart) {
  const chartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          chart.classList.add('animate');
          chartObserver.unobserve(chart);
        }
      });
    },
    { threshold: 0.4 }
  );
  chartObserver.observe(chart);
}

// ===================== FAQ ACCORDION =====================
document.querySelectorAll('.faq-item').forEach((item) => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ===================== TESTIMONIALS CAROUSEL =====================
const track = document.getElementById('track');
const slides = Array.from(track.children);
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('dots');

let index = 0;

function slidesPerView() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function maxIndex() {
  return Math.max(0, slides.length - slidesPerView());
}

function buildDots() {
  dotsContainer.innerHTML = '';
  for (let i = 0; i <= maxIndex(); i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === index ? ' active' : '');
    dot.setAttribute('aria-label', 'Ir para depoimento ' + (i + 1));
    dot.addEventListener('click', () => {
      index = i;
      update();
    });
    dotsContainer.appendChild(dot);
  }
}

function update() {
  index = Math.min(index, maxIndex());
  const slideWidth = 100 / slidesPerView();
  track.style.transform = `translateX(-${index * slideWidth}%)`;
  dotsContainer.querySelectorAll('.dot').forEach((d, i) =>
    d.classList.toggle('active', i === index)
  );
}

nextBtn.addEventListener('click', () => {
  index = index >= maxIndex() ? 0 : index + 1;
  update();
});
prevBtn.addEventListener('click', () => {
  index = index <= 0 ? maxIndex() : index - 1;
  update();
});

// Autoplay
let autoplay = setInterval(() => {
  index = index >= maxIndex() ? 0 : index + 1;
  update();
}, 5000);

const carousel = document.getElementById('carousel');
[carousel, prevBtn, nextBtn].forEach((el) => {
  el.addEventListener('mouseenter', () => clearInterval(autoplay));
  el.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    }, 5000);
  });
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    buildDots();
    update();
  }, 150);
});

buildDots();
update();
