//將資料庫的陣列取出
const profile_arrayJason = JSON.parse(localStorage.getItem('profileInf'));
const consumer_photo = document.querySelector('.consumer_photo')
const profile_consumerName = document.querySelector('.profile_consumerName')
const profile_email = document.querySelector('.profile_email')
const profile_Content = document.querySelector('.profile_Content')
//假如資料庫內的陣列有內容存在，執行以下的程式碼
if (profile_arrayJason) {
    consumer_photo.setAttribute('src', `${profile_arrayJason.picture}`)
    profile_consumerName.textContent = profile_arrayJason.name
    profile_email.textContent = profile_arrayJason.email
} else {
    profile_Content.innerHTML = '';
    profile_Content.innerHTML = '查無會員資料';
}
console.log('ok')
