import '../scss/main.scss';

const headerNav = document.querySelector('[data-js="header-nav"]');
const featuresControl = document.querySelector('[data-js="features-control"]');
const accordionsContainer = document.querySelector('[data-js="accordions-container"]');
const contactForm = document.querySelector('[data-js="contact-form"]');
const resizeObserver = new ResizeObserver(handleAccordionDropdownResize);

headerNav.addEventListener('click', handleHeaderNavClick);
window.matchMedia('(min-width: 768px)').onchange = checkLargeScreenChange;
featuresControl.addEventListener('click', handleFeaturesControlClick);
accordionsContainer.addEventListener('click', handleAccordionsClick);
contactForm.addEventListener('submit', handleContactFormSubmit);

function handleHeaderNavClick({ target }) {
  switch (target.dataset.js) {
    case 'guide-toggle':
    case 'guide-link':
      toggleMobileGuide();
      return;
  }
}

function toggleMobileGuide() {
  const guide = document.querySelector('[data-js="guide"]');
  const guideToggle = document.querySelector('[data-js="guide-toggle"]');
  const isActive = hasActive(headerNav);

  document.body.classList.toggle('no-scroll');
  headerNav.classList.toggle('active');
  guide.classList.toggle('slide-in');
  guideToggle.setAttribute('aria-pressed', !isActive);
  guideToggle.setAttribute('aria-expanded', !isActive);

  if (isActive) {
    guide.classList.add('slide-out');
    guide.addEventListener('animationend', () => {
      guide.classList.remove('slide-out');
    });
  } else {
    window.scroll({ top: 0 });
  }
}

function hasActive(element) {
  return element.classList.contains('active');
}

function checkLargeScreenChange({ matches }) {
  if (matches && hasActive(headerNav)) {
    toggleMobileGuide();
  }
}

function handleFeaturesControlClick({ target }) {
  if (target.matches('[data-control-button]')) {
    changeFeatureTab(target);
  }
}

function changeFeatureTab(button) {
  const selectedButton = document.querySelector('[data-control-button].selected');

  if (button === selectedButton) return;

  button.classList.add('selected');
  button.setAttribute('aria-pressed', true);
  button.setAttribute('aria-expanded', true);
  selectedButton.classList.remove('selected');
  selectedButton.setAttribute('aria-pressed', false);
  selectedButton.setAttribute('aria-expanded', false);

  const currentIndex = selectedButton.dataset.controlButton;
  const nextIndex = button.dataset.controlButton;
  const currentTab = document.querySelector(`[data-feature-tab="${currentIndex}"]`);
  const nextTab = document.querySelector(`[data-feature-tab="${nextIndex}"]`);

  hideCurrentFeatureTab(currentTab);
  showNextFeatureTab(nextTab);
}

function hideCurrentFeatureTab(currentTab) {
  currentTab.classList.add('slide-out');
  currentTab.setAttribute('aria-hidden', true);

  currentTab.addEventListener(
    'animationend',
    () => {
      currentTab.classList.add('hidden');
      currentTab.classList.remove('slide-out');
    },
    { once: true }
  );
}

function showNextFeatureTab(nextTab) {
  nextTab.classList.remove('hidden');
  nextTab.classList.add('slide-in');
  nextTab.setAttribute('aria-hidden', false);

  nextTab.addEventListener(
    'animationend',
    () => {
      nextTab.classList.remove('slide-in');
    },
    { once: true }
  );
}

function handleAccordionsClick({ target }) {
  if (target.matches('[data-js="accordion-toggle"]')) {
    toggleAccordionDropdown(target);
  }
}

function toggleAccordionDropdown(button) {
  const accordion = button.closest('[data-js="accordion"]');
  const dropdown = accordion.querySelector('[data-js="accordion-dropdown"]');
  const dropdownContent = dropdown.firstElementChild;
  const isActive = hasActive(button);

  button.classList.toggle('active');

  if (isActive) {
    resizeObserver.unobserve(dropdownContent);
    setAccordionDropdownHeight(dropdown, 0);
  } else {
    resizeObserver.observe(dropdownContent);
  }

  button.setAttribute('aria-pressed', !isActive);
  button.setAttribute('aria-expanded', !isActive);
  dropdown.setAttribute('aria-hidden', isActive);
}

function handleAccordionDropdownResize(event) {
  event.forEach(({ target, borderBoxSize }) => {
    const dropdown = target.closest('[data-js="accordion-dropdown"]');
    const { blockSize } = borderBoxSize[0];

    setAccordionDropdownHeight(dropdown, blockSize);
  });
}

function setAccordionDropdownHeight(dropdown, height) {
  dropdown.style.height = `${height}px`;
}

function handleContactFormSubmit(event) {
  event.preventDefault();
  validateEmail();
}

function validateEmail() {
  const inputEmail = document.querySelector('[data-js="input-email"]');
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const isValid = pattern.test(inputEmail.value);
  const textError = document.querySelector('[data-js="email-error"]');

  inputEmail.setAttribute('aria-invalid', !isValid);
  textError.setAttribute('aria-live', isValid ? 'off' : 'assertive');

  if (isValid) {
    const labelEmail = inputEmail.parentElement;

    contactForm.classList.remove('invalid');
    labelEmail.classList.add('submitted');
    inputEmail.value = '';

    labelEmail.addEventListener(
      'animationend',
      () => {
        labelEmail.classList.remove('submitted');
      },
      { once: true }
    );
  } else {
    contactForm.classList.add('invalid');
  }
}
