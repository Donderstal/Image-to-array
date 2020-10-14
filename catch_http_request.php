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
    else if( isset( $_POST['request_restore_username'] ) && isset( $_POST['request_restore_email']) ) {
        SendRestorationCode( $_POST['request_restore_username'], $_POST['request_restore_email'] );
    }
    else if( isset( $_POST['restore_username'] ) && isset( $_POST['restore_password'] ) && isset( $_POST['restore_code'] ) ) {
        SetNewPassword( $_POST['restore_username'], $_POST['restore_password'], $_POST['restore_code'] );
    }
    else {
        die($_POST);
    }
?>