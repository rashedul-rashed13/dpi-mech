
/* ==========================================
   MECHANICAL ALUMNI ASSOCIATION
   MAIN JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 1. MOBILE MENU
    // ======================================

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", function () {

            navMenu.classList.toggle("active");

            const icon = menuToggle.querySelector("i");

            if (navMenu.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-times");
            } else {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }

        });

    }


    // ======================================
    // 2. MOBILE DROPDOWN
    // ======================================

    const dropdowns = document.querySelectorAll(".dropdown > a");

    dropdowns.forEach(function (link) {

        link.addEventListener("click", function (e) {

            if (window.innerWidth <= 768) {

                e.preventDefault();

                const parent = this.parentElement;

                // Close other dropdowns
                document.querySelectorAll(".dropdown.open").forEach(function (item) {
                    if (item !== parent) {
                        item.classList.remove("open");
                    }
                });

                parent.classList.toggle("open");

            }

        });

    });


    // ======================================
    // 3. CLOSE MOBILE MENU ON LINK CLICK
    // ======================================

    document.querySelectorAll(".nav-menu a").forEach(function (link) {

        link.addEventListener("click", function () {

            if (window.innerWidth <= 768) {

                if (!this.parentElement.classList.contains("dropdown")) {

                    navMenu.classList.remove("active");

                    const icon = menuToggle.querySelector("i");

                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");

                }

            }

        });

    });


    // ======================================
    // 4. REGISTRATION POPUP
    // ======================================

    const registerModal = document.getElementById("registerModal");

    const registerButtons = [
        document.getElementById("registerOpen"),
        document.getElementById("registerOpen2")
    ];

    registerButtons.forEach(function (button) {

        if (button) {

            button.addEventListener("click", function () {

                openModal(registerModal);

            });

        }

    });


    // ======================================
    // 5. LOGIN POPUP
    // ======================================

    const loginModal = document.getElementById("loginModal");

    const loginOpen = document.getElementById("loginOpen");

    if (loginOpen) {

        loginOpen.addEventListener("click", function () {

            openModal(loginModal);

        });

    }


    // ======================================
    // 6. OPEN MODAL FUNCTION
    // ======================================

    function openModal(modal) {

        if (!modal) return;

        closeAllModals();

        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    // ======================================
    // 7. CLOSE MODAL FUNCTION
    // ======================================

    function closeModal(modal) {

        if (!modal) return;

        modal.classList.remove("active");

        document.body.style.overflow = "";

    }


    function closeAllModals() {

        document.querySelectorAll(".modal").forEach(function (modal) {

            modal.classList.remove("active");

        });

        document.body.style.overflow = "";

    }


    // ======================================
    // 8. CLOSE BUTTON
    // ======================================

    document.querySelectorAll("[data-close]").forEach(function (button) {

        button.addEventListener("click", function () {

            const modalId = this.getAttribute("data-close");

            const modal = document.getElementById(modalId);

            closeModal(modal);

        });

    });


    // ======================================
    // 9. CLICK OUTSIDE TO CLOSE
    // ======================================

    document.querySelectorAll(".modal").forEach(function (modal) {

        modal.addEventListener("click", function (e) {

            if (e.target === modal) {

                closeModal(modal);

            }

        });

    });


    // ======================================
    // 10. ESC KEY TO CLOSE POPUP
    // ======================================

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            closeAllModals();

        }

    });


    // ======================================
    // 11. LOGIN TO REGISTRATION SWITCH
    // ======================================

    const switchToRegister = document.getElementById("switchToRegister");

    if (switchToRegister) {

        switchToRegister.addEventListener("click", function (e) {

            e.preventDefault();

            closeModal(loginModal);

            openModal(registerModal);

        });

    }


    // ======================================
    // 12. REGISTRATION FORM
    // ======================================

    const registrationForm = document.getElementById("registrationForm");

    if (registrationForm) {

        registrationForm.addEventListener("submit", function (e) {

            e.preventDefault();

            if (!registrationForm.reportValidity()) return;

            const formData = new FormData(registrationForm);

            const name = registrationForm.querySelector('input[type="text"]').value.trim();

            const email = registrationForm.querySelector('input[type="email"]').value.trim();

            const phone = registrationForm.querySelector('input[type="tel"]').value.trim();

            const type = document.getElementById("registrationType").value;

            if (!type || !name || !email || !phone) {

                alert("Please fill in all required fields.");

                return;

            }

            alert(
                "Thank you " + name + "!\n\n" +
                "Your " + type + " registration form has been submitted successfully.\n\n" +
                "Please connect the website with a backend to save your registration."
            );

            registrationForm.reset();

            closeModal(registerModal);

        });

    }


    // ======================================
    // 13. LOGIN FORM
    // ======================================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (e) {

            e.preventDefault();

            if (!loginForm.reportValidity()) return;

            const loginType = document.getElementById("loginType").value;

            const username = loginForm.querySelector('input[type="text"]').value.trim();

            if (!loginType || !username) {

                alert("Please enter your login information.");

                return;

            }

            alert(
                loginType + " Login\n\n" +
                "Your login form has been received.\n\n" +
                "Real authentication requires a secure backend and database."
            );

            loginForm.reset();

            closeModal(loginModal);

        });

    }


    // ======================================
    // 14. CONTACT FORM
    // ======================================

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (e) {

            e.preventDefault();

            if (!contactForm.reportValidity()) return;

            alert(
                "Thank you for contacting us!\n\n" +
                "Your message form is ready. Connect a backend to deliver messages."
            );

            contactForm.reset();

        });

    }


    // ======================================
    // 15. BN / EN LANGUAGE SWITCH
    // ======================================

    const languageBtn = document.getElementById("languageBtn");

    let currentLanguage = "EN";

    const translations = {

        BN: {

            "Home": "হোম",
            "About Us": "আমাদের সম্পর্কে",
            "Overview": "পরিচিতি",
            "Teachers": "শিক্ষকমণ্ডলী",
            "Leader Message": "নেতার বার্তা",
            "Mentors": "মেন্টর",
            "Committee": "কমিটি",
            "Executive Committee": "নির্বাহী কমিটি",
            "Advisory Committee": "উপদেষ্টা কমিটি",
            "Former Leaders": "সাবেক নেতৃবৃন্দ",
            "Alumni Directory": "অ্যালামনাই ডিরেক্টরি",
            "Events": "ইভেন্ট",
            "Notices": "নোটিশ",
            "More": "আরও",
            "Jobs / Career": "চাকরি / ক্যারিয়ার",
            "Donation / Fund": "অনুদান / তহবিল",
            "Contact": "যোগাযোগ",
            "Login": "লগইন",
            "Notice Board": "নোটিশ বোর্ড",
            "Upcoming Events": "আসন্ন অনুষ্ঠান",
            "Photo Gallery": "ফটো গ্যালারি",
            "About Our Association": "আমাদের অ্যাসোসিয়েশন সম্পর্কে",
            "Become a Member": "সদস্য হোন",
            "Contact Us": "যোগাযোগ করুন",
            "Discover More": "আরও জানুন",
            "Register Now": "নিবন্ধন করুন",
            "Send Us a Message": "আমাদের বার্তা পাঠান",
            "Quick Links": "দ্রুত লিংক",
            "Useful Links": "প্রয়োজনীয় লিংক",
            "Privacy Policy": "গোপনীয়তা নীতি",
            "Terms & Conditions": "শর্তাবলি"

        },

        EN: {}

    };


    if (languageBtn) {

        languageBtn.addEventListener("click", function () {

            currentLanguage = currentLanguage === "EN" ? "BN" : "EN";

            languageBtn.textContent = currentLanguage === "EN" ? "BN / EN" : "EN / BN";

            document.querySelectorAll(".nav-menu > li > a").forEach(function (link) {

                const key = link.textContent.trim().replace(/\s+/g, " ").replace(/\s*[⌄▼▾]\s*$/, "");

                const icon = link.querySelector("i");

                if (currentLanguage === "BN") {

                    if (translations.BN[key]) {

                        link.childNodes[0].textContent = translations.BN[key] + " ";

                    }

                } else {

                    const original = Object.keys(translations.BN).find(function (english) {

                        return translations.BN[english] === link.childNodes[0].textContent.trim();

                    });

                    if (original) {

                        link.childNodes[0].textContent = original + " ";

                    }

                }

                if (icon) {

                    link.appendChild(icon);

                }

            });

            // Translate section headings
            document.querySelectorAll(".section-heading h2").forEach(function (heading) {

                const original = heading.dataset.original || heading.textContent.trim();

                heading.dataset.original = original;

                if (currentLanguage === "BN" && translations.BN[original]) {

                    heading.textContent = translations.BN[original];

                } else {

                    heading.textContent = original;

                }

            });

        });

    }


    // ======================================
    // 16. SMOOTH SCROLL
    // ======================================

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (e) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {

                e.preventDefault();

                target.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }

        });

    });


    // ======================================
    // 17. FOOTER CURRENT YEAR
    // ======================================

    const footerYear = document.querySelector(".footer-bottom");

    if (footerYear) {

        footerYear.innerHTML = footerYear.innerHTML.replace(
            /2026/g,
            new Date().getFullYear()
        );

    }


    // ======================================
    // 18. CONSOLE MESSAGE
    // ======================================

    console.log(
        "%c Mechanical Alumni Association ",
        "background:#092d55;color:#fff;font-size:16px;padding:10px;"
    );

    console.log("Website JavaScript Loaded Successfully!");

});
