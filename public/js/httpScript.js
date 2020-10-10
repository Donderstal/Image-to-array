const prepareHTTPRequest = ( method, url, data ) => {
    fetch( url, {
        method: method,
        body: data
    } ).then( response => { 
            return response.json() 
        }
    ).then( data => {
            const responseJSON = JSON.parse(data)
            if ( responseJSON["log-succes"] ) {
                document.getElementById( "login-modal-dismiss" ).click( );
                document.getElementsByClassName('window-active')[0].className = "row window window-inactive";
                document.getElementById("welcome-div").className = "row window window-active";
            }
        }
    ).catch(err => {
        console.log("Error Reading data " + err);
        } 
    );
}

console.log('httpscript')

const initHTTPListeners = ( ) => {
    document.getElementById("post-login-button").addEventListener( 'click', ( event ) => {
        event.preventDefault()
        new FormData(document.getElementById("login-form"))
    }, true );

    document.getElementById("post-registration-button").addEventListener( 'click', ( event ) => {
        event.preventDefault()
        new FormData(document.getElementById("registration-form"))
    }, true );    
}

document.addEventListener('DOMContentLoaded', initHTTPListeners );

document.getElementById("registration-form").addEventListener( 'formdata', ( event ) => {
    prepareHTTPRequest( "POST", "catch_http_request.php", event.formData )
}, true );

document.getElementById("login-form").addEventListener( 'formdata', ( event ) => {
    prepareHTTPRequest( "POST", "catch_http_request.php", event.formData )
}, true );