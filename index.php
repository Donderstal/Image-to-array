<?php
/* Catch requested route */
$request = $_SERVER['REQUEST_URI'];
require __DIR__ . '/app/views/partials/head.phtml';
require __DIR__ . '/app/views/partials/mapmaker.html';    
require __DIR__ . '/app/views/partials/foot.phtml';

?>