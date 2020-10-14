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

    document.getElementById("post-validation-button").addEventListener( 'click', ( event ) => {
        event.preventDefault()
        new FormData(document.getElementById("validation-form"))
    }, true );
    
    document.getElementById("post-request-restore-button").addEventListener( 'click', ( event ) => {
        event.preventDefault()
        new FormData(document.getElementById("request-restore-form"))
    }, true );    

    document.getElementById("post-restore-button").addEventListener( 'click', ( event ) => {
        event.preventDefault()
        new FormData(document.getElementById("restore-password-form"))
    }, true );
}

const LogOut = ( ) => {
    new FormData(document.getElementById("logout-form"))
}

const RegisterHTTPCallback = ( data ) => {
    const responseJSON = JSON.parse(data);
    if( responseJSON["register-succes"]) {
        document.getElementById("login-modal-dismiss").click();
        document.getElementById("validate-button").click();
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

const ValidationHTTPCallback = ( data ) => {
    const responseJSON = JSON.parse(data)
    if ( responseJSON["validate-succes"] ) {
        alert('Your account has been successfully validated! You will now be logged in.')
        location.reload(); 
    } else if ( !responseJSON["validate-succes"] ) {
        alert(responseJSON["error-message"])
    } 
}

const RequestRestoreHTTPCallback = ( data ) => {
    const responseJSON = JSON.parse(data)
    if ( responseJSON["request-restore-succes"] ) {
        alert('A restoration code has been sent to you accounts email adress')
    } else if ( !responseJSON["request-restore-succes"] ) {
        alert(responseJSON["error-message"])
    } 
}

const RestorePasswordHTTPCallback = ( data ) => {
    const responseJSON = JSON.parse(data)
    if ( responseJSON["restore-password-succes"] ) {
        alert('Your account has been successfully restored! You will now be logged in.')
        location.reload(); 
    } else if ( !responseJSON["restore-password-succes"] ) {
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

document.getElementById("validation-form").addEventListener( 'formdata', ( event ) => {
    prepareHTTPRequest( "POST", "catch_http_request.php", event.formData, ValidationHTTPCallback )
}, true )

document.getElementById("request-restore-form").addEventListener( 'formdata', ( event ) => {
    prepareHTTPRequest( "POST", "catch_http_request.php", event.formData, RequestRestoreHTTPCallback )
}, true )

document.getElementById("restore-password-form").addEventListener( 'formdata', ( event ) => {
    prepareHTTPRequest( "POST", "catch_http_request.php", event.formData, RestorePasswordHTTPCallback )
}, true )