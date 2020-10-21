<?php 
    session_start( );

    require_once "emails.php";
    require_once "folders_and_files.php";

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
                email VARCHAR(255) NOT NULL UNIQUE,
                validated BIT NOT NULL DEFAULT 0,
                validation_code VARCHAR(6),
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

        $validation_code = substr(str_shuffle(str_repeat("0123456789abcdefghijklmnopqrstuvwxyz", 6)), 0, 6);

        try {
            $CREATE_USER_STMT = $DATABASE->prepare( "INSERT INTO users (username, email, password, validation_code) VALUES (?,?,?,?)" );
            $CREATE_USER_STMT->execute( [ $username, $email, password_hash( $password, PASSWORD_DEFAULT ), $validation_code ] );
        } catch ( PDOException $e ) {
            die( $e->getMessage( ) );
        }

        SendMail( $username, $email, $validation_code, true );

        echo json_encode('{"register-succes": true}', true);
    }

    function LogInUser( $username, $password ) {
        $USER_DATA = ReturnRowIfValueExists( 'users', 'username', $username );
        $json_response;

        if( $USER_DATA == null ) {
            echo json_encode('{"log-succes": false, "error-message": "This username does not exist. Please register first"}', true);
            return;
        }

        if (  $USER_DATA['validated'] == 0 ) {
            echo json_encode('{"log-succes": false, "error-message": "Your account has not been validated"}', true);
            return;
        }
        else if ( password_verify( $password, $USER_DATA['password'] ) ) {
            $_SESSION['username'] = $username;

            echo json_encode('{"log-succes": true}', true);
            return;
        } 
        else {
            echo json_encode('{"log-succes": false, "error-message": "Password is not correct"}', true);
            return;
        }
    }

    function ValidateUser( $username, $password, $validation_code ) {
        $DATABASE = GetDAAL( );

        $USER_DATA = ReturnRowIfValueExists( 'users', 'username', $username );

        if ( $USER_DATA == null ) {
            echo json_encode('{"validate-succes": false, "error-message": "This username is not recognised"}', true);
        } else if ( !password_verify( $password, $USER_DATA['password'] ) ) {
            echo json_encode('{"validate-succes": false, "error-message": "This password does not match the one in the database"}', true);
        } else if ( $USER_DATA["validation_code"] != $validation_code ) {
            echo json_encode('{"validate-succes": false, "error-message": "This secret code is not correct. Are you sure it is the one we sent you?"}', true);
        } else {
            try {
                $VALIDATE_USER_STMT = $DATABASE->prepare( "UPDATE users SET validated=?, validation_code=? WHERE username=?" );
                $VALIDATE_USER_STMT->execute( [ 1, null, $username ] );
                MakeUserDirectory( $username );
                $_SESSION['username'] = $username;
            } catch ( PDOException $e ) {
                die( $e->getMessage( ) );
            }
    
            echo json_encode('{"validate-succes": true}', true);
        }
    }

    function SendRestorationCode( $username, $email ) {
        $DATABASE = GetDAAL( );

        $USER_DATA = ReturnRowIfValueExists( 'users', 'username', $username );

        if ( $USER_DATA != null && $USER_DATA['email'] == $email ) {
            echo json_encode('{"request-restore-succes": true}', true);

            $validation_code = substr(str_shuffle(str_repeat("0123456789abcdefghijklmnopqrstuvwxyz", 6)), 0, 6);

            try {
                $RESTORE_CODE_FOR_USER_STMT = $DATABASE->prepare( "UPDATE users SET validated=?, validation_code=? WHERE username=?" );
                $RESTORE_CODE_FOR_USER_STMT->execute( [ 0, $validation_code, $username ] );
                SendMail( $username, $email, $validation_code, false );
            } catch ( PDOException $e ) {
                die( $e->getMessage( ) );
            }
            return;
        } else {
            echo json_encode('{"request-restore-succes": false, "error-message": "This username is not paired with the email you inputted"}', true);
            return;
        } 
    }

    function SetNewPassword( $username, $new_password, $validation_code ) {
        $DATABASE = GetDAAL( );

        $USER_DATA = ReturnRowIfValueExists( 'users', 'username', $username );

        if ( $USER_DATA != null && $USER_DATA["validation_code"] == $validation_code ) {
            try {
                $RESTORE_USER_ACCOUNT = $DATABASE->prepare( "UPDATE users SET password=?, validated=?, validation_code=? WHERE username=?" );
                $RESTORE_USER_ACCOUNT->execute( [ password_hash( $new_password, PASSWORD_DEFAULT ), 1, null, $username ] );
                $_SESSION['username'] = $username;
                echo json_encode('{"restore-password-succes": true}', true);
            } catch ( PDOException $e ) {
                die( $e->getMessage( ) );
            }
            return;
        } else {
            echo json_encode('{"restore-password-succes": false, "error-message": "The username you inputted is not paired with your secret code"}', true);
            return;
        } 
    }

    function LogOutUser( ) {
        session_destroy( );
        echo json_encode('{"log-succes": true}', true);
    }
?>