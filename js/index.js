/* Mobile menu */
initMobileMenu();

function initMobileMenu() {
  const menu = document.querySelector(".js-mobile-menu");
  const backdrop = document.querySelector(".mobile-menu__backdrop");
  const delay = 500;

  if (!menu || menu.dataset.initialized) return;
  menu.dataset.initialized = "true";

  const openBtns = document.querySelectorAll(".js-open-menu");
  const closeBtns = document.querySelectorAll(".js-close-menu");

  let showTimeout = null;

  const handleToggle = () => {
    const isOpen = menu.classList.contains("mobile-menu--active");

    clearTimeout(showTimeout);

    if (isOpen) {
      closeMenu(menu, openBtns);
    } else {
      openMenu(menu, openBtns);

      showTimeout = setTimeout(() => {
        menu.classList.add("mobile-menu--show");
      }, delay);
    }
  };

  openBtns.forEach((btn) => {
    btn.addEventListener("click", handleToggle);
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      clearTimeout(showTimeout);
      closeMenu(menu, openBtns);
    });
  });

  const submenuToggleBtns = document.querySelectorAll(".js-submenu-toggle");
  submenuToggleBtns.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const $item = toggle.closest(".mobile-menu__item--has-submenu");
      const $submenu = $item.querySelector(".mobile-menu__submenu");
      const isOpen = $item.classList.contains("is-open");

      // Закрыть все остальные
      document.querySelectorAll(".mobile-menu__item--has-submenu.is-open").forEach((el) => {
        const $s = el.querySelector(".mobile-menu__submenu");
        $s.style.maxHeight = $s.scrollHeight + "px";
        // Принудительный reflow чтобы transition сработал от текущего значения
        $s.getBoundingClientRect();
        $s.style.maxHeight = "0";
        el.classList.remove("is-open");
        el.querySelector(".js-submenu-toggle").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        $submenu.style.maxHeight = $submenu.scrollHeight + "px";
        $item.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      clearTimeout(showTimeout);
      closeMenu(menu, openBtns);
    });
  }
}

function openMenu(menu, openBtns) {
  menu.classList.add("mobile-menu--active");
  document.documentElement.classList.add("is-lock");
  openBtns.forEach((btn) => btn.classList.add("is-active"));
}

function closeMenu(menu, openBtns) {
  menu.classList.remove("mobile-menu--active");
  menu.classList.remove("mobile-menu--show");
  document.documentElement.classList.remove("is-lock");
  openBtns.forEach((btn) => btn.classList.remove("is-active"));
}

/* Partners */
document.addEventListener("DOMContentLoaded", function () {
  const partners = document.querySelector(".partners");
  if (!partners) {
    return;
  }

  const listsBox = partners.querySelector(".partners__lists");
  const lists = partners.querySelectorAll(".partners__list");
  if (lists.length === 0) return;

  const images = Array.from(listsBox.querySelectorAll("img"));
  if (images.length === 0) {
    track.classList.add("is-ready");
    return;
  }

  const promises = images.map(function (img) {
    if (img.complete && img.naturalWidth > 0) {
      return Promise.resolve();
    }

    return new Promise(function (resolve) {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    });
  });

  Promise.all(promises).then(function () {
    lists.forEach((list) => list.classList.add("is-ready"));
  });
});

/* Video */
const videoSections = document.querySelectorAll(".video");

videoSections.forEach((videoSection) => {
  const videoUrl = videoSection.dataset.src;
  if (!videoUrl) return;

  const button = videoSection.querySelector(".video__play-button");

  let video = null;
  let isCreated = false;

  button.addEventListener("click", () => {
    if (!isCreated) {
      video = createVideo(videoUrl);
      videoSection.append(video);
      isCreated = true;
    }

    videoSection.classList.add("is-active");

    video.play().catch((err) => {
      console.warn("Video play failed:", err);
    });
  });
});

function createVideo(url) {
  const video = document.createElement("video");
  video.classList.add("video__player");

  video.src = url;
  video.controls = true;
  video.playsInline = true;
  video.muted = true;
  video.preload = "metadata";

  return video;
}

/* Services */
const servicesSlider = new Swiper(".services__slider", {
  slidesPerView: "auto",
  spaceBetween: 8,
  speed: 400,

  breakpoints: {
    576: {
      enabled: false,
      spaceBetween: 0,
    },
  },
});

/* Selects */
function initSelects() {
  document.querySelectorAll(".select").forEach(($select) => {
    if ($select.dataset.initialized) return;

    const $value = $select.querySelector(".select__value");
    const $options = $select.querySelectorAll(".select__option");

    if (!$value || !$options.length) return;

    $options.forEach(($option) => {
      $option.addEventListener("click", () => {
        $value.textContent = $option.dataset.selectValue || $option.textContent.trim();
      });
    });

    $select.dataset.initialized = "true";
  });
}

document.addEventListener("DOMContentLoaded", initSelects, { once: true });

/* OS versions */
function initOsVersions() {
  document.querySelectorAll(".os-option").forEach(($osOption) => {
    if ($osOption.dataset.versionSelectInitialized) return;

    const $trigger = $osOption.querySelector(".os-option__version");
    const $value = $osOption.querySelector(".os-option__version-text");
    const $options = $osOption.querySelectorAll(".os-option__version-option");
    const $radio = $osOption.querySelector('.os-option__input[type="radio"]');

    if (!$trigger || !$value || !$options.length) return;

    $trigger.addEventListener("show.bs.dropdown", () => $osOption.classList.add("os-option--dropdown-open"));
    $trigger.addEventListener("hide.bs.dropdown", () => $osOption.classList.remove("os-option--dropdown-open"));

    $options.forEach(($option) => {
      $option.addEventListener("click", () => {
        $value.textContent = $option.dataset.osVersionValue || $option.textContent.trim();
        $options.forEach(($item) => $item.setAttribute("aria-pressed", "false"));
        $option.setAttribute("aria-pressed", "true");

        if ($radio && !$radio.checked) {
          $radio.checked = true;
          $radio.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    });

    $osOption.dataset.versionSelectInitialized = "true";
  });
}

document.addEventListener("DOMContentLoaded", initOsVersions, { once: true });

/* Adaptive order summary */
initAdaptiveOrderSummary();

function initAdaptiveOrderSummary() {
  const $summary = document.querySelector("[data-order-summary]");
  const $mobileSlot = document.querySelector("[data-order-summary-mobile]");
  const $modal = document.querySelector("#order-summary-modal");
  const $modalClose = $modal?.querySelector('[data-bs-dismiss="modal"]');
  const $mobileOrder = document.querySelector(".mobile-order");
  const $detailsButton = $mobileOrder?.querySelector(".mobile-order__details");
  const $desktopParent = $summary?.parentElement;
  const $desktopNextSibling = $summary?.nextElementSibling;

  if (
    !$summary ||
    !$mobileSlot ||
    !$modal ||
    !$modalClose ||
    !$mobileOrder ||
    !$detailsButton ||
    !$desktopParent ||
    $summary.dataset.adaptiveInitialized
  )
    return;

  const mobileMedia = window.matchMedia("(max-width: 991px)");
  let isModalOpening = false;

  const moveSummaryToDesktop = () => {
    if ($desktopNextSibling?.parentElement === $desktopParent) {
      $desktopParent.insertBefore($summary, $desktopNextSibling);
      return;
    }

    $desktopParent.append($summary);
  };

  const moveSummary = () => {
    if (mobileMedia.matches) {
      $mobileSlot.append($summary);
      return;
    }

    if ($modal.classList.contains("show")) {
      if (!isModalOpening) {
        $modalClose.click();
      }

      return;
    }

    moveSummaryToDesktop();
  };

  $modal.addEventListener("show.bs.modal", (event) => {
    if (!mobileMedia.matches) {
      event.preventDefault();
      return;
    }

    isModalOpening = true;
    $mobileSlot.append($summary);
    $mobileOrder?.classList.add("mobile-order--hidden");
  });

  $modal.addEventListener("shown.bs.modal", () => {
    isModalOpening = false;

    if (!mobileMedia.matches) {
      moveSummary();
    }
  });

  $modal.addEventListener("hide.bs.modal", () => {
    isModalOpening = false;
  });

  $modal.addEventListener("hidden.bs.modal", () => {
    $mobileOrder.classList.remove("mobile-order--hidden");

    if (!mobileMedia.matches) {
      moveSummaryToDesktop();
      return;
    }

    window.requestAnimationFrame(() => $detailsButton.focus());
  });

  if (typeof mobileMedia.addEventListener === "function") {
    mobileMedia.addEventListener("change", moveSummary);
  } else {
    mobileMedia.addListener(moveSummary);
  }

  $summary.dataset.adaptiveInitialized = "true";
  moveSummary();
}

/* Counters */
function initCounters() {
  document.querySelectorAll(".counter").forEach(($counter) => {
    if ($counter.dataset.initialized) return;

    const $value = $counter.querySelector(".counter__value");
    const $decreaseButton = $counter.querySelector('[data-counter-action="decrease"]');
    const $increaseButton = $counter.querySelector('[data-counter-action="increase"]');

    if (!$value || !$decreaseButton || !$increaseButton) return;

    const parsedMin = Number.parseInt($counter.dataset.counterMin, 10);
    const parsedMax = Number.parseInt($counter.dataset.counterMax, 10);
    const min = Number.isNaN(parsedMin) ? 1 : parsedMin;
    const max = Number.isNaN(parsedMax) ? Infinity : Math.max(parsedMax, min);
    const initialValue = Number.parseInt($value.textContent, 10);
    const $minModal = $counter.dataset.counterMinModal ? document.querySelector($counter.dataset.counterMinModal) : null;
    const hasMinModal = Boolean($minModal && window.bootstrap?.Modal);
    let value = Number.isNaN(initialValue) ? min : initialValue;

    const updateValue = (nextValue) => {
      value = Math.min(Math.max(nextValue, min), max);
      $value.textContent = value;
      $decreaseButton.disabled = value <= min && !hasMinModal;
      $increaseButton.disabled = value >= max;
    };

    $decreaseButton.addEventListener("click", () => {
      if (value <= min && hasMinModal) {
        window.bootstrap.Modal.getOrCreateInstance($minModal).show($decreaseButton);
        return;
      }

      updateValue(value - 1);
    });
    $increaseButton.addEventListener("click", () => updateValue(value + 1));

    $counter.dataset.initialized = "true";
    updateValue(value);
  });
}

document.addEventListener("DOMContentLoaded", initCounters, { once: true });

/* Range cards */
function initRangeCards() {
  document.querySelectorAll("[data-range-card]").forEach(($card) => {
    if ($card.dataset.initialized) return;

    const $input = $card.querySelector("[data-range-input]");
    const $value = $card.querySelector("[data-range-value]");
    const $decreaseButton = $card.querySelector('[data-range-action="decrease"]');
    const $increaseButton = $card.querySelector('[data-range-action="increase"]');
    const $select = $card.querySelector('.range-card__select[type="radio"]');

    if (!$input || !$value || !$decreaseButton || !$increaseButton || !$select) return;

    const min = Number.parseFloat($input.min);
    const max = Number.parseFloat($input.max);
    const step = Number.parseFloat($input.step) || 1;

    const selectCard = () => {
      if ($select.checked) return;

      $select.checked = true;
      $select.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const updateValue = (nextValue) => {
      const value = Math.min(Math.max(nextValue, min), max);
      const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;

      $input.value = value;
      $input.style.setProperty("--range-progress", `${progress}%`);
      $value.value = value;
      $value.textContent = value;
      $decreaseButton.disabled = value <= min;
      $increaseButton.disabled = value >= max;
    };

    $card.addEventListener("pointerdown", (event) => {
      if (event.button === 0) selectCard();
    });
    $card.addEventListener("click", selectCard);
    $input.addEventListener("input", () => {
      selectCard();
      updateValue(Number.parseFloat($input.value));
    });
    $input.addEventListener("keydown", (event) => {
      const currentValue = Number.parseFloat($input.value);

      if (["ArrowLeft", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        updateValue(currentValue - step);
      }

      if (["ArrowRight", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        updateValue(currentValue + step);
      }

      if (event.key === "Home") {
        event.preventDefault();
        updateValue(min);
      }

      if (event.key === "End") {
        event.preventDefault();
        updateValue(max);
      }
    });
    $decreaseButton.addEventListener("click", () => updateValue(Number.parseFloat($input.value) - step));
    $increaseButton.addEventListener("click", () => updateValue(Number.parseFloat($input.value) + step));

    $card.dataset.initialized = "true";
    updateValue(Number.parseFloat($input.value));
  });
}

document.addEventListener("DOMContentLoaded", initRangeCards, { once: true });

/* Security switches */
function initSecuritySwitches() {
  document.querySelectorAll(".security-option .switch__input").forEach(($input) => {
    if ($input.dataset.initialized) return;

    const $option = $input.closest(".security-option");

    if (!$option) return;

    const updateOptionState = () => {
      $option.classList.toggle("is-active", $input.checked);
    };

    $option.addEventListener("click", (event) => {
      if (event.target.closest(".switch")) return;

      $input.click();
    });
    $input.addEventListener("change", updateOptionState);
    $input.dataset.initialized = "true";
    updateOptionState();
  });
}

document.addEventListener("DOMContentLoaded", initSecuritySwitches, { once: true });

/* Authorization switches */
function initAuthorizationSwitches() {
  document.querySelectorAll(".authorization").forEach(($authorization) => {
    if ($authorization.dataset.initialized) return;

    const $input = $authorization.querySelector("[data-authorization-switch]");
    const $status = $authorization.querySelector("[data-authorization-status]");

    if (!$input || !$status) return;

    const updateStatus = () => {
      $status.textContent = $input.checked ? $status.dataset.enabledText : $status.dataset.disabledText;
    };

    $input.addEventListener("change", updateStatus);
    $authorization.dataset.initialized = "true";
    updateStatus();
  });
}

document.addEventListener("DOMContentLoaded", initAuthorizationSwitches, { once: true });

/* Cloud-init editors */
function initCloudInitEditors() {
  document.querySelectorAll("[data-cloud-init]").forEach(($cloudInit) => {
    if ($cloudInit.dataset.initialized) return;

    const $editor = $cloudInit.querySelector("[data-cloud-init-editor]");
    const $textarea = $cloudInit.querySelector("[data-cloud-init-textarea]");
    const $lineNumbers = $cloudInit.querySelector("[data-cloud-init-lines]");
    const $fileInput = $cloudInit.querySelector("[data-cloud-init-file]");
    const $resizer = $cloudInit.querySelector("[data-cloud-init-resizer]");

    if (!$editor || !$textarea || !$lineNumbers || !$fileInput || !$resizer) return;

    const syncLineNumberScroll = () => {
      $lineNumbers.style.transform = `translateY(${-$textarea.scrollTop}px)`;
    };

    const updateLineNumbers = () => {
      const linesCount = $textarea.value.split(/\r\n|\r|\n/).length;
      const fragment = document.createDocumentFragment();

      for (let line = 1; line <= linesCount; line += 1) {
        const $lineNumber = document.createElement("span");
        $lineNumber.textContent = line;
        fragment.append($lineNumber);
      }

      $lineNumbers.replaceChildren(fragment);
      syncLineNumberScroll();
    };

    $textarea.addEventListener("input", updateLineNumbers);
    $textarea.addEventListener("scroll", syncLineNumberScroll);

    $fileInput.addEventListener("change", () => {
      const [file] = $fileInput.files;

      if (!file) return;

      const reader = new FileReader();

      reader.addEventListener("load", () => {
        $textarea.value = typeof reader.result === "string" ? reader.result : "";
        $textarea.scrollTop = 0;
        $textarea.scrollLeft = 0;
        $fileInput.value = "";
        updateLineNumbers();
        $textarea.focus();
      });

      reader.addEventListener("error", () => {
        $fileInput.value = "";
      });

      reader.readAsText(file);
    });

    let pointerId = null;
    let startY = 0;
    let startHeight = 0;

    const minHeight = Number.parseFloat(getComputedStyle($editor).minHeight) || 200;

    const setEditorHeight = (height) => {
      $editor.style.height = `${Math.max(Math.round(height), minHeight)}px`;
    };

    $resizer.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;

      pointerId = event.pointerId;
      startY = event.clientY;
      startHeight = $editor.getBoundingClientRect().height;
      $resizer.setPointerCapture(pointerId);
      event.preventDefault();
    });

    $resizer.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;

      setEditorHeight(startHeight + event.clientY - startY);
    });

    const stopResize = (event) => {
      if (event.pointerId !== pointerId) return;

      if ($resizer.hasPointerCapture(pointerId)) {
        $resizer.releasePointerCapture(pointerId);
      }

      pointerId = null;
    };

    $resizer.addEventListener("pointerup", stopResize);
    $resizer.addEventListener("pointercancel", stopResize);
    $resizer.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

      const direction = event.key === "ArrowUp" ? -1 : 1;
      setEditorHeight($editor.getBoundingClientRect().height + direction * 16);
      event.preventDefault();
    });

    $cloudInit.dataset.initialized = "true";
    updateLineNumbers();
  });
}

document.addEventListener("DOMContentLoaded", initCloudInitEditors, { once: true });
