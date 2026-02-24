let currentLang = localStorage.getItem('acelynnLang') || 'zh';

function getLocalizedText(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[currentLang] || obj.zh || obj.en || '';
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('acelynnLang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = lang === 'zh' ? 'EN' : '中';
    }
    
    updatePageContent();
}

async function updatePageContent() {
    try {
        const data = await loadData();
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = getTextFromData(key, data);
            if (text) {
                el.textContent = text;
            }
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const text = getTextFromData(key, data);
            if (text) {
                el.placeholder = text;
            }
        });
        
        updateAboutPage(data);
        updateContactPage(data);
        updateFeatures(data);
        
        await renderProducts();
        renderNews();
    } catch (error) {
        console.error('更新页面内容失败:', error);
        // 如果加载失败，使用默认数据
        const defaultData = getDefaultData();
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = getTextFromData(key, defaultData);
            if (text) {
                el.textContent = text;
            }
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const text = getTextFromData(key, defaultData);
            if (text) {
                el.placeholder = text;
            }
        });
        
        updateAboutPage(defaultData);
        updateContactPage(defaultData);
        updateFeatures(defaultData);
        
        // 直接渲染产品，使用默认数据
        const container = document.getElementById('productsList');
        const hotProductsList = document.getElementById('hotProductsList');
        if (hotProductsList) {
            const hotProductsData = defaultData.products.filter(p => p.isHot).slice(0, 6);
            hotProductsList.innerHTML = hotProductsData.map(p => `
                <div class="product-card" onclick="viewProductDetail(${p.id})" style="cursor: pointer;">
                    <div class="product-image">${p.icon || '🧬'}</div>
                    <div class="product-info">
                        <h3 class="product-name">${getLocalizedText(p.name)}</h3>
                        ${p.chemicalName ? `<div style="font-size: 0.9rem; color: var(--primary-blue); margin-bottom: 0.5rem; font-style: italic;">${p.chemicalName}</div>` : ''}
                        <p class="product-price">${p.price}</p>
                        <p class="product-desc">${getLocalizedText(p.desc)}</p>
                        ${(p.casNumber || p.catalogNumber || p.purity ? `
                            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--bg-light);">
                                ${p.casNumber ? `<div style="font-size: 0.85rem; color: var(--text-gray); margin-bottom: 0.25rem;"><strong>CAS:</strong> ${p.casNumber}</div>` : ''}
                                ${p.catalogNumber ? `<div style="font-size: 0.85rem; color: var(--text-gray); margin-bottom: 0.25rem;"><strong>货号:</strong> ${p.catalogNumber}</div>` : ''}
                                ${p.purity ? `<div style="font-size: 0.85rem; color: var(--text-gray);"><strong>纯度:</strong> ${p.purity}</div>` : ''}
                            </div>
                        ` : '')}
                    </div>
                </div>
            `).join('');
        }
        
        renderNews();
    }
}

function getTextFromData(key, data) {
    if (!data.pages) return '';
    
    switch(key) {
        case 'nav.home': return currentLang === 'zh' ? '首页' : 'Home';
        case 'nav.about': return getLocalizedText(data.pages.about?.title) || (currentLang === 'zh' ? '关于我们' : 'About');
        case 'nav.products': return getLocalizedText(data.pages.products?.title) || (currentLang === 'zh' ? '产品中心' : 'Products');
        case 'nav.news': return getLocalizedText(data.pages.news?.title) || (currentLang === 'zh' ? '新闻资讯' : 'News');
        case 'nav.contact': return getLocalizedText(data.pages.contact?.title) || (currentLang === 'zh' ? '联系我们' : 'Contact');
        case 'hero.title': return getLocalizedText(data.pages.home?.hero?.title);
        case 'hero.subtitle': return getLocalizedText(data.pages.home?.hero?.subtitle);
        case 'hero.search': return getLocalizedText(data.pages.home?.hero?.search);
        case 'hero.products': return currentLang === 'zh' ? '查看产品' : 'View Products';
        case 'hero.contact': return currentLang === 'zh' ? '联系我们' : 'Contact Us';
        case 'features.title': return getLocalizedText(data.pages.home?.features?.title);
        case 'features.subtitle': return getLocalizedText(data.pages.home?.features?.subtitle);
        case 'products.title': return getLocalizedText(data.pages.home?.products?.title);
        case 'products.more': return getLocalizedText(data.pages.home?.products?.seeMore);
        case 'products.pageTitle': return getLocalizedText(data.pages.products?.title);
        case 'products.search': return getLocalizedText(data.pages.products?.search);
        case 'products.allCategories': return getLocalizedText(data.pages.products?.allCategories);
        case 'news.title': return getLocalizedText(data.pages.news?.title);
        case 'about.title': return getLocalizedText(data.pages.about?.title);
        case 'about.company': return getLocalizedText(data.pages.about?.companyTitle);
        case 'about.mission': return getLocalizedText(data.pages.about?.missionTitle);
        case 'about.vision': return getLocalizedText(data.pages.about?.visionTitle);
        case 'about.values': return getLocalizedText(data.pages.about?.valuesTitle);
        case 'contact.title': return getLocalizedText(data.pages.contact?.title);
        case 'contact.info': return getLocalizedText(data.pages.contact?.infoTitle);
        case 'contact.address': return getLocalizedText(data.pages.contact?.addressLabel);
        case 'contact.email': return getLocalizedText(data.pages.contact?.emailLabel);
        case 'contact.phone': return getLocalizedText(data.pages.contact?.phoneLabel);
        case 'contact.hours': return getLocalizedText(data.pages.contact?.hoursLabel);
        case 'contact.form': return getLocalizedText(data.pages.contact?.formTitle);
        case 'contact.name': return getLocalizedText(data.pages.contact?.nameLabel);
        case 'contact.emailField': return getLocalizedText(data.pages.contact?.emailFieldLabel);
        case 'contact.subject': return getLocalizedText(data.pages.contact?.subjectLabel);
        case 'contact.message': return getLocalizedText(data.pages.contact?.messageLabel);
        case 'contact.submit': return getLocalizedText(data.pages.contact?.submitLabel);
        case 'contact.namePlaceholder': return currentLang === 'zh' ? '请输入您的姓名' : 'Please enter your name';
        case 'contact.emailPlaceholder': return currentLang === 'zh' ? '请输入您的邮箱地址' : 'Please enter your email address';
        case 'contact.phonePlaceholder': return currentLang === 'zh' ? '请输入您的联系电话' : 'Please enter your phone number';
        case 'contact.messagePlaceholder': return currentLang === 'zh' ? '请输入您的留言内容' : 'Please enter your message';
        default: return '';
    }
}

function updateAboutPage(data) {
    const aboutText = document.getElementById('aboutText');
    const aboutText2 = document.getElementById('aboutText2');
    if (aboutText) aboutText.textContent = getLocalizedText(data.company.aboutText);
    if (aboutText2) aboutText2.textContent = getLocalizedText(data.company.aboutText2);
    
    const missionText = document.getElementById('missionText');
    const visionText = document.getElementById('visionText');
    const valuesText = document.getElementById('valuesText');
    if (missionText) missionText.textContent = getLocalizedText(data.company.mission);
    if (visionText) visionText.textContent = getLocalizedText(data.company.vision);
    if (valuesText) valuesText.textContent = getLocalizedText(data.company.values);
}

function updateContactPage(data) {
    const contactAddress = document.getElementById('contactAddress');
    const contactEmail = document.getElementById('contactEmail');
    const contactPhone = document.getElementById('contactPhone');
    const contactHours = document.getElementById('contactHours');
    if (contactAddress) contactAddress.textContent = getLocalizedText(data.company.address);
    if (contactEmail) contactEmail.textContent = data.company.email;
    if (contactPhone) contactPhone.textContent = data.company.phone;
    if (contactHours) contactHours.textContent = getLocalizedText(data.company.hours);
}

function updateFeatures(data) {
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0 && data.pages.home?.features?.items) {
        data.pages.home.features.items.forEach((item, i) => {
            if (featureCards[i]) {
                const icon = featureCards[i].querySelector('.feature-icon');
                const title = featureCards[i].querySelector('.feature-title');
                const desc = featureCards[i].querySelector('.feature-desc');
                
                if (icon) icon.textContent = item.icon;
                if (title) title.textContent = getLocalizedText(item.title);
                if (desc) desc.textContent = getLocalizedText(item.desc);
            }
        });
    }
}

async function renderProducts() {
    const container = document.getElementById('productsList');
    const noResults = document.getElementById('noResults');
    const searchResultsInfo = document.getElementById('searchResultsInfo');
    const hotProducts = document.getElementById('hotProducts');
    const hotProductsList = document.getElementById('hotProductsList');
    
    if (!container || !hotProductsList) return;
    
    try {
        const data = await loadData();
        const searchTerm = document.getElementById('productSearch')?.value?.toLowerCase() || '';
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlSearch = urlParams.get('search')?.toLowerCase() || '';
        const finalSearchTerm = searchTerm || urlSearch;
        
        if (finalSearchTerm && !searchTerm) {
            const searchInput = document.getElementById('productSearch');
            if (searchInput) {
                // 确保只设置有效的搜索词，避免设置数字或空值
                if (finalSearchTerm.trim() && isNaN(finalSearchTerm)) {
                    searchInput.value = finalSearchTerm;
                } else {
                    searchInput.value = '';
                }
            }
        }
        
        let products = data.products || [];
        
        if (finalSearchTerm) {
            products = products.filter(p => {
                const name = getLocalizedText(p.name).toLowerCase();
                const chemicalName = (p.chemicalName || '').toLowerCase();
                const casNumber = (p.casNumber || '').toLowerCase();
                const catalogNumber = (p.catalogNumber || '').toLowerCase();
                const desc = getLocalizedText(p.desc).toLowerCase();
                
                return name.includes(finalSearchTerm) ||
                       chemicalName.includes(finalSearchTerm) ||
                       casNumber.includes(finalSearchTerm) ||
                       catalogNumber.includes(finalSearchTerm) ||
                       desc.includes(finalSearchTerm);
            });
        }
        
        if (!finalSearchTerm) {
            if (hotProducts) hotProducts.style.display = 'block';
            container.style.display = 'none';
            if (noResults) noResults.style.display = 'none';
            if (searchResultsInfo) searchResultsInfo.innerHTML = '';
            
            const hotProductsData = products.filter(p => p.isHot).slice(0, 6);
            hotProductsList.innerHTML = hotProductsData.map(p => `
                <div class="product-card" onclick="viewProductDetail(${p.id})" style="cursor: pointer;">
                    <div class="product-image">${p.icon || '🧬'}</div>
                    <div class="product-info">
                        <h3 class="product-name">${getLocalizedText(p.name)}</h3>
                        ${p.chemicalName ? `<div style="font-size: 0.9rem; color: var(--primary-blue); margin-bottom: 0.5rem; font-style: italic;">${p.chemicalName}</div>` : ''}
                        <p class="product-price">${p.price}</p>
                        <p class="product-desc">${getLocalizedText(p.desc)}</p>
                        ${(p.casNumber || p.catalogNumber || p.purity ? `
                            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--bg-light);">
                                ${p.casNumber ? `<div style="font-size: 0.85rem; color: var(--text-gray); margin-bottom: 0.25rem;"><strong>CAS:</strong> ${p.casNumber}</div>` : ''}
                                ${p.catalogNumber ? `<div style="font-size: 0.85rem; color: var(--text-gray); margin-bottom: 0.25rem;"><strong>货号:</strong> ${p.catalogNumber}</div>` : ''}
                                ${p.purity ? `<div style="font-size: 0.85rem; color: var(--text-gray);"><strong>纯度:</strong> ${p.purity}</div>` : ''}
                            </div>
                        ` : '')}
                    </div>
                </div>
            `).join('');
            
            return;
        }
        
        if (hotProducts) hotProducts.style.display = 'none';
        container.style.display = 'grid';
        
        if (searchResultsInfo) {
            if (finalSearchTerm) {
                searchResultsInfo.innerHTML = `<p style="color: var(--text-gray); margin-bottom: 1.5rem;">找到 ${products.length} 个相关产品 ("${finalSearchTerm}")</p>`;
            } else {
                searchResultsInfo.innerHTML = '';
            }
        }
        
        if (products.length === 0) {
            container.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
        } else {
            if (noResults) noResults.style.display = 'none';
            container.innerHTML = products.map(p => `
                <div class="product-card" onclick="viewProductDetail(${p.id})" style="cursor: pointer;">
                    <div class="product-image">${p.icon || '🧬'}</div>
                    <div class="product-info">
                        <h3 class="product-name">${getLocalizedText(p.name)}</h3>
                        ${p.chemicalName ? `<div style="font-size: 0.9rem; color: var(--primary-blue); margin-bottom: 0.5rem; font-style: italic;">${p.chemicalName}</div>` : ''}
                        <p class="product-price">${p.price}</p>
                        <p class="product-desc">${getLocalizedText(p.desc)}</p>
                        ${(p.casNumber || p.catalogNumber || p.purity ? `
                            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--bg-light);">
                                ${p.casNumber ? `<div style="font-size: 0.85rem; color: var(--text-gray); margin-bottom: 0.25rem;"><strong>CAS:</strong> ${p.casNumber}</div>` : ''}
                                ${p.catalogNumber ? `<div style="font-size: 0.85rem; color: var(--text-gray); margin-bottom: 0.25rem;"><strong>货号:</strong> ${p.catalogNumber}</div>` : ''}
                                ${p.purity ? `<div style="font-size: 0.85rem; color: var(--text-gray);"><strong>纯度:</strong> ${p.purity}</div>` : ''}
                            </div>
                        ` : '')}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('渲染产品失败:', error);
        // 如果加载失败，使用默认数据
        const defaultData = {
            products: [
                {
                    id: 1,
                    name: { zh: '重组蛋白酶K', en: 'Recombinant Proteinase K' },
                    chemicalName: 'Proteinase K',
                    price: '¥1,280',
                    desc: { zh: '高纯度重组蛋白酶K，用于核酸提取和蛋白消化', en: 'High purity recombinant Proteinase K for nucleic acid extraction and protein digestion' },
                    icon: '🧬',
                    casNumber: '39450-01-6',
                    catalogNumber: 'PK-001',
                    specification: '100mg',
                    purity: '≥95% (SDS-PAGE)',
                    isHot: true
                },
                {
                    id: 2,
                    name: { zh: 'DNA提取试剂盒', en: 'DNA Extraction Kit' },
                    chemicalName: 'Genomic DNA Extraction Kit',
                    price: '¥890',
                    desc: { zh: '快速高效的基因组DNA提取试剂盒', en: 'Fast and efficient genomic DNA extraction kit' },
                    icon: '🧪',
                    casNumber: '',
                    catalogNumber: 'DK-002',
                    specification: '50 preps',
                    purity: '',
                    isHot: true
                }
            ]
        };
        
        const hotProductsData = defaultData.products.filter(p => p.isHot).slice(0, 6);
        hotProductsList.innerHTML = hotProductsData.map(p => `
            <div class="product-card" onclick="viewProductDetail(${p.id})" style="cursor: pointer;">
                <div class="product-image">${p.icon || '🧬'}</div>
                <div class="product-info">
                    <h3 class="product-name">${getLocalizedText(p.name)}</h3>
                    ${p.chemicalName ? `<div style="font-size: 0.9rem; color: var(--primary-blue); margin-bottom: 0.5rem; font-style: italic;">${p.chemicalName}</div>` : ''}
                    <p class="product-price">${p.price}</p>
                    <p class="product-desc">${getLocalizedText(p.desc)}</p>
                    ${(p.casNumber || p.catalogNumber || p.purity ? `
                        <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--bg-light);">
                            ${p.casNumber ? `<div style="font-size: 0.85rem; color: var(--text-gray); margin-bottom: 0.25rem;"><strong>CAS:</strong> ${p.casNumber}</div>` : ''}
                            ${p.catalogNumber ? `<div style="font-size: 0.85rem; color: var(--text-gray); margin-bottom: 0.25rem;"><strong>货号:</strong> ${p.catalogNumber}</div>` : ''}
                            ${p.purity ? `<div style="font-size: 0.85rem; color: var(--text-gray);"><strong>纯度:</strong> ${p.purity}</div>` : ''}
                        </div>
                    ` : '')}
                </div>
            </div>
        `).join('');
    }
}

function viewProductDetail(productId) {
    sessionStorage.setItem('viewProductId', productId);
    window.location.href = 'product-detail.html?id=' + productId;
}

function renderNews() {
    const container = document.getElementById('newsList');
    if (!container) return;
    
    const data = loadData();
    
    container.innerHTML = data.news.map(n => `
        <div class="news-card">
            <div class="news-date">${n.date}</div>
            <h3 class="news-title">${getLocalizedText(n.title)}</h3>
            <p class="news-content">${getLocalizedText(n.content)}</p>
        </div>
    `).join('');
}

function saveMessage(message) {
    let messages = JSON.parse(localStorage.getItem('acelynnMessages') || '[]');
    messages.unshift(message);
    localStorage.setItem('acelynnMessages', JSON.stringify(messages));
}

function initNavSearch() {
    const searchInput = document.getElementById('navSearch');
    const suggestionsContainer = document.getElementById('navSearchSuggestions');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const results = searchProducts(query);
        renderNavSearchSuggestions(results);
    });
    
    searchInput.addEventListener('focus', (e) => {
        if (e.target.value) {
            const results = searchProducts(e.target.value);
            renderNavSearchSuggestions(results);
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && 
            !suggestionsContainer?.contains(e.target)) {
            suggestionsContainer?.classList.remove('active');
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            if (query.trim()) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        }
    });
}

function searchProducts(query) {
    if (!query || query.trim() === '') return [];
    
    const data = loadData();
    const q = query.toLowerCase().trim();
    
    return data.products.filter(p => {
        const name = getLocalizedText(p.name).toLowerCase();
        const chemicalName = (p.chemicalName || '').toLowerCase();
        const casNumber = (p.casNumber || '').toLowerCase();
        const catalogNumber = (p.catalogNumber || '').toLowerCase();
        const desc = getLocalizedText(p.desc).toLowerCase();
        
        return name.includes(q) || 
               chemicalName.includes(q) ||
               casNumber.includes(q) || 
               catalogNumber.includes(q) ||
               desc.includes(q);
    });
}

function renderNavSearchSuggestions(products) {
    const suggestionsContainer = document.getElementById('navSearchSuggestions');
    if (!suggestionsContainer) return;
    
    if (products.length === 0) {
        suggestionsContainer.classList.remove('active');
        return;
    }
    
    suggestionsContainer.classList.add('active');
    suggestionsContainer.innerHTML = products.map(p => `
        <div class="search-suggestion-item" data-product-id="${p.id}">
            <div class="search-suggestion-icon">${p.icon || '🧬'}</div>
            <div class="search-suggestion-content">
                <div class="search-suggestion-name">${getLocalizedText(p.name)}</div>
                <div class="search-suggestion-meta">
                    ${p.casNumber ? `<span>CAS: ${p.casNumber}</span>` : ''}
                    ${p.catalogNumber ? `<span>货号: ${p.catalogNumber}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    suggestionsContainer.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const productId = item.getAttribute('data-product-id');
            viewProductDetail(productId);
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            setLanguage(currentLang === 'zh' ? 'en' : 'zh');
        });
    }
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    const productSearch = document.getElementById('productSearch');
    if (productSearch) productSearch.addEventListener('input', renderProducts);
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // 清除错误提示的函数
        function clearError(fieldName) {
            const errorElement = document.getElementById(`${fieldName}Error`);
            const inputElement = document.querySelector(`input[name="${fieldName}"]`) || document.querySelector(`textarea[name="${fieldName}"]`);
            
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
            
            if (inputElement) {
                inputElement.classList.remove('error');
            }
        }
        
        // 显示错误提示的函数
        function showError(fieldName, message) {
            const errorElement = document.getElementById(`${fieldName}Error`);
            const inputElement = document.querySelector(`input[name="${fieldName}"]`) || document.querySelector(`textarea[name="${fieldName}"]`);
            
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
            
            if (inputElement) {
                inputElement.classList.add('error');
                inputElement.focus();
            }
        }
        
        // 为输入框添加输入事件，自动清除错误提示
        const requiredFields = ['name', 'email', 'message', 'phone'];
        requiredFields.forEach(field => {
            const input = document.querySelector(`input[name="${field}"]`) || document.querySelector(`textarea[name="${field}"]`);
            if (input) {
                input.addEventListener('input', () => clearError(field));
            }
        });
        
        // 表单提交处理
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 清除所有错误提示
            requiredFields.forEach(field => clearError(field));
            
            // 自定义表单验证
            const name = document.querySelector('input[name="name"]').value.trim();
            const email = document.querySelector('input[name="email"]').value.trim();
            const message = document.querySelector('textarea[name="message"]').value.trim();
            
            let isValid = true;
            
            // 验证逻辑
            if (!name) {
                showError('name', currentLang === 'zh' ? '请输入您的姓名' : 'Please enter your name');
                isValid = false;
            }
            
            if (!email) {
                showError('email', currentLang === 'zh' ? '请输入您的邮箱地址' : 'Please enter your email address');
                isValid = false;
            } else {
                // 简单的邮箱格式验证
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showError('email', currentLang === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address');
                    isValid = false;
                }
            }
            
            if (!message) {
                showError('message', currentLang === 'zh' ? '请输入您的留言内容' : 'Please enter your message');
                isValid = false;
            }
            
            // 验证联系电话格式（如果填写了）
            const phone = document.querySelector('input[name="phone"]').value.trim();
            if (phone) {
                // 简单的电话号码格式验证（支持国内外电话号码）
                const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                if (!phoneRegex.test(phone)) {
                    showError('phone', currentLang === 'zh' ? '请输入有效的联系电话' : 'Please enter a valid phone number');
                    isValid = false;
                }
            }
            
            if (isValid) {
                // 收集表单数据
                const formData = new FormData(contactForm);
                const newMessage = {
                    id: Date.now(),
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    message: formData.get('message'),
                    date: new Date().toISOString(),
                    read: false
                };
                
                saveMessage(newMessage);
                
                // 显示成功提示
                const successMessage = document.createElement('div');
                successMessage.style.cssText = `
                    background: #2ed573;
                    color: white;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                    text-align: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                successMessage.textContent = currentLang === 'zh' ? '留言已提交成功！' : 'Message sent successfully!';
                
                contactForm.insertBefore(successMessage, contactForm.firstChild);
                
                // 显示成功提示
                setTimeout(() => {
                    successMessage.style.opacity = '1';
                }, 100);
                
                // 3秒后隐藏成功提示并重置表单
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    setTimeout(() => {
                        successMessage.remove();
                        contactForm.reset();
                    }, 300);
                }, 3000);
            }
        });
    }
    
    initNavSearch();
    await updatePageContent();
});
