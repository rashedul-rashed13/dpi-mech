
document.addEventListener("DOMContentLoaded", function () {

  // =========================================
  // 1. BASIC SETTINGS
  // =========================================

  const currentYear = new Date().getFullYear();

  const currentYearElement = document.getElementById("currentYear");

  if (currentYearElement) {
    currentYearElement.textContent = currentYear;
  }

  function getElement(id) {
    return document.getElementById(id);
  }

  function showElement(id, show) {
    const element = getElement(id);
    if (element) {
      element.classList.toggle("hidden", !show);
    }
  }

  function fillYears(selectId, startYear, endYear, sessionMode = false) {
    const select = getElement(selectId);
    if (!select) return;

    select.innerHTML = '<option value="">Select Year</option>';

    for (let year = startYear; year >= endYear; year--) {
      const option = document.createElement("option");

      if (sessionMode) {
        option.value = `${year}-${String(year + 1).slice(-2)}`;
        option.textContent = `${year}-${String(year + 1).slice(-2)}`;
      } else {
        option.value = year;
        option.textContent = year;
      }

      select.appendChild(option);
    }

    if (sessionMode) {
      const other = document.createElement("option");
      other.value = "Other";
      other.textContent = "Other";
      select.appendChild(other);
    }
  }


  // =========================================
  // 2. YEAR DROPDOWNS
  // =========================================

  fillYears("session", currentYear, 1955, true);
  fillYears("diplomaPassing", currentYear, 1955);
  fillYears("alliedPassing", currentYear, 1955);


  // =========================================
  // 3. DATE OF BIRTH
  // =========================================

  const dob = getElement("dob");

  if (dob) {
    dob.max = new Date().toISOString().split("T")[0];
  }


  // =========================================
  // 4. DIPLOMA & ALLIED COURSE
  // =========================================

  const diplomaCheck = getElement("diplomaCheck");
  const alliedCheck = getElement("alliedCheck");

  function updateAcademicFields() {
    showElement("diplomaFields", diplomaCheck?.checked);
    showElement("alliedFields", alliedCheck?.checked);

    if (diplomaCheck) {
      setRequired("department", diplomaCheck.checked);
      setRequired("session", diplomaCheck.checked);
      setRequired("diplomaRoll", diplomaCheck.checked);
      setRequired("diplomaReg", diplomaCheck.checked);
    }
  }

  diplomaCheck?.addEventListener("change", updateAcademicFields);
  alliedCheck?.addEventListener("change", updateAcademicFields);


  // =========================================
  // 5. DEPARTMENT VALIDATION
  // =========================================

  const department = getElement("department");
  const departmentWarning = getElement("departmentWarning");

  function validateDepartment() {
    if (!department) return;

    const invalidDepartment = department.value !== "" &&
      department.value !== "70";

    showElement("departmentWarning", invalidDepartment);

    if (invalidDepartment) {
      department.setCustomValidity(
        "Other Departments are not allowed."
      );
    } else {
      department.setCustomValidity("");
    }
  }

  department?.addEventListener("change", validateDepartment);


  // =========================================
  // 6. SESSION OTHER OPTION
  // =========================================

  const sessionSelect = getElement("session");

  if (sessionSelect) {
    sessionSelect.addEventListener("change", function () {
      let otherInput = getElement("otherSession");

      if (this.value === "Other") {
        if (!otherInput) {
          otherInput = document.createElement("input");
          otherInput.type = "text";
          otherInput.id = "otherSession";
          otherInput.name = "otherSession";
          otherInput.placeholder = "Enter your session";
          otherInput.className = "other-session-input";

          this.insertAdjacentElement("afterend", otherInput);
        }
      } else if (otherInput) {
        otherInput.remove();
      }
    });
  }


  // =========================================
  // 7. SAME PRESENT & PERMANENT ADDRESS
  // =========================================

  const sameAddress = getElement("sameAddress");

  const addressFieldIds = [
    "permanentType",
    "permanentDivision",
    "permanentDistrict",
    "permanentArea",
    "permanentPost",
    "permanentPostCode",
    "permanentAddress"
  ];

  function copyAddress() {
    const fields = [
      "presentType",
      "presentDivision",
      "presentDistrict",
      "presentArea",
      "presentPost",
      "presentPostCode",
      "presentAddress"
    ];

    fields.forEach((presentId, index) => {
      const presentField = getElement(presentId);
      const permanentField = getElement(addressFieldIds[index]);

      if (presentField && permanentField) {
        permanentField.value = presentField.value;
      }
    });
  }

  function updateSameAddress() {
    const permanentFields = getElement("permanentAddressFields");

    if (!permanentFields) return;

    if (sameAddress?.checked) {
      copyAddress();
      permanentFields.classList.add("hidden");
      addressFieldIds.forEach(id => setRequired(id, false));
    } else {
      permanentFields.classList.remove("hidden");
    }
  }

  sameAddress?.addEventListener("change", updateSameAddress);

  [
    "presentType",
    "presentDivision",
    "presentDistrict",
    "presentArea",
    "presentPost",
    "presentPostCode",
    "presentAddress"
  ].forEach(id => {
    getElement(id)?.addEventListener("input", function () {
      if (sameAddress?.checked) copyAddress();
    });

    getElement(id)?.addEventListener("change", function () {
      if (sameAddress?.checked) copyAddress();
    });
  });


  // =========================================
  // 8. ADDRESS DIVISION & DISTRICT DATA
  // =========================================

  const divisions = {
    "Dhaka": [
      "Dhaka", "Faridpur", "Gazipur", "Gopalganj",
      "Kishoreganj", "Madaripur", "Manikganj",
      "Munshiganj", "Narayanganj", "Narsingdi",
      "Rajbari", "Shariatpur", "Tangail"
    ],
    "Chattogram": [
      "Chattogram", "Cox's Bazar", "Cumilla",
      "Brahmanbaria", "Chandpur", "Feni",
      "Khagrachhari", "Lakshmipur", "Noakhali",
      "Rangamati", "Bandarban"
    ],
    "Rajshahi": [
      "Rajshahi", "Bogura", "Joypurhat", "Naogaon",
      "Natore", "Chapainawabganj", "Pabna", "Sirajganj"
    ],
    "Khulna": [
      "Khulna", "Bagerhat", "Chuadanga", "Jashore",
      "Jhenaidah", "Kushtia", "Magura", "Meherpur",
      "Narail", "Satkhira"
    ],
    "Barishal": [
      "Barishal", "Barguna", "Bhola", "Jhalokathi",
      "Patuakhali", "Pirojpur"
    ],
    "Sylhet": [
      "Sylhet", "Habiganj", "Moulvibazar", "Sunamganj"
    ],
    "Rangpur": [
      "Rangpur", "Dinajpur", "Gaibandha", "Kurigram",
      "Lalmonirhat", "Nilphamari", "Panchagarh", "Thakurgaon"
    ],
    "Mymensingh": [
      "Mymensingh", "Jamalpur", "Netrokona", "Sherpur"
    ]
  };

  function setupAddress(prefix) {
    const divisionSelect = getElement(prefix + "Division");
    const districtSelect = getElement(prefix + "District");

    if (!divisionSelect || !districtSelect) return;

    divisionSelect.innerHTML =
      '<option value="">Select Division</option>';

    Object.keys(divisions).forEach(division => {
      const option = document.createElement("option");
      option.value = division;
      option.textContent = division;
      divisionSelect.appendChild(option);
    });

    divisionSelect.addEventListener("change", function () {
      districtSelect.innerHTML =
        '<option value="">Select District</option>';

      const selectedDistricts = divisions[this.value] || [];

      selectedDistricts.forEach(district => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
      });
    });
  }

  setupAddress("present");
  setupAddress("permanent");


  // =========================================
  // 9. CURRENT STATUS
  // =========================================

  const currentStatus = getElement("currentStatus");

  function updateCurrentStatus() {
    const status = currentStatus?.value;

    showElement("higherFields", status === "higher");
    showElement("jobFields", status === "job");
    showElement("businessFields", status === "business");
    showElement("otherStatusFields", status === "other");
  }

  currentStatus?.addEventListener("change", updateCurrentStatus);


  // =========================================
  // 10. CONTACT VISIBILITY
  // =========================================

  const visibility = getElement("visibility");

  function updateVisibility() {
    showElement("socialFields", visibility?.value === "yes");
  }

  visibility?.addEventListener("change", updateVisibility);


  // =========================================
  // 11. JOB TYPE
  // =========================================

  const jobType = getElement("jobType");
  const organizationLabel = document.querySelector(
    'label[for="organization"]'
  );

  function updateJobType() {
    if (!jobType || !organizationLabel) return;

    if (jobType.value === "government") {
      organizationLabel.textContent = "Organization Name (Government)";
    } else if (jobType.value === "private") {
      organizationLabel.textContent = "Organization / Company (Private)";
    } else {
      organizationLabel.textContent = "Organization / Company";
    }
  }

  jobType?.addEventListener("change", updateJobType);


  // =========================================
  // 12. REQUIRED FIELD HELPER
  // =========================================

  function setRequired(id, required) {
    const element = getElement(id);

    if (element) {
      element.required = required;
    }
  }


  // =========================================
  // 13. GOOGLE SIGN-IN DEMO
  // =========================================

  const googleSignIn = getElement("googleSignIn");

  googleSignIn?.addEventListener("click", function () {
    alert(
      "Google Sign-in চালু করতে Google OAuth এবং Backend Configuration প্রয়োজন।"
    );
  });


  // =========================================
  // 14. FORM SUBMISSION DEMO
  // =========================================

  const registrationForm = getElement("registrationForm");

  registrationForm?.addEventListener("submit", function (event) {
    event.preventDefault();

    validateDepartment();

    if (sameAddress?.checked) {
      copyAddress();
    }

    if (!registrationForm.checkValidity()) {
      registrationForm.reportValidity();
      return;
    }

    if (diplomaCheck?.checked && department?.value !== "70") {
      department?.reportValidity();
      return;
    }

    alert(
      "Your registration form has been validated successfully. Backend connection is required to save your information."
    );
  });


  // =========================================
  // 15. RESET FORM
  // =========================================

  registrationForm?.addEventListener("reset", function () {
    setTimeout(function () {
      updateAcademicFields();
      updateCurrentStatus();
      updateVisibility();

      showElement("departmentWarning", false);

      if (department) {
        department.setCustomValidity("");
      }

      const otherSession = getElement("otherSession");
      if (otherSession) otherSession.remove();

      const permanentFields = getElement("permanentAddressFields");
      permanentFields?.classList.remove("hidden");

      updateJobType();
    }, 0);
  });


  // =========================================
  // 16. INITIALIZE
  // =========================================

  updateAcademicFields();
  updateCurrentStatus();
  updateVisibility();
  updateJobType();

});
