<?php
    require_once "database_config.php";
    StartConnection( );

    $APP_FOLDER = __DIR__ . '/app/';
    $VIEWS_FOLDER = __DIR__ . '/app/views/';
    $MODALS_FOLDER = __DIR__ . '/app/modals/';

    /* Catch requested route */
    $request = $_SERVER['REQUEST_URI'];
    require $APP_FOLDER . 'head.phtml';

    require $MODALS_FOLDER . 'tilesheetmodal.html';    
    require $MODALS_FOLDER . 'loginmodal.html';    
    require $MODALS_FOLDER . 'validationmodal.phtml';    
    require $MODALS_FOLDER . 'restorationmodal.phtml';  
    require $MODALS_FOLDER . 'loadfilemodal.phtml';   

    require $VIEWS_FOLDER . 'mapmaker.html';   
    if ( !isset($_SESSION["username"]) ) {
        require $VIEWS_FOLDER . 'login.html';
    } else {
        require $VIEWS_FOLDER . 'welcome.phtml';        
    }
    require $VIEWS_FOLDER . 'newmap.html';
    require $VIEWS_FOLDER . 'mapoverview.phtml';
 
    require $APP_FOLDER . 'foot.phtml';
?>