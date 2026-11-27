
document.addEventListener("DOMContentLoaded", function () {

  // =========================================
  // 1. HELPER FUNCTIONS
  // =========================================

  const $ = id => document.getElementById(id);
  const currentYear = new Date().getFullYear();

  const field = name =>
    document.querySelector(`[name="${name}"]`);

  function populateSelect(select, placeholder, values = []) {
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
    if (element) element.classList.toggle("active", show);
  }

  function setRequired(container, required) {
    if (!container) return;

    container.querySelectorAll("input, select, textarea")
      .forEach(input => {
        if (input.dataset.originalRequired === undefined) {
          input.dataset.originalRequired =
            input.required ? "true" : "false";
        }

        input.required =
          required && input.dataset.originalRequired === "true";
      });
  }

  function getName(item) {
    if (typeof item === "string") return item;
    return item?.name || item?.en_name || item?.english_name || "";
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

  populateSelect($("dobMonth"), "Month", [
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
  ]);

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

  sessions.push({ value: "other", label: "Other" });

  populateSelect($("diplomaSession"), "Select Session", sessions);


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
  // 5. CITY CORPORATION LIST
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
  // 6. BANGLADESH GEO DATA
  // =========================================

  let bangladeshData = [];
  let locationDataLoaded = false;

  const GEO_DATA_URL =
    "https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json";

  async function loadBangladeshData() {
    try {
      const response = await fetch(GEO_DATA_URL);

      if (!response.ok) {
        throw new Error("Location data could not be loaded.");
      }

      const data = await response.json();

      // Dataset root is expected to contain divisions.
      bangladeshData = Array.isArray(data)
        ? data
        : data.divisions || data.data || [];

      if (!bangladeshData.length) {
        throw new Error("Invalid location data.");
      }

      locationDataLoaded = true;

      setupAddress("present");
      setupAddress("permanent");

      // If Same Address was checked before data finished loading
      if ($("sameAddress")?.checked) {
        copyPresentToPermanent();
      }

      console.log("Bangladesh location data loaded.");

    } catch (error) {
      console.error("Location data error:", error);

      document.querySelectorAll(
        '[name="presentDivision"], [name="permanentDivision"]'
      ).forEach(select => {
        populateSelect(
          select,
          "Location data unavailable - reload page",
          []
        );
      });
    }
  }

  function findDivision(name) {
    return bangladeshData.find(
      item => getName(item) === name
    );
  }

  function findDistrict(name) {
    for (const division of bangladeshData) {
      const districts = division.districts || [];

      const found = districts.find(
        item => getName(item) === name
      );

      if (found) return found;
    }

    return null;
  }

  function getDivisionNames() {
    return bangladeshData
      .map(item => getName(item))
      .filter(Boolean);
  }

  function getDistrictNames(divisionName) {
    const division = findDivision(divisionName);

    if (!division) return [];

    return (division.districts || [])
      .map(item => getName(item))
      .filter(Boolean);
  }

  function getUpazilas(districtName) {
    const district = findDistrict(districtName);

    if (!district) return [];

    return (district.upazilas || [])
      .map(item => getName(item))
      .filter(Boolean);
  }

  function getMunicipalities(districtName) {
    const district = findDistrict(districtName);

    if (!district) return [];

    const upazilas = district.upazilas || [];
    const municipalities = [];

    upazilas.forEach(upazila => {
      (upazila.pourashavas || []).forEach(item => {
        const name = getName(item);

        if (name && !municipalities.includes(name)) {
          municipalities.push(name);
        }
      });
    });

    // Some datasets may store pourashavas directly in the district.
    (district.pourashavas || []).forEach(item => {
      const name = getName(item);

      if (name && !municipalities.includes(name)) {
        municipalities.push(name);
      }
    });

    return municipalities;
  }


  // =========================================
  // 7. ADDRESS DROPDOWNS
  // =========================================

  function setupAddress(prefix) {

    // IMPORTANT: Use name selectors because the HTML
    // does not assign IDs to these address fields.

    const addressType = field(prefix + "AddressType");
    const city = field(prefix + "City");
    const division = field(prefix + "Division");
    const district = field(prefix + "District");
    const areaType = field(prefix + "AreaType");
    const area = field(prefix + "Area");

    if (!addressType) return;

    // City Corporation list works independently of geo data.
    populateSelect(
      city,
      "Select City Corporation",
      cityCorporations
    );

    populateSelect(division, "Select Division", []);
    populateSelect(district, "Select District", []);
    populateSelect(area, "Select Area", []);

    function updateAreaOptions() {
      if (!area || !district || !areaType) return;

      const selectedDistrict = district.value;
      const selectedType = areaType.value;

      if (!selectedDistrict || !selectedType) {
        populateSelect(area, "Select Area", []);
        return;
      }

      if (selectedType === "upazila") {
        populateSelect(
          area,
          "Select Upazila",
          getUpazilas(selectedDistrict)
        );
      } else if (selectedType === "municipality") {
        populateSelect(
          area,
          "Select Municipality",
          getMunicipalities(selectedDistrict)
        );
      } else {
        populateSelect(area, "Select Area", []);
      }
    }

    // Division → District
    division?.addEventListener("change", function () {
      populateSelect(
        district,
        "Select District",
        getDistrictNames(this.value)
      );

      populateSelect(area, "Select Area", []);
    });

    // District → Upazila / Municipality
    district?.addEventListener("change", function () {
      updateAreaOptions();
    });

    // Area Type → Upazila / Municipality
    areaType?.addEventListener("change", function () {
      updateAreaOptions();
    });

    // Address Type visibility
    function updateAddressFields() {
      const selected = addressType.value;
      const section = addressType.closest(".form-section");

      if (!section) return;

      const cityGroup = city?.closest(".form-group");

      const districtGroups = [
        division,
        district,
        areaType,
        area
      ]
        .map(element => element?.closest(".form-group"))
        .filter(Boolean);

      if (cityGroup) {
        cityGroup.style.display =
          selected === "city" ? "" : "none";
      }

      districtGroups.forEach(group => {
        group.style.display =
          selected === "district" ? "" : "none";
      });
    }

    addressType.addEventListener("change", updateAddressFields);

    updateAddressFields();

    // Load division list after the geo data is available.
    if (locationDataLoaded) {
      populateSelect(
        division,
        "Select Division",
        getDivisionNames()
      );
    }
  }

  // Initialize both address forms.
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

    values.push({ value: "other", label: "Others" });

    populateSelect(select, "Select Ward", values);
  }

  fillWard(field("presentWard"));
  fillWard(field("permanentWard"));


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

  function setSelectValue(select, value) {
    if (!select) return;

    const exists = Array.from(select.options).some(
      option => option.value === value
    );

    select.value = exists ? value : "";
  }

  function copyPresentToPermanent() {
    if (!locationDataLoaded) return;

    // Copy in dependency order so the required options
    // exist before selecting them.

    const order = [
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

    order.forEach(suffix => {
      const present = field("present" + suffix);
      const permanent = field("permanent" + suffix);

      if (!present || !permanent) return;

      if (permanent.tagName === "SELECT") {
        setSelectValue(permanent, present.value);
        permanent.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      } else {
        permanent.value = present.value;
        permanent.dispatchEvent(
          new Event("input", { bubbles: true })
        );
      }
    });
  }

  if (sameAddress && permanentAddressFields) {
    sameAddress.addEventListener("change", function () {
      if (this.checked) {
        if (locationDataLoaded) {
          copyPresentToPermanent();
        }

        permanentAddressFields.classList.add("hidden");
      } else {
        permanentAddressFields.classList.remove("hidden");
      }
    });

    document.querySelectorAll('[name^="present"]').forEach(input => {
      input.addEventListener("change", function () {
        if (sameAddress.checked) copyPresentToPermanent();
      });

      input.addEventListener("input", function () {
        if (sameAddress.checked) copyPresentToPermanent();
      });
    });
  }


  // =========================================
  // 10. DIPLOMA SECTION
  // =========================================

  $("diplomaCheck")?.addEventListener("change", function () {
    toggleSection("diplomaFields", this.checked);
  });


  // =========================================
  // 11. ALLIED SECTION
  // =========================================

  $("alliedCheck")?.addEventListener("change", function () {
    toggleSection("alliedFields", this.checked);
  });


  // =========================================
  // 12. ALLIED POLYTECHNIC OTHER OPTION
  // =========================================

  const alliedPolytechnic = $("alliedPolytechnic");
  const alliedPolytechnicOther = $("alliedPolytechnicOther");

  function updateAlliedPolytechnic() {
    if (!alliedPolytechnic || !alliedPolytechnicOther) return;

    const isOther = alliedPolytechnic.value === "other";

    alliedPolytechnicOther.style.display =
      isOther ? "block" : "none";

    alliedPolytechnicOther.required = isOther;

    if (!isOther) {
      alliedPolytechnicOther.value = "";
    }
  }

  alliedPolytechnic?.addEventListener(
    "change",
    updateAlliedPolytechnic
  );

  updateAlliedPolytechnic();


  // =========================================
  // 13. DIPLOMA DEPARTMENT VALIDATION
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
    const shouldDisable =
      selected !== "" && selected !== "70";

    diplomaRestrictedFields.forEach(name => {
      const input = field(name);

      if (!input) return;

      input.disabled = shouldDisable;

      if (shouldDisable) input.value = "";
    });

    if (departmentWarning) {
      departmentWarning.classList.toggle(
        "show",
        shouldDisable
      );

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
  // 14. CURRENT STATUS SECTIONS
  // =========================================

  const statusControls = [
    ["higherStudiesCheck", "higherStudiesFields"],
    ["jobCheck", "jobFields"],
    ["businessCheck", "businessFields"],
    ["otherStatusCheck", "otherStatusFields"]
  ];

  statusControls.forEach(([checkboxId, sectionId]) => {
    $(checkboxId)?.addEventListener("change", function () {
      toggleSection(sectionId, this.checked);
    });
  });


  // =========================================
  // 15. CONTACT VISIBILITY
  // =========================================

  const visibilityYes = $("visibilityYes");
  const visibilityNo = $("visibilityNo");

  function updateContactVisibility() {
    toggleSection(
      "socialFields",
      Boolean(visibilityYes?.checked)
    );
  }

  visibilityYes?.addEventListener(
    "change",
    updateContactVisibility
  );

  visibilityNo?.addEventListener(
    "change",
    updateContactVisibility
  );


  // =========================================
  // 16. ACCOUNT REGISTRATION
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
  // 17. PASSWORD MATCH VALIDATION
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
  // 18. LOGIN POPUP
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
    if (event.target === loginModal) closeLogin();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLogin();
  });


  // =========================================
  // 19. REGISTRATION FORM SUBMISSION
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
      $("diplomaCheck")?.checked &&
      diplomaDepartment?.value !== "70"
    ) {
      alert(
        "Only Mechanical Technology is allowed for Diploma registration."
      );

      diplomaDepartment?.focus();
      return;
    }

    if (
      $("alliedCheck")?.checked &&
      alliedPolytechnic?.value === "other" &&
      !alliedPolytechnicOther.value.trim()
    ) {
      alert("Please enter your Polytechnic Name.");
      alliedPolytechnicOther.focus();
      return;
    }

    if (
      sameAddress?.checked === false &&
      !field("permanentAddressType")?.value
    ) {
      alert("Please select your permanent address type.");
      field("permanentAddressType")?.focus();
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
  // 20. LOGIN FORM SUBMISSION
  // =========================================

  $("loginForm")?.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }

    alert("Login backend is not connected yet.");
  });


  // =========================================
  // 21. INITIAL PAGE STATE
  // =========================================

  [
    "diplomaFields",
    "alliedFields",
    "higherStudiesFields",
    "jobFields",
    "businessFields",
    "otherStatusFields",
    "socialFields",
    "accountFields"
  ].forEach(id => toggleSection(id, false));

  googleInfo?.classList.remove("show");

  permanentAddressFields?.classList.remove("hidden");

  if (sameAddress) sameAddress.checked = false;

  updateContactVisibility();
  updateRegistrationType();
  updateAlliedPolytechnic();
  checkDiplomaDepartment();

  // Load Bangladesh divisions, districts,
  // upazilas and municipalities.
  loadBangladeshData();

  console.log(
    "Mechanical Alumni Association Registration JS Loaded Successfully."
  );

});
