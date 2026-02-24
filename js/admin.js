let isLoggedIn = false;

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    initLoginForm();
});

function checkLoginStatus() {
    const savedLogin = localStorage.getItem('acelynnAdminLoggedIn');
    if (savedLogin === 'true') {
        isLoggedIn = true;
        showAdminPanel();
    }
}

function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
}

async function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const savedUsername = localStorage.getItem('acelynnAdminUsername') || DEFAULT_ADMIN_USERNAME;
    const savedPassword = localStorage.getItem('acelynnAdminPassword') || DEFAULT_ADMIN_PASSWORD;
    
    if (username === savedUsername && password === savedPassword) {
        isLoggedIn = true;
        localStorage.setItem('acelynnAdminLoggedIn', 'true');
        await showAdminPanel();
    } else {
        alert('用户名或密码错误！');
    }
}

async function showAdminPanel() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminLayout').style.display = 'flex';
    await loadData();
    initAdminNavigation();
    initLogoutButton();
    initResetButton();
    renderAllTabs();
    
    // 恢复之前的标签页状态
    const savedTab = localStorage.getItem('acelynnAdminActiveTab') || 'home';
    const tabLink = document.querySelector(`.admin-nav-link[data-tab="${savedTab}"]`);
    if (tabLink) {
        document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
        tabLink.classList.add('active');
        switchTab(savedTab);
    }
}

function initAdminNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            switchTab(tabId);
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.getElementById('tab-' + tabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // 保存当前标签页状态到localStorage
    localStorage.setItem('acelynnAdminActiveTab', tabId);
}

function initLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('确定要退出登录吗？')) {
                isLoggedIn = false;
                localStorage.removeItem('acelynnAdminLoggedIn');
                document.getElementById('adminLayout').style.display = 'none';
                document.getElementById('loginPage').style.display = 'flex';
                document.getElementById('loginUsername').value = '';
                document.getElementById('loginPassword').value = '';
            }
        });
    }
}

function initResetButton() {
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('确定要重置所有数据吗？此操作不可恢复！')) {
                localStorage.removeItem('acelynnData');
                location.reload();
            }
        });
    }
}

function renderAllTabs() {
    renderHomeTab();
    renderAboutTab();
    renderProductsTab();
    renderNewsTab();
    renderContactTab();
    renderMessagesTab();
    initPasswordForm();
    initExportButtons();
    initModalCloseButtons();
}

function renderHomeTab() {
    if (!siteData?.pages?.home) return;
    
    const hero = siteData.pages.home.hero || {};
    const features = siteData.pages.home.features || {};
    
    setInputValue('homeHeroTitleZh', hero.title?.zh);
    setInputValue('homeHeroTitleEn', hero.title?.en);
    setInputValue('homeHeroSubtitleZh', hero.subtitle?.zh);
    setInputValue('homeHeroSubtitleEn', hero.subtitle?.en);
    
    setInputValue('homeFeaturesTitleZh', features.title?.zh);
    setInputValue('homeFeaturesTitleEn', features.title?.en);
    setInputValue('homeFeaturesSubtitleZh', features.subtitle?.zh);
    setInputValue('homeFeaturesSubtitleEn', features.subtitle?.en);
    
    if (features.items && features.items.length >= 3) {
        setInputValue('homeFeature1Icon', features.items[0].icon);
        setInputValue('homeFeature1TitleZh', features.items[0].title?.zh);
        setInputValue('homeFeature1TitleEn', features.items[0].title?.en);
        setInputValue('homeFeature1DescZh', features.items[0].desc?.zh);
        setInputValue('homeFeature1DescEn', features.items[0].desc?.en);
        
        setInputValue('homeFeature2Icon', features.items[1].icon);
        setInputValue('homeFeature2TitleZh', features.items[1].title?.zh);
        setInputValue('homeFeature2TitleEn', features.items[1].title?.en);
        setInputValue('homeFeature2DescZh', features.items[1].desc?.zh);
        setInputValue('homeFeature2DescEn', features.items[1].desc?.en);
        
        setInputValue('homeFeature3Icon', features.items[2].icon);
        setInputValue('homeFeature3TitleZh', features.items[2].title?.zh);
        setInputValue('homeFeature3TitleEn', features.items[2].title?.en);
        setInputValue('homeFeature3DescZh', features.items[2].desc?.zh);
        setInputValue('homeFeature3DescEn', features.items[2].desc?.en);
    }
    
    initHomeForms();
}

function initHomeForms() {
    const homeHeroForm = document.getElementById('homeHeroForm');
    if (homeHeroForm) {
        homeHeroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveHomeHero();
        });
    }
    
    const homeFeaturesForm = document.getElementById('homeFeaturesForm');
    if (homeFeaturesForm) {
        homeFeaturesForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveHomeFeatures();
        });
    }
}

async function saveHomeHero() {
    if (!siteData.pages.home) siteData.pages.home = {};
    if (!siteData.pages.home.hero) siteData.pages.home.hero = {};
    
    siteData.pages.home.hero.title = {
        zh: getInputValue('homeHeroTitleZh'),
        en: getInputValue('homeHeroTitleEn')
    };
    siteData.pages.home.hero.subtitle = {
        zh: getInputValue('homeHeroSubtitleZh'),
        en: getInputValue('homeHeroSubtitleEn')
    };
    
    await saveData();
    alert('保存成功！');
}

async function saveHomeFeatures() {
    if (!siteData.pages.home) siteData.pages.home = {};
    if (!siteData.pages.home.features) siteData.pages.home.features = {};
    if (!siteData.pages.home.features.items) siteData.pages.home.features.items = [];
    
    siteData.pages.home.features.title = {
        zh: getInputValue('homeFeaturesTitleZh'),
        en: getInputValue('homeFeaturesTitleEn')
    };
    siteData.pages.home.features.subtitle = {
        zh: getInputValue('homeFeaturesSubtitleZh'),
        en: getInputValue('homeFeaturesSubtitleEn')
    };
    
    siteData.pages.home.features.items = [
        {
            icon: getInputValue('homeFeature1Icon'),
            title: {
                zh: getInputValue('homeFeature1TitleZh'),
                en: getInputValue('homeFeature1TitleEn')
            },
            desc: {
                zh: getInputValue('homeFeature1DescZh'),
                en: getInputValue('homeFeature1DescEn')
            }
        },
        {
            icon: getInputValue('homeFeature2Icon'),
            title: {
                zh: getInputValue('homeFeature2TitleZh'),
                en: getInputValue('homeFeature2TitleEn')
            },
            desc: {
                zh: getInputValue('homeFeature2DescZh'),
                en: getInputValue('homeFeature2DescEn')
            }
        },
        {
            icon: getInputValue('homeFeature3Icon'),
            title: {
                zh: getInputValue('homeFeature3TitleZh'),
                en: getInputValue('homeFeature3TitleEn')
            },
            desc: {
                zh: getInputValue('homeFeature3DescZh'),
                en: getInputValue('homeFeature3DescEn')
            }
        }
    ];
    
    await saveData();
    alert('保存成功！');
}

function renderAboutTab() {
    if (!siteData?.pages?.about) return;
    
    setInputValue('aboutTitleZh', siteData.pages.about.title?.zh);
    setInputValue('aboutTitleEn', siteData.pages.about.title?.en);
    setInputValue('aboutCompanyTitleZh', siteData.pages.about.companyTitle?.zh);
    setInputValue('aboutCompanyTitleEn', siteData.pages.about.companyTitle?.en);
    setInputValue('aboutMissionTitleZh', siteData.pages.about.missionTitle?.zh);
    setInputValue('aboutMissionTitleEn', siteData.pages.about.missionTitle?.en);
    setInputValue('aboutVisionTitleZh', siteData.pages.about.visionTitle?.zh);
    setInputValue('aboutVisionTitleEn', siteData.pages.about.visionTitle?.en);
    setInputValue('aboutValuesTitleZh', siteData.pages.about.valuesTitle?.zh);
    setInputValue('aboutValuesTitleEn', siteData.pages.about.valuesTitle?.en);
    
    if (siteData?.company) {
        setTextareaValue('aboutText', siteData.company.aboutText?.zh);
        setTextareaValue('aboutTextEn', siteData.company.aboutText?.en);
        setTextareaValue('aboutText2', siteData.company.aboutText2?.zh);
        setTextareaValue('aboutText2En', siteData.company.aboutText2?.en);
        setTextareaValue('missionText', siteData.company.mission?.zh);
        setTextareaValue('missionTextEn', siteData.company.mission?.en);
        setTextareaValue('visionText', siteData.company.vision?.zh);
        setTextareaValue('visionTextEn', siteData.company.vision?.en);
        setTextareaValue('valuesText', siteData.company.values?.zh);
        setTextareaValue('valuesTextEn', siteData.company.values?.en);
    }
    
    initAboutForms();
}

function initAboutForms() {
    const aboutTitleForm = document.getElementById('aboutTitleForm');
    if (aboutTitleForm) {
        aboutTitleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveAboutTitles();
        });
    }
    
    const companyForm = document.getElementById('companyForm');
    if (companyForm) {
        companyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveCompanyInfo();
        });
    }
}

async function saveAboutTitles() {
    if (!siteData.pages.about) siteData.pages.about = {};
    
    siteData.pages.about.title = {
        zh: getInputValue('aboutTitleZh'),
        en: getInputValue('aboutTitleEn')
    };
    siteData.pages.about.companyTitle = {
        zh: getInputValue('aboutCompanyTitleZh'),
        en: getInputValue('aboutCompanyTitleEn')
    };
    siteData.pages.about.missionTitle = {
        zh: getInputValue('aboutMissionTitleZh'),
        en: getInputValue('aboutMissionTitleEn')
    };
    siteData.pages.about.visionTitle = {
        zh: getInputValue('aboutVisionTitleZh'),
        en: getInputValue('aboutVisionTitleEn')
    };
    siteData.pages.about.valuesTitle = {
        zh: getInputValue('aboutValuesTitleZh'),
        en: getInputValue('aboutValuesTitleEn')
    };
    
    await saveData();
    alert('保存成功！');
}

async function saveCompanyInfo() {
    if (!siteData.company) siteData.company = {};
    
    siteData.company.aboutText = {
        zh: getTextareaValue('aboutText'),
        en: getTextareaValue('aboutTextEn')
    };
    siteData.company.aboutText2 = {
        zh: getTextareaValue('aboutText2'),
        en: getTextareaValue('aboutText2En')
    };
    siteData.company.mission = {
        zh: getTextareaValue('missionText'),
        en: getTextareaValue('missionTextEn')
    };
    siteData.company.vision = {
        zh: getTextareaValue('visionText'),
        en: getTextareaValue('visionTextEn')
    };
    siteData.company.values = {
        zh: getTextareaValue('valuesText'),
        en: getTextareaValue('valuesTextEn')
    };
    
    await saveData();
    alert('保存成功！');
}

function renderProductsTab() {
    renderProductsTable();
    initProductSearch();
    initAddProductBtn();
    initProductForm();
    initExcelImport();
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTable');
    if (!tbody || !siteData?.products) return;
    
    // 按热门产品优先排序
    const sortedProducts = [...siteData.products].sort((a, b) => {
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        return 0;
    });
    
    tbody.innerHTML = sortedProducts.map(product => `
        <tr>
            <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
            <td>${getLocalizedText(product.name)}</td>
            <td>${product.chemicalName || '-'}</td>
            <td>${product.casNumber || '-'}</td>
            <td>${product.catalogNumber || '-'}</td>
            <td>${product.purity || '-'}</td>
            <td>${product.price}</td>
            <td>
                <button class="hot-btn ${product.isHot ? 'hot-active' : ''}" onclick="toggleProductHot(${product.id})">
                    ${product.isHot ? '⭐' : '☆'}
                </button>
            </td>
            <td>
                <button class="btn btn-secondary" onclick="editProduct(${product.id})">编辑</button>
                <button class="btn btn-secondary" onclick="deleteProduct(${product.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function initProductSearch() {
    const searchInput = document.getElementById('productAdminSearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filterProducts(searchInput.value);
        });
    }
}

function filterProducts(query) {
    const tbody = document.getElementById('productsTable');
    if (!tbody || !siteData?.products) return;
    
    const q = query.toLowerCase().trim();
    const filtered = q ? siteData.products.filter(p => {
        const name = getLocalizedText(p.name).toLowerCase();
        const cas = (p.casNumber || '').toLowerCase();
        const catalog = (p.catalogNumber || '').toLowerCase();
        return name.includes(q) || cas.includes(q) || catalog.includes(q);
    }) : siteData.products;
    
    // 按热门产品优先排序
    const sortedFiltered = [...filtered].sort((a, b) => {
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        return 0;
    });
    
    tbody.innerHTML = sortedFiltered.map(product => `
        <tr>
            <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
            <td>${getLocalizedText(product.name)}</td>
            <td>${product.chemicalName || '-'}</td>
            <td>${product.casNumber || '-'}</td>
            <td>${product.catalogNumber || '-'}</td>
            <td>${product.purity || '-'}</td>
            <td>${product.price}</td>
            <td>
                <button class="hot-btn ${product.isHot ? 'hot-active' : ''}" onclick="toggleProductHot(${product.id})">
                    ${product.isHot ? '⭐' : '☆'}
                </button>
            </td>
            <td>
                <button class="btn btn-secondary" onclick="editProduct(${product.id})">编辑</button>
                <button class="btn btn-secondary" onclick="deleteProduct(${product.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function initAddProductBtn() {
    const addBtn = document.getElementById('addProductBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            openProductModal();
        });
    }
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    
    if (productId) {
        title.textContent = '编辑产品';
        const product = siteData.products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = getLocalizedText(product.name);
            document.getElementById('productNameEn').value = product.name?.en || '';
            document.getElementById('productChemicalName').value = product.chemicalName || '';
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productCasNumber').value = product.casNumber || '';
            document.getElementById('productCatalogNumber').value = product.catalogNumber || '';
            document.getElementById('productSpecification').value = product.specification || '';
            document.getElementById('productPurity').value = product.purity || '';
            document.getElementById('productDesc').value = getLocalizedText(product.desc);
            document.getElementById('productDescEn').value = product.desc?.en || '';
            document.getElementById('productIsHot').checked = product.isHot || false;
        }
    } else {
        title.textContent = '添加产品';
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('productIsHot').checked = false;
    }
    
    modal.style.display = 'flex';
}

function initProductForm() {
    const form = document.getElementById('productForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveProduct();
        });
    }
}

async function saveProduct() {
    const productId = document.getElementById('productId').value;
    const product = {
        id: productId ? parseInt(productId) : Date.now(),
        name: {
            zh: document.getElementById('productName').value,
            en: document.getElementById('productNameEn').value || document.getElementById('productName').value
        },
        chemicalName: document.getElementById('productChemicalName').value,
        price: document.getElementById('productPrice').value,
        casNumber: document.getElementById('productCasNumber').value,
        catalogNumber: document.getElementById('productCatalogNumber').value,
        specification: document.getElementById('productSpecification').value,
        purity: document.getElementById('productPurity').value,
        desc: {
            zh: document.getElementById('productDesc').value,
            en: document.getElementById('productDescEn').value || document.getElementById('productDesc').value
        },
        isHot: document.getElementById('productIsHot').checked,
        icon: '🧬'
    };
    
    if (productId) {
        const index = siteData.products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            product.icon = siteData.products[index].icon;
            siteData.products[index] = product;
        }
    } else {
        siteData.products.push(product);
    }
    
    await saveData();
    closeProductModal();
    renderProductsTable();
    alert('保存成功！');
}

function editProduct(productId) {
    openProductModal(productId);
}

async function deleteProduct(productId) {
    if (confirm('确定要删除这个产品吗？')) {
        siteData.products = siteData.products.filter(p => p.id !== productId);
        await saveData();
        renderProductsTable();
    }
}

async function toggleProductHot(productId) {
    const product = siteData.products.find(p => p.id === productId);
    if (product) {
        product.isHot = !product.isHot;
        await saveData();
        renderProductsTable();
    }
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAllProducts');
    const checkboxes = document.querySelectorAll('.product-checkbox');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
}

async function batchDeleteProducts() {
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    if (checkboxes.length === 0) {
        alert('请先选择要删除的产品！');
        return;
    }
    
    if (confirm(`确定要删除选中的 ${checkboxes.length} 个产品吗？`)) {
        const ids = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-id')));
        siteData.products = siteData.products.filter(p => !ids.includes(p.id));
        await saveData();
        renderProductsTable();
    }
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function initExcelImport() {
    const excelImport = document.getElementById('excelImport');
    const downloadTemplateBtn = document.getElementById('downloadTemplateBtn');
    
    if (excelImport) {
        excelImport.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                await handleExcelImport(file);
            }
        });
    }
    
    if (downloadTemplateBtn) {
        downloadTemplateBtn.addEventListener('click', () => {
            downloadExcelTemplate();
        });
    }
}

async function handleExcelImport(file) {
    try {
        const formData = new FormData();
        formData.append('excelFile', file);
        
        const response = await fetch('/api/import/products', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                alert(result.message);
                await loadData();
                renderProductsTable();
            } else {
                alert('导入失败: ' + result.error);
            }
        } else {
            const error = await response.json();
            alert('导入失败: ' + error.error);
        }
    } catch (error) {
        console.error('导入错误:', error);
        alert('导入失败: ' + error.message);
    }
}

function downloadExcelTemplate() {
    window.location.href = '/api/export/template';
}

function renderNewsTab() {
    renderNewsTable();
    initAddNewsBtn();
    initNewsForm();
}

function renderNewsTable() {
    const tbody = document.getElementById('newsTable');
    if (!tbody || !siteData?.news) return;
    
    tbody.innerHTML = siteData.news.map(news => `
        <tr>
            <td>${getLocalizedText(news.title)}</td>
            <td>${news.date}</td>
            <td>
                <button class="btn btn-secondary" onclick="editNews(${news.id})">编辑</button>
                <button class="btn btn-secondary" onclick="deleteNews(${news.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function initAddNewsBtn() {
    const addBtn = document.getElementById('addNewsBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            openNewsModal();
        });
    }
}

function openNewsModal(newsId = null) {
    const modal = document.getElementById('newsModal');
    const title = document.getElementById('newsModalTitle');
    
    if (newsId) {
        title.textContent = '编辑新闻';
        const news = siteData.news.find(n => n.id === newsId);
        if (news) {
            document.getElementById('newsId').value = news.id;
            document.getElementById('newsTitle').value = getLocalizedText(news.title);
            document.getElementById('newsTitleEn').value = news.title?.en || '';
            document.getElementById('newsContent').value = getLocalizedText(news.content);
            document.getElementById('newsContentEn').value = news.content?.en || '';
            document.getElementById('newsDate').value = news.date;
        }
    } else {
        title.textContent = '添加新闻';
        document.getElementById('newsForm').reset();
        document.getElementById('newsId').value = '';
        document.getElementById('newsDate').value = new Date().toISOString().split('T')[0];
    }
    
    modal.style.display = 'flex';
}

function initNewsForm() {
    const form = document.getElementById('newsForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveNews();
        });
    }
}

async function saveNews() {
    const newsId = document.getElementById('newsId').value;
    const news = {
        id: newsId ? parseInt(newsId) : Date.now(),
        title: {
            zh: document.getElementById('newsTitle').value,
            en: document.getElementById('newsTitleEn').value || document.getElementById('newsTitle').value
        },
        content: {
            zh: document.getElementById('newsContent').value,
            en: document.getElementById('newsContentEn').value || document.getElementById('newsContent').value
        },
        date: document.getElementById('newsDate').value
    };
    
    if (newsId) {
        const index = siteData.news.findIndex(n => n.id === parseInt(newsId));
        if (index !== -1) {
            siteData.news[index] = news;
        }
    } else {
        siteData.news.unshift(news);
    }
    
    await saveData();
    closeNewsModal();
    renderNewsTable();
    alert('保存成功！');
}

function editNews(newsId) {
    openNewsModal(newsId);
}

async function deleteNews(newsId) {
    if (confirm('确定要删除这条新闻吗？')) {
        siteData.news = siteData.news.filter(n => n.id !== newsId);
        await saveData();
        renderNewsTable();
    }
}

function closeNewsModal() {
    document.getElementById('newsModal').style.display = 'none';
}

function renderContactTab() {
    if (!siteData?.pages?.contact) return;
    if (!siteData?.company) return;
    
    setInputValue('contactTitleZh', siteData.pages.contact.title?.zh);
    setInputValue('contactTitleEn', siteData.pages.contact.title?.en);
    setInputValue('contactInfoTitleZh', siteData.pages.contact.infoTitle?.zh);
    setInputValue('contactInfoTitleEn', siteData.pages.contact.infoTitle?.en);
    setInputValue('contactAddressLabelZh', siteData.pages.contact.addressLabel?.zh);
    setInputValue('contactAddressLabelEn', siteData.pages.contact.addressLabel?.en);
    setInputValue('contactEmailLabelZh', siteData.pages.contact.emailLabel?.zh);
    setInputValue('contactEmailLabelEn', siteData.pages.contact.emailLabel?.en);
    setInputValue('contactPhoneLabelZh', siteData.pages.contact.phoneLabel?.zh);
    setInputValue('contactPhoneLabelEn', siteData.pages.contact.phoneLabel?.en);
    setInputValue('contactHoursLabelZh', siteData.pages.contact.hoursLabel?.zh);
    setInputValue('contactHoursLabelEn', siteData.pages.contact.hoursLabel?.en);
    setInputValue('contactFormTitleZh', siteData.pages.contact.formTitle?.zh);
    setInputValue('contactFormTitleEn', siteData.pages.contact.formTitle?.en);
    setInputValue('contactNameLabelZh', siteData.pages.contact.nameLabel?.zh);
    setInputValue('contactNameLabelEn', siteData.pages.contact.nameLabel?.en);
    setInputValue('contactEmailFieldLabelZh', siteData.pages.contact.emailFieldLabel?.zh);
    setInputValue('contactEmailFieldLabelEn', siteData.pages.contact.emailFieldLabel?.en);
    setInputValue('contactSubjectLabelZh', siteData.pages.contact.subjectLabel?.zh);
    setInputValue('contactSubjectLabelEn', siteData.pages.contact.subjectLabel?.en);
    setInputValue('contactMessageLabelZh', siteData.pages.contact.messageLabel?.zh);
    setInputValue('contactMessageLabelEn', siteData.pages.contact.messageLabel?.en);
    setInputValue('contactSubmitLabelZh', siteData.pages.contact.submitLabel?.zh);
    setInputValue('contactSubmitLabelEn', siteData.pages.contact.submitLabel?.en);
    
    setTextareaValue('contactAddressZh', siteData.company.address?.zh);
    setTextareaValue('contactAddressEn', siteData.company.address?.en);
    setInputValue('contactEmail', siteData.company.email);
    setInputValue('contactPhone', siteData.company.phone);
    setTextareaValue('contactHoursZh', siteData.company.hours?.zh);
    setTextareaValue('contactHoursEn', siteData.company.hours?.en);
    
    initContactForms();
}

function initContactForms() {
    const contactTextForm = document.getElementById('contactTextForm');
    if (contactTextForm) {
        contactTextForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveContactText();
        });
    }
    
    const contactInfoForm = document.getElementById('contactInfoForm');
    if (contactInfoForm) {
        contactInfoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveContactInfo();
        });
    }
}

async function saveContactText() {
    if (!siteData.pages.contact) siteData.pages.contact = {};
    
    siteData.pages.contact.title = {
        zh: getInputValue('contactTitleZh'),
        en: getInputValue('contactTitleEn')
    };
    siteData.pages.contact.infoTitle = {
        zh: getInputValue('contactInfoTitleZh'),
        en: getInputValue('contactInfoTitleEn')
    };
    siteData.pages.contact.addressLabel = {
        zh: getInputValue('contactAddressLabelZh'),
        en: getInputValue('contactAddressLabelEn')
    };
    siteData.pages.contact.emailLabel = {
        zh: getInputValue('contactEmailLabelZh'),
        en: getInputValue('contactEmailLabelEn')
    };
    siteData.pages.contact.phoneLabel = {
        zh: getInputValue('contactPhoneLabelZh'),
        en: getInputValue('contactPhoneLabelEn')
    };
    siteData.pages.contact.hoursLabel = {
        zh: getInputValue('contactHoursLabelZh'),
        en: getInputValue('contactHoursLabelEn')
    };
    siteData.pages.contact.formTitle = {
        zh: getInputValue('contactFormTitleZh'),
        en: getInputValue('contactFormTitleEn')
    };
    siteData.pages.contact.nameLabel = {
        zh: getInputValue('contactNameLabelZh'),
        en: getInputValue('contactNameLabelEn')
    };
    siteData.pages.contact.emailFieldLabel = {
        zh: getInputValue('contactEmailFieldLabelZh'),
        en: getInputValue('contactEmailFieldLabelEn')
    };
    siteData.pages.contact.subjectLabel = {
        zh: getInputValue('contactSubjectLabelZh'),
        en: getInputValue('contactSubjectLabelEn')
    };
    siteData.pages.contact.messageLabel = {
        zh: getInputValue('contactMessageLabelZh'),
        en: getInputValue('contactMessageLabelEn')
    };
    siteData.pages.contact.submitLabel = {
        zh: getInputValue('contactSubmitLabelZh'),
        en: getInputValue('contactSubmitLabelEn')
    };
    
    await saveData();
    alert('保存成功！');
}

async function saveContactInfo() {
    if (!siteData.company) siteData.company = {};
    
    siteData.company.address = {
        zh: getTextareaValue('contactAddressZh'),
        en: getTextareaValue('contactAddressEn')
    };
    siteData.company.email = getInputValue('contactEmail');
    siteData.company.phone = getInputValue('contactPhone');
    siteData.company.hours = {
        zh: getTextareaValue('contactHoursZh'),
        en: getTextareaValue('contactHoursEn')
    };
    
    await saveData();
    alert('保存成功！');
}

function renderMessagesTab() {
    renderMessagesTable();
    initMessageActions();
}

function renderMessagesTable() {
    const tbody = document.getElementById('messagesTable');
    const noMessages = document.getElementById('noMessages');
    const messages = JSON.parse(localStorage.getItem('acelynnMessages') || '[]');
    
    if (!tbody) return;
    
    if (messages.length === 0) {
        tbody.innerHTML = '';
        noMessages.style.display = 'block';
        return;
    }
    
    noMessages.style.display = 'none';
    tbody.innerHTML = messages.map(msg => `
        <tr style="${msg.read ? '' : 'background: #e3f2fd;'}">
            <td>${msg.read ? '已读' : '未读'}</td>
            <td>${msg.name}</td>
            <td>${msg.email}</td>
            <td>${msg.subject}</td>
            <td>${new Date(msg.date).toLocaleString()}</td>
            <td>
                <button class="btn btn-secondary" onclick="viewMessage(${msg.id})">查看</button>
                ${!msg.read ? `<button class="btn btn-primary" onclick="markAsRead(${msg.id})">标记已读</button>` : ''}
                <button class="btn btn-secondary" onclick="deleteMessage(${msg.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function initMessageActions() {
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            const messages = JSON.parse(localStorage.getItem('acelynnMessages') || '[]');
            messages.forEach(msg => msg.read = true);
            localStorage.setItem('acelynnMessages', JSON.stringify(messages));
            renderMessagesTable();
        });
    }
    
    const clearMessagesBtn = document.getElementById('clearMessagesBtn');
    if (clearMessagesBtn) {
        clearMessagesBtn.addEventListener('click', () => {
            if (confirm('确定要清空所有留言吗？')) {
                localStorage.removeItem('acelynnMessages');
                renderMessagesTable();
            }
        });
    }
}

function viewMessage(id) {
    const messages = JSON.parse(localStorage.getItem('acelynnMessages') || '[]');
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    
    const modal = document.getElementById('messageModal');
    const body = document.getElementById('messageModalBody');
    
    body.innerHTML = `
        <p><strong>姓名：</strong>${msg.name}</p>
        <p><strong>邮箱：</strong>${msg.email}</p>
        <p><strong>主题：</strong>${msg.subject}</p>
        <p><strong>日期：</strong>${new Date(msg.date).toLocaleString()}</p>
        <hr>
        <p><strong>留言内容：</strong></p>
        <p>${msg.message}</p>
    `;
    
    modal.style.display = 'flex';
    
    if (!msg.read) {
        markAsRead(id);
    }
}

function markAsRead(id) {
    const messages = JSON.parse(localStorage.getItem('acelynnMessages') || '[]');
    const msg = messages.find(m => m.id === id);
    if (msg) {
        msg.read = true;
        localStorage.setItem('acelynnMessages', JSON.stringify(messages));
        renderMessagesTable();
    }
}

function deleteMessage(id) {
    if (confirm('确定要删除这条留言吗？')) {
        const messages = JSON.parse(localStorage.getItem('acelynnMessages') || '[]');
        const filtered = messages.filter(m => m.id !== id);
        localStorage.setItem('acelynnMessages', JSON.stringify(filtered));
        renderMessagesTable();
    }
}

function initPasswordForm() {
    const form = document.getElementById('passwordForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            changePassword();
        });
    }
}

function changePassword() {
    const currentPwd = document.getElementById('currentPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;
    
    const savedPassword = localStorage.getItem('acelynnAdminPassword') || DEFAULT_ADMIN_PASSWORD;
    
    if (currentPwd !== savedPassword) {
        alert('当前密码错误！');
        return;
    }
    
    if (newPwd !== confirmPwd) {
        alert('两次输入的新密码不一致！');
        return;
    }
    
    if (newPwd.length < 6) {
        alert('新密码长度不能少于6位！');
        return;
    }
    
    localStorage.setItem('acelynnAdminPassword', newPwd);
    alert('密码修改成功！');
    document.getElementById('passwordForm').reset();
}

function initExportButtons() {
    const exportProductsBtn = document.getElementById('exportProducts');
    if (exportProductsBtn) {
        exportProductsBtn.addEventListener('click', () => {
            alert('导出功能需要完整的admin.js支持');
        });
    }
    
    const exportAllBtn = document.getElementById('exportAll');
    if (exportAllBtn) {
        exportAllBtn.addEventListener('click', () => {
            alert('导出功能需要完整的admin.js支持');
        });
    }
}

function initModalCloseButtons() {
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('collapsed');
        const toggle = section.querySelector('.form-section-toggle');
        if (toggle) {
            toggle.textContent = section.classList.contains('collapsed') ? '▶' : '▼';
        }
    }
}

function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function setInputValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
}

function getTextareaValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function setTextareaValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
}



function getLocalizedText(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj.zh || obj.en || '';
}
