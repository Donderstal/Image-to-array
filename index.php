<?php
/* Catch requested route */
$request = $_SERVER['REQUEST_URI'];
require __DIR__ . '/app/views/head.phtml';
require __DIR__ . '/app/views/mapmaker.html';    
require __DIR__ . '/app/views/foot.phtml';

?>