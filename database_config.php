<?php 
    session_start( );

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

    function ReturnRowIfValueExists( $table, $column, $value ) {
        $DATABASE = GetDAAL( );
        $DB_ROW = null;

        try {
            $GET_DB_ROW = $DATABASE->prepare( "SELECT * FROM $table WHERE $column=?" );
            $GET_DB_ROW->execute( [ $value ] );
            $DB_ROW = $GET_DB_ROW->fetch( );
        } catch ( PDOException $e ) {
            die( $e->getMessage( ) );
        }

        return $DB_ROW;
    }

    function CreateUser( $username, $email, $password ) {
        $DATABASE = GetDAAL( );

        if ( ReturnRowIfValueExists( 'users', 'username', $username ) != null ) {
            echo json_encode('{"register-succes": false, "error-message": "This username is already taken."}', true);
            return;
        }

        if ( ReturnRowIfValueExists( 'users', 'email', $email ) != null ) {
            echo json_encode('{"register-succes": false, "error-message": "This email adress is already registered."}', true);
            return;
        }

        try {
            $CREATE_USER_STMT = $DATABASE->prepare( "INSERT INTO users (username, email, password) VALUES (?,?,?)" );
            $CREATE_USER_STMT->execute( [ $username, $email, password_hash( $password, PASSWORD_DEFAULT ) ] );
        } catch ( PDOException $e ) {
            die( $e->getMessage( ) );
        }

        echo json_encode('{"register-succes": true}', true);
    }

    function LogInUser( $username, $password ) {
        $USER_DATA = ReturnRowIfValueExists( 'users', 'username', $username );
        $json_response;

        if( $USER_DATA == null ) {
            echo json_encode('{"log-succes": false, "error-message": "This username does not exist. Please register first"}', true);
            return;
        }

        if ( password_verify( $password, $USER_DATA['password'] ) ) {
            $_SESSION['username'] = $username;

            echo json_encode('{"log-succes": true}', true);
            return;
        } 
        else {
            echo json_encode('{"log-succes": false, "error-message": "Password is not correct"}', true);
            return;
        }
    }

    function LogOutUser( ) {
        session_destroy( );
        echo json_encode('{"log-succes": true}', true);
    }
?>