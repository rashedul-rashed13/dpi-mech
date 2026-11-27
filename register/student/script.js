
document.addEventListener("DOMContentLoaded", function () {

  // =========================================
  // 1. HELPER FUNCTIONS
  // =========================================

  const $ = (id) => document.getElementById(id);

  const currentYear = new Date().getFullYear();

  function toggleSection(id, show) {
    const element = $(id);

    if (!element) return;

    element.classList.toggle("active", show);
  }

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


  // =========================================
  // 2. DATE OF BIRTH
  // =========================================

  const dobDay = $("dobDay");
  const dobMonth = $("dobMonth");
  const dobYear = $("dobYear");

  populateSelect(
    dobDay,
    "Day",
    Array.from({ length: 31 }, (_, i) =>
      String(i + 1).padStart(2, "0")
    )
  );

  populateSelect(
    dobMonth,
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

  populateSelect(dobYear, "Year", dobYears);


  // =========================================
  // 3. SESSION DROPDOWN
  // =========================================

  const sessionSelect = $("diplomaSession");

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
    sessionSelect,
    "Select Session",
    sessions
  );


  // =========================================
  // 4. PASSING YEAR DROPDOWNS
  // =========================================

  const passingYearIds = [
    "diplomaPassingYear",
    "alliedPassingYear",
    "makeupPassingYear"
  ];

  passingYearIds.forEach(id => {
    const select = $(id);

    const years = [];

    for (let year = currentYear; year >= 1955; year--) {
      years.push(year);
    }

    populateSelect(select, "Select Year", years);
  });


  // =========================================
  // 5. BANGLADESH DIVISIONS
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
      "Barguna",
      "Barishal",
      "Bhola",
      "Jhalokati",
      "Patuakhali",
      "Pirojpur"
    ],

    Chattogram: [
      "Bandarban",
      "Brahmanbaria",
      "Chandpur",
      "Chattogram",
      "Cumilla",
      "Cox's Bazar",
      "Feni",
      "Khagrachhari",
      "Lakshmipur",
      "Noakhali",
      "Rangamati"
    ],

    Dhaka: [
      "Dhaka",
      "Faridpur",
      "Gazipur",
      "Gopalganj",
      "Kishoreganj",
      "Madaripur",
      "Manikganj",
      "Munshiganj",
      "Narayanganj",
      "Narsingdi",
      "Rajbari",
      "Shariatpur",
      "Tangail"
    ],

    Khulna: [
      "Bagerhat",
      "Chuadanga",
      "Jashore",
      "Jhenaidah",
      "Khulna",
      "Kushtia",
      "Magura",
      "Meherpur",
      "Narail",
      "Satkhira"
    ],

    Mymensingh: [
      "Jamalpur",
      "Mymensingh",
      "Netrokona",
      "Sherpur"
    ],

    Rajshahi: [
      "Bogura",
      "Chapainawabganj",
      "Joypurhat",
      "Naogaon",
      "Natore",
      "Pabna",
      "Rajshahi",
      "Sirajganj"
    ],

    Rangpur: [
      "Dinajpur",
      "Gaibandha",
      "Kurigram",
      "Lalmonirhat",
      "Nilphamari",
      "Panchagarh",
      "Rangpur",
      "Thakurgaon"
    ],

    Sylhet: [
      "Habiganj",
      "Moulvibazar",
      "Sunamganj",
      "Sylhet"
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
  // 7. ADDRESS DROPDOWN INITIALIZATION
  // =========================================

  function setupAddress(prefix) {

    const division = $(
      prefix + "Division"
    );

    const district = $(
      prefix + "District"
    );

    const areaType = $(
      prefix + "AreaType"
    );

    const area = $(
      prefix + "Area"
    );

    const addressType = document.querySelector(
      `[name="${prefix}AddressType"]`
    );

    const city = $(
      prefix + "City"
    );

    populateSelect(
      division,
      "Select Division",
      divisions
    );

    populateSelect(
      city,
      "Select City Corporation",
      cityCorporations
    );

    if (district) {
      populateSelect(
        district,
        "Select District",
        []
      );
    }

    if (area) {
      populateSelect(
        area,
        "Select Area",
        []
      );
    }

    if (division && district) {

      division.addEventListener("change", function () {

        const selectedDistricts =
          districts[this.value] || [];

        populateSelect(
          district,
          "Select District",
          selectedDistricts
        );

        populateSelect(
          area,
          "Select Area",
          []
        );

      });

    }

    if (areaType && area) {

      areaType.addEventListener("change", function () {

        if (this.value === "upazila") {
          populateSelect(
            area,
            "Select Upazila",
            []
          );
        }

        else if (this.value === "municipality") {
          populateSelect(
            area,
            "Select Municipality",
            []
          );
        }

      });

    }

    if (addressType) {

      addressType.addEventListener("change", function () {

        const isCity = this.value === "city";
        const isDistrict = this.value === "district";

        const section = this.closest(".form-section");

        if (!section) return;

        section.querySelectorAll(".city-field")
          .forEach(el => {
            el.style.display = isCity ? "" : "none";
          });

        section.querySelectorAll(".district-field")
          .forEach(el => {
            el.style.display = isDistrict ? "" : "none";
          });

      });

    }

  }

  setupAddress("present");
  setupAddress("permanent");


  // =========================================
  // 8. WARD DROPDOWN
  // =========================================

  function fillWard(select, max = 99) {

    if (!select) return;

    const values = [];

    for (let i = 1; i <= max; i++) {
      values.push({
        value: String(i).padStart(2, "0"),
        label: "Ward " + String(i).padStart(2, "0")
      });
    }

    values.push({
      value: "other",
      label: "Others"
    });

    populateSelect(select, "Select Ward", values);
  }

  fillWard(
    document.querySelector('[name="presentWard"]'),
    99
  );

  fillWard(
    document.querySelector('[name="permanentWard"]'),
    99
  );


  // =========================================
  // 9. PRESENT = PERMANENT ADDRESS
  // =========================================

  const sameAddress = $("sameAddress");

  const permanentAddressFields =
    $("permanentAddressFields");

  if (sameAddress && permanentAddressFields) {

    sameAddress.addEventListener("change", function () {

      permanentAddressFields.classList.toggle(
        "hidden",
        this.checked
      );

    });

  }


  // =========================================
  // 10. DIPLOMA CHECKBOX
  // =========================================

  const diplomaCheck = $("diplomaCheck");
  const diplomaFields = $("diplomaFields");

  if (diplomaCheck) {

    diplomaCheck.addEventListener("change", function () {

      toggleSection(
        "diplomaFields",
        this.checked
      );

    });

  }


  // =========================================
  // 11. ALLIED COURSE CHECKBOX
  // =========================================

  const alliedCheck = $("alliedCheck");

  if (alliedCheck) {

    alliedCheck.addEventListener("change", function () {

      toggleSection(
        "alliedFields",
        this.checked
      );

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

    const isMechanical =
      diplomaDepartment.value === "70";

    const isOther =
      diplomaDepartment.value === "other";

    const shouldDisable =
      diplomaDepartment.value !== "" && !isMechanical;

    diplomaRestrictedFields.forEach(name => {

      const field = document.querySelector(
        `[name="${name}"]`
      );

      if (!field) return;

      field.disabled = shouldDisable;

      if (shouldDisable) {
        field.value = "";
      }

    });

    if (departmentWarning) {
      departmentWarning.classList.toggle(
        "show",
        shouldDisable
      );

      departmentWarning.textContent = isOther
        ? "Other Departments are not allowed."
        : "Only Mechanical Technology is allowed for Diploma registration.";
    }

  }

  if (diplomaDepartment) {
    diplomaDepartment.addEventListener(
      "change",
      checkDiplomaDepartment
    );
  }


  // =========================================
  // 13. CURRENT STATUS CHECKBOXES
  // =========================================

  const statusControls = [
    ["higherStudiesCheck", "higherStudiesFields"],
    ["jobCheck", "jobFields"],
    ["businessCheck", "businessFields"],
    ["otherStatusCheck", "otherStatusFields"]
  ];

  statusControls.forEach(([checkboxId, sectionId]) => {

    const checkbox = $(checkboxId);

    if (!checkbox) return;

    checkbox.addEventListener("change", function () {

      toggleSection(
        sectionId,
        this.checked
      );

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
      visibilityYes && visibilityYes.checked
    );

  }

  if (visibilityYes) {
    visibilityYes.addEventListener(
      "change",
      updateContactVisibility
    );
  }

  if (visibilityNo) {
    visibilityNo.addEventListener(
      "change",
      updateContactVisibility
    );
  }


  // =========================================
  // 15. ACCOUNT REGISTRATION
  // =========================================

  const registrationType = $("registrationType");

  const accountFields = $("accountFields");

  const googleInfo = $("googleInfo");

  function updateRegistrationType() {

    if (!registrationType) return;

    const selected = registrationType.value;

    toggleSection(
      "accountFields",
      selected === "email"
    );

    if (googleInfo) {
      googleInfo.classList.toggle(
        "show",
        selected === "google"
      );
    }

  }

  if (registrationType) {

    registrationType.addEventListener(
      "change",
      updateRegistrationType
    );

  }


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

    if (passwordWarning) {
      passwordWarning.classList.toggle(
        "show",
        hasValues && !matched
      );
    }

    confirmPassword.setCustomValidity(
      hasValues && !matched
        ? "Passwords do not match."
        : ""
    );

    return !hasValues || matched;

  }

  if (password && confirmPassword) {

    password.addEventListener(
      "input",
      checkPasswordMatch
    );

    confirmPassword.addEventListener(
      "input",
      checkPasswordMatch
    );

  }


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

  if (loginOpen) {

    loginOpen.addEventListener("click", function (event) {

      event.preventDefault();

      openLogin();

    });

  }

  if (loginClose) {
    loginClose.addEventListener(
      "click",
      closeLogin
    );
  }

  if (loginModal) {

    loginModal.addEventListener("click", function (event) {

      if (event.target === loginModal) {
        closeLogin();
      }

    });

  }

  document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
      closeLogin();
    }

  });


  // =========================================
  // 18. FORM SUBMISSION
  // =========================================

  const registrationForm = $("registrationForm");

  if (registrationForm) {

    registrationForm.addEventListener("submit", function (event) {

      event.preventDefault();

      checkPasswordMatch();

      if (!registrationForm.checkValidity()) {

        registrationForm.reportValidity();

        return;

      }

      if (
        diplomaCheck &&
        diplomaCheck.checked &&
        diplomaDepartment &&
        diplomaDepartment.value !== "70"
      ) {

        alert(
          "Only Mechanical Technology is allowed for Diploma registration."
        );

        diplomaDepartment.focus();

        return;

      }

      if (
        password &&
        confirmPassword &&
        registrationType &&
        registrationType.value === "email" &&
        password.value !== confirmPassword.value
      ) {

        alert("Passwords do not match.");

        confirmPassword.focus();

        return;

      }

      if (sameAddress && sameAddress.checked) {

        const presentAddress =
          document.querySelector(
            '[name="presentAddress"]'
          );

        if (presentAddress) {
          presentAddress.setCustomValidity("");
        }

      }

      alert(
        "Your form is validated. Connect the registration backend to save your information."
      );

    });

  }


  // =========================================
  // 19. LOGIN FORM
  // =========================================

  const loginForm = $("loginForm");

  if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

      event.preventDefault();

      if (!loginForm.checkValidity()) {
        loginForm.reportValidity();
        return;
      }

      alert(
        "Login backend is not connected yet."
      );

    });

  }


  // =========================================
  // 20. INITIAL STATE
  // =========================================

  toggleSection("diplomaFields", false);
  toggleSection("alliedFields", false);
  toggleSection("higherStudiesFields", false);
  toggleSection("jobFields", false);
  toggleSection("businessFields", false);
  toggleSection("otherStatusFields", false);
  toggleSection("socialFields", false);
  toggleSection("accountFields", false);

  console.log(
    "Mechanical Alumni Association Registration JS Loaded Successfully."
  );

});
