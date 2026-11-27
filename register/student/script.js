
document.addEventListener("DOMContentLoaded", function () {

  // =========================================
  // 1. HELPER FUNCTIONS
  // =========================================

  const $ = id => document.getElementById(id);

  const field = name =>
    document.querySelector(`[name="${name}"]`);

  const currentYear = new Date().getFullYear();

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


  // Preserve original required state.
  function setRequired(container, required) {
    if (!container) return;

    container.querySelectorAll("input, select, textarea")
      .forEach(input => {

        if (input.dataset.originalRequired === undefined) {
          input.dataset.originalRequired =
            input.required ? "true" : "false";
        }

        input.required =
          required &&
          input.dataset.originalRequired === "true";
      });
  }


  // Show / hide conditional sections.
  function toggleSection(id, show) {
    const element = $(id);

    if (!element) return;

    element.classList.toggle("active", show);

    setRequired(element, show);
  }


  // Safely read names from different JSON structures.
  function getName(item) {

    if (typeof item === "string") return item;

    if (!item || typeof item !== "object") return "";

    const name =
      item.name ||
      item.en_name ||
      item.english_name ||
      item.name_en ||
      "";

    if (typeof name === "string") return name;

    if (typeof name === "object") {
      return (
        name.en ||
        name.english ||
        name.name ||
        Object.values(name)[0] ||
        ""
      );
    }

    return "";
  }


  function setSelectValue(select, value) {
    if (!select) return;

    const exists = Array.from(select.options).some(
      option => option.value === value
    );

    select.value = exists ? value : "";
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

    const nextYear = String((year + 1) % 100)
      .padStart(2, "0");

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

      bangladeshData = Array.isArray(data)
        ? data
        : data.divisions || data.data || [];

      if (!bangladeshData.length) {
        throw new Error("Invalid location data.");
      }

      locationDataLoaded = true;

      // Populate both division dropdowns.
      ["present", "permanent"].forEach(prefix => {

        const division = field(prefix + "Division");

        populateSelect(
          division,
          "Select Division",
          getDivisionNames()
        );

      });


      // Copy address if checkbox was selected
      // before location data finished loading.
      if (sameAddress?.checked) {
        copyPresentToPermanent();
      }

      console.log("Bangladesh location data loaded successfully.");

    } catch (error) {

      console.error("Bangladesh location data error:", error);

      ["present", "permanent"].forEach(prefix => {

        populateSelect(
          field(prefix + "Division"),
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

    const municipalities = [];

    const upazilas = district.upazilas || [];

    upazilas.forEach(upazila => {

      (upazila.pourashavas || []).forEach(item => {

        const name = getName(item);

        if (name && !municipalities.includes(name)) {
          municipalities.push(name);
        }

      });

    });


    // Some datasets store Pourashavas
    // directly inside the district.

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

    const addressType = field(prefix + "AddressType");

    const city = field(prefix + "City");

    const division = field(prefix + "Division");

    const district = field(prefix + "District");

    const areaType = field(prefix + "AreaType");

    const area = field(prefix + "Area");

    if (!addressType) return;


    // City Corporation options.

    populateSelect(
      city,
      "Select City Corporation",
      cityCorporations
    );


    populateSelect(
      division,
      "Select Division",
      locationDataLoaded ? getDivisionNames() : []
    );

    populateSelect(district, "Select District", []);

    populateSelect(area, "Select Area", []);


    // Update Upazila / Municipality options.

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


    // District → Area

    district?.addEventListener("change", function () {

      updateAreaOptions();

    });


    // Area Type → Area

    areaType?.addEventListener("change", function () {

      updateAreaOptions();

    });


    // Address Type visibility.

    function updateAddressFields() {

      const selected = addressType.value;

      const cityGroup = city?.closest(".form-group");

      const districtGroups = [
        division,
        district,
        areaType,
        area
      ]
        .map(element => element?.closest(".form-group"))
        .filter(Boolean);


      const showCity = selected === "city";

      const showDistrict = selected === "district";


      if (cityGroup) {

        cityGroup.style.display = showCity ? "" : "none";

        setRequired(cityGroup, showCity);

      }


      districtGroups.forEach(group => {

        group.style.display = showDistrict ? "" : "none";

        setRequired(group, showDistrict);

      });

    }


    addressType.addEventListener(
      "change",
      updateAddressFields
    );

    updateAddressFields();

  }


  // Initialize address forms once.

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


  fillWard(field("presentWard"));

  fillWard(field("permanentWard"));


  // =========================================
  // 9. SAME PRESENT AND PERMANENT ADDRESS
  // =========================================

  const sameAddress = $("sameAddress");

  const permanentAddressFields =
    $("permanentAddressFields");


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

    if (!locationDataLoaded) return;


    addressSuffixes.forEach(suffix => {

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

        permanentAddressFields.classList.add("hidden");

        setRequired(permanentAddressFields, false);

        if (locationDataLoaded) {
          copyPresentToPermanent();
        }

      } else {

        permanentAddressFields.classList.remove("hidden");

        setRequired(permanentAddressFields, true);

      }

    });


    // Keep permanent address synchronized
    // whenever present address changes.

    document.querySelectorAll('[name^="present"]')
      .forEach(input => {

        input.addEventListener("change", function () {

          if (sameAddress.checked) {
            copyPresentToPermanent();
          }

        });

        input.addEventListener("input", function () {

          if (sameAddress.checked) {
            copyPresentToPermanent();
          }

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

    updateAlliedPolytechnic();

  });


  // =========================================
  // 12. ALLIED POLYTECHNIC OTHER OPTION
  // =========================================

  const alliedPolytechnic = $("alliedPolytechnic");

  const alliedPolytechnicOther =
    $("alliedPolytechnicOther");


  function updateAlliedPolytechnic() {

    if (!alliedPolytechnic || !alliedPolytechnicOther) {
      return;
    }

    const alliedEnabled =
      $("alliedCheck")?.checked === true;

    const isOther =
      alliedPolytechnic.value === "other";

    const showOther =
      alliedEnabled && isOther;


    alliedPolytechnicOther.style.display =
      showOther ? "block" : "none";


    alliedPolytechnicOther.required = showOther;


    if (!showOther) {
      alliedPolytechnicOther.value = "";
    }

  }


  alliedPolytechnic?.addEventListener(
    "change",
    updateAlliedPolytechnic
  );


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

      if (shouldDisable) {
        input.value = "";
      }

    });


    if (departmentWarning) {

      departmentWarning.classList.toggle(
        "show",
        shouldDisable
      );

      departmentWarning.textContent =
        "Only Mechanical Technology is allowed for Diploma registration.";

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

    const emailSelected = selected === "email";

    toggleSection("accountFields", emailSelected);


    googleInfo?.classList.toggle(
      "show",
      selected === "google"
    );


    if (accountFields) {
      setRequired(accountFields, emailSelected);
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


  password?.addEventListener(
    "input",
    checkPasswordMatch
  );

  confirmPassword?.addEventListener(
    "input",
    checkPasswordMatch
  );


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


    // Diploma Department validation.

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


    // Allied Polytechnic validation.

    if (
      $("alliedCheck")?.checked &&
      alliedPolytechnic?.value === "other" &&
      !alliedPolytechnicOther?.value.trim()
    ) {

      alert("Please enter your Polytechnic Name.");

      alliedPolytechnicOther?.focus();

      return;
    }


    // Permanent address validation.

    if (
      !sameAddress?.checked &&
      !field("permanentAddressType")?.value
    ) {

      alert("Please select your permanent address type.");

      field("permanentAddressType")?.focus();

      return;
    }


    // Password validation.

    if (
      registrationType?.value === "email" &&
      password?.value !== confirmPassword?.value
    ) {

      alert("Passwords do not match.");

      confirmPassword?.focus();

      return;
    }


    // Backend is not connected yet.

    alert(
      "Your form is validated. Registration backend is not connected yet."
    );

  });


  // =========================================
  // 19. INITIAL PAGE STATE
  // =========================================

  const initialSections = [
    "diplomaFields",
    "alliedFields",
    "higherStudiesFields",
    "jobFields",
    "businessFields",
    "otherStatusFields",
    "socialFields",
    "accountFields"
  ];


  initialSections.forEach(id => {

    toggleSection(id, false);

  });


  googleInfo?.classList.remove("show");


  // Same address starts unchecked.

  if (sameAddress) {
    sameAddress.checked = false;
  }


  permanentAddressFields?.classList.remove("hidden");

  setRequired(permanentAddressFields, true);


  // Initial state updates.

  updateContactVisibility();

  updateRegistrationType();

  updateAlliedPolytechnic();

  checkDiplomaDepartment();


  // =========================================
  // 20. LOAD BANGLADESH LOCATION DATA
  // =========================================

  loadBangladeshData();


  // =========================================
  // 21. CONSOLE MESSAGE
  // =========================================

  console.log(
    "Mechanical Alumni Association Registration JS Loaded Successfully."
  );

});
