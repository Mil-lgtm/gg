document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Rok w stopce ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobilne ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Przycisk "do góry" ---------- */
  const toTopBtn = document.getElementById('to-top');
  if (toTopBtn) {
    window.addEventListener('scroll', () => {
      toTopBtn.classList.toggle('visible', window.scrollY > 600);
    });
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Animacja wjazdu elementów przy scrollu ---------- */
  const revealTargets = document.querySelectorAll(
    '.service-card, .process-step, .portfolio-card, .testimonial-card, .about-frame, .about-copy'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));

  /* ---------- Formularz kontaktowy (AJAX -> contact.php) ---------- */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      statusEl.textContent = '';
      statusEl.className = 'form-status';

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        statusEl.textContent = 'Wypełnij imię, e-mail i opis projektu.';
        statusEl.className = 'form-status error';
        return;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        statusEl.textContent = 'Podaj poprawny adres e-mail.';
        statusEl.className = 'form-status error';
        return;
      }

      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wysyłanie...';

      // ---------------------------------------------------------------
      // FORMSPREE — darmowy serwis do obsługi formularzy bez backendu.
      // Działa na GitHub Pages (hosting statyczny, bez PHP).
      //
      // KONFIGURACJA (zrób to raz):
      // 1. Wejdź na https://formspree.io i załóż darmowe konto.
      // 2. Utwórz nowy formularz, podaj e-mail, na który mają trafiać zgłoszenia.
      // 3. Formspree poda Ci adres typu: https://formspree.io/f/abcd1234
      // 4. Wklej go poniżej w miejsce FORMSPREE_ENDPOINT.
      // 5. Wyślij testowe zgłoszenie ze strony i potwierdź adres e-mail
      //    klikając link, który przyjdzie od Formspree (jednorazowo).
      // ---------------------------------------------------------------
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwvdqbno'; // <-- ZMIEŃ TO

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            phone: form.phone.value.trim(),
            service: form.service.value,
            message,
            _subject: `[GRANBUD] Nowe zapytanie ofertowe — ${name}`
          })
        });

        if (response.ok) {
          statusEl.textContent = 'Dziękujemy! Odpowiemy w ciągu jednego dnia roboczego.';
          statusEl.className = 'form-status success';
          form.reset();
        } else {
          statusEl.textContent = 'Coś poszło nie tak. Spróbuj ponownie lub zadzwoń do nas.';
          statusEl.className = 'form-status error';
        }
      } catch (err) {
        statusEl.textContent = 'Brak połączenia z serwerem. Zadzwoń: +48 12 345 67 89.';
        statusEl.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

});
