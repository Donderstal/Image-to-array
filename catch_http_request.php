<?php
    require_once "database_config.php";

    if( isset( $_POST['register_username'] ) && isset( $_POST['register_email'] ) && isset( $_POST['register_password'] ) ) {
        CreateUser( $_POST['register_username'], $_POST['register_email'], $_POST['register_password'] );
    }
    else if( isset( $_POST['login_username'] ) && isset( $_POST['login_password'] ) ) {
        LogInUser( $_POST['login_username'], $_POST['login_password'] );
    }
    else if( isset( $_POST['logout'] ) ) {
        LogOutUser( );
    }
    else if( isset( $_POST['validation_username'] ) && isset( $_POST['validation_password']) && isset( $_POST['validation_code'] ) ) {
        ValidateUser( $_POST['validation_username'], $_POST['validation_password'], $_POST['validation_code'] );
    }
    else {
        die($_POST);
    }
?>