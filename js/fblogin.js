

window.fbAsyncInit = function() {
    FB.init({
    appId      : '2072629076292893',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v3.2' // The Graph API version to use for the call
    });
}

const btn_member01 = document.querySelector('.btn_member01')
const mobile_member_icon = document.querySelector('.mobile_member_icon')

btn_member01.addEventListener('click', fbLogIn)
mobile_member_icon.addEventListener('click', fbLogIn)

function fbLogIn() {
    FB.login(function(response) {
        console.log('response of FB.login: ', response)
        if (response.authResponse) {
        //  console.log('Welcome!  Fetching your information.... ');
        
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    });
}

