import $ from 'jquery';

$(document).ready(function () {
    $('#loginButton').on('click', function () {
        window.location.href = 'login.html';
    });

    $('#registerButton').on('click', function () {
        window.location.href = 'register.html';
    });
});
