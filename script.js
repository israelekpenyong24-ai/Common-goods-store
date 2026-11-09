const products = [
  {id:1,name:'Sunday Ceramic Mug',category:'Home',detail:'Hand-finished stoneware · 350ml',price:24,image:'photo-1514228742587-6b1558fcca3d',badge:'Bestseller',tone:'#e7ddd0'},
  {id:2,name:'Everywhere Tote',category:'Style',detail:'Recycled cotton · Natural',price:32,image:'photo-1544816155-12df9643f363',badge:'Easy favourite',tone:'#e5e2d8'},
  {id:3,name:'Soft Focus Lamp',category:'Home',detail:'Warm LED · Rechargeable',price:68,image:'photo-1507473885765-e6ed057f782c',badge:'A good glow',tone:'#e8e1d5'},
  {id:4,name:'Daily Notes Set',category:'Everyday',detail:'Uncoated paper · Set of 3',price:18,image:'photo-1455390582262-044cdead277a',badge:'Little ritual',tone:'#e9e1d6'},
  {id:5,name:'Studio Headphones',category:'Tech',detail:'Wireless · 30-hour playtime',price:89,image:'photo-1505740420928-5e560c06d30e',badge:'Sound good',tone:'#e2e1dc'},
  {id:6,name:'Cloud Knit Throw',category:'Home',detail:'Organic cotton · Moss',price:76,image:'photo-1600210492486-724fe5c67fb0',badge:'Slow Sunday',tone:'#e2e5dc'},
  {id:7,name:'Pocket Film Camera',category:'Tech',detail:'35mm · Reusable',price:54,image:'photo-1516035069371-29a1b244cc32',badge:'New find',tone:'#e2e0d9'},
  {id:8,name:'Good Day Bottle',category:'Everyday',detail:'Insulated steel · 500ml',price:29,image:'photo-1602143407151-7111542de6e8',badge:'Take it along',tone:'#e3e8df'}
];
const money = value => `$${value.toFixed(2)}`;
const grid = document.querySelector('#product-grid');
const emptyState = document.querySelector('#empty-state');
let category = 'All';
let query = '';
let cart = JSON.parse(localStorage.getItem('commonGoodsCart') || '{}');
let toastTimer;

function renderProducts(){
  const visible = products.filter(p => (category === 'All' || p.category === category) && `${p.name} ${p.category} ${p.detail}`.toLowerCase().includes(query.toLowerCase()));
  grid.innerHTML = visible.map(p => `<article class="product-card">
    <div class="product-image" style="background:${p.tone}"><img src="https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=800&q=80" alt="${p.name}" loading="lazy"><span class="product-badge">${p.badge}</span><button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div>
    <div class="product-info"><div><h3>${p.name}</h3><p>${p.detail}</p></div><span class="product-price">${money(p.price)}</span></div>
  </article>`).join('');
  emptyState.hidden = visible.length > 0;
}
function saveCart(){localStorage.setItem('commonGoodsCart',JSON.stringify(cart));renderCart();}
function addToCart(id){cart[id]=(cart[id]||0)+1;saveCart();const p=products.find(x=>x.id===id);showToast(`${p.name} added to your bag`);}
function renderCart(){
  const entries=Object.entries(cart).filter(([,qty])=>qty>0);const count=entries.reduce((n,[,qty])=>n+qty,0);
  document.querySelector('#cart-count').textContent=count;document.querySelector('#drawer-count').textContent=`(${count})`;
  document.querySelector('#cart-empty').hidden=count>0;document.querySelector('#drawer-bottom').hidden=count===0;
  document.querySelector('#cart-items').innerHTML=entries.map(([id,qty])=>{const p=products.find(x=>x.id===Number(id));return `<article class="cart-row"><img src="https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=180&q=75" alt=""><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="quantity"><button data-qty="${id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${id}" data-change="1" aria-label="Increase quantity">+</button></div><button class="remove-item" data-remove="${id}">Remove</button></div><b class="line-price">${money(p.price*qty)}</b></article>`}).join('');
  document.querySelector('#cart-subtotal').textContent=money(entries.reduce((n,[id,qty])=>n+products.find(p=>p.id===Number(id)).price*qty,0));
}
function setCartOpen(open){document.body.classList.toggle('cart-open',open);document.querySelector('#cart-drawer').setAttribute('aria-hidden',String(!open));}
function showToast(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2100);}
document.querySelectorAll('.filter-chip').forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.category;document.querySelectorAll('.filter-chip').forEach(b=>b.classList.toggle('active',b===btn));renderProducts();}));
document.querySelector('#product-search').addEventListener('input',e=>{query=e.target.value;renderProducts();});
document.querySelector('.search-toggle').addEventListener('click',()=>{document.querySelector('#product-search').focus();document.querySelector('#shop').scrollIntoView({behavior:'smooth'});});
document.querySelectorAll('[data-nav-category]').forEach(link=>link.addEventListener('click',()=>{category=link.dataset.navCategory;document.querySelectorAll('.filter-chip').forEach(b=>b.classList.toggle('active',b.dataset.category===category));renderProducts();}));
grid.addEventListener('click',e=>{const btn=e.target.closest('[data-add]');if(btn)addToCart(Number(btn.dataset.add));});
document.querySelector('#cart-items').addEventListener('click',e=>{const qty=e.target.closest('[data-qty]'),remove=e.target.closest('[data-remove]');if(qty){const id=qty.dataset.qty;cart[id]=(cart[id]||0)+Number(qty.dataset.change);if(cart[id]<=0)delete cart[id];saveCart();}if(remove){delete cart[remove.dataset.remove];saveCart();}});
document.querySelector('#open-cart').addEventListener('click',()=>setCartOpen(true));document.querySelector('#close-cart').addEventListener('click',()=>setCartOpen(false));document.querySelector('#overlay').addEventListener('click',()=>setCartOpen(false));document.querySelector('#continue-shopping').addEventListener('click',()=>setCartOpen(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setCartOpen(false);});
document.querySelector('#menu-toggle').addEventListener('click',()=>document.querySelector('.main-nav').classList.toggle('open'));
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.main-nav').classList.remove('open')));
document.querySelector('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#newsletter-message').textContent='You’re on the list. Talk soon ✳';e.target.reset();});
document.querySelector('.checkout-button').addEventListener('click',()=>showToast('Checkout is a demo in this storefront'));
renderProducts();renderCart();
