

window.fbAsyncInit = function() {
    FB.init({
    appId      : '2072629076292893',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v3.2' // The Graph API version to use for the call
    });
}

const logInBtn = document.querySelector('.logInBtn')
const mobile_member_icon = document.querySelector('.mobile_member_icon')

logInBtn.addEventListener('click', fbLogIn)
mobile_member_icon.addEventListener('click', fbLogIn)

function fbLogIn() {
    FB.login(function(response) {
        console.log('response of FB.login: ', response)
        if (response.authResponse) {
            // console.log('Welcome!  Fetching your information.... ');
            // 改變登入登出顯示及帳戶資訊是否顯示
            let logInBtn = document.querySelector('.logInBtn')
            let member_Information = document.querySelector('.member_Information')
            logInBtn.innerHTML = '登出'
            member_Information.style.display = "initial"

        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'user picture, name, email'});
}


//會員登入菜單
var hide = true;
//可通過title變化觸發不同菜單
function showOrHide(title) {
    var d = document.getElementById("d"+title);
    if(hide) {
        d.style.display = "block";
        hide = false;
    } else {
        d.style.display = "none";
        hide = true;
    }
}