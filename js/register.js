$(document).ready(function () {
    $('#registerForm').on('submit', function (e) {
        e.preventDefault();

        var dob = new Date($('#dob').val());
        var age = $('#age').val();
        var contact_number = $('#contact_number').val();
        var today = new Date();
        var ageDiff = today.getFullYear() - dob.getFullYear();
        var monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            ageDiff--;
        }

        // Validate age matches the date of birth
        if (ageDiff != age) {
            $('#responseMessage').html('<div class="alert alert-danger">Age does not match the date of birth.</div>');
            return;
        }

        // Validate contact number is exactly 10 digits and an integer
        if (!/^\d{10}$/.test(contact_number)) {
            $('#responseMessage').html('<div class="alert alert-danger">Contact number must be exactly 10 digits.</div>');
            return;
        }

        var formData = {
            username: $('#username').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            dob: $('#dob').val(),
            age: $('#age').val(),
            contact_number: contact_number
        };

        $.ajax({
            url: 'php/register.php', // URL to PHP script
            type: 'POST',
            data: formData,
            dataType: 'json', // Expect JSON response
            success: function (response) {
                if (response.status === 'success') {
                    $('#responseMessage').html('<div class="alert alert-success">' + response.message + '</div>');
                    // Optionally redirect or clear form fields
                } else {
                    $('#responseMessage').html('<div class="alert alert-danger">' + response.message + '</div>');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#responseMessage').html('<div class="alert alert-danger">An error occurred: ' + textStatus + '</div>');
            }
        });
    });
});
