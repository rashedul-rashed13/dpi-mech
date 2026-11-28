
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


    // Close menu after clicking navigation link

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

    const languageToggle =
      event.target.closest("#languageToggle");

    if (!languageToggle) return;

    const currentLanguage =
      document.documentElement.lang;

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

  const registerModal =
    document.getElementById("registerModal");

  const loginModal =
    document.getElementById("loginModal");

  const closeRegisterBtn =
    document.getElementById("closeRegisterModal");

  const closeLoginBtn =
    document.getElementById("closeLoginModal");



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

  document.addEventListener("click", function (event) {

    const registerTrigger =
      event.target.closest(".register-trigger");

    const loginTrigger =
      event.target.closest(".login-trigger");


    // Register Popup

    if (registerTrigger) {

      event.preventDefault();

      openModal(registerModal);

      return;
    }


    // Login Popup

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

    const destination =
      link.getAttribute("href");

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
      event.target.classList.contains(
        "register-modal-overlay"
      ) ||

      event.target.classList.contains(
        "login-modal-overlay"
      )
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
  // 11. OPEN LOGIN FROM REGISTRATION PAGE
  // =====================================

  function openLoginPopupFromLink() {

    const params =
      new URLSearchParams(window.location.search);

    const openLogin =
      params.get("openLogin");


    // Support both:
    // ?openLogin=1
    // ?openLogin=true

    if (
      openLogin !== "1" &&
      openLogin !== "true"
    ) {

      return;
    }


    // Open existing Homepage Login Popup

    if (loginModal) {

      openModal(loginModal);

    } else {

      console.warn("Login Modal not found.");

    }


    // Remove URL parameter without page reload

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname +
      window.location.hash
    );

  }


  openLoginPopupFromLink();



  // =====================================
  // 12. INITIAL MODAL STATE
  // =====================================

  [registerModal, loginModal].forEach(function (modal) {

    if (!modal) return;

    if (!modal.classList.contains("active")) {

      modal.setAttribute("aria-hidden", "true");

    }

  });



  // =====================================
  // 13. CONSOLE MESSAGE
  // =====================================

  console.log(
    "Mechanical Alumni Association Main Script Loaded Successfully!"
  );

});
