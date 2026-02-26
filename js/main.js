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
    showToast(currentLang === 'zh' ? '语言已切换' : 'Language switched', 'success');
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

        const container = document.getElementById('productsList');
        const hotProductsList = document.getElementById('hotProductsList');
        if (hotProductsList) {
            const hotProductsData = defaultData.products.filter(p => p.isHot).slice(0, 6);
            hotProductsList.innerHTML = hotProductsData.map(p => createProductCard(p)).join('');
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
        case 'footer.copyright': return currentLang === 'zh' ? '© 2015 爱诗伦生物科技（上海）有限公司 All Rights Reserved.' : '© 2015 Acelynn Biotech Inc. All Rights Reserved.';
        case 'searchButton': return currentLang === 'zh' ? '搜索' : 'Search';
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

function createProductCard(p) {
    const hasImage = p.image && p.image.startsWith('data:image');
    const displayName = p.chemicalName || getLocalizedText(p.name);
    return `
        <div class="product-card ${hasImage ? 'has-image' : ''}" onclick="viewProductDetail(${p.id})" data-product-id="${p.id}">
            ${hasImage ? `<div class="product-image"><img src="${p.image}" alt="${displayName}"></div>` : ''}
            <div class="product-info">
                <div class="product-header">
                    <h3 class="product-name">${displayName}</h3>
                </div>
                <div class="product-meta">
                    ${p.catalogNumber ? `<span class="product-tag">${p.catalogNumber}</span>` : ''}
                    ${p.casNumber ? `<span class="product-tag">CAS: ${p.casNumber}</span>` : ''}
                    ${p.smiles ? `<span class="product-tag">SMILES: ${p.smiles.substring(0, 20)}${p.smiles.length > 20 ? '...' : ''}</span>` : ''}
                </div>
                <p class="product-desc">${getLocalizedText(p.desc)}</p>
                <div class="product-footer">
                    <span class="product-price">${p.price}</span>
                    ${p.purity ? `<span class="product-tag">${p.purity}</span>` : ''}
                </div>
            </div>
        </div>
    `;
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
            hotProductsList.innerHTML = hotProductsData.map(p => createProductCard(p)).join('');

            return;
        }

        if (hotProducts) hotProducts.style.display = 'none';
        container.style.display = 'grid';

        if (searchResultsInfo) {
            if (finalSearchTerm) {
                searchResultsInfo.innerHTML = `<p style="color: var(--text-gray); margin-bottom: 1.5rem;">${currentLang === 'zh' ? '找到' : 'Found'} ${products.length} ${currentLang === 'zh' ? '个相关产品' : 'products'} ("${finalSearchTerm}")</p>`;
            } else {
                searchResultsInfo.innerHTML = '';
            }
        }

        if (products.length === 0) {
            container.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
        } else {
            if (noResults) noResults.style.display = 'none';
            container.innerHTML = products.map(p => createProductCard(p)).join('');
        }
    } catch (error) {
        console.error('渲染产品失败:', error);
        const defaultData = getDefaultData();
        const hotProductsData = defaultData.products.filter(p => p.isHot).slice(0, 6);
        hotProductsList.innerHTML = hotProductsData.map(p => createProductCard(p)).join('');
    }
}

function viewProductDetail(productId) {
    sessionStorage.setItem('viewProductId', productId);
    window.location.href = 'product-detail.html?id=' + productId;
}

async function renderNews() {
    const container = document.getElementById('newsList');
    if (!container) return;

    try {
        const data = await loadData();
        const news = data.news || [];

        container.innerHTML = news.map(n => `
            <div class="news-card">
                <div class="news-date">📅 ${n.date}</div>
                <h3 class="news-title">${getLocalizedText(n.title)}</h3>
                <p class="news-content">${getLocalizedText(n.content)}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('渲染新闻失败:', error);
    }
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



function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .product-card, .news-card, .mission-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function showToast(message, type = 'success', duration = 3000) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function initStatsCounter() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const counters = statsSection.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    const suffix = counter.dataset.suffix || '';
                    animateCounter(counter, target, suffix);
                });
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
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
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    const productSearch = document.getElementById('productSearch');
    const searchButton = document.getElementById('searchButton');
    if (productSearch && searchButton) {
        // 移除input事件监听器，改为点击按钮时搜索
        searchButton.addEventListener('click', () => {
            const query = productSearch.value.trim();
            if (query) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });
        
        // 保留回车键搜索功能
        productSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = productSearch.value.trim();
                if (query) {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
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

        const requiredFields = ['name', 'email', 'message', 'phone'];
        requiredFields.forEach(field => {
            const input = document.querySelector(`input[name="${field}"]`) || document.querySelector(`textarea[name="${field}"]`);
            if (input) {
                input.addEventListener('input', () => clearError(field));
            }
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            requiredFields.forEach(field => clearError(field));

            const name = document.querySelector('input[name="name"]').value.trim();
            const email = document.querySelector('input[name="email"]').value.trim();
            const message = document.querySelector('textarea[name="message"]').value.trim();

            let isValid = true;

            if (!name) {
                showError('name', currentLang === 'zh' ? '请输入您的姓名' : 'Please enter your name');
                isValid = false;
            }

            if (!email) {
                showError('email', currentLang === 'zh' ? '请输入您的邮箱地址' : 'Please enter your email address');
                isValid = false;
            } else {
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

            const phone = document.querySelector('input[name="phone"]').value.trim();
            if (!phone) {
                showError('phone', currentLang === 'zh' ? '请输入您的联系电话' : 'Please enter your phone number');
                isValid = false;
            } else {
                const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                if (!phoneRegex.test(phone)) {
                    showError('phone', currentLang === 'zh' ? '请输入有效的联系电话' : 'Please enter a valid phone number');
                    isValid = false;
                }
            }

            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span>';

                await new Promise(resolve => setTimeout(resolve, 1000));

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

                submitBtn.disabled = false;
                submitBtn.textContent = originalText;

                showToast(currentLang === 'zh' ? '留言已提交成功！' : 'Message sent successfully!', 'success');
                contactForm.reset();
            }
        });
    }

    initNavSearch();
    initScrollEffects();
    initIntersectionObserver();
    initStatsCounter();

    await updatePageContent();

    document.querySelectorAll('.feature-card, .product-card, .news-card, .mission-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
