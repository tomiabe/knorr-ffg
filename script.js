const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const toast = document.querySelector('[data-toast]');
const interestForm = document.querySelector('[data-interest-form]');
const videoTriggers = document.querySelectorAll('[data-video-id]');
const submitButton = interestForm?.querySelector('[data-submit-button]');

menuToggle?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  menuToggle.innerHTML = `<i class="ph ${isOpen ? 'ph-x' : 'ph-list'}" aria-hidden="true"></i>`;
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open menu');
    if (menuToggle) menuToggle.innerHTML = '<i class="ph ph-list" aria-hidden="true"></i>';
  });
});

let toastTimer;
function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

interestForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!interestForm.checkValidity()) {
    interestForm.reportValidity();
    return;
  }
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.innerHTML = 'Saving your place... <i class="ph ph-spinner" aria-hidden="true"></i>';
  }
  const name = new FormData(interestForm).get('name')?.toString().trim();
  window.setTimeout(() => {
    showToast(name ? `Thanks, ${name}. Your spot is saved for the next step.` : 'Thanks. Your spot is saved for the next step.');
    interestForm.reset();
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.setAttribute('aria-busy', 'false');
      submitButton.innerHTML = "Save my place";
    }
  }, 420);
});

videoTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const videoId = trigger.dataset.videoId;
    const frame = trigger.closest('[data-video-frame]');
    if (!videoId || !frame) return;
    frame.setAttribute('aria-busy', 'true');
    frame.setAttribute('role', 'status');
    frame.setAttribute('aria-live', 'polite');
    frame.classList.add('is-loading');
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" title="Knorr campaign video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    frame.querySelector('iframe')?.addEventListener('load', () => {
      frame.setAttribute('aria-busy', 'false');
      frame.removeAttribute('role');
      frame.removeAttribute('aria-live');
      frame.classList.remove('is-loading');
    }, { once: true });
  });
});

document.querySelector('[data-scroll-top]')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
