
const api_path = "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/ch.yu";


// 取得所有產品列表

let totalGoods,
    $goodsList = document.querySelector('[data-goodsList]');

// 取得所有產品列表：接 API
function getTotalGoods() {
    axios.get(`${api_path}/products`)
        .then((res) => {
            totalGoods = res.data.products;
            renderTotalGoods();
        });
}
getTotalGoods();

// 取得所有產品列表：渲染到畫面上
function renderTotalGoods() {
    totalGoods.forEach((product) => {
        $goodsList.innerHTML += `
        <li class="l-viewList__item">
            <div class="c-card">
                <div class="c-card__img">
                    <img src="${product.images}" alt="${product.title}">
                </div>
                <div class="c-card__btn">
                    <a href="#" class="o-btn">
                        <span>加入購物車</span>
                    </a>
                </div>
                <div class="c-card__tit">
                    <div class="o-title o-title--md">${product.title}</div>
                </div>
                <div class="c-card__bottom">
                    <del class="o-title o-title--md o-title--normal">NT$ <span>${product.origin_price}</span></del>
                    <div class="o-title o-title--normal">NT$ <span>${product.price}</span></div>
                </div>
                <div class="c-card__tag">
                    <div class="o-tag">New</div>
                </div>
            </div>
        </li>`;
    });
}