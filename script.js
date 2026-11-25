
document.addEventListener("DOMContentLoaded", function () {

  // =====================================
  // 1. MOBILE NAVIGATION
  // =====================================

  function closeMobileMenu() {

    const navMenu = document.getElementById("navMenu");
    const menuToggle = document.getElementById("menuToggle");

    if (!navMenu || !menuToggle) return;

    navMenu.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open Menu");
    menuToggle.innerHTML = "☰";

  }

  // Event Delegation for dynamically loaded header
  document.addEventListener("click", function (event) {

    const menuToggle = event.target.closest("#menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

      const isOpen = navMenu.classList.toggle("active");

      menuToggle.setAttribute("aria-expanded", isOpen);
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close Menu" : "Open Menu"
      );

      menuToggle.innerHTML = isOpen ? "&times;" : "☰";

      return;
    }

    // Close menu after clicking a navigation link
    if (
      navMenu &&
      event.target.closest("#navMenu a")
    ) {
      closeMobileMenu();
      return;
    }

    // Close menu when clicking outside
    if (
      navMenu &&
      !navMenu.contains(event.target)
    ) {
      closeMobileMenu();
    }

  });


  // =====================================
  // 2. LANGUAGE TOGGLE
  // =====================================

  document.addEventListener("click", function (event) {

    const languageToggle = event.target.closest("#languageToggle");

    if (!languageToggle) return;

    const currentLanguage = document.documentElement.lang;

    if (currentLanguage === "en") {

      document.documentElement.lang = "bn";
      languageToggle.textContent = "(EN)";

    } else {

      document.documentElement.lang = "en";
      languageToggle.textContent = "(BN)";

    }

  });


  // =====================================
  // 3. MODAL ELEMENTS
  // =====================================

  const registerModal = document.getElementById("registerModal");
  const loginModal = document.getElementById("loginModal");

  const closeRegisterBtn = document.getElementById("closeRegisterModal");
  const closeLoginBtn = document.getElementById("closeLoginModal");


  // =====================================
  // 4. CLOSE ALL MODALS
  // =====================================

  function closeAllModals() {

    [registerModal, loginModal].forEach(function (modal) {

      if (!modal) return;

      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");

    });

    document.body.classList.remove("modal-open");

  }


  // =====================================
  // 5. OPEN MODAL
  // =====================================

  function openModal(modal) {

    if (!modal) return;

    closeAllModals();

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

  }


  // =====================================
  // 6. GLOBAL LOGIN & REGISTER TRIGGERS
  // =====================================

  // Works with dynamically loaded Global Header

  document.addEventListener("click", function (event) {

    const registerTrigger = event.target.closest(".register-trigger");
    const loginTrigger = event.target.closest(".login-trigger");

    if (registerTrigger) {

      event.preventDefault();

      openModal(registerModal);

      return;
    }

    if (loginTrigger) {

      event.preventDefault();

      openModal(loginModal);

      return;
    }

  });


  // =====================================
  // 7. STUDENT & TEACHER REGISTRATION
  // =====================================

  function navigateToForm(link) {

    if (!link) return;

    const destination = link.getAttribute("href");

    if (!destination || destination === "#") {

      alert("Registration page link is missing.");

      return;
    }

    closeAllModals();

    window.location.href = destination;

  }


  document.addEventListener("click", function (event) {

    const studentLink = event.target.closest(
      "#registerModal .student-option"
    );

    const teacherLink = event.target.closest(
      "#registerModal .teacher-option"
    );

    if (studentLink) {

      event.preventDefault();

      navigateToForm(studentLink);

      return;
    }

    if (teacherLink) {

      event.preventDefault();

      navigateToForm(teacherLink);

      return;
    }

  });


  // =====================================
  // 8. CLOSE BUTTONS
  // =====================================

  if (closeRegisterBtn) {

    closeRegisterBtn.addEventListener(
      "click",
      closeAllModals
    );

  }

  if (closeLoginBtn) {

    closeLoginBtn.addEventListener(
      "click",
      closeAllModals
    );

  }


  // =====================================
  // 9. CLICK OUTSIDE MODAL
  // =====================================

  document.addEventListener("click", function (event) {

    if (
      event.target.classList.contains("register-modal-overlay") ||
      event.target.classList.contains("login-modal-overlay")
    ) {

      closeAllModals();

    }

  });


  // =====================================
  // 10. ESC KEY
  // =====================================

  document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

      closeAllModals();
      closeMobileMenu();

    }

  });


  // =====================================
  // 11. OPEN LOGIN FROM URL
  // =====================================

  function openLoginPopupFromLink() {

    const params = new URLSearchParams(window.location.search);

    if (params.get("openLogin") !== "true") return;

    openModal(loginModal);

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname + window.location.hash
    );

  }

  openLoginPopupFromLink();


  console.log("DTSC Alumni Main Script Loaded Successfully!");

});
