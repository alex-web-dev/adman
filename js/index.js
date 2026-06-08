/* Mobile menu */
/* Mobile menu */
initMobileMenu();

function initMobileMenu() {
  const $menu = document.querySelector(".js-mobile-menu");
  const $backdrop = document.querySelector(".mobile-menu__backdrop");
  const delay = 500;

  if (!$menu || $menu.dataset.initialized) return;
  $menu.dataset.initialized = "true";

  const $openBtns = document.querySelectorAll(".js-open-menu");
  const $closeBtns = document.querySelectorAll(".js-close-menu");

  let showTimeout = null;

  const handleToggle = () => {
    const isOpen = $menu.classList.contains("mobile-menu--active");

    clearTimeout(showTimeout);

    if (isOpen) {
      closeMenu($menu, $openBtns);
    } else {
      openMenu($menu, $openBtns);

      showTimeout = setTimeout(() => {
        $menu.classList.add("mobile-menu--show");
      }, delay);
    }
  };

  $openBtns.forEach((btn) => {
    btn.addEventListener("click", handleToggle);
  });

  $closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      clearTimeout(showTimeout);
      closeMenu($menu, $openBtns);
    });
  });

  if ($backdrop) {
    $backdrop.addEventListener("click", () => {
      clearTimeout(showTimeout);
      closeMenu($menu, $openBtns);
    });
  }
}

function openMenu($menu, $openBtns) {
  $menu.classList.add("mobile-menu--active");
  document.documentElement.classList.add("is-lock");
  $openBtns.forEach((btn) => btn.classList.add("is-active"));
}

function closeMenu($menu, $openBtns) {
  $menu.classList.remove("mobile-menu--active");
  $menu.classList.remove("mobile-menu--show");
  document.documentElement.classList.remove("is-lock");
  $openBtns.forEach((btn) => btn.classList.remove("is-active"));
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
  const $video = document.createElement("video");
  $video.classList.add("video__player");

  $video.src = url;
  $video.controls = true;
  $video.playsInline = true;
  $video.muted = true;
  $video.preload = "metadata";

  return $video;
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
