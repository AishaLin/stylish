//將資料庫的陣列取出
const arrayJason = JSON.parse(localStorage.getItem('profileInf'));
const consumer_photo = document.querySelector('.consumer_photo')
const profile_consumerName = document.querySelector('.profile_consumerName')
const profile_email = document.querySelector('.profile_email')
const profile_Content = document.querySelector('.profile_Content')
//假如資料庫內的陣列有內容存在，執行以下的程式碼
if (arrayJason) {
    consumer_photo.setAttribute('src', arrayJason.picture)
    profile_consumerName.innerHTML = arrayJason.name
    profile_email.innerHTML = arrayJason.email
} else {
    profile_Content.innerHTML = '';
    profile_Content.innerHTML = '查無會員資料';
}
console.log('ok')