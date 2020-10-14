<?php
    require_once "database_config.php";
    StartConnection( );

    /* Catch requested route */
    $request = $_SERVER['REQUEST_URI'];
    require __DIR__ . '/app/views/head.phtml';
    require __DIR__ . '/app/views/mapmaker.html';   
    if ( !isset($_SESSION["username"]) ) {
        require __DIR__ . '/app/views/login.html';
    } else {
        require __DIR__ . '/app/views/welcome.phtml';        
    }
    require __DIR__ . '/app/views/mapmakermenu.html';
    require __DIR__ . '/app/views/newmap.html';
    require __DIR__ . '/app/views/tilesheetmodal.html';    
    require __DIR__ . '/app/views/loginmodal.html';    
    require __DIR__ . '/app/views/validationmodal.phtml';    
    require __DIR__ . '/app/views/restorationmodal.phtml';    
    require __DIR__ . '/app/views/foot.phtml';
?>