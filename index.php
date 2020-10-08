<?php
    require_once "database_config.php";

    StartConnection( );

    /* Catch requested route */
    $request = $_SERVER['REQUEST_URI'];
    require __DIR__ . '/app/views/head.phtml';
    require __DIR__ . '/app/views/mapmaker.html';    
    require __DIR__ . '/app/views/login.html';
    require __DIR__ . '/app/views/welcome.html';
    require __DIR__ . '/app/views/mapmakermenu.html';
    require __DIR__ . '/app/views/newmap.html';
    require __DIR__ . '/app/views/tilesheetmodal.html';    
    require __DIR__ . '/app/views/foot.phtml';
?>