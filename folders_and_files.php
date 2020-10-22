<?php

    function MakeUserDirectory( $username ) {
        $userdir = 'user-folders/' . str_replace( " ", "_", $username );
        mkdir( $userdir );
        mkdir( $userdir . '/neighbourhoods');
        $user_neighbourhoods = $userdir . '/neighbourhoods';
        mkdir( $userdir . '/maps');

        try {
            $master_folder = 'master-folder';
            $master_files = glob("master-folder/*.*");
            foreach($master_files as $path_to_old_file){
                $path_to_new_file = str_replace( $master_folder, $user_neighbourhoods, $path_to_old_file );
                copy( $path_to_old_file, $path_to_new_file );
            }
            
        }
        catch( Exception $e ) {
            die($e->getMessage());
        }
    }

    function StoreJSONMapAsFile( $json_map, $map_name ) {
        $folder_name = "user-folders/" . $_SESSION["username"] . "/" . "maps/";
        $file_path = $folder_name . $map_name . ".json";

        if ( !file_exists($path) ) {
            try {
                file_put_contents( $file_path, $json_map); 
                echo json_encode('{"save-map-succes": true, "test": '.$json_map["mapName"].'}' );            
            }
            catch ( Exception $ex ) {
                echo json_encode('{"save-map-succes": false, "error-message": "'.$ex.'"}' );     
            }
        } else {
            echo json_encode('{"save-map-succes": false, "error-message": "File with that name already exists"}' );     
        }

    }

?>