<?php
/* Catch requested route */
$request = $_SERVER['REQUEST_URI'];
require __DIR__ . '/app/views/partials/head.phtml';

if ( strpos( $request, 'mapmaker' ) ) {
    require __DIR__ . '/app/views/partials/head.phtml';
    require __DIR__ . '/app/views/partials/mapmaker.html';    
    require __DIR__ . '/app/views/partials/foot.phtml';
}
else if ( strpos( $request, 'vektis-viewer' ) ) {
    require __DIR__ . '/app/views/partials/vektis-viewer.phtml';   
}
else {
    require __DIR__ . '/app/views/partials/head.phtml';
    require __DIR__ . '/app/views/partials/home.html';    
    require __DIR__ . '/app/views/partials/foot.phtml';
}
?>