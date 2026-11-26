
document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // 1. ELEMENT SELECTORS
    // =========================================

    const form = document.getElementById("studentRegistrationForm");

    if (!form) return;

    const $ = (id) => document.getElementById(id);

    const diplomaCheckbox = document.querySelector(
        'input[name="qualification"][value="Diploma in Engineering"]'
    );

    const makeupCheckbox = document.querySelector(
        'input[name="qualification"][value="Allied Group Make-up Course"]'
    );

    const diplomaFields = $("diplomaFields");
    const makeupFields = $("makeupFields");

    const department = $("department");
    const session = $("session");
    const passingYear = $("passingYear");
    const makeupPassingYear = $("makeupPassingYear");

    const eligibilityMessage = $("eligibilityMessage");

    const displayContactRadios = document.querySelectorAll(
        'input[name="displayContact"]'
    );

    const publicContactFields = $("publicContactFields");


    // =========================================
    // 2. CURRENT YEAR
    // =========================================

    const currentYear = new Date().getFullYear();

    const currentSessionYear =
        new Date().getMonth() >= 6
            ? currentYear
            : currentYear - 1;


    // =========================================
    // 3. HELPER FUNCTIONS
    // =========================================

    function populateYearSelect(selectElement, startYear) {

        if (!selectElement) return;

        selectElement.innerHTML =
            '<option value="">Select Passing Year</option>';

        for (let year = currentYear; year >= startYear; year--) {

            const option = document.createElement("option");

            option.value = year;
            option.textContent = year;

            selectElement.appendChild(option);
        }
    }


    function setRequired(container, required) {

        if (!container) return;

        container.querySelectorAll("input, select, textarea").forEach(
            function (element) {

                if (
                    element.type === "checkbox" ||
                    element.type === "radio"
                ) return;

                element.required = required;
            }
        );
    }


    function showFields(element, show) {

        if (!element) return;

        element.classList.toggle("show", show);

        setRequired(element, show);
    }


    // =========================================
    // 4. SESSION DROPDOWN
    // =========================================

    function populateSessions() {

        if (!session) return;

        session.innerHTML =
            '<option value="">Select Session</option>';

        for (let year = currentSessionYear; year >= 1955; year--) {

            const option = document.createElement("option");

            option.value = `${year}-${String(year + 1).slice(-2)}`;

            option.textContent = option.value;

            session.appendChild(option);
        }
    }


    // =========================================
    // 5. PASSING YEAR DROPDOWNS
    // =========================================

    populateSessions();

    populateYearSelect(passingYear, 1955);

    populateYearSelect(makeupPassingYear, 1955);


    // =========================================
    // 6. ACADEMIC QUALIFICATION
    // =========================================

    function updateAcademicFields() {

        const diplomaSelected = diplomaCheckbox.checked;
        const makeupSelected = makeupCheckbox.checked;

        showFields(diplomaFields, diplomaSelected);

        showFields(makeupFields, makeupSelected);

        if (!diplomaSelected) {

            department.value = "";

            eligibilityMessage.textContent = "";

            eligibilityMessage.className = "eligibility-message";
        }

        if (!makeupSelected) {

            $("makeupInstitute").value = "";
            $("otherInstitute").value = "";

            $("otherInstituteGroup").style.display = "none";
        }
    }


    diplomaCheckbox.addEventListener("change", updateAcademicFields);

    makeupCheckbox.addEventListener("change", updateAcademicFields);


    // =========================================
    // 7. DEPARTMENT ELIGIBILITY
    // =========================================

    function checkDepartmentEligibility() {

        const selectedDepartment = department.value;

        eligibilityMessage.textContent = "";

        eligibilityMessage.className = "eligibility-message";

        if (!selectedDepartment) return;

        if (selectedDepartment === "70 - Mechanical Technology") {

            eligibilityMessage.textContent =
                "Your selected department meets the department requirement.";

            eligibilityMessage.classList.add("success");

        } else {

            eligibilityMessage.textContent =
                "Currently, membership eligibility is limited to 70 - Mechanical Technology.";

            eligibilityMessage.classList.add("error");
        }
    }


    department.addEventListener("change", checkDepartmentEligibility);


    // =========================================
    // 8. OTHER POLYTECHNIC FIELD
    // =========================================

    $("makeupInstitute").addEventListener("change", function () {

        const isOther = this.value === "Other";

        $("otherInstituteGroup").style.display =
            isOther ? "flex" : "none";

        $("otherInstitute").required = isOther;

        if (!isOther) {
            $("otherInstitute").value = "";
        }
    });


    // =========================================
    // 9. CURRENT STATUS CONDITIONAL FIELDS
    // =========================================

    const currentStatus = $("currentStatus");

    const jobFields = $("jobFields");
    const higherStudyFields = $("higherStudyFields");
    const businessFields = $("businessFields");
    const otherStatusFields = $("otherStatusFields");


    function updateCurrentStatus() {

        const status = currentStatus.value;

        showFields(jobFields, status === "Job Holder");

        showFields(
            higherStudyFields,
            status === "Higher Studies"
        );

        showFields(
            businessFields,
            status === "Entrepreneur / Business"
        );

        showFields(
            otherStatusFields,
            status === "Others"
        );
    }


    currentStatus.addEventListener("change", updateCurrentStatus);


    // =========================================
    // 10. DISPLAY CONTACT DETAILS
    // =========================================

    function updatePublicContactFields() {

        const selected = document.querySelector(
            'input[name="displayContact"]:checked'
        );

        const showPublicDetails =
            selected && selected.value === "Yes";

        showFields(publicContactFields, showPublicDetails);
    }


    displayContactRadios.forEach(function (radio) {

        radio.addEventListener(
            "change",
            updatePublicContactFields
        );

    });


    // =========================================
    // 11. BANGLADESH DIVISION & DISTRICT DATA
    // =========================================

    const bangladeshLocations = {

        "Dhaka": [
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

        "Chattogram": [
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

        "Rajshahi": [
            "Bogura",
            "Joypurhat",
            "Naogaon",
            "Natore",
            "Chapainawabganj",
            "Pabna",
            "Rajshahi",
            "Sirajganj"
        ],

        "Khulna": [
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

        "Barishal": [
            "Barguna",
            "Barishal",
            "Bhola",
            "Jhalokathi",
            "Patuakhali",
            "Pirojpur"
        ],

        "Sylhet": [
            "Habiganj",
            "Moulvibazar",
            "Sunamganj",
            "Sylhet"
        ],

        "Rangpur": [
            "Dinajpur",
            "Gaibandha",
            "Kurigram",
            "Lalmonirhat",
            "Nilphamari",
            "Panchagarh",
            "Rangpur",
            "Thakurgaon"
        ],

        "Mymensingh": [
            "Jamalpur",
            "Mymensingh",
            "Netrokona",
            "Sherpur"
        ]

    };


    // =========================================
    // 12. ADDRESS DROPDOWN FUNCTION
    // =========================================

    function setupAddress(prefix) {

        const division = $(prefix + "division");
        const district = $(prefix + "district");
        const areaType = $(prefix + "areaType");
        const location = $(prefix + "location");

        if (!division || !district || !areaType || !location) {
            return;
        }

        division.innerHTML =
            '<option value="">Select Division</option>';

        Object.keys(bangladeshLocations).forEach(function (name) {

            const option = document.createElement("option");

            option.value = name;
            option.textContent = name;

            division.appendChild(option);
        });


        division.addEventListener("change", function () {

            district.innerHTML =
                '<option value="">Select District</option>';

            location.innerHTML =
                '<option value="">Select Location</option>';

            const districts = bangladeshLocations[this.value] || [];

            districts.forEach(function (name) {

                const option = document.createElement("option");

                option.value = name;
                option.textContent = name;

                district.appendChild(option);
            });
        });


        district.addEventListener("change", function () {

            updateLocationOptions();
        });


        areaType.addEventListener("change", function () {

            updateLocationOptions();
        });


        function updateLocationOptions() {

            const selectedDistrict = district.value;
            const selectedArea = areaType.value;

            location.innerHTML =
                '<option value="">Select Location</option>';

            if (!selectedDistrict || !selectedArea) return;

            /*
             * Upazila, Municipality and City Corporation
             * require a complete official location dataset.
             * For now, the user can select the district name
             * or use the detailed address field.
             */

            const option = document.createElement("option");

            option.value = selectedDistrict;
            option.textContent = selectedDistrict + " (District area)";

            location.appendChild(option);
        }

    }


    setupAddress("");

    setupAddress("permanent");


    // =========================================
    // 13. SAME AS PRESENT ADDRESS
    // =========================================

    const sameAddress = $("sameAddress");

    const addressPairs = [

        ["division", "permanentDivision"],
        ["district", "permanentDistrict"],
        ["areaType", "permanentAreaType"],
        ["location", "permanentLocation"],
        ["presentAddress", "permanentAddress"]

    ];


    function copyPresentAddress() {

        addressPairs.forEach(function (pair) {

            const source = $(pair[0]);
            const target = $(pair[1]);

            target.value = source.value;

            target.disabled = sameAddress.checked;

        });
    }


    sameAddress.addEventListener("change", copyPresentAddress);


    addressPairs.forEach(function (pair) {

        const source = $(pair[0]);

        source.addEventListener("change", function () {

            if (sameAddress.checked) {
                copyPresentAddress();
            }

        });

        source.addEventListener("input", function () {

            if (sameAddress.checked) {
                copyPresentAddress();
            }

        });

    });


    // =========================================
    // 14. PASSWORD VALIDATION
    // =========================================

    const password = $("password");
    const confirmPassword = $("confirmPassword");


    function validatePassword() {

        if (confirmPassword.value === "") {

            confirmPassword.setCustomValidity("");

            return;
        }

        if (password.value !== confirmPassword.value) {

            confirmPassword.setCustomValidity(
                "Passwords do not match."
            );

        } else {

            confirmPassword.setCustomValidity("");
        }
    }


    password.addEventListener("input", validatePassword);

    confirmPassword.addEventListener("input", validatePassword);


    // =========================================
    // 15. FORM SUBMISSION
    // =========================================

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const message = $("formMessage");

        message.textContent = "";

        message.style.color = "#d93025";


        // At least one academic qualification
        if (
            !diplomaCheckbox.checked &&
            !makeupCheckbox.checked
        ) {

            alert("Please select at least one Academic Qualification.");

            return;
        }


        // Department eligibility
        if (
            diplomaCheckbox.checked &&
            department.value !== "70 - Mechanical Technology"
        ) {

            alert(
                "Diploma membership currently requires 70 - Mechanical Technology."
            );

            department.focus();

            return;
        }


        // Password check
        validatePassword();

        if (password.value !== confirmPassword.value) {

            alert("Password and Confirm Password do not match.");

            confirmPassword.focus();

            return;
        }


        // Browser validation
        if (!form.reportValidity()) {
            return;
        }


        // Same address: restore fields before collecting values
        if (sameAddress.checked) {

            addressPairs.forEach(function (pair) {

                const source = $(pair[0]);
                const target = $(pair[1]);

                target.value = source.value;
                target.disabled = false;

            });

        }


        message.style.color = "#16834a";

        message.textContent =
            "Form validation successful. Backend connection is required to submit your registration.";


        // Restore disabled state after validation
        if (sameAddress.checked) {

            addressPairs.forEach(function (pair) {

                $(pair[1]).disabled = true;

            });

        }

    });


    // =========================================
    // 16. INITIAL STATE
    // =========================================

    updateAcademicFields();

    updateCurrentStatus();

    updatePublicContactFields();


});
