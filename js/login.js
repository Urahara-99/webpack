$(document).ready(function () {
    $('#loginForm').submit(function (e) {
        e.preventDefault();

        var formData = {
            username_email: $('#username_email').val(),
            password: $('#password').val()
        };

        // Log the form data to verify
        console.log("Form Data Sent:", formData);

        $.ajax({
            url: 'php/login.php',
            type: 'POST',
            data: formData,
            dataType: 'json',  // Expect JSON response
            success: function (response) {
                console.log("Server Response:", response);
                if (response.status === 'Login successful!') {
                    localStorage.setItem('username', response.user);
                    window.location.href = 'profile.html';
                } else {
                    $('#responseMessage').html('<div class="alert alert-danger">' + response.status + '</div>');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#responseMessage').html('<div class="alert alert-danger">An error occurred: ' + textStatus + '</div>');
                console.log("AJAX Error:", textStatus, errorThrown);
            }
        });
    });
});
