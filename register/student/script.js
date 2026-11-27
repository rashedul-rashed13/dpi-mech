
document.addEventListener('DOMContentLoaded', () => {

  const $ = id => document.getElementById(id);
  const currentYear = new Date().getFullYear();

  $('footerYear').textContent = currentYear;

  // =====================================
  // 1. YEAR AND DATE DROPDOWNS
  // =====================================

  function fillYears(id, start, end, formatter = y => y) {
    const el = $(id);
    if (!el) return;

    for (let y = start; y >= end; y--) {
      el.add(new Option(formatter(y), y));
    }
  }

  for (let d = 1; d <= 31; d++) {
    $('dobDay').add(
      new Option(String(d).padStart(2, '0'), d)
    );
  }

  [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ].forEach((month, index) => {
    $('dobMonth').add(new Option(month, index + 1));
  });

  fillYears('dobYear', currentYear, 1930);

  [
    'diplomaPassing',
    'alliedPassing',
    'makeupPassing'
  ].forEach(id => {
    fillYears(id, currentYear, 1955);
  });

  // Session: 2026-27 format, automatically updates

  const session = $('diplomaSession');

  for (let y = currentYear; y >= 1955; y--) {
    const nextYear = String((y + 1) % 100).padStart(2, '0');
    const value = `${y}-${nextYear}`;

    session.add(new Option(value, value));
  }

  session.add(new Option('Other', 'Other'));


  // =====================================
  // 2. BANGLADESH DIVISION AND DISTRICTS
  // =====================================

  const divisions = {

    'Barishal': [
      'Barguna', 'Barishal', 'Bhola',
      'Jhalokati', 'Patuakhali', 'Pirojpur'
    ],

    'Chattogram': [
      'Bandarban', 'Brahmanbaria', 'Chandpur',
      'Chattogram', 'Cumilla', "Cox's Bazar",
      'Feni', 'Khagrachhari', 'Lakshmipur',
      'Noakhali', 'Rangamati'
    ],

    'Dhaka': [
      'Dhaka', 'Faridpur', 'Gazipur',
      'Gopalganj', 'Kishoreganj', 'Madaripur',
      'Manikganj', 'Munshiganj', 'Narayanganj',
      'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'
    ],

    'Khulna': [
      'Bagerhat', 'Chuadanga', 'Jashore',
      'Jhenaidah', 'Khulna', 'Kushtia',
      'Magura', 'Meherpur', 'Narail', 'Satkhira'
    ],

    'Mymensingh': [
      'Jamalpur', 'Mymensingh',
      'Netrokona', 'Sherpur'
    ],

    'Rajshahi': [
      'Bogura', 'Chapainawabganj', 'Joypurhat',
      'Naogaon', 'Natore', 'Pabna',
      'Rajshahi', 'Sirajganj'
    ],

    'Rangpur': [
      'Dinajpur', 'Gaibandha', 'Kurigram',
      'Lalmonirhat', 'Nilphamari', 'Panchagarh',
      'Rangpur', 'Thakurgaon'
    ],

    'Sylhet': [
      'Habiganj', 'Moulvibazar',
      'Sunamganj', 'Sylhet'
    ]

  };


  // =====================================
  // 3. CITY CORPORATION LIST
  // =====================================

  const cityCorporations = [
    'Dhaka North City Corporation',
    'Dhaka South City Corporation',
    'Chattogram City Corporation',
    'Khulna City Corporation',
    'Rajshahi City Corporation',
    'Sylhet City Corporation',
    'Barishal City Corporation',
    'Rangpur City Corporation',
    'Gazipur City Corporation',
    'Narayanganj City Corporation',
    'Cumilla City Corporation',
    'Mymensingh City Corporation'
  ];


  // =====================================
  // 4. ACADEMIC DEPARTMENTS
  // =====================================

  const departments = [
    '67 - Electrical Technology',
    '64 - Civil Technology',
    '70 - Mechanical Technology',
    '85 - Computer Science & Technology',
    '71 - Power Technology',
    '68 - Electronics Technology',
    '61 - Architecture Technology',
    '69 - Food Technology',
    '63 - Chemical Technology',
    '72 - Refrigeration & Air-Conditioning (RAC) Technology',
    '62 - Automobile Technology',
    '90 - Environmental Technology',
    'Other'
  ];

  departments.forEach(value => {
    $('diplomaDepartment').add(
      new Option(value, value)
    );
  });


  // =====================================
  // 5. POLYTECHNIC LIST
  // =====================================

  const polytechnics = [
    'Dhaka Polytechnic Institute',
    'Chattogram Polytechnic Institute',
    'Rajshahi Polytechnic Institute',
    'Khulna Polytechnic Institute',
    'Barishal Polytechnic Institute',
    'Sylhet Polytechnic Institute',
    'Rangpur Polytechnic Institute',
    'Bogura Polytechnic Institute',
    'Cumilla Polytechnic Institute',
    'Mymensingh Polytechnic Institute',
    'Feni Polytechnic Institute',
    'Pabna Polytechnic Institute',
    'Other'
  ];

  polytechnics.forEach(value => {
    $('polytechnic').add(
      new Option(value, value)
    );
  });


  // =====================================
  // 6. ADDRESS DROPDOWNS
  // =====================================

  document.querySelectorAll('.address-kind').forEach(select => {

    const prefix = select.id.replace('Kind', '');

    // Division list

    Object.keys(divisions).forEach(value => {
      $(prefix + 'Division').add(
        new Option(value, value)
      );
    });

    // City Corporation list

    cityCorporations.forEach(value => {
      $(prefix + 'City').add(
        new Option(value, value)
      );
    });

    // City Corporation Ward 01-99

    for (let n = 1; n <= 99; n++) {
      const ward = String(n).padStart(2, '0');

      $(prefix + 'WardCity').add(
        new Option(`Ward - ${ward}`, n)
      );
    }

    $(prefix + 'WardCity').add(
      new Option('Others', 'Other')
    );

    // Municipality Ward 01-15

    for (let n = 1; n <= 15; n++) {
      const ward = String(n).padStart(2, '0');

      $(prefix + 'WardMuni').add(
        new Option(`Ward - ${ward}`, n)
      );
    }

    $(prefix + 'WardMuni').add(
      new Option('Others', 'Other')
    );

    select.addEventListener('change', () => {
      refreshAddress(prefix);
    });

    $(prefix + 'Division').addEventListener('change', () => {
      populateDistrict(prefix);
    });

    $(prefix + 'District').addEventListener('change', () => {
      populateLocalAreas(prefix);
    });

    $(prefix + 'AreaType').addEventListener('change', () => {
      refreshAddress(prefix);
    });

    refreshAddress(prefix);

  });


  // District dropdown

  function populateDistrict(prefix) {

    const district = $(prefix + 'District');

    district.innerHTML =
      '<option value="">Select District</option>';

    const selectedDivision =
      $(prefix + 'Division').value;

    (divisions[selectedDivision] || []).forEach(value => {
      district.add(new Option(value, value));
    });

    populateLocalAreas(prefix);
  }


  // Upazila and Municipality dropdown
  // Complete official local-government data is not included yet.

  function populateLocalAreas(prefix) {

    const district = $(prefix + 'District').value;

    const upazila = $(prefix + 'Upazila');
    const municipality = $(prefix + 'Municipality');

    upazila.innerHTML =
      '<option value="">Select Upazila</option>';

    municipality.innerHTML =
      '<option value="">Select Municipality</option>';

    if (district) {
      upazila.add(
        new Option(
          'Local list not configured — add official dataset',
          ''
        )
      );

      municipality.add(
        new Option(
          'Local list not configured — add official dataset',
          ''
        )
      );
    }
  }


  // Show address fields depending on address type

  function refreshAddress(prefix) {

    const kind = $(prefix + 'Kind').value;
    const area = $(prefix + 'AreaType').value;

    const root = $(prefix + 'AddressFields');

    root.querySelectorAll('.conditional').forEach(element => {
      element.style.display = 'none';
    });

    if (kind === 'city') {

      root.querySelectorAll(
        '.city-fields, .ward-city'
      ).forEach(element => {
        element.style.display = 'flex';
      });

    }

    else if (kind === 'district') {

      root.querySelectorAll(
        '.district-fields'
      ).forEach(element => {
        element.style.display = 'flex';
      });

      if (area === 'upazila') {

        root.querySelectorAll(
          '.upazila-fields'
        ).forEach(element => {
          element.style.display = 'flex';
        });

      }

      if (area === 'municipality') {

        root.querySelectorAll(
          '.municipality-fields, .ward-muni'
        ).forEach(element => {
          element.style.display = 'flex';
        });

      }

    }

  }


  // Ward Others input

  ['present', 'permanent'].forEach(prefix => {

    [
      [prefix + 'WardCity', prefix + 'WardOther'],
      [prefix + 'WardMuni', prefix + 'WardOther']
    ].forEach(([selectId, inputId]) => {

      $(selectId).addEventListener('change', () => {

        $(inputId).classList.toggle(
          'hidden',
          $(selectId).value !== 'Other'
        );

      });

    });

  });


  // =====================================
  // 7. ACADEMIC INFORMATION
  // =====================================

  function toggle(checkId, panelId) {

    $(checkId).addEventListener('change', () => {

      $(panelId).classList.toggle(
        'hidden',
        !$(checkId).checked
      );

    });

  }

  toggle('diplomaCheck', 'diplomaPanel');
  toggle('alliedCheck', 'alliedPanel');


  // Mechanical Technology restriction

  $('diplomaDepartment').addEventListener('change', () => {

    const selected =
      $('diplomaDepartment').value;

    const allowed =
      selected === '70 - Mechanical Technology';

    $('departmentWarning').classList.toggle(
      'hidden',
      !selected || allowed
    );

    $('diplomaPanel')
      .querySelectorAll('input, select')
      .forEach(element => {

        if (element.id !== 'diplomaDepartment') {
          element.disabled = !!selected && !allowed;
        }

      });

  });


  // Other Session

  $('diplomaSession').addEventListener('change', () => {

    $('diplomaSessionOther').classList.toggle(
      'hidden',
      $('diplomaSession').value !== 'Other'
    );

  });


  // Other Polytechnic

  $('polytechnic').addEventListener('change', () => {

    $('polytechnicOther').classList.toggle(
      'hidden',
      $('polytechnic').value !== 'Other'
    );

  });


  // =====================================
  // 8. CURRENT STATUS
  // =====================================

  const statusPairs = [
    ['statusStudy', 'studyPanel'],
    ['statusJob', 'jobPanel'],
    ['statusBusiness', 'businessPanel'],
    ['statusOther', 'otherStatusPanel']
  ];

  statusPairs.forEach(([checkId, panelId]) => {
    toggle(checkId, panelId);
  });


  // Government / Private organization label

  $('jobType').addEventListener('change', () => {

    $('jobOrgLabel').textContent =
      $('jobType').value === 'Government Service'
        ? 'Organization Name'
        : 'Organization / Company';

  });


  // =====================================
  // 9. CONTACT VISIBILITY
  // =====================================

  $('visibilityYes').addEventListener('change', () => {

    $('visibilityPanel').classList.toggle(
      'hidden',
      !$('visibilityYes').checked
    );

  });

  $('visibilityNo').addEventListener('change', () => {

    $('visibilityPanel').classList.toggle(
      'hidden',
      !$('visibilityYes').checked
    );

  });


  // =====================================
  // 10. ACCOUNT REGISTRATION
  // =====================================

  $('registrationType').addEventListener('change', () => {

    const email =
      $('registrationType').value === 'email';

    const google =
      $('registrationType').value === 'google';

    $('accountPanel').classList.toggle(
      'hidden',
      !email
    );

    $('googleInfo').classList.toggle(
      'hidden',
      !google
    );

  });


  // =====================================
  // 11. SAME PRESENT AND PERMANENT ADDRESS
  // =====================================

  $('sameAddress').addEventListener('change', () => {

    const hide = $('sameAddress').checked;

    $('permanentAddressFields').classList.toggle(
      'hidden',
      hide
    );

    $('permanentSection').classList.toggle(
      'hidden',
      hide
    );

    if (hide) {

      const presentFields =
        $('presentAddressFields')
          .querySelectorAll('input, select, textarea');

      const permanentFields =
        $('permanentAddressFields')
          .querySelectorAll('input, select, textarea');

      permanentFields.forEach((element, index) => {

        const source = presentFields[index];

        if (source && element.type !== 'file') {
          element.value = source.value;
        }

      });

    }

  });


  // =====================================
  // 12. FORM VALIDATION
  // =====================================

  $('registrationForm').addEventListener('submit', event => {

    event.preventDefault();

    const message = $('formMessage');

    message.textContent = '';
    message.style.color = '#b43c30';

    // At least one exam must be selected

    if (
      !$('diplomaCheck').checked &&
      !$('alliedCheck').checked
    ) {

      message.textContent =
        'Please select at least one examination.';

      return;
    }


    // Department restriction

    if (
      $('diplomaCheck').checked &&
      $('diplomaDepartment').value !==
      '70 - Mechanical Technology'
    ) {

      message.textContent =
        'Other Departments are not allowed. Please select 70 - Mechanical Technology.';

      return;
    }


    // Google login notice

    if ($('registrationType').value === 'google') {

      message.textContent =
        'Google sign-in is not connected yet. Configure Google OAuth before enabling registration.';

      return;
    }


    // Password matching

    if (
      $('registrationType').value === 'email' &&
      $('password').value !== $('confirmPassword').value
    ) {

      message.textContent =
        'Password and Confirm Password do not match.';

      return;
    }


    // Browser required-field validation

    if (!$('registrationForm').reportValidity()) {
      return;
    }


    message.style.color = '#176b47';

    message.textContent =
      'Form validation successful. Connect a backend/database to save registrations.';

  });

});
