// Shared navigation, filters, forms, FAQ accordions, and gallery lightbox.
document.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.querySelector('.home-hero-video');
  if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.pause();
    heroVideo.removeAttribute('autoplay');
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const open = navigation.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
  }

  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const buttons = [...group.querySelectorAll('[data-filter]')];
    const container = document.querySelector(group.dataset.filterTarget);
    if (!container) return;
    const items = [...container.querySelectorAll('[data-category]')];
    const search = group.dataset.searchTarget
      ? document.querySelector(group.dataset.searchTarget)
      : null;
    let activeFilter = 'all';
    const update = () => {
      const term = search ? search.value.trim().toLowerCase() : '';
      items.forEach((item) => {
        const categories = (item.dataset.category || '').split(/\s+/);
        const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
        const matchesSearch = !term || item.textContent.toLowerCase().includes(term) ||
          [...item.querySelectorAll('img[alt]')].some((image) => image.alt.toLowerCase().includes(term));
        item.hidden = !(matchesFilter && matchesSearch);
      });
    };
    buttons.forEach((button) => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      buttons.forEach((other) => {
        const selected = other === button;
        other.classList.toggle('is-active', selected);
        other.setAttribute('aria-pressed', String(selected));
      });
      update();
    }));
    if (search) search.addEventListener('input', update);
  });

  document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (panel) panel.hidden = expanded;
      const icon = trigger.querySelector('[aria-hidden="true"]');
      if (icon) icon.textContent = expanded ? '+' : '−';
    });
  });

  document.querySelectorAll('.demo-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const message = form.querySelector('.form-message') || form.querySelector('.success-message');
      if (message) {
        message.textContent = form.dataset.success || 'Thank you! This demo form was submitted successfully. No information has been stored.';
        message.className = 'success-message';
      }
      form.reset();
    });
  });

  document.querySelectorAll('[data-package-select]').forEach((button) => {
    button.addEventListener('click', () => {
      const select = document.querySelector('#package-choice');
      const form = document.querySelector('#booking-form');
      if (select) select.value = button.dataset.packageSelect;
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const images = [...document.querySelectorAll('.gallery-item img')];
    const largeImage = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.lightbox-caption');
    let currentIndex = 0;
    const show = (index) => {
      currentIndex = (index + images.length) % images.length;
      const selected = images[currentIndex];
      largeImage.src = selected.dataset.large || selected.src;
      largeImage.alt = selected.alt;
      caption.textContent = selected.closest('figure').querySelector('figcaption').textContent;
    };
    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        show(index);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('.lightbox-close').focus();
      });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(currentIndex - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(currentIndex + 1));
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) close(); });
    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(currentIndex - 1);
      if (event.key === 'ArrowRight') show(currentIndex + 1);
    });
  }
});
