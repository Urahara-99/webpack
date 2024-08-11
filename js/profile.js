$(document).ready(function () {
    loadProfile();
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
                $("#username").text(response.data.username);
                $("#email").text(response.data.email);
                $("#dob").text(response.data.dob);
                $("#age").text(response.data.age);
                $("#contact_number").text(response.data.contact_number);
            } else {
                alert(response.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error loading profile data');
        }
    });
}
