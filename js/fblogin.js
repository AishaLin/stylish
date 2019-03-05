function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
}


const logInBtn = document.querySelector('.logInBtn')
const mobile_member_icon = document.querySelector('.mobile_member_icon')

logInBtn.addEventListener('click', fbLogIn)
mobile_member_icon.addEventListener('click', fbLogIn)

let consumer_Information = null;
var FBlogin = function(userID,email,name){
	var consumer_Information = {
        'userID' : userID,
		'email' : email,
		'name' : name,
    };
    return consumer_Information;
}

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
            // 取得資料
            FB.api('/me','GET',{
				"fields" : "userID,name,gender,email"
			},function(response){
				// FB登入視窗點擊登入後，會將資訊回傳到此處。
				FBlogin(response.userID,response.email,response.name,response);
            });
            // 將資訊帶進頁面
            let consumer_photo = document.querySelector('.consumer_photo')
            let profile_consumerName = document.querySelector('.profile_consumerName')
            let profile_email = document.querySelector('.profile_email')
            // let profile_tel = document.querySelector('.profile_tel')
            consumer_photo.setAttribute('src', `http://graph.facebook.com/${FBlogin.userID}/picture?type=normal`)
            profile_consumerName.innerHTML = `${FBlogin.name}`
            profile_email.innerHTML = `${FBlogin.email}`

        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'userID, user picture, name, email'});
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