document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     1. POPULATE DATE OF BIRTH, SESSIONS & PASSING YEARS
  ========================================================= */
  const birthDay = document.getElementById('birthDay');
  const birthMonth = document.getElementById('birthMonth');
  const birthYear = document.getElementById('birthYear');

  for (let d = 1; d <= 31; d++) {
    birthDay.add(new Option(String(d).padStart(2, '0'), d));
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  months.forEach((m, idx) => birthMonth.add(new Option(m, idx + 1)));

  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 15; y >= 1950; y--) {
    birthYear.add(new Option(y, y));
  }

  // Academic Sessions & Passing Years
  const diplomaSession = document.getElementById('diplomaSession');
  for (let y = currentYear - 1; y >= 1960; y--) {
    const sessionStr = `${y}-${String((y + 1) % 100).padStart(2, '0')}`;
    diplomaSession.add(new Option(sessionStr, sessionStr));
  }
  diplomaSession.add(new Option('Other', 'other'));

  const yearSelects = ['diplomaPassingYear', 'makeupPassingYear', 'makeupCourseYear'];
  yearSelects.forEach(id => {
    const el = document.getElementById(id);
    for (let y = currentYear; y >= 1964; y--) {
      el.add(new Option(y, y));
    }
  });

  /* =========================================================
     2. BANGLADESH LOCATION DATA & ADDRESS LOGIC
  ========================================================= */
  const bdDivisions = {
    'Dhaka': ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
    'Chattogram': ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Cumilla', 'Cox\'s Bazar', 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
    'Rajshahi': ['Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Pabna', 'Rajshahi', 'Sirajganj'],
    'Khulna': ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
    'Barishal': ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
    'Sylhet': ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
    'Rangpur': ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
    'Mymensingh': ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur']
  };

  const cityCorporations = [
    'Dhaka North City Corporation', 'Dhaka South City Corporation',
    'Chattogram City Corporation', 'Gazipur City Corporation',
    'Narayanganj City Corporation', 'Cumilla City Corporation',
    'Rajshahi City Corporation', 'Khulna City Corporation',
    'Barishal City Corporation', 'Sylhet City Corporation',
    'Rangpur City Corporation', 'Mymensingh City Corporation'
  ];

  // Populate Divisions & City Corporations
  const presentDivision = document.getElementById('presentDivision');
  const permanentDivision = document.getElementById('permanentDivision');
  Object.keys(bdDivisions).forEach(div => {
    presentDivision.add(new Option(div, div));
    permanentDivision.add(new Option(div, div));
  });

  const presentCity = document.getElementById('presentCity');
  const presentCityWard = document.getElementById('presentCityWard');
  cityCorporations.forEach(cc => presentCity.add(new Option(cc, cc)));
  for (let w = 1; w <= 75; w++) {
    presentCityWard.add(new Option(`Ward ${w}`, w));
  }

  // Present Address Type Toggle (District vs City Corporation)
  const presentAddressType = document.getElementById('presentAddressType');
  const presentCityFields = document.getElementById('presentCityFields');
  const presentDistrictFields = document.getElementById('presentDistrictFields');

  presentAddressType.addEventListener('change', () => {
    const isCity = presentAddressType.value === 'city';
    presentCityFields.classList.toggle('hidden', !isCity);
    presentDistrictFields.classList.toggle('hidden', isCity);
  });

  // Division -> District Cascade
  const presentDistrict = document.getElementById('presentDistrict');
  presentDivision.addEventListener('change', () => {
    presentDistrict.innerHTML = '<option value="">Select District</option>';
    const districts = bdDivisions[presentDivision.value] || [];
    districts.forEach(dist => presentDistrict.add(new Option(dist, dist)));
  });

  // District -> Populate Sample Upazila & Municipality
  const presentUpazila = document.getElementById('presentUpazila');
  const presentMunicipality = document.getElementById('presentMunicipality');
  const presentMunicipalityWard = document.getElementById('presentMunicipalityWard');

  for (let w = 1; w <= 9; w++) {
    presentMunicipalityWard.add(new Option(`Ward ${w}`, w));
  }

  presentDistrict.addEventListener('change', () => {
    const dist = presentDistrict.value;
    presentUpazila.innerHTML = '<option value="">Select Upazila</option>';
    presentMunicipality.innerHTML = '<option value="">Select Municipality</option>';
    if (dist) {
      presentUpazila.add(new Option(`${dist} Sadar`, `${dist} Sadar`));
      presentUpazila.add(new Option('Other Upazila', 'Other'));
      presentMunicipality.add(new Option(`${dist} Pourashava`, `${dist} Pourashava`));
    }
  });

  // Area Type Toggle (Upazila vs Municipality)
  const presentAreaType = document.getElementById('presentAreaType');
  presentAreaType.addEventListener('change', () => {
    const type = presentAreaType.value;
    document.getElementById('presentUpazilaWrap').classList.toggle('hidden', type !== 'upazila');
    document.getElementById('presentUnionWrap').classList.toggle('hidden', type !== 'upazila');
    document.getElementById('presentMunicipalityWrap').classList.toggle('hidden', type !== 'municipality');
    document.getElementById('presentMunicipalityWardWrap').classList.toggle('hidden', type !== 'municipality');
  });

  // Same as Present Address Checkbox
  const sameAddress = document.getElementById('sameAddress');
  const permanentAddressPanel = document.getElementById('permanentAddressPanel');
  sameAddress.addEventListener('change', () => {
    permanentAddressPanel.classList.toggle('hidden', sameAddress.checked);
  });

  /* =========================================================
     3. ACADEMIC INFORMATION TOGGLES
  ========================================================= */
  const togglePanel = (checkboxId, panelId) => {
    const cb = document.getElementById(checkboxId);
    const panel = document.getElementById(panelId);
    cb.addEventListener('change', () => {
      panel.classList.toggle('hidden', !cb.checked);
    });
  };

  togglePanel('diplomaCheck', 'diplomaPanel');
  togglePanel('makeupCheck', 'makeupPanel');

  // Department "Other" Warning
  const diplomaDepartment = document.getElementById('diplomaDepartment');
  const departmentWarning = document.getElementById('departmentWarning');
  diplomaDepartment.addEventListener('change', () => {
    departmentWarning.classList.toggle('hidden', diplomaDepartment.value !== 'other');
  });

  // Session "Other" Input
  diplomaSession.addEventListener('change', () => {
    document.getElementById('otherSessionWrap').classList.toggle('hidden', diplomaSession.value !== 'other');
  });

  // Polytechnic "Other" Input
  const polytechnic = document.getElementById('polytechnic');
  polytechnic.addEventListener('change', () => {
    document.getElementById('otherPolytechnicWrap').classList.toggle('hidden', polytechnic.value !== 'Other');
  });

  /* =========================================================
     4. CURRENT STATUS TOGGLES
  ========================================================= */
  togglePanel('higherStudies', 'higherStudiesPanel');
  togglePanel('jobHolder', 'jobPanel');
  togglePanel('entrepreneur', 'businessPanel');
  togglePanel('otherStatus', 'otherStatusPanel');

  const serviceType = document.getElementById('serviceType');
  const employmentFields = document.getElementById('employmentFields');
  const organizationLabel = document.getElementById('organizationLabel');

  serviceType.addEventListener('change', () => {
    const val = serviceType.value;
    employmentFields.classList.toggle('hidden', !val);
    organizationLabel.textContent = val === 'government'
      ? 'Ministry / Directorate / Govt. Organization Name'
      : 'Company / Organization Name';
  });

  /* =========================================================
     5. ASSOCIATION SOCIAL DISPLAY TOGGLE
  ========================================================= */
  const socialPanel = document.getElementById('socialPanel');
  document.querySelectorAll('input[name="displayContact"]').forEach(radio => {
    radio.addEventListener('change', () => {
      socialPanel.classList.toggle('hidden', document.getElementById('displayNo').checked);
    });
  });

  /* =========================================================
     6. LOGIN MODAL & FORM SUBMISSION HANDLERS
  ========================================================= */
  const loginModal = document.getElementById('loginModal');
  document.getElementById('openLogin').addEventListener('click', () => {
    loginModal.classList.remove('hidden');
  });
  document.getElementById('closeLogin').addEventListener('click', () => {
    loginModal.classList.add('hidden');
  });
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.classList.add('hidden');
  });

  // Main Registration Form Submit
  document.getElementById('membershipForm').addEventListener('submit', (e) => {
    e.preventDefault();

    if (diplomaDepartment.value === 'other') {
      alert('Sorry, "Other" departments are not allowed for Diploma in Engineering.');
      diplomaDepartment.focus();
      return;
    }

    const phone = document.getElementById('phone').value.trim();
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      alert('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).');
      document.getElementById('phone').focus();
      return;
    }

    alert('Form validated successfully! (Connect your backend API to save data.)');
  });

  // Demo Alerts for Login & Google Buttons
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Login submitted! Connect Firebase/Backend auth to verify credentials.');
  });

  ['googleSignup', 'googleLogin'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      alert('Google Authentication requires Firebase configuration.');
    });
  });
});
