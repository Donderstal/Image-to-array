<?php 
    $DATABASE;

    function StartConnection( ) {
        try {
            $DATABASE = new PDO( "mysql:host=localhost", "root", "" );
            $DATABASE->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $database_name = "`".str_replace( "`", "``", "maptool_database" )."`";

            $DATABASE->query( "CREATE DATABASE IF NOT EXISTS $database_name" );
            $DATABASE->query( "use $database_name" );

            $DATABASE->query( "CREATE TABLE users (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );" );
        }
        catch ( PDOException $e ) {
            die( $e->getMessage( ) );
        }
    }
?>