
/* =========================================
   MECHANICAL ALUMNI ASSOCIATION
   Dhaka Polytechnic Institute
   Main JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // MOBILE MENU
    // =====================================

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");

            const isOpen = navMenu.classList.contains("active");
            menuToggle.setAttribute("aria-expanded", isOpen);
        });
    }


    // =====================================
    // DROPDOWN MENU
    // =====================================

    const dropdownButtons = document.querySelectorAll(".dropdown-toggle");

    dropdownButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const parent = button.closest(".has-dropdown");

            if (!parent) return;

            // Close other dropdowns
            document.querySelectorAll(".has-dropdown.open").forEach(function (item) {
                if (item !== parent) {
                    item.classList.remove("open");
                }
            });

            parent.classList.toggle("open");
        });
    });


    // =====================================
    // LANGUAGE TOGGLE
    // =====================================

    const languageToggle = document.getElementById("languageToggle");

    let currentLanguage = localStorage.getItem("maa-language") || "EN";

    function changeLanguage(language) {
        currentLanguage = language;

        if (languageToggle) {
            languageToggle.textContent = language === "EN" ? "BN" : "EN";
        }

        document.documentElement.lang = language === "BN" ? "bn" : "en";

        // Change text using data-en and data-bn attributes
        document.querySelectorAll("[data-en][data-bn]").forEach(function (element) {
            element.textContent = element.getAttribute(
                language === "BN" ? "data-bn" : "data-en"
            );
        });

        localStorage.setItem("maa-language", language);
    }

    changeLanguage(currentLanguage);

    if (languageToggle) {
        languageToggle.addEventListener("click", function () {
            changeLanguage(currentLanguage === "EN" ? "BN" : "EN");
        });
    }


    // =====================================
    // REGISTRATION MODAL
    // =====================================

    const registerModal = document.getElementById("registerModal");
    const closeRegister = document.getElementById("closeRegisterModal");

    const registerTriggers = document.querySelectorAll(".register-trigger");

    function openRegisterModal() {
        if (registerModal) {
            registerModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeRegisterModal() {
        if (registerModal) {
            registerModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    }

    registerTriggers.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            openRegisterModal();
        });
    });

    if (closeRegister) {
        closeRegister.addEventListener("click", closeRegisterModal);
    }

    if (registerModal) {
        registerModal.addEventListener("click", function (event) {
            if (event.target === registerModal) {
                closeRegisterModal();
            }
        });
    }


    // =====================================
    // LOGIN MODAL
    // =====================================

    const loginModal = document.getElementById("loginModal");
    const closeLogin = document.getElementById("closeLoginModal");

    const loginTriggers = document.querySelectorAll(".login-trigger");

    function openLoginModal() {
        if (loginModal) {
            loginModal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeLoginModal() {
        if (loginModal) {
            loginModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    }

    loginTriggers.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            openLoginModal();
        });
    });

    if (closeLogin) {
        closeLogin.addEventListener("click", closeLoginModal);
    }

    if (loginModal) {
        loginModal.addEventListener("click", function (event) {
            if (event.target === loginModal) {
                closeLoginModal();
            }
        });
    }


    // =====================================
    // ESC KEY CLOSE MODALS
    // =====================================

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeRegisterModal();
            closeLoginModal();

            document.querySelectorAll(".has-dropdown.open").forEach(function (item) {
                item.classList.remove("open");
            });
        }
    });


    // =====================================
    // CLOSE MOBILE MENU AFTER CLICK
    // =====================================

    document.querySelectorAll(".nav-menu > li > a").forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.innerWidth <= 768 && navMenu) {
                navMenu.classList.remove("active");
                if (menuToggle) {
                    menuToggle.setAttribute("aria-expanded", "false");
                }
            }
        });
    });


    // =====================================
    // CONTACT FORM DEMO
    // =====================================

    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            alert("Thank you! Your message has been received.");

            contactForm.reset();
        });
    }


    // =====================================
    // CURRENT YEAR
    // =====================================

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

});
