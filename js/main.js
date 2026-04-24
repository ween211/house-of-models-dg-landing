document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");
  const mobileLinks = document.querySelectorAll(".mobile-menu a");
  const faqItems = document.querySelectorAll(".faq__item");
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const preview = document.getElementById("preview");
  const feedbackForm = document.getElementById("feedbackForm");
  const statusMessage = document.getElementById("statusMessage");
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const closeMobileMenu = () => {
    menuButton?.classList.remove("is-active");
    mobileMenu?.classList.remove("is-active");
    overlay?.classList.remove("is-active");

    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
    }

    if (mobileMenu) {
      mobileMenu.setAttribute("aria-hidden", "true");
    }

    document.body.style.overflow = "";
  };

  const openMobileMenu = () => {
    menuButton?.classList.add("is-active");
    mobileMenu?.classList.add("is-active");
    overlay?.classList.add("is-active");

    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "true");
    }

    if (mobileMenu) {
      mobileMenu.setAttribute("aria-hidden", "false");
    }

    document.body.style.overflow = "hidden";
  };

  window.addEventListener("scroll", () => {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  });

  menuButton?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.contains("is-active");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  overlay?.addEventListener("click", closeMobileMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header?.offsetHeight || 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  });

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq__head");

    button?.addEventListener("click", () => {
      item.classList.toggle("is-open");
    });
  });

  const renderPreview = (file) => {
    if (!file || !preview) return;

    if (!file.type.startsWith("image/")) {
      preview.innerHTML = "<span>Пожалуйста, выберите изображение</span>";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      preview.innerHTML = "";

      const image = document.createElement("img");
      image.src = reader.result;
      image.alt = "Предпросмотр загруженного фото";

      preview.appendChild(image);
    };

    reader.readAsDataURL(file);
  };

  dropZone?.addEventListener("click", () => {
    fileInput?.click();
  });

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files?.[0];

    if (file) {
      renderPreview(file);
    }
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone?.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone?.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("is-dragover");
    });
  });

  dropZone?.addEventListener("drop", (event) => {
    const file = event.dataTransfer?.files?.[0];

    if (!file) return;

    if (fileInput) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
    }

    renderPreview(file);
  });

  feedbackForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!statusMessage) return;

    statusMessage.hidden = false;
    statusMessage.textContent = "Заявка подготовлена. В production-версии данные отправляются на backend.";
    statusMessage.className = "status-message status-message--success";

    feedbackForm.reset();

    if (preview) {
      preview.innerHTML = "<span>Загрузите ваше фото</span>";
    }
  });
});
