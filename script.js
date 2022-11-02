const root = document.getElementById('root');

// 데이터 불러오기

const vendingPageHeader = document.createElement('header');
vendingPageHeader.setAttribute('class','header');

const vendingTitle = document.createElement('h1');
const vendingTitleImg = document.createElement('img');
vendingTitleImg.setAttribute('class','img_title')
vendingTitleImg.setAttribute('src','./assets/img/logo.svg');
vendingTitleImg.setAttribute('alt', 'Cola Cola 타이틀 로고');
vendingTitle.appendChild(vendingTitleImg);



root.appendChild(vendingPageHeader);