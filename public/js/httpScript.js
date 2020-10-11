const emailRegEx =  /\S+@\S+\.\S+/;

const prepareHTTPRequest = ( method, url, data, callback ) => {
    fetch( url, {
        method: method,
        body: data
    } ).then( response => { 
            return response.json() 
        }
    ).then( 
        result => callback(result)
    ).catch(err => {
        console.log("Error Reading data " + err);
        } 
    );
}

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

const LogOut = ( ) => {
    new FormData(document.getElementById("logout-form"))
}

const RegisterHTTPCallback = ( data ) => {
    const responseJSON = JSON.parse(data);
    if( responseJSON["register-succes"]) {
        alert("registration succes!")
    } else if (!responseJSON["register-succes"]) {
        alert(responseJSON["error-message"])
    }
}

const LogHTTPCallback = ( data ) => {
    const responseJSON = JSON.parse(data)
    if ( responseJSON["log-succes"] ) {
        location.reload(); 
    } else if ( !responseJSON["log-succes"] ) {
        alert(responseJSON["error-message"])
    } 
}

document.addEventListener('DOMContentLoaded', initHTTPListeners );

document.getElementById("registration-form").addEventListener( 'formdata', ( event ) => {
    if ( document.getElementById("register-password-confirmation").value != document.getElementById("register-password-input").value ) {
        alert('your password confirmation does not match your first password');
    } else if ( !emailRegEx.test( document.getElementById("register-email-input").value ) ) {
        alert("that's not a valid email adress, fool")
    } else {
        prepareHTTPRequest( "POST", "catch_http_request.php", event.formData, RegisterHTTPCallback )        
    }
}, true );

document.getElementById("login-form").addEventListener( 'formdata', ( event ) => {
    prepareHTTPRequest( "POST", "catch_http_request.php", event.formData, LogHTTPCallback )
}, true );

document.getElementById("logout-form").addEventListener( 'formdata', ( event ) => {
    event.formData.append('logout', true)
    prepareHTTPRequest( "POST", "catch_http_request.php", event.formData, LogHTTPCallback )
}, true )