/* ONE DAY content hub — imagery and menu content are managed here. */
const siteVisuals = {
  heroImage: 'hero-one-day.png',
  categories: [
    ['kahveler', 'Kahveler', 'photo-1495474472287-4d71bcdd2085'], ['soguk-kahveler', 'Soğuk Kahveler', 'photo-1461023058943-07fcbe16d735'], ['sicak-icecekler', 'Sıcak İçecekler', 'photo-1512568400610-62da28bc8a13'], ['caylar', 'Çaylar', 'photo-1564890369478-c89ca6d9cde9'], ['bitki-caylari', 'Bitki Çayları', 'photo-1544787219-7f47ccb76574'], ['frozen', 'Frozen', 'photo-1553530666-ba11a7da3888'], ['smoothie', 'Smoothie', 'photo-1553530666-ba11a7da3888'], ['milkshake', 'Milkshake', 'photo-1579954115545-a95591f28bfc'], ['limonatalar', 'Limonatalar', 'photo-1621263764928-df1444c5e859'], ['taze-sikimlar', 'Taze Sıkımlar', 'photo-1613478223719-2ab802602423'], ['kokteyller', 'Kokteyller', 'photo-1536935338788-846bb9981813'], ['soft-drinks', 'Soft Drinks', 'photo-1551024709-8f23befc6f87'], ['kahvalti', 'Kahvaltı', 'photo-1533089860892-a7c6f0a88666'], ['omletler', 'Omletler', 'photo-1525351484163-7529414344d8'], ['tostlar', 'Tostlar', 'photo-1528735602780-2552fd46c7af'], ['burgerler', 'Burgerler', 'photo-1568901346375-23c9450c58cd'], ['makarnalar', 'Makarnalar', 'photo-1473093295043-cdd812d0e601'], ['pizzalar', 'Pizzalar', 'photo-1513104890138-7c749659a591'], ['ana-yemekler', 'Ana Yemekler', 'photo-1547592180-85f173990554'], ['salatalar', 'Salatalar', 'photo-1540420773420-3366772f4999'], ['tatlilar', 'Tatlılar', 'photo-1551024506-0bccd828d307'], ['nargile', 'Nargile', 'photo-1520903920243-00d872a2d1c9'],
  ],
  productImages: ['photo-1495474472287-4d71bcdd2085', 'photo-1509042239860-f550ce710b93', 'photo-1514432324607-a09d9b4aefdd', 'photo-1517256673644-36ad11246d21', 'photo-1515003197210-e0cd71810b5f', 'photo-1541167760496-1628856ab772', 'photo-1501339847302-ac426a4a7cbb', 'photo-1521302080334-4bebac2763a6', 'photo-1497636577773-f1231844b336', 'photo-1495474472287-4d71bcdd2085'],
};

/* Admin panelindeki içerikler ziyaretçi menüsünde otomatik olarak kullanılır. */
try {
  const managed = JSON.parse(localStorage.getItem('oneday-menu-data-v1'));
  if (managed?.categories?.length) {
    siteVisuals.categories = managed.categories.map(c => [c.id, c.name, c.image]);
    siteVisuals.managedProducts = managed.products || [];
  }
} catch (_) { /* Yerel yönetim verisi yoksa varsayılan menü kullanılmaya devam eder. */ }

const imageUrl = (id, width = 1000) => /^(https?:|data:)/.test(id) ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=84`;
const hero = document.querySelector('#hero-image');
const categoryGrid = document.querySelector('#category-grid');
if (hero) hero.src = siteVisuals.heroImage;
try { const settings = JSON.parse(localStorage.getItem('oneday-site-settings-v1')); if (settings?.heroImage && hero) hero.src = settings.heroImage; if (settings?.customCss) { const customStyle = document.createElement('style'); customStyle.textContent = settings.customCss; document.head.appendChild(customStyle); } } catch (_) { /* Varsayılan görünüm korunur. */ }
if (categoryGrid) categoryGrid.innerHTML = siteVisuals.categories.map(([slug, name, image], index) => `<a class="category-card" href="category.html?category=${slug}" style="--card-delay:${Math.min(index, 8) * 45}ms"><img src="${imageUrl(image)}" alt="${name}" loading="lazy"><span class="category-card__veil"></span><span class="category-card__number">${String(index + 1).padStart(2, '0')}</span><span class="category-card__name">${name}<i>↗</i></span></a>`).join('');

document.querySelectorAll('a[href="#categories"]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); document.querySelector('#categories').scrollIntoView({ behavior: 'smooth' }); }));
const menuButton = document.querySelector('.button--outline');
if (menuButton) setInterval(() => menuButton.classList.toggle('is-attention'), 2200);

const menuArrow = document.querySelector('.menu-button__arrow');
if (menuArrow) {
  let arrowIsDown = false;
  setInterval(() => {
    arrowIsDown = !arrowIsDown;
    menuArrow.style.transform = `translateY(${arrowIsDown ? 7 : 0}px)`;
  }, 520);
}

const categorySlug = new URLSearchParams(location.search).get('category');
const [currentSlug, categoryName, categoryImage] = siteVisuals.categories.find(([slug]) => slug === categorySlug) || siteVisuals.categories[0];
const menuIntro = document.querySelector('#menu-intro');
const productGrid = document.querySelector('#product-grid');
const categoryRail = document.querySelector('#category-rail');

if (menuIntro && productGrid && categoryRail) {
  const labels = ['Signature', 'Classic', 'House', 'Premium', 'Special', 'Fresh', 'Seasonal', 'Artisan', 'One Day', 'Lounge'];
  document.title = `${categoryName} | ONE DAY`;
  categoryRail.innerHTML = siteVisuals.categories.map(([slug, name, image]) => `<a class="quick-category ${slug === currentSlug ? 'is-active' : ''}" href="category.html?category=${slug}"><img src="${imageUrl(image, 240)}" alt=""><span>${name}</span></a>`).join('');
  menuIntro.innerHTML = `<p class="section-label">✦ QR MENU ✦</p><h1>${categoryName}</h1><p>Günün her anına eşlik eden, özenle hazırlanmış seçimlerimizi keşfedin.</p><img src="${imageUrl(categoryImage, 1800)}" alt="${categoryName}">`;
  const managedProducts = (siteVisuals.managedProducts || []).filter(product => product.categoryId === currentSlug);
  const products = managedProducts.length ? managedProducts.map(product => ({ name: product.name, price: product.price, image: product.image || imageUrl(categoryImage), text: product.description })) : labels.map((label, index) => ({ name: `${label} ${categoryName}`, price: `${135 + index * 18} ₺`, image: imageUrl(siteVisuals.productImages[index]), text: `Seçkin malzemeler ve One Day dokunuşuyla hazırlanan özel bir ${categoryName.toLocaleLowerCase('tr-TR')} seçimi.` }));
  productGrid.innerHTML = products.map((product, index) => `<button class="product-card" data-id="${index}"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="product-card__index">${String(index + 1).padStart(2, '0')}</span><div><h2>${product.name}</h2><p>${product.text}</p><strong>${product.price}</strong></div><b>+</b></button>`).join('');
  const dialog = document.querySelector('#product-modal');
  const modalContent = document.querySelector('#modal-content');
  productGrid.onclick = (event) => { const card = event.target.closest('.product-card'); if (!card) return; const product = products[card.dataset.id]; modalContent.innerHTML = `<img src="${product.image}" alt="${product.name}"><div class="modal-copy"><p class="section-label">ONE DAY SELECTION</p><h2>${product.name}</h2><strong>${product.price}</strong><p>${product.text}</p><span>Ürün içeriği ve alerjen bilgisi için ekibimize danışabilirsiniz.</span></div>`; dialog.showModal(); };
  document.querySelector('.modal-close').onclick = () => dialog.close();
  dialog.onclick = (event) => { if (event.target === dialog) dialog.close(); };
}
