(function () {
  'use strict';

  // ========== Smooth scroll по клику на навигацию ==========
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      var target = document.querySelector(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    });
  });

  // ========== Гамбургер и мобильное меню ==========
  var burgerBtn = document.getElementById('burgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuOverlay = document.getElementById('menuOverlay');

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    menuOverlay.classList.add('is-visible');
    burgerBtn.classList.add('is-active');
    burgerBtn.setAttribute('aria-label', 'Закрыть меню');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    menuOverlay.classList.remove('is-visible');
    burgerBtn.classList.remove('is-active');
    burgerBtn.setAttribute('aria-label', 'Открыть меню');
    document.body.style.overflow = '';
  }

  burgerBtn.addEventListener('click', function () {
    if (mobileMenu.classList.contains('is-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  menuOverlay.addEventListener('click', closeMobileMenu);

  function isOutsideMenu(target) {
    return !mobileMenu.contains(target) && target !== burgerBtn && !burgerBtn.contains(target);
  }

  document.addEventListener('click', function (e) {
    if (mobileMenu.classList.contains('is-open') && isOutsideMenu(e.target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener('touchend', function (e) {
    if (mobileMenu.classList.contains('is-open') && isOutsideMenu(e.target)) {
      closeMobileMenu();
    }
  }, { passive: true });

  // ========== Scroll-reveal анимация (Intersection Observer) ==========
  var revealElements = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function (el) {
    observer.observe(el);
  });

  // ========== Слайдер отзывов: пагинация страницами (9 отзывов, 3 страницы) ==========
  var track = document.getElementById('reviewsTrack');
  var dotsContainer = document.getElementById('reviewsDots');
  var totalSlides = 9;
  var totalPages = 3;
  var currentPage = 0;

  function getSlidesPerView() {
    var w = window.innerWidth;
    if (w >= 1000) return 3;
    if (w >= 768) return 2;
    return 1;
  }

  function goToPage(page) {
    currentPage = page;
    var slidesPerView = getSlidesPerView();
    var offsetPercent = currentPage * (300 / slidesPerView);
    track.style.transform = 'translateX(-' + offsetPercent + '%)';

    var dots = dotsContainer.querySelectorAll('.reviews__dot');
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.toggle('is-active', d === currentPage);
    }
  }

  function nextPage() {
    var next = currentPage >= totalPages - 1 ? 0 : currentPage + 1;
    goToPage(next);
  }

  function prevPage() {
    var prev = currentPage <= 0 ? totalPages - 1 : currentPage - 1;
    goToPage(prev);
  }

  for (var i = 0; i < totalPages; i++) {
    (function (idx) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'reviews__dot' + (idx === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Страница ' + (idx + 1));
      dot.addEventListener('click', function () { goToPage(idx); });
      dotsContainer.appendChild(dot);
    })(i);
  }

  document.querySelector('.reviews__arrow--prev').addEventListener('click', prevPage);
  document.querySelector('.reviews__arrow--next').addEventListener('click', nextPage);

  window.addEventListener('resize', function () { goToPage(currentPage); });

  goToPage(0);

  // ========== Форма бронирования: валидация и имитация отправки ==========
  var bookingForm = document.getElementById('bookingForm');
  var bookingInputs = bookingForm.querySelectorAll('.booking__input, .booking__select');

  function validatePhone(value) {
    var digits = value.replace(/\D/g, '');
    return digits.length >= 10;
  }

  function clearErrors() {
    bookingInputs.forEach(function (input) {
      input.classList.remove('is-error');
    });
  }

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    var name = document.getElementById('bookingName').value.trim();
    var phone = document.getElementById('bookingPhone').value.trim();
    var date = document.getElementById('bookingDate').value;
    var time = document.getElementById('bookingTime').value;
    var guests = document.getElementById('bookingGuests').value;
    var valid = true;

    if (!name) {
      document.getElementById('bookingName').classList.add('is-error');
      valid = false;
    }
    if (!phone || !validatePhone(phone)) {
      document.getElementById('bookingPhone').classList.add('is-error');
      valid = false;
    }
    if (!date) {
      document.getElementById('bookingDate').classList.add('is-error');
      valid = false;
    }
    if (!time) {
      document.getElementById('bookingTime').classList.add('is-error');
      valid = false;
    }
    if (!guests) {
      document.getElementById('bookingGuests').classList.add('is-error');
      valid = false;
    }

    if (valid) {
      alert('Заявка отправлена');
      bookingForm.reset();
    }
  });
})();
