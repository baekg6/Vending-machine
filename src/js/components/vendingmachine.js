class Vendingmachine {
  constructor() {
    const vMachine = document.querySelector('.vending-machine');
    this.balance = vMachine.querySelector('.txt-balance');
    this.itemList = vMachine.querySelector('.list-item');
    this.inputCostEl = vMachine.querySelector('.inp-put');
    this.btnPut = vMachine.querySelector('.btn-put');
    this.btnReturn = vMachine.querySelector('.btn-return');
    this.btnGet = vMachine.querySelector('.btn-get');
    this.stagedList = vMachine.querySelector('.list-item-staged');

    const myinfo = document.querySelector('.my-info');
    this.myMoney = myinfo.querySelector('.txt-mymoney');
    this.gotList = myinfo.querySelector('.list-item-staged');
    this.txtTotal = myinfo.querySelector('.txt-total');
  }
  setup() {
    this.bindEvents();
  }

  // 선택한 음료수 목록 생성
  stagedItemGenerator(target) {
    const stagedItem = document.createElement('li');
    stagedItem.dataset.item = target.dataset.item;
    stagedItem.dataset.price = target.dataset.price;
    stagedItem.innerHTML = `
    <button type="button" class="btn-staged">
            <img src="./src/images/${target.dataset.img}" alt="" class="img-item">
            <strong class="txt-item">${target.dataset.item}</strong>
            <span class="num-counter">1</span>
            </button>
        `;
    this.stagedList.appendChild(stagedItem);
  }

  bindEvents() {
    /**
     * 1. 입금 버튼
     * 입금액을 입력하고 버튼을 누르면 소지금에서 입력한 금액이 잔액에 추가
     * 입금액이 소지금보다 많다면, 소지금 부족 경고창을 띄움
     * 버튼을 누르면 입금액 입력 인풋창은 초기화
     */
    this.btnPut.addEventListener('click', (event) => {
      const inputCost = parseInt(this.inputCostEl.value);
      const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(',', ''));
      const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));

      if (inputCost) {
        if (inputCost <= myMoneyVal && inputCost > 0) {
          //Intl.NumberFormat : 언어에 맞는 숫자 서식을 문자열로 반환합니다. IE11 부터 지원
          this.myMoney.textContent = new Intl.NumberFormat().format(myMoneyVal - inputCost) + ' 원';
          this.balance.textContent = new Intl.NumberFormat().format((balanceVal ? balanceVal : 0) + inputCost) + ' 원';
        } else {
          alert('소지금이 부족합니다.');
        }
        this.inputCostEl.value = null;
      }
    });

    /**
     * 2. 거스름돈 반환 버튼
     * 반환 버튼을 누르면 잔액이 소지금으로 이동
     */

    this.btnReturn.addEventListener('click', (event) => {
      const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));
      const myMoneyVal = parseInt(this.myMoney.textContent.replaceAll(',', ''));

      if (balanceVal) {
        this.myMoney.textContent = new Intl.NumberFormat().format(balanceVal + myMoneyVal) + ' 원';
        this.balance.textContent = '원';
      }
    });

    /**
     * 3. 자판기 메뉴
     * 아이템을 누르면 잔액에서 아이템 가격이 차감
     * 잔액이 부족하면 경고창을 띄움
     * 아이템이 획득가능 창에 등록
     * 아이템 재고가 0이면 sold-out 클래스 츄거
     */

    const btnsCola = this.itemList.querySelectorAll('button');

    btnsCola.forEach((item) => {
      item.addEventListener('click', (event) => {
        const targetEl = event.currentTarget;
        const balanceVal = parseInt(this.balance.textContent.replaceAll(',', ''));
        let isStaged = false; // 이미 선택되었는가?
        const targetElPrice = parseInt(targetEl.dataset.price);
        const stagedListItem = this.stagedList.querySelectorAll('li');

        if (balanceVal >= targetElPrice) {
          this.balance.textContent = new Intl.NumberFormat().format(balanceVal - targetElPrice) + ' 원';

          for (const item of stagedListItem) {
            if (item.dataset.item === targetEl.dataset.item) {
              item.querySelector('.num-counter').textContent++;
              isStaged = true;
              break;
            }
          }

          if (!isStaged) {
            this.stagedItemGenerator(targetEl);
          }

          targetEl.dataset.count--;

          if (parseInt(targetEl.dataset.count) === 0) {
            targetEl.parentElement.classList.add('sold-out');
            const warning = document.createElement('em');
            warning.textContent = '해당상품은 품절입니다.';
            warning.classList.add('ir');
            targetEl.parentElement.insertBefore(warning, targetEl);
          }
        } else {
          alert('잔액이 부족합니다. 돈을 입금해주세요');
        }
      });
    });

    /**
     * 4. 획득 버튼
     * 획득 버튼을 누르면 선택한 음료수 목록이 획득 음료 목록으로 이동
     * 획득 음료들의 금액을 모두 합하여 총 금액 업데이트
     */

    this.btnGet.addEventListener('click', (event) => {
      let isGot = false;
      let totalPrice = 0;

      for (const itemStaged of this.stagedList.querySelectorAll('li')) {
        for (const itemGot of this.gotList.querySelectorAll('li')) {
          let itemGotCount = itemGot.querySelector('.num-counter');
          if (itemStaged.dataset.item === itemGot.dataset.item) {
            itemGotCount.textContent =
              parseInt(itemGotCount.textContent) + parseInt(itemStaged.querySelector('.num-counter').textContent);
            isGot = true;
            break;
          }
        }

        if (!isGot) {
          this.gotList.appendChild(itemStaged);
        }
      }

      this.stagedList.innerHTML = null;

      this.gotList.querySelectorAll('li').forEach((itemGot) => {
        totalPrice += itemGot.dataset.price * parseInt(itemGot.querySelector('.num-counter').textContent);
      });
      this.txtTotal.textContent = `총금액 : ${new Intl.NumberFormat().format(totalPrice)}원`;
    });
  }
}

export default Vendingmachine;
