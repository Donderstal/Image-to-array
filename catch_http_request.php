<?php
    require_once "database_config.php";

    if( isset( $_POST['register_username'] ) && isset( $_POST['register_email'] ) && isset( $_POST['register_password'] ) ) {
        CreateUser( $_POST['register_username'], $_POST['register_email'], $_POST['register_password'] );
    }
    if( isset( $_POST['get_username'] ) ) {
        echo GetUserIfUsernameExists( $_POST['get_username'] );
    }
?>