function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
}


const logInBtn = document.querySelector('.logInBtn')
const mobile_member_icon = document.querySelector('.mobile_member_icon')
const member_Information = document.querySelector('.member_Information')
const consumer_photo = document.querySelector('.consumer_photo')
const profile_consumerName = document.querySelector('.profile_consumerName')
const profile_email = document.querySelector('.profile_email')
const profile_Content = document.querySelector('.profile_Content')
let fbAccessToken =''


logInBtn.addEventListener('click', fb_Login)
mobile_member_icon.addEventListener('click', fb_Login)

// let consumer_Information = null;
// var FBlogin = function(userID,email,name){
// 	var consumer_Information = {
//         'userID' : userID,
// 		'email' : email,
// 		'name' : name,
//     };
//     return consumer_Information;
// }

function statusChangeCallback(response) {
    console.log('response of FB.login: ', response)
    if (response.authResponse) {
        // console.log('Welcome!  Fetching your information.... ');
        // 改變登入登出顯示及帳戶資訊是否顯示
        logInBtn.innerHTML = '登出'
        member_Information.style.display = "initial"
        fbAccessToken = response.authResponse.accessToken
        console.log(fbAccessToken)
        // 取得資料
        // FB.api('/me','GET',{
        // 	"fields" : "userID,name,gender,email"
        // },function(response){
        // 	// FB登入視窗點擊登入後，會將資訊回傳到此處。
        // 	FBlogin(response.userID,response.email,response.name,response);
        // });
        // 將資訊帶進頁面
    } else {
        console.log('User cancelled login or did not fully authorize.');
    }
}

function fb_Login() {
    FB.login(function(response) {
        statusChangeCallback(response);

    })
}

function signupAPI() {
    const signupUrl = 'https://api.appworks-school.tw/api/1.0/user/signin'
    fetch(signupUrl,{
        method: 'Post',
        headers: {
        'Content-Type': 'application/json',
        },
        body: {
            "provider":"facebook",
            "access_token": fbAccessToken
          }
    })
    .then(res=>res.json())
    .then(json=>{
        let profileData = json.data
        if(profileData) {
            consumer_photo.setAttribute('src', `${profileData.user.picture}`)
            profile_consumerName.innerHTML = profileData.user.name
            profile_email.innerHTML = profileData.user.email
        } else {
            profile_Content.innerHTML = '查無會員資料';
        } 
    })
}


//會員登入菜單
var hide = true;
//可通過title變化觸發不同菜單
function showOrHide(title) {
    var d = document.getElementById("d"+title);
    if(hide) {
        d.style.display = "initial";
        hide = false;
    } else {
        d.style.display = "none";
        hide = true;
    }
}


