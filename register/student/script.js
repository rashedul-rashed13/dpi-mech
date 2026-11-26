
document.addEventListener("DOMContentLoaded", function () {

  // =====================================
  // 1. HELPER FUNCTIONS
  // =====================================

  const $ = (id) => document.getElementById(id);

  function show(element) {
    if (element) element.classList.remove("hidden");
  }

  function hide(element) {
    if (element) element.classList.add("hidden");
  }

  function toggleByCheckbox(checkbox, panel) {
    if (!checkbox || !panel) return;

    function update() {
      checkbox.checked ? show(panel) : hide(panel);
    }

    checkbox.addEventListener("change", update);
    update();
  }

  function toggleBySelect(select, panel, values) {
    if (!select || !panel) return;

    function update() {
      values.includes(select.value) ? show(panel) : hide(panel);
    }

    select.addEventListener("change", update);
    update();
  }

  // =====================================
  // 2. DATE OF BIRTH DROPDOWNS
  // =====================================

  function populateSelect(id, items, placeholder) {
    const select = $(id);
    if (!select) return;

    select.innerHTML = `<option value="">${placeholder}</option>`;

    items.forEach(item => {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      select.appendChild(option);
    });
  }

  const currentYear = new Date().getFullYear();

  populateSelect(
    "dobDay",
    Array.from({ length: 31 }, (_, i) => ({
      value: String(i + 1),
      label: String(i + 1).padStart(2, "0")
    })),
    "Day"
  );

  populateSelect(
    "dobMonth",
    [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ].map((month, i) => ({
      value: String(i + 1),
      label: month
    })),
    "Month"
  );

  populateSelect(
    "dobYear",
    Array.from({ length: currentYear - 1929 }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i)
    })),
    "Year"
  );

  // =====================================
  // 3. SAME PRESENT & PERMANENT ADDRESS
  // =====================================

  const sameAddress = $("sameAddress");

  if (sameAddress) {
    sameAddress.addEventListener("change", function () {
      const permanentAddress = $("permanentAddress");

      if (permanentAddress) {
        sameAddress.checked
          ? hide(permanentAddress)
          : show(permanentAddress);
      }
    });
  }

  // =====================================
  // 4. ADDRESS TYPE SELECTION
  // =====================================

  const addressType = $("addressType");

  if (addressType) {
    addressType.addEventListener("change", function () {
      const cityPanel = $("cityCorporationPanel");
      const districtPanel = $("districtPanel");

      hide(cityPanel);
      hide(districtPanel);

      if (this.value === "City Corporation") {
        show(cityPanel);
      }

      if (this.value === "District") {
        show(districtPanel);
      }
    });
  }

  // =====================================
  // 5. CITY CORPORATION WARD
  // =====================================

  const cityWard = $("cityWard");
  const otherCityWard = $("otherCityWard");

  if (cityWard && otherCityWard) {
    cityWard.addEventListener("change", function () {
      this.value === "Others"
        ? show(otherCityWard)
        : hide(otherCityWard);
    });
  }

  // =====================================
  // 6. DISTRICT DIVISION & DISTRICT DATA
  // =====================================

  const districts = {
    "Dhaka": [
      "Dhaka", "Faridpur", "Gazipur", "Gopalganj",
      "Kishoreganj", "Madaripur", "Manikganj",
      "Munshiganj", "Narayanganj", "Narsingdi",
      "Rajbari", "Shariatpur", "Tangail"
    ],
    "Chattogram": [
      "Bandarban", "Brahmanbaria", "Chandpur",
      "Chattogram", "Cumilla", "Cox's Bazar",
      "Feni", "Khagrachhari", "Lakshmipur",
      "Noakhali", "Rangamati"
    ],
    "Rajshahi": [
      "Bogura", "Joypurhat", "Naogaon", "Natore",
      "Chapainawabganj", "Pabna", "Rajshahi", "Sirajganj"
    ],
    "Khulna": [
      "Bagerhat", "Chuadanga", "Jashore", "Jhenaidah",
      "Khulna", "Kushtia", "Magura", "Meherpur",
      "Narail", "Satkhira"
    ],
    "Barishal": [
      "Barguna", "Barishal", "Bhola", "Jhalokati",
      "Patuakhali", "Pirojpur"
    ],
    "Sylhet": [
      "Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"
    ],
    "Rangpur": [
      "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat",
      "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon"
    ],
    "Mymensingh": [
      "Jamalpur", "Mymensingh", "Netrokona", "Sherpur"
    ]
  };

  const divisionSelect = $("division");
  const districtSelect = $("district");

  if (divisionSelect && districtSelect) {
    divisionSelect.addEventListener("change", function () {
      districtSelect.innerHTML =
        '<option value="">Select District</option>';

      const list = districts[this.value] || [];

      list.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        districtSelect.appendChild(option);
      });
    });
  }

  // =====================================
  // 7. AREA TYPE: UPAZILA / MUNICIPALITY
  // =====================================

  const areaType = $("areaType");

  if (areaType) {
    areaType.addEventListener("change", function () {
      const upazilaPanel = $("upazilaPanel");
      const municipalityPanel = $("municipalityPanel");

      hide(upazilaPanel);
      hide(municipalityPanel);

      if (this.value === "Upazila") {
        show(upazilaPanel);
      }

      if (this.value === "Municipality") {
        show(municipalityPanel);
      }
    });
  }

  const municipalityWard = $("municipalityWard");
  const otherMunicipalityWard = $("otherMunicipalityWard");

  if (municipalityWard && otherMunicipalityWard) {
    municipalityWard.addEventListener("change", function () {
      this.value === "Others"
        ? show(otherMunicipalityWard)
        : hide(otherMunicipalityWard);
    });
  }

  // =====================================
  // 8. ACADEMIC: DIPLOMA / MAKE-UP COURSE
  // =====================================

  const diplomaCheck = $("diplomaCheck");
  const makeupCheck = $("makeupCheck");

  toggleByCheckbox(diplomaCheck, $("diplomaPanel"));
  toggleByCheckbox(makeupCheck, $("makeupPanel"));

  // =====================================
  // 9. DIPLOMA DEPARTMENT WARNING
  // =====================================

  const diplomaDepartment = $("diplomaDepartment");

  if (diplomaDepartment) {
    diplomaDepartment.addEventListener("change", function () {
      const warning = $("departmentWarning");

      if (warning) {
        this.value === "70"
          ? hide(warning)
          : show(warning);
      }
    });
  }

  // =====================================
  // 10. DIPLOMA SESSION OTHER
  // =====================================

  const sessionSelect = $("diplomaSession");
  const otherSession = $("otherSession");

  if (sessionSelect && otherSession) {
    sessionSelect.addEventListener("change", function () {
      this.value === "Other"
        ? show(otherSession)
        : hide(otherSession);
    });
  }

  // =====================================
  // 11. ALLIED POLYTECHNIC OTHER
  // =====================================

  const polytechnicSelect = $("polytechnicName");
  const otherPolytechnic = $("otherPolytechnic");

  if (polytechnicSelect && otherPolytechnic) {
    polytechnicSelect.addEventListener("change", function () {
      this.value === "Other"
        ? show(otherPolytechnic)
        : hide(otherPolytechnic);
    });
  }

  // =====================================
  // 12. CURRENT STATUS
  // =====================================

  toggleByCheckbox(
    $("higherStudiesCheck"),
    $("higherStudiesPanel")
  );

  toggleByCheckbox(
    $("jobHolderCheck"),
    $("jobHolderPanel")
  );

  toggleByCheckbox(
    $("entrepreneurCheck"),
    $("entrepreneurPanel")
  );

  toggleByCheckbox(
    $("othersStatusCheck"),
    $("othersStatusPanel")
  );

  // =====================================
  // 13. JOB TYPE
  // =====================================

  toggleBySelect(
    $("jobType"),
    $("jobDetailsPanel"),
    ["Private", "Government"]
  );

  // =====================================
  // 14. CONTACT VISIBILITY
  // =====================================

  const contactVisibility = $("contactVisibility");

  if (contactVisibility) {
    contactVisibility.addEventListener("change", function () {
      const contactPanel = $("contactVisibilityPanel");

      if (!contactPanel) return;

      this.value === "Yes"
        ? show(contactPanel)
        : hide(contactPanel);
    });
  }

  // =====================================
  // 15. LOGIN POPUP
  // =====================================

  const openLogin = $("openLogin");
  const loginModal = $("loginModal");
  const closeLogin = $("closeLogin");

  if (openLogin && loginModal) {
    openLogin.addEventListener("click", function () {
      show(loginModal);
      document.body.style.overflow = "hidden";
    });
  }

  if (closeLogin && loginModal) {
    closeLogin.addEventListener("click", function () {
      hide(loginModal);
      document.body.style.overflow = "";
    });
  }

  if (loginModal) {
    loginModal.addEventListener("click", function (event) {
      if (event.target === loginModal) {
        hide(loginModal);
        document.body.style.overflow = "";
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && loginModal) {
      hide(loginModal);
      document.body.style.overflow = "";
    }
  });

  // =====================================
  // 16. FORM SUBMISSION DEMO
  // =====================================

  const membershipForm = $("membershipForm");

  if (membershipForm) {
    membershipForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!membershipForm.checkValidity()) {
        membershipForm.reportValidity();
        return;
      }

      alert(
        "Your membership registration form has been completed successfully. Backend connection is required for actual submission."
      );
    });
  }

  // =====================================
  // 17. LOGIN FORM DEMO
  // =====================================

  const loginForm = $("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      alert(
        "Login authentication requires a backend or Firebase connection."
      );
    });
  }

  // =====================================
  // 18. GOOGLE SIGN-IN DEMO
  // =====================================

  const googleButton = $("googleSignIn");

  if (googleButton) {
    googleButton.addEventListener("click", function () {
      alert(
        "Google Sign-In requires Firebase Authentication configuration."
      );
    });
  }

});
