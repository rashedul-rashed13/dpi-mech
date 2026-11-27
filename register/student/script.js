
document.addEventListener("DOMContentLoaded", function () {

  // =========================================
  // 1. HELPER FUNCTIONS
  // =========================================

  const $ = (id) => document.getElementById(id);

  const currentYear = new Date().getFullYear();

  function populateSelect(select, placeholder, values) {
    if (!select) return;

    select.innerHTML = "";

    const first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.appendChild(first);

    values.forEach(item => {
      const option = document.createElement("option");

      if (typeof item === "object") {
        option.value = item.value;
        option.textContent = item.label;
      } else {
        option.value = item;
        option.textContent = item;
      }

      select.appendChild(option);
    });
  }

  function toggleSection(id, show) {
    const element = $(id);
    if (element) {
      element.classList.toggle("active", show);
    }
  }

  function setRequired(container, required) {
    if (!container) return;

    container.querySelectorAll("input, select, textarea").forEach(field => {
      if (field.dataset.originalRequired === undefined) {
        field.dataset.originalRequired = field.required ? "true" : "false";
      }

      field.required = required &&
        field.dataset.originalRequired === "true";
    });
  }

  // =========================================
  // 2. DATE OF BIRTH
  // =========================================

  populateSelect(
    $("dobDay"),
    "Day",
    Array.from({ length: 31 }, (_, i) =>
      String(i + 1).padStart(2, "0")
    )
  );

  populateSelect(
    $("dobMonth"),
    "Month",
    [
      { value: "01", label: "January" },
      { value: "02", label: "February" },
      { value: "03", label: "March" },
      { value: "04", label: "April" },
      { value: "05", label: "May" },
      { value: "06", label: "June" },
      { value: "07", label: "July" },
      { value: "08", label: "August" },
      { value: "09", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" }
    ]
  );

  const dobYears = [];
  for (let year = currentYear; year >= 1930; year--) {
    dobYears.push(year);
  }

  populateSelect($("dobYear"), "Year", dobYears);


  // =========================================
  // 3. DIPLOMA SESSION
  // =========================================

  const sessions = [];

  for (let year = currentYear; year >= 1955; year--) {
    const nextYear = String((year + 1) % 100).padStart(2, "0");

    sessions.push({
      value: `${year}-${nextYear}`,
      label: `${year}-${nextYear}`
    });
  }

  sessions.push({
    value: "other",
    label: "Other"
  });

  populateSelect(
    $("diplomaSession"),
    "Select Session",
    sessions
  );


  // =========================================
  // 4. PASSING YEARS
  // =========================================

  [
    "diplomaPassingYear",
    "alliedPassingYear",
    "makeupPassingYear"
  ].forEach(id => {

    const years = [];

    for (let year = currentYear; year >= 1955; year--) {
      years.push(year);
    }

    populateSelect($(id), "Select Year", years);
  });


  // =========================================
  // 5. BANGLADESH DIVISIONS AND DISTRICTS
  // =========================================

  const divisions = [
    "Barishal",
    "Chattogram",
    "Dhaka",
    "Khulna",
    "Mymensingh",
    "Rajshahi",
    "Rangpur",
    "Sylhet"
  ];

  const districts = {
    Barishal: [
      "Barguna", "Barishal", "Bhola",
      "Jhalokati", "Patuakhali", "Pirojpur"
    ],

    Chattogram: [
      "Bandarban", "Brahmanbaria", "Chandpur",
      "Chattogram", "Cumilla", "Cox's Bazar",
      "Feni", "Khagrachhari", "Lakshmipur",
      "Noakhali", "Rangamati"
    ],

    Dhaka: [
      "Dhaka", "Faridpur", "Gazipur",
      "Gopalganj", "Kishoreganj", "Madaripur",
      "Manikganj", "Munshiganj", "Narayanganj",
      "Narsingdi", "Rajbari", "Shariatpur", "Tangail"
    ],

    Khulna: [
      "Bagerhat", "Chuadanga", "Jashore",
      "Jhenaidah", "Khulna", "Kushtia",
      "Magura", "Meherpur", "Narail", "Satkhira"
    ],

    Mymensingh: [
      "Jamalpur", "Mymensingh", "Netrokona", "Sherpur"
    ],

    Rajshahi: [
      "Bogura", "Chapainawabganj", "Joypurhat",
      "Naogaon", "Natore", "Pabna",
      "Rajshahi", "Sirajganj"
    ],

    Rangpur: [
      "Dinajpur", "Gaibandha", "Kurigram",
      "Lalmonirhat", "Nilphamari", "Panchagarh",
      "Rangpur", "Thakurgaon"
    ],

    Sylhet: [
      "Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"
    ]
  };


  // =========================================
  // 6. CITY CORPORATIONS
  // =========================================

  const cityCorporations = [
    "Dhaka North City Corporation",
    "Dhaka South City Corporation",
    "Chattogram City Corporation",
    "Khulna City Corporation",
    "Rajshahi City Corporation",
    "Barishal City Corporation",
    "Sylhet City Corporation",
    "Rangpur City Corporation",
    "Gazipur City Corporation",
    "Narayanganj City Corporation",
    "Cumilla City Corporation",
    "Mymensingh City Corporation"
  ];


  // =========================================
  // 7. ADDRESS DROPDOWN SETUP
  // =========================================

  function setupAddress(prefix) {

    const addressType = document.querySelector(
      `[name="${prefix}AddressType"]`
    );

    const city = $(prefix + "City");
    const division = $(prefix + "Division");
    const district = $(prefix + "District");
    const areaType = $(prefix + "AreaType");
    const area = $(prefix + "Area");

    if (!addressType) return;

    // Add classes to both Present and Permanent Address
    city?.closest(".form-group")?.classList.add("city-field");

    [division, district, areaType, area].forEach(field => {
      field?.closest(".form-group")?.classList.add("district-field");
    });

    populateSelect(city, "Select City Corporation", cityCorporations);
    populateSelect(division, "Select Division", divisions);
    populateSelect(district, "Select District", []);
    populateSelect(area, "Select Area", []);

    // Division → District
    division?.addEventListener("change", function () {

      populateSelect(
        district,
        "Select District",
        districts[this.value] || []
      );

      populateSelect(area, "Select Area", []);
    });

    // Area Type
    areaType?.addEventListener("change", function () {

      const placeholder = this.value === "upazila"
        ? "Select Upazila"
        : this.value === "municipality"
          ? "Select Municipality"
          : "Select Area";

      populateSelect(area, placeholder, []);
    });

    // Address Type visibility
    function updateAddressFields() {

      const selected = addressType.value;
      const section = addressType.closest(".form-section");

      if (!section) return;

      section.querySelectorAll(".city-field").forEach(field => {
        field.style.display = selected === "city" ? "" : "none";
      });

      section.querySelectorAll(".district-field").forEach(field => {
        field.style.display = selected === "district" ? "" : "none";
      });
    }

    addressType.addEventListener("change", updateAddressFields);

    updateAddressFields();
  }

  setupAddress("present");
  setupAddress("permanent");


  // =========================================
  // 8. WARD DROPDOWNS
  // =========================================

  function fillWard(select, max = 99) {

    if (!select) return;

    const values = [];

    for (let i = 1; i <= max; i++) {
      const number = String(i).padStart(2, "0");

      values.push({
        value: number,
        label: "Ward " + number
      });
    }

    values.push({
      value: "other",
      label: "Others"
    });

    populateSelect(select, "Select Ward", values);
  }

  fillWard(document.querySelector('[name="presentWard"]'));
  fillWard(document.querySelector('[name="permanentWard"]'));


  // =========================================
  // 9. SAME PRESENT AND PERMANENT ADDRESS
  // =========================================

  const sameAddress = $("sameAddress");
  const permanentAddressFields = $("permanentAddressFields");

  const addressSuffixes = [
    "AddressType",
    "City",
    "Division",
    "District",
    "AreaType",
    "Area",
    "Ward",
    "Union",
    "PostOffice",
    "PostCode",
    "Address"
  ];

  function copyPresentToPermanent() {

    addressSuffixes.forEach(suffix => {

      const present = document.querySelector(
        `[name="present${suffix}"]`
      );

      const permanent = document.querySelector(
        `[name="permanent${suffix}"]`
      );

      if (!present || !permanent) return;

      if (present.tagName === "SELECT") {
        const matchingOption = Array.from(permanent.options).find(
          option => option.value === present.value
        );

        permanent.value = matchingOption ? present.value : "";
      } else {
        permanent.value = present.value;
      }

      permanent.dispatchEvent(new Event("change", {
        bubbles: true
      }));
    });
  }

  if (sameAddress && permanentAddressFields) {

    sameAddress.addEventListener("change", function () {

      if (this.checked) {
        copyPresentToPermanent();
        permanentAddressFields.classList.add("hidden");
      } else {
        permanentAddressFields.classList.remove("hidden");
      }
    });

    document.querySelectorAll('[name^="present"]').forEach(field => {

      field.addEventListener("change", function () {
        if (sameAddress.checked) {
          copyPresentToPermanent();
        }
      });

      field.addEventListener("input", function () {
        if (sameAddress.checked) {
          copyPresentToPermanent();
        }
      });
    });
  }


  // =========================================
  // 10. DIPLOMA SECTION
  // =========================================

  const diplomaCheck = $("diplomaCheck");
  const diplomaFields = $("diplomaFields");

  if (diplomaCheck) {

    diplomaCheck.addEventListener("change", function () {
      toggleSection("diplomaFields", this.checked);
    });
  }


  // =========================================
  // 11. ALLIED SECTION
  // =========================================

  const alliedCheck = $("alliedCheck");

  if (alliedCheck) {

    alliedCheck.addEventListener("change", function () {
      toggleSection("alliedFields", this.checked);
    });
  }


  // =========================================
  // 12. DIPLOMA DEPARTMENT VALIDATION
  // =========================================

  const diplomaDepartment = $("diplomaDepartment");
  const departmentWarning = $("departmentWarning");

  const diplomaRestrictedFields = [
    "diplomaSession",
    "diplomaRoll",
    "diplomaReg",
    "diplomaCGPA",
    "diplomaPassingYear"
  ];

  function checkDiplomaDepartment() {

    if (!diplomaDepartment) return;

    const selected = diplomaDepartment.value;
    const isMechanical = selected === "70";
    const shouldDisable = selected !== "" && !isMechanical;

    diplomaRestrictedFields.forEach(name => {

      const field = document.querySelector(`[name="${name}"]`);

      if (!field) return;

      field.disabled = shouldDisable;

      if (shouldDisable) field.value = "";
    });

    if (departmentWarning) {

      departmentWarning.classList.toggle("show", shouldDisable);

      departmentWarning.textContent =
        selected === "other"
          ? "Other Departments are not allowed."
          : "Only Mechanical Technology is allowed for Diploma registration.";
    }
  }

  diplomaDepartment?.addEventListener(
    "change",
    checkDiplomaDepartment
  );


  // =========================================
  // 13. CURRENT STATUS SECTIONS
  // =========================================

  const statusControls = [
    ["higherStudiesCheck", "higherStudiesFields"],
    ["jobCheck", "jobFields"],
    ["businessCheck", "businessFields"],
    ["otherStatusCheck", "otherStatusFields"]
  ];

  statusControls.forEach(([checkboxId, sectionId]) => {

    const checkbox = $(checkboxId);

    checkbox?.addEventListener("change", function () {
      toggleSection(sectionId, this.checked);
    });
  });


  // =========================================
  // 14. CONTACT VISIBILITY
  // =========================================

  const visibilityYes = $("visibilityYes");
  const visibilityNo = $("visibilityNo");

  function updateContactVisibility() {
    toggleSection(
      "socialFields",
      Boolean(visibilityYes?.checked)
    );
  }

  visibilityYes?.addEventListener("change", updateContactVisibility);
  visibilityNo?.addEventListener("change", updateContactVisibility);


  // =========================================
  // 15. ACCOUNT REGISTRATION
  // =========================================

  const registrationType = $("registrationType");
  const accountFields = $("accountFields");
  const googleInfo = $("googleInfo");

  function updateRegistrationType() {

    const selected = registrationType?.value;

    toggleSection("accountFields", selected === "email");

    googleInfo?.classList.toggle(
      "show",
      selected === "google"
    );

    if (accountFields) {
      setRequired(accountFields, selected === "email");
    }
  }

  registrationType?.addEventListener(
    "change",
    updateRegistrationType
  );


  // =========================================
  // 16. PASSWORD MATCH VALIDATION
  // =========================================

  const password = $("password");
  const confirmPassword = $("confirmPassword");
  const passwordWarning = $("passwordWarning");

  function checkPasswordMatch() {

    if (!password || !confirmPassword) return true;

    const hasValues =
      password.value !== "" &&
      confirmPassword.value !== "";

    const matched =
      password.value === confirmPassword.value;

    passwordWarning?.classList.toggle(
      "show",
      hasValues && !matched
    );

    confirmPassword.setCustomValidity(
      hasValues && !matched
        ? "Passwords do not match."
        : ""
    );

    return !hasValues || matched;
  }

  password?.addEventListener("input", checkPasswordMatch);
  confirmPassword?.addEventListener("input", checkPasswordMatch);


  // =========================================
  // 17. LOGIN POPUP
  // =========================================

  const loginOpen = $("loginOpen");
  const loginClose = $("loginClose");
  const loginModal = $("loginModal");

  function openLogin() {

    if (!loginModal) return;

    loginModal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeLogin() {

    if (!loginModal) return;

    loginModal.classList.remove("show");
    document.body.style.overflow = "";
  }

  loginOpen?.addEventListener("click", function (event) {
    event.preventDefault();
    openLogin();
  });

  loginClose?.addEventListener("click", closeLogin);

  loginModal?.addEventListener("click", function (event) {
    if (event.target === loginModal) {
      closeLogin();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLogin();
  });


  // =========================================
  // 18. REGISTRATION FORM SUBMISSION
  // =========================================

  const registrationForm = $("registrationForm");

  registrationForm?.addEventListener("submit", function (event) {

    event.preventDefault();

    checkPasswordMatch();

    if (!registrationForm.checkValidity()) {
      registrationForm.reportValidity();
      return;
    }

    if (
      diplomaCheck?.checked &&
      diplomaDepartment?.value !== "70"
    ) {
      alert(
        "Only Mechanical Technology is allowed for Diploma registration."
      );

      diplomaDepartment?.focus();
      return;
    }

    if (
      sameAddress?.checked === false &&
      !document.querySelector('[name="permanentAddressType"]').value
    ) {
      alert("Please select your permanent address type.");
      document.querySelector('[name="permanentAddressType"]').focus();
      return;
    }

    if (
      registrationType?.value === "email" &&
      password?.value !== confirmPassword?.value
    ) {
      alert("Passwords do not match.");
      confirmPassword?.focus();
      return;
    }

    alert(
      "Your form is validated. Registration backend is not connected yet."
    );
  });


  // =========================================
  // 19. LOGIN FORM SUBMISSION
  // =========================================

  const loginForm = $("loginForm");

  loginForm?.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!loginForm.checkValidity()) {
      loginForm.reportValidity();
      return;
    }

    alert("Login backend is not connected yet.");
  });


  // =========================================
  // 20. INITIAL PAGE STATE
  // =========================================

  toggleSection("diplomaFields", false);
  toggleSection("alliedFields", false);
  toggleSection("higherStudiesFields", false);
  toggleSection("jobFields", false);
  toggleSection("businessFields", false);
  toggleSection("otherStatusFields", false);
  toggleSection("socialFields", false);
  toggleSection("accountFields", false);

  googleInfo?.classList.remove("show");

  if (permanentAddressFields) {
    permanentAddressFields.classList.remove("hidden");
  }

  if (sameAddress) {
    sameAddress.checked = false;
  }

  updateContactVisibility();
  updateRegistrationType();
  checkDiplomaDepartment();

  console.log(
    "Mechanical Alumni Association Registration JS Loaded Successfully."
  );

});
