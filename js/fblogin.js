const logInBtn = document.querySelector('.logInBtn')
const mobile_member_icon = document.querySelector('.mobile_member_icon')
const member_Information = document.querySelector('.member_Information')

let fbAccessToken =''

!==

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

function fb_Login(response) {
    FB.login(function(response) {
        checkLoginState(response);
    },{ scope: 'email,public_profile'})
}

// 檢查當前的登入狀態
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}
// 依登入狀態執行事件
function statusChangeCallback(response) {
    console.log('response of FB.login: ', response)
    if (response.authResponse) {
        // console.log('Welcome!  Fetching your information.... ');
        // 改變登入登出顯示及帳戶資訊是否顯示
        logInBtn.innerHTML = '登出'
        member_Information.style.display = "initial"
        fbAccessToken = response.authResponse.accessToken
        const user = {
            "provider":"facebook",
            "access_token": fbAccessToken
          }
        console.log(fbAccessToken)
        signupAPI(user, response)
        
        // 若是手機版，點擊登入後直接進入會員資料頁面
        if(mobile_member_icon) {
            window.location.pathname = `profile.html`
        }
        // 取得資料
        // FB.api('/me','GET',{
        // 	"fields" : "userID,name,gender,email"
        // },function(response){
        // 	// FB登入視窗點擊登入後，會將資訊回傳到此處。
        // 	FBlogin(response.userID,response.email,response.name,response);
        // });
        // 將資訊帶進頁面

    } else {

        beforeLogInEventHandler(response)
    }
    
}


// 在local storage 存入profile 資訊
if(!localStorage.getItem('profileInf')) {
    localStorage.setItem('profileInf',JSON.stringify([]))
}
function signupAPI(obj,res) {
    console.log('token', fbAccessToken)
    const signupUrl = `https://api.appworks-school.tw/api/1.0/user/signin`
    fetch(signupUrl,{
        method: 'Post',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${fbAccessToken}`
        },
        body: JSON.stringify(obj)
    })
    .then(res =>res.json())
    .then(json=>{
        console.log(json)
        let profileData = json.data.user
        if(profileData) {
            let profileDataArray = {
                name: profileData.name,
                email: profileData.email,
                picture: profileData.picture
            }
            console.log(profileDataArray)
            let profileInfData = JSON.parse(localStorage.getItem('profileInf'))
            console.log(profileInfData)
            profileInfData.push(profileDataArray)
            localStorage.setItem('profileInf', JSON.stringify(profileInfData))
            console.log('99')
        } else {
            console.log(json)
            alert('查無會員資訊。');
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
