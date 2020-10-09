const prepareHTTPRequest = ( method, url, data ) => {
    fetch( url, {
        method: method,
        body: data
    } ).then(
        response => { 
            console.log(response)
            return response.json() 
        }
    ).then(
        data => {
            console.log( data )
        }
    ).catch(err => {
        console.log("Error Reading data " + err);
        } 
    );
}

const postRegistrationForm = ( event ) => {
    event.preventDefault()
    new FormData(document.getElementById("registration-form"))
};

const postLoginForm = ( ) => {
    event.preventDefault()
    new FormData(document.getElementById("login-form"))
}

document.getElementById("post-login-button").addEventListener( 'click', postLoginForm, true );

document.getElementById("post-registration-button").addEventListener( 'click', postRegistrationForm, true );

document.getElementById("registration-form").addEventListener( 'formdata', ( e ) => {
    prepareHTTPRequest( "POST", "catch_http_request.php", e.formData )
}, true );

document.getElementById("login-form").addEventListener( 'formdata', ( e ) => {
    prepareHTTPRequest( "POST", "catch_http_request.php", e.formData )
}, true );