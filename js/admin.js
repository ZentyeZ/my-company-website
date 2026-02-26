let isLoggedIn = false;
let currentPage = 1;
const PRODUCTS_PER_PAGE = 20;

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
    initImageUpload();
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTable');
    if (!tbody) return;

    // 确保products数组存在
    if (!siteData) {
        siteData = {};
    }
    if (!siteData.products) {
        siteData.products = [];
    }

    // 按热门产品优先排序
    const sortedProducts = [...siteData.products].sort((a, b) => {
        if (a.isHot && !b.isHot) return -1;
        if (!a.isHot && b.isHot) return 1;
        return 0;
    });

    // 计算分页
    const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));

    // 确保当前页在有效范围内
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const pageProducts = sortedProducts.slice(start, end);

    // 渲染当前页产品
    tbody.innerHTML = pageProducts.map(product => `
        <tr>
            <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
            <td class="long-text" title="${product.chemicalName || ''}">${product.chemicalName || '-'}</td>
            <td class="long-text" title="${product.smiles || ''}">${product.smiles || '-'}</td>
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

    // 更新分页控件
    updatePagination(totalPages, sortedProducts.length);

    // 确保分页控件可见
    const pagination = document.getElementById('productsPagination');
    if (pagination) {
        pagination.style.display = 'flex';
    }
}

function updatePagination(totalPages, totalItems) {
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');

    if (pageInfo) {
        pageInfo.textContent = `第 ${currentPage} / ${totalPages} 页 (共 ${totalItems} 条)`;
    }
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
}

function changePage(direction) {
    // 确保products数组存在
    if (!siteData) {
        siteData = {};
    }
    if (!siteData.products) {
        siteData.products = [];
    }
    const totalPages = Math.max(1, Math.ceil(siteData.products.length / PRODUCTS_PER_PAGE));
    const newPage = currentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderProductsTable();
        // 滚动到表格顶部
        document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
    }
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
    if (!tbody) return;

    // 确保products数组存在
    if (!siteData) {
        siteData = {};
    }
    if (!siteData.products) {
        siteData.products = [];
    }

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

    // 搜索时显示所有结果，不分页
    tbody.innerHTML = sortedFiltered.map(product => `
        <tr>
            <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
            <td class="long-text" title="${product.chemicalName || ''}">${product.chemicalName || '-'}</td>
            <td class="long-text" title="${product.smiles || ''}">${product.smiles || '-'}</td>
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

    // 搜索时隐藏分页控件
    const pagination = document.getElementById('productsPagination');
    if (pagination) {
        pagination.style.display = q ? 'none' : 'flex';
    }

    // 清空搜索时恢复分页显示
    if (!q) {
        renderProductsTable();
    }
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

    // 重置图片上传区域
    resetImageUpload();

    if (productId) {
        title.textContent = '编辑产品';
        const product = siteData.products.find(p => p.id === productId);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productChemicalName').value = product.chemicalName || '';
            document.getElementById('productSmiles').value = product.smiles || '';
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productCasNumber').value = product.casNumber || '';
            document.getElementById('productCatalogNumber').value = product.catalogNumber || '';
            document.getElementById('productSpecification').value = product.specification || '';
            document.getElementById('productPurity').value = product.purity || '';
            document.getElementById('productDesc').value = getLocalizedText(product.desc);
            document.getElementById('productDescEn').value = product.desc?.en || '';
            document.getElementById('productIsHot').checked = product.isHot || false;

            // 加载产品图片
            if (product.image) {
                document.getElementById('productImage').value = product.image;
                showImagePreview(product.image);
            }
        }
    } else {
        title.textContent = '添加产品';
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('productIsHot').checked = false;
    }

    modal.style.display = 'flex';
}

// 图片上传相关函数
function resetImageUpload() {
    document.getElementById('productImage').value = '';
    document.getElementById('productImageInput').value = '';
    document.getElementById('productImagePreview').innerHTML = '<span class="image-placeholder">📷 点击上传图片</span>';
    document.getElementById('removeImageBtn').style.display = 'none';
}

function showImagePreview(imageSrc) {
    const preview = document.getElementById('productImagePreview');
    preview.innerHTML = `<img src="${imageSrc}" alt="产品图片">`;
    document.getElementById('removeImageBtn').style.display = 'inline-block';
}

function initImageUpload() {
    const imageInput = document.getElementById('productImageInput');
    const imagePreview = document.getElementById('productImagePreview');
    const removeBtn = document.getElementById('removeImageBtn');

    if (imageInput) {
        imageInput.addEventListener('change', handleImageUpload);
    }

    if (imagePreview) {
        imagePreview.addEventListener('click', () => {
            imageInput.click();
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            resetImageUpload();
        });
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
    }

    // 检查文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB！');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // 压缩图片
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 计算压缩后的尺寸（最大宽度 800px）
            let width = img.width;
            let height = img.height;
            const maxWidth = 800;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // 转换为 JPEG，质量 0.7
            const compressedData = canvas.toDataURL('image/jpeg', 0.7);

            // 检查压缩后的大小
            const sizeInMB = (compressedData.length * 3 / 4) / 1024 / 1024;
            if (sizeInMB > 1) {
                // 如果还是太大，进一步压缩
                const furtherCompressed = canvas.toDataURL('image/jpeg', 0.5);
                document.getElementById('productImage').value = furtherCompressed;
                showImagePreview(furtherCompressed);
            } else {
                document.getElementById('productImage').value = compressedData;
                showImagePreview(compressedData);
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
    const chemicalName = document.getElementById('productChemicalName').value;
    const product = {
        id: productId ? parseInt(productId) : Date.now(),
        name: {
            zh: chemicalName,
            en: chemicalName
        },
        chemicalName: chemicalName,
        smiles: document.getElementById('productSmiles').value,
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
        image: document.getElementById('productImage').value || null
    };

    if (productId) {
        const index = siteData.products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
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
        const originalProducts = [...siteData.products];
        siteData.products = siteData.products.filter(p => p.id !== productId);

        const saved = await saveData();
        if (!saved) {
            alert('保存失败，请重试！');
            siteData.products = originalProducts;
            renderProductsTable();
            return;
        }

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
    if (!selectAll) return;

    const checkboxes = document.querySelectorAll('.product-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });
}

async function batchDeleteProducts() {
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    if (checkboxes.length === 0) {
        alert('请先选择要删除的产品！');
        return;
    }

    if (confirm(`确定要删除选中的 ${checkboxes.length} 个产品吗？`)) {
        // 获取选中的ID（支持字符串和数字ID）
        const ids = Array.from(checkboxes).map(cb => cb.getAttribute('data-id'));
        const idsToDelete = new Set(ids);

        // 备份原始数据
        const originalProducts = siteData.products ? [...siteData.products] : [];

        // 过滤掉要删除的产品
        if (siteData.products) {
            siteData.products = siteData.products.filter(p => {
                const pid = String(p.id);
                return !idsToDelete.has(pid);
            });
        } else {
            siteData.products = [];
        }

        // 重置全选框
        const selectAll = document.getElementById('selectAllProducts');
        if (selectAll) {
            selectAll.checked = false;
        }

        // 保存到服务器，检查是否成功
        const saved = await saveData();

        if (!saved) {
            // 保存失败，恢复原始数据
            alert('保存失败，请重试！');
            siteData.products = originalProducts;
            renderProductsTable();
            return;
        }

        renderProductsTable();
    }
}

async function deleteAllProducts() {
    // 确保products数组存在
    if (!siteData) {
        siteData = {};
    }
    if (!siteData.products) {
        siteData.products = [];
    }

    const productCount = siteData.products.length;
    if (productCount === 0) {
        alert('没有产品可以删除！');
        return;
    }

    if (confirm(`确定要删除所有 ${productCount} 个产品吗？此操作不可恢复！`)) {
        // 备份原始数据
        const originalProducts = [...siteData.products];

        // 清空产品数组
        siteData.products = [];

        // 重置全选框
        const selectAll = document.getElementById('selectAllProducts');
        if (selectAll) {
            selectAll.checked = false;
        }

        // 保存到服务器，检查是否成功
        const saved = await saveData();

        if (!saved) {
            // 保存失败，恢复原始数据
            alert('保存失败，请重试！');
            siteData.products = originalProducts;
            renderProductsTable();
            return;
        }

        renderProductsTable();
        alert(`成功删除所有 ${productCount} 个产品！`);
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
        // 显示进度提示
        const statusDiv = document.createElement('div');
        statusDiv.id = 'importStatus';
        statusDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.3);z-index:10000;font-size:16px;';
        document.body.appendChild(statusDiv);

        // 进度和状态文本变量
        let progress, statusText;

        function updateStatus(html) {
            statusDiv.innerHTML = html;
            progress = document.getElementById('importProgress');
            statusText = document.getElementById('importStatusText');
        }

        updateStatus('正在读取文件...<br><progress id="importProgress" value="0" max="100" style="width:300px;margin-top:10px;"></progress><br><span id="importStatusText">0%</span>');

        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                updateStatus('正在解析Excel文件...<br><progress id="importProgress" value="30" max="100" style="width:300px;margin-top:10px;"></progress>');

                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array', cellNF: true, cellText: false });

                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                if (jsonData.length === 0) {
                    statusDiv.remove();
                    alert('Excel文件为空！');
                    return;
                }

                const totalRows = jsonData.length;
                updateStatus(`正在导入...<br><progress id="importProgress" value="0" max="${totalRows}" style="width:300px;margin-top:10px;"></progress><br><span id="importStatusText">0 / ${totalRows}</span>`);

                // 先尝试使用新的批量导入API
                let useNewAPI = true;
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);

                    const testResponse = await fetch('/api/import/batch', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ products: [{ chemicalName: 'test' }], mode: 'append' }),
                        signal: controller.signal
                    });

                    clearTimeout(timeoutId);

                    // 检查是否返回JSON
                    const contentType = testResponse.headers.get('content-type');
                    if (!testResponse.ok || !contentType || !contentType.includes('application/json')) {
                        console.log('新API不可用，使用分批保存模式');
                        useNewAPI = false;
                    }
                } catch (e) {
                    console.log('新API不可用，使用分批保存模式', e.message);
                    useNewAPI = false;
                }

                if (useNewAPI) {
                    // 使用新的批量导入API
                    const BATCH_SIZE = 100;
                    let successCount = 0;
                    let errorCount = 0;

                    for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {
                        const batch = jsonData.slice(i, i + BATCH_SIZE);
                        const products = [];

                        for (const row of batch) {
                            const product = parseExcelRow(row);
                            if (product.chemicalName) {
                                product.id = Date.now() + Math.random() + Math.random();
                                products.push(product);
                            } else {
                                errorCount++;
                            }
                        }

                        try {
                            const controller = new AbortController();
                            const timeoutId = setTimeout(() => controller.abort(), 30000);

                            const response = await fetch('/api/import/batch', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ products, mode: i === 0 ? 'replace' : 'append' }),
                                signal: controller.signal
                            });

                            clearTimeout(timeoutId);

                            if (!response.ok) {
                                throw new Error('服务器返回错误: ' + response.status);
                            }

                            const result = await response.json();
                            if (result.success) {
                                successCount += products.length;
                            }
                        } catch (e) {
                            statusDiv.remove();
                            alert('导入失败: ' + e.message);
                            return;
                        }

                        if (progress) progress.value = Math.min(i + BATCH_SIZE, totalRows);
                        if (statusText) statusText.textContent = `${Math.min(i + BATCH_SIZE, totalRows)} / ${totalRows}`;
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }

                    await loadData();
                    renderProductsTable();
                    statusDiv.remove();
                    alert(`导入完成！\n成功: ${successCount} 个产品\n失败: ${errorCount} 个产品`);
                } else {
                    // 使用旧的保存方式（但跳过重复检查以提高性能）
                    const BATCH_SIZE = 50;
                    let successCount = 0;
                    let errorCount = 0;

                    // 先获取现有产品ID集合用于去重（只获取一次）
                    const existingIds = new Set(siteData.products.map(p => p.catalogNumber || p.casNumber).filter(Boolean));

                    for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {
                        const batch = jsonData.slice(i, i + BATCH_SIZE);

                        for (const row of batch) {
                            const product = parseExcelRow(row);

                            if (!product.chemicalName) {
                                errorCount++;
                                continue;
                            }

                            // 简单去重检查
                            const key = product.catalogNumber || product.casNumber;
                            if (key && existingIds.has(key)) {
                                errorCount++;
                                continue;
                            }

                            product.id = Date.now() + Math.random();
                            siteData.products.push(product);
                            if (key) existingIds.add(key);
                            successCount++;
                        }

                        // 分批保存到服务器
                        await saveData();

                        if (progress) progress.value = Math.min(i + BATCH_SIZE, totalRows);
                        if (statusText) statusText.textContent = `${Math.min(i + BATCH_SIZE, totalRows)} / ${totalRows}`;
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }

                    await loadData();
                    renderProductsTable();
                    statusDiv.remove();
                    alert(`导入完成！\n成功: ${successCount} 个产品\n失败/跳过: ${errorCount} 个产品`);
                }

                document.getElementById('excelImport').value = '';
            } catch (err) {
                statusDiv.remove();
                console.error('导入错误:', err);
                alert('导入失败: ' + err.message);
            }
        };
        reader.readAsArrayBuffer(file);
    } catch (error) {
        console.error('导入错误:', error);
        alert('导入失败: ' + error.message);
    }
}

function parseExcelRow(row) {
    // 支持多种列名格式
    const getValue = (keys) => {
        for (const key of keys) {
            if (row[key] !== undefined) return row[key];
        }
        return '';
    };

    const chemicalName = getValue(['化学名称', 'Chemical Name', '化学名']);

    return {
        name: {
            zh: chemicalName,
            en: chemicalName
        },
        chemicalName: chemicalName,
        smiles: getValue(['SMILES', 'Smiles', 'smiles']),
        price: getValue(['价格', 'Price', '单价']),
        casNumber: getValue(['CAS号', 'CAS', 'CAS Number']),
        catalogNumber: getValue(['货号', 'Catalog Number', '产品编号', '编号']),
        specification: getValue(['规格', 'Specification', '包装规格']),
        purity: getValue(['纯度', 'Purity', '纯度(%)']),
        desc: {
            zh: getValue(['产品描述(中文)', '描述', 'Description (Chinese)', 'Description']),
            en: getValue(['产品描述(英文)', '英文描述', 'Description (English)'])
        },
        isHot: getValue(['热门产品', '热门', 'Is Hot', 'Hot']) === '是' ||
               getValue(['热门产品', '热门', 'Is Hot', 'Hot']) === 'Yes' ||
               getValue(['热门产品', '热门', 'Is Hot', 'Hot']) === true,
        image: null
    };
}

function downloadExcelTemplate() {
    // 定义模板数据结构
    const templateData = [
        {
            '化学名称': 'Proteinase K',
            'SMILES': '',
            '价格': '¥500/100mg',
            'CAS号': '39450-01-6',
            '货号': 'PK-001',
            '规格': '100mg',
            '纯度': '≥95% (SDS-PAGE)',
            '产品描述(中文)': '用于分子生物学实验的蛋白酶',
            '产品描述(英文)': 'Protease for molecular biology experiments',
            '热门产品': '是'
        }
    ];

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // 设置列宽
    const colWidths = [
        { wch: 20 }, // 产品名称(中文)
        { wch: 25 }, // 产品名称(英文)
        { wch: 20 }, // 化学名称
        { wch: 15 }, // 价格
        { wch: 15 }, // CAS号
        { wch: 12 }, // 货号
        { wch: 12 }, // 规格
        { wch: 20 }, // 纯度
        { wch: 35 }, // 产品描述(中文)
        { wch: 40 }, // 产品描述(英文)
        { wch: 10 }  // 热门产品
    ];
    ws['!cols'] = colWidths;

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '产品导入模板');

    // 下载文件
    XLSX.writeFile(wb, '产品导入模板.xlsx');
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
            <td>${msg.phone || '-'}</td>
            <td>${new Date(msg.date).toLocaleString()}</td>
            <td>
                <button class="btn btn-secondary" onclick="viewMessage(${msg.id})"><br/>查看</button>
                ${!msg.read ? `<button class="btn btn-primary" onclick="markAsRead(${msg.id})"><br/>标记已读</button>` : ''}
                <button class="btn btn-secondary" onclick="deleteMessage(${msg.id})"><br/>删除</button>
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
        ${msg.phone ? `<p><strong>联系电话：</strong>${msg.phone}</p>` : ''}
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
