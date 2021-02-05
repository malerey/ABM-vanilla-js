$(document).ready(() => {
  let theUsers;

  window.edit = (id) => {
    document.querySelector('#editEmployeeModal form').reset();

    const user = theUsers.find(u => u.id == id);
    $('#editEmployeeModal form #userid').val(user.id);
    $('#editEmployeeModal form #name').val(user.fullname);
    $('#editEmployeeModal form #email').val(user.email);
    $('#editEmployeeModal form #address').val(user.address);
    $('#editEmployeeModal form #phone').val(user.phone);
  };

  window.remove = (id) => {
    $('#deleteEmployeeModal form #userid').val(id);
  };

  window.validateNumber = (evt) => {
    let e = evt || window.event;
    let key = e.keyCode || e.which;

    if (
      (!e.shiftKey &&
        !e.altKey &&
        !e.ctrlKey &&
        // numbers
        key >= 48 &&
        key <= 57) ||
      // Numeric keypad
      (key >= 96 && key <= 105) ||
      // Backspace and Tab and Enter
      key == 8 ||
      key == 9 ||
      key == 13 ||
      // Home and End
      key == 35 ||
      key == 36 ||
      // left and right arrows
      key == 37 ||
      key == 39 ||
      // Del and Ins
      key == 46 ||
      key == 45
    ) {
      // input is VALID
    } else {
      // input is INVALID
      e.returnValue = false;
      if (e.preventDefault) e.preventDefault();
    }
  };

  const createEmployee = u => {
    return `
          <tr>
            <td>
              <span class="custom-checkbox">
                <input type="checkbox" id="checkbox5" name="options[]" value="1">
                <label for="checkbox5"></label>
              </span>
            </td>
                <td>${u.fullname}</td>
                <td>${u.email}</td>
    <td>${u.address}</td>
                <td>${u.phone}</td>
                <td>
                    <a onclick="edit(${u.id})" href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                    <a onclick="remove(${u.id})" href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                </td>
            </tr>
          `;
  };

  fetch('https://601da02bbe5f340017a19d60.mockapi.io/users')
    .then(res => res.json())
    .then(users => {
      theUsers = users;
      users.map(createEmployee).forEach(u => $('tbody').append(u));
    });

  $('#search').keypress(e => {
    let code = e.keyCode ? e.keyCode : e.which;
    if (code == 13) {
      fetch(
        'https://601da02bbe5f340017a19d60.mockapi.io/users?search=' +
          $('#search').val(),
      )
        .then(res => res.json())
        .then(users => {
          $('tbody').empty();

          users.map(createEmployee).forEach(u => $('tbody').append(u));
        });
    }
  });

  // Activate tooltip
  $('[data-toggle="tooltip"]').tooltip();

  $('#addEmployeeModal form').submit(e => {
    e.preventDefault();

    fetch('https://601da02bbe5f340017a19d60.mockapi.io/users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullname: $('#addEmployeeModal form #name').val(),
        email: $('#addEmployeeModal form #email').val(),
        address: $('#addEmployeeModal form #address').val(),
        phone: $('#addEmployeeModal form #phone').val(),
      }),
    })
      .then(res => res.json())
      .then(u => {
        theUsers.push(u);

        $('tbody').empty();

        theUsers.map(createEmployee).forEach(u => $('tbody').append(u));

        $('#addEmployeeModal').modal('hide');

        document.querySelector('#addEmployeeModal form').reset();
      });
  });

  $('#editEmployeeModal form').submit(e => {
    e.preventDefault();

    fetch(
      'https://601da02bbe5f340017a19d60.mockapi.io/users/' +
        $('#editEmployeeModal form #userid').val(),
      {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: $('#editEmployeeModal form #name').val(),
          email: $('#editEmployeeModal form #email').val(),
          address: $('#editEmployeeModal form #address').val(),
          phone: $('#editEmployeeModal form #phone').val(),
        }),
      },
    )
      .then(res => res.json())
      .then(users => {
        fetch('https://601da02bbe5f340017a19d60.mockapi.io/users')
          .then(res => res.json())
          .then(users => {
            $('tbody').empty();

            users.map(createEmployee).forEach(u => $('tbody').append(u));

            $('#editEmployeeModal').modal('hide');
          });
      });
  });

  $('#deleteEmployeeModal form').submit(e => {
    e.preventDefault();

    fetch(
      'https://601da02bbe5f340017a19d60.mockapi.io/users/' +
        $('#deleteEmployeeModal form #userid').val(),
      {
        method: 'delete',
      },
    )
      .then(res => res.json())
      .then(users => {
        fetch('https://601da02bbe5f340017a19d60.mockapi.io/users')
          .then(res => res.json())
          .then(users => {
            $('tbody').empty();

            users.map(createEmployee).forEach(u => $('tbody').append(u));

            $('#deleteEmployeeModal').modal('hide');
          });
      });
  });

  // Select/Deselect checkboxes
  let checkbox = $('table tbody input[type="checkbox"]');
  $('#selectAll').click(function () {
    let checkbox = $('table tbody input[type="checkbox"]');
    if (this.checked) {
      checkbox.each(function () {
        this.checked = true;
      });
    } else {
      checkbox.each(function () {
        this.checked = false;
      });
    }
  });
  checkbox.click(function () {
    if (!this.checked) {
      $('#selectAll').prop('checked', false);
    }
  });
});
