<?php 
    function GetDAAL( ) {
        $DATABASE = new PDO( "mysql:host=localhost", "root", "" );
        $DATABASE->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $database_name = "`".str_replace( "`", "``", "maptool_database" )."`";

        $DATABASE->query( "CREATE DATABASE IF NOT EXISTS $database_name" );
        $DATABASE->query( "use $database_name" );
        return $DATABASE;
    }

    function StartConnection( ) {
        try {
            $DATABASE = GetDAAL( );
            $DATABASE->query( "CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );" );
        }
        catch ( PDOException $e ) {
            die( $e->getMessage( ) );
        }
    }

    function GetUserIfUsernameExists( $username ) {
        $DATABASE = GetDAAL( );
        $USER = null;

        try {
            $GET_USER_STMT = $DATABASE->prepare( "SELECT * FROM users WHERE username=?" );
            $GET_USER_STMT->execute( [ $username ] );
            $USER = $GET_USER_STMT->fetch( );
        } catch ( PDOException $e ) {
            die( $e->getMessage( ) );
        }

        return $USER;
    }

    function CreateUser( $username, $email, $password ) {
        $DATABASE = GetDAAL( );

        if ( GetUserIfUsernameExists( $username ) != null ) {
            echo "Username is already taken bruh";
            echo implode(GetUserIfUsernameExists( $username ));
            return;
        }

        try {
            $CREATE_USER_STMT = $DATABASE->prepare( "INSERT INTO users (username, email, password) VALUES (?,?,?)" );
            $CREATE_USER_STMT->execute( [ $username, $email, password_hash( $password, PASSWORD_DEFAULT ) ] );
        } catch ( PDOException $e ) {
            die( $e->getMessage( ) );
        }
    }

    function LogInUser( $username, $password ) {
        $USER_DATA = GetUserIfUsernameExists( $username );
        if ( password_verify( $password, $USER_DATA['password'] ) ) {
            echo "Hello " . $USER_DATA['username'] . ", your email is " . $USER_DATA['email'] ;
        }
    }
?>