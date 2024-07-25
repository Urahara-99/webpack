$(document).ready(function () {
    // Load profile info on page load
    loadProfile();
});

// Function to load profile information
function loadProfile() {
    var username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "login.html";
        return;
    }

    $.ajax({
        url: 'php/profile.php',
        type: 'GET',
        data: { username: username }, // Send username as query parameter
        success: function (response) {
            var jsonResponse = JSON.parse(response);
            if (jsonResponse.status === 'success') {
                $("#username").text(jsonResponse.data.username);
                $("#email").text(jsonResponse.data.email);
                $("#dob").text(jsonResponse.data.dob);
                $("#age").text(jsonResponse.data.age);
                $("#contact_number").text(jsonResponse.data.contact_number);
            } else {
                alert(jsonResponse.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error loading profile data');
        }
    });
}
