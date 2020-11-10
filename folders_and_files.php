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

        if ( !file_exists($file_path) ) {
            try {
                file_put_contents( $file_path, $json_map); 
                echo json_encode('{"save-map-succes": true}' );            
            }
            catch ( Exception $ex ) {
                die( $e->getMessage( ) );
                echo json_encode('{"save-map-succes": false}' );     
            }
        } else {
            echo json_encode('{"save-map-succes": false, "error-message": "File with that name already exists"}' );     
        }
    }

    function GetUserJSONFilesIfLoggedIn( ) {
        $neighbourhoods_path = '/user-folders' . '/' .$_SESSION["username"]. '/neighbourhoods';
        $maps_path = '/user-folders'  . '/' .str_replace( " ", "_", $_SESSION["username"] ). '/maps';
        $neighbourhood_files = scandir( $_SERVER['DOCUMENT_ROOT'].$neighbourhoods_path );
        $map_files = scandir( $_SERVER['DOCUMENT_ROOT'].$maps_path );

        $Return_Arr = array( 
            "get-user-maps-success" => "Tmapsmapsmaps", 
            "error-message" => "error burh..."
        );

        $neighbourhoods = array( );
        $maps = array( );

        foreach( $neighbourhood_files as $neighbourhood) {
            if ( $neighbourhood != "." && $neighbourhood != ".." ) {
                $url = $_SERVER['DOCUMENT_ROOT'].$neighbourhoods_path."/".$neighbourhood;
                $json_as_string = file_get_contents( $url, false );
                $json_data = json_decode($json_as_string, true);

                $neighbourhood_arr = array( );
                
                try {
                    foreach(array_keys($json_data) as $key) {
                        $neighbourhood_arr[$key] = $json_data[$key];
                    }
                    $neighbourhoods[explode(".", $neighbourhood)[0]] = $neighbourhood_arr;                   
                }
                catch( Exception $ex ) {
                    die($ex);                    
                }
            }
        }

        foreach( $map_files as $map ) {
            if ( $map != "." && $map != ".." ) {
                $url = $_SERVER['DOCUMENT_ROOT'].$maps_path."/".$map;
                $json_as_string = file_get_contents( $url, false );
                $json_data = json_decode($json_as_string, true);

                $maps[explode(".", $map)[0]] = json_decode($json_data);
            }
        }

        $Return_Arr["neighbourhoods"] = $neighbourhoods;
        $Return_Arr["maps"] = $maps;
        echo json_encode($Return_Arr);
    }
?>