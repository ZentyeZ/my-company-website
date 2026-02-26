let siteData = {};

const DATA_VERSION_KEY = 'acelynn_data_version';
const CURRENT_DATA_VERSION = '5.0';
const API_BASE_URL = 'http://localhost:3001/api';

async function fetchDataFromServer() {
    try {
        const response = await fetch(`${API_BASE_URL}/data`);
        if (response.ok) {
            const data = await response.json();
            siteData = data;
            console.log('数据从服务器获取成功');
            return data;
        } else {
            console.error('从服务器获取数据失败:', response.status);
            return getDefaultData();
        }
    } catch (error) {
        console.error('网络错误:', error.message);
        return getDefaultData();
    }
}

async function saveDataToServer() {
    try {
        const response = await fetch(`${API_BASE_URL}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(siteData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('数据保存到服务器成功:', result.message);
            return true;
        } else {
            console.error('保存数据到服务器失败:', response.status);
            return false;
        }
    } catch (error) {
        console.error('网络错误:', error.message);
        return false;
    }
}

function getDefaultData() {
    return {
        pages: {
            home: {
                hero: {
                    title: { zh: '创新生物科技，引领健康未来', en: 'Innovative Biotechnology for a Healthy Future' },
                    subtitle: { zh: 'ACELYNN 爱诗伦 - 专注于生物科技研发与创新', en: 'ACELYNN - Focused on Biotechnology R&D and Innovation' },
                    search: { zh: '搜索产品名称、CAS号、货号...', en: 'Search by product name, CAS number, catalog number...' },
                    searchButton: { zh: '搜索', en: 'Search' }
                },
                features: {
                    title: { zh: '我们的优势', en: 'Our Advantages' },
                    subtitle: { zh: '专业团队 · 先进技术 · 可靠品质', en: 'Professional Team · Advanced Technology · Reliable Quality' },
                    items: [
                        {
                            icon: '🔬',
                            title: { zh: '研发创新', en: 'R&D Innovation' },
                            desc: { zh: '持续投入研发，引领行业技术创新', en: 'Continuous R&D investment, leading industry innovation' }
                        },
                        {
                            icon: '⚗️',
                            title: { zh: '品质保证', en: 'Quality Assurance' },
                            desc: { zh: '严格的质量控制体系，确保产品安全可靠', en: 'Strict quality control system ensures product safety' }
                        },
                        {
                            icon: '🤝',
                            title: { zh: '专业服务', en: 'Professional Service' },
                            desc: { zh: '专业技术团队，提供全方位解决方案', en: 'Professional technical team provides comprehensive solutions' }
                        }
                    ]
                },
                products: {
                    title: { zh: '热门产品', en: 'Featured Products' },
                    seeMore: { zh: '查看全部 →', en: 'View All →' }
                }
            },
            about: {
                title: { zh: '关于我们', en: 'About Us' },
                companyTitle: { zh: '公司简介', en: 'Company Profile' },
                missionTitle: { zh: '企业使命', en: 'Mission' },
                visionTitle: { zh: '企业愿景', en: 'Vision' },
                valuesTitle: { zh: '核心价值观', en: 'Values' }
            },
            products: {
                title: { zh: '产品中心', en: 'Products' },
                search: { zh: '搜索产品...', en: 'Search products...' },
                allCategories: { zh: '所有分类', en: 'All Categories' }
            },
            news: {
                title: { zh: '新闻资讯', en: 'News' }
            },
            contact: {
                title: { zh: '联系我们', en: 'Contact Us' },
                infoTitle: { zh: '联系方式', en: 'Contact Info' },
                addressLabel: { zh: '公司地址', en: 'Address' },
                emailLabel: { zh: '电子邮箱', en: 'Email' },
                phoneLabel: { zh: '联系电话', en: 'Phone' },
                hoursLabel: { zh: '工作时间', en: 'Business Hours' },
                formTitle: { zh: '在线留言', en: 'Message Us' },
                nameLabel: { zh: '姓名', en: 'Name' },
                emailFieldLabel: { zh: '邮箱', en: 'Email' },
                subjectLabel: { zh: '主题', en: 'Subject' },
                messageLabel: { zh: '留言内容', en: 'Message' },
                submitLabel: { zh: '提交留言', en: 'Send Message' }
            }
        },
        company: {
            name: { zh: '爱诗伦', en: 'ACELYNN' },
            aboutText: {
                zh: '爱诗伦（ACELYNN）是一家专注于生物科技研发与创新的高新技术企业。我们致力于生命科学领域的前沿研究，为客户提供高品质的生物试剂、实验耗材和技术服务。',
                en: 'ACELYNN is a high-tech enterprise focused on biotechnology research and innovation. We are committed to cutting-edge research in the life sciences field, providing customers with high-quality biological reagents, laboratory consumables, and technical services.'
            },
            aboutText2: {
                zh: '公司拥有一支由博士、硕士组成的专业研发团队，配备先进的实验设备和完善的质量控制体系。我们始终坚持"创新驱动、品质至上"的理念，为科研工作者提供可靠的产品和专业的服务。',
                en: 'The company has a professional R&D team composed of doctors and masters, equipped with advanced experimental equipment and a comprehensive quality control system. We always adhere to the concept of "innovation-driven, quality first" to provide researchers with reliable products and professional services.'
            },
            mission: { zh: '以创新生物科技，助力人类健康事业发展', en: 'Innovative biotechnology for human health' },
            vision: { zh: '成为全球领先的生物科技解决方案提供商', en: 'To be the world\'s leading biotech solution provider' },
            values: { zh: '创新、专业、诚信、共赢', en: 'Innovation, Professionalism, Integrity, Win-Win' },
            address: { zh: '上海市浦东新区生物科技园区888号', en: '888 Biotech Park, Pudong, Shanghai' },
            email: 'info@acelynn.com',
            phone: '+86 21 1234 5678',
            hours: { zh: '周一至周五 9:00 - 18:00', en: 'Mon-Fri 9:00 AM - 6:00 PM' },
            footer: {
                desc: { zh: '创新生物科技，引领健康未来', en: 'Innovative Biotechnology for a Healthy Future' },
                linksTitle: { zh: '快速链接', en: 'Quick Links' },
                contactTitle: { zh: '联系方式', en: 'Contact' },
                addressShort: { zh: '上海市浦东新区生物科技园区', en: 'Biotech Park, Pudong, Shanghai' }
            }
        },
        products: [
            {
                id: 1,
                name: { zh: '重组蛋白酶K', en: 'Recombinant Proteinase K' },
                chemicalName: 'Proteinase K',
                category: { zh: '酶试剂', en: 'Enzymes' },
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
                category: { zh: '试剂盒', en: 'Kits' },
                price: '¥890',
                desc: { zh: '快速高效的基因组DNA提取试剂盒', en: 'Fast and efficient genomic DNA extraction kit' },
                icon: '🧪',
                casNumber: '',
                catalogNumber: 'DK-002',
                specification: '50 preps',
                purity: '',
                isHot: true
            },
            {
                id: 3,
                name: { zh: '实时荧光定量PCR仪', en: 'Real-Time qPCR System' },
                chemicalName: 'Real-Time Quantitative PCR System',
                category: { zh: '仪器设备', en: 'Instruments' },
                price: '¥168,000',
                desc: { zh: '高精度实时荧光定量PCR检测系统', en: 'High-precision real-time fluorescent quantitative PCR detection system' },
                icon: '🔬',
                casNumber: '',
                catalogNumber: 'QPCR-003',
                specification: '96孔',
                purity: '',
                isHot: false
            },
            {
                id: 4,
                name: { zh: '细胞培养皿', en: 'Cell Culture Dish' },
                chemicalName: 'Sterile Cell Culture Dish',
                category: { zh: '实验耗材', en: 'Consumables' },
                price: '¥280',
                desc: { zh: '无菌细胞培养皿，多种规格可选', en: 'Sterile cell culture dishes, various sizes available' },
                icon: '⚗️',
                casNumber: '',
                catalogNumber: 'CD-004',
                specification: '100mm',
                purity: '无菌',
                isHot: false
            }
        ],
        news: [
            {
                id: 1,
                title: { zh: '爱诗伦荣获2026年度生物科技创新奖', en: 'ACELYNN Wins 2026 Biotechnology Innovation Award' },
                content: { zh: '近日，在上海举行的国际生物技术大会上，我公司凭借在重组蛋白表达领域的突破性研究，荣获2026年度生物科技创新奖。', en: 'Recently, at the International Biotechnology Conference held in Shanghai, our company won the 2026 Biotechnology Innovation Award for our breakthrough research in recombinant protein expression.' },
                date: '2026-02-15'
            },
            {
                id: 2,
                title: { zh: '新产品上线：第三代PCR试剂盒', en: 'New Product Launch: 3rd Generation PCR Kit' },
                content: { zh: '我们很高兴地宣布，第三代高效PCR试剂盒正式上线！该产品具有更高的灵敏度和特异性，欢迎新老客户咨询。', en: 'We are pleased to announce the official launch of our 3rd generation high-efficiency PCR kit! This product offers higher sensitivity and specificity.' },
                date: '2026-02-10'
            }
        ]
    };
}

function loadData() {
    return fetchDataFromServer();
}

function saveData() {
    return saveDataToServer();
}

function resetToDefaultData() {
    siteData = getDefaultData();
    saveData();
    alert('数据已重置为默认值！');
    location.reload();
}

// 导出函数
window.siteData = siteData;
window.loadData = loadData;
window.saveData = saveData;
window.resetToDefaultData = resetToDefaultData;
window.getDefaultData = getDefaultData;