import $ from 'jquery';

$(document).ready(function () {
    loadProfile();

    $("#editProfileForm").submit(function (event) {
        event.preventDefault();
        saveProfile();
    });
});

function loadProfile() {
    var username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "login.html";
        return;
    }

    $.ajax({
        url: 'php/profile.php',
        type: 'GET',
        dataType: 'json', // Automatically parse response as JSON
        data: { username: username },
        success: function (response) {
            if (response.status === 'success') {
                $("#username").val(response.data.username);
                $("#email").val(response.data.email);
                $("#dob").val(response.data.dob);
                $("#age").val(response.data.age);
                $("#contact_number").val(response.data.contact_number);
            } else {
                alert(response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error loading profile data');
        }
    });
}

function saveProfile() {
    var formData = $("#editProfileForm").serialize();

    var email = $("#email").val();
    var dob = $("#dob").val();
    var age = $("#age").val();
    var contact_number = $("#contact_number").val();

    if (!validateEmail(email)) {
        alert("Invalid email format");
        return;
    }

    if (!validateDOB(dob, age)) {
        alert("DOB does not match age");
        return;
    }

    if (!validateAge(age)) {
        alert("Age must be a 1 to 3-digit integer");
        return;
    }

    if (!validateContact(contact_number)) {
        alert("Contact number must be a 10-digit integer");
        return;
    }

    $.ajax({
        url: 'php/edit_profile.php',
        type: 'POST',
        dataType: 'json', // Automatically parse response as JSON
        data: formData,
        success: function (response) {
            if (response.status === 'success') {
                alert('Profile updated successfully');
                window.location.href = "login.html";
            } else {
                alert(response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error saving profile data');
        }
    });
}

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateDOB(dob, age) {
    var birthDate = new Date(dob);
    var today = new Date();
    var calculatedAge = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
    }
    return calculatedAge == age;
}

function validateAge(age) {
    var re = /^[0-9]{1,3}$/;
    return re.test(age);
}

function validateContact(contact) {
    var re = /^[0-9]{10}$/;
    return re.test(contact);
}
