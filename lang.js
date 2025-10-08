/**
 * Language Selector Popup
 * Manages the language selection popup and redirect functionality with glass morphism design.
 * Updated with correct Chinese region detection logic.
 */
class LanguageSelector {
    constructor() {
        // Language data with names and external links
        this.languages = [
            { code: 'en', name: 'English', localName: 'English', link: 'https://chronie-shizutoki.github.io/self-info-en' },
            { code: 'ja', name: '日本語', localName: 'Japanese', link: 'https://self-info-ja.netlify.app/' },
            { code: 'zh-CN', name: '中国大陆', localName: 'China Mainland', link: 'https://chronie-shizutoki-self-info-zh-cn.netlify.app/' },
            { code: 'zh-Hans', name: '华文', localName: 'Simplified Chinese (SEA)', link: 'https://self-info-zh-hans.netlify.app/' },
            { code: 'zh-TW', name: '繁體中文（台灣）', localName: 'Traditional Chinese (Taiwan)', link: 'https://chronie-shizutoki.github.io/self-info-zh-tw/' },
        ];
        
        // Store original languages for restoration
        this.originalLanguages = [...this.languages];
        
        // Initialize the language selector
        this.init();
    }
    
    /**
     * Initializes the language selector by creating the button and popup elements.
     */
    init() {
        // Create language selector button
        this.createLanguageButton();
        
        // Create language popup
        this.createLanguagePopup();
        
        // Add event listeners
        this.setupEventListeners();
    }
    
    /**
     * Creates the language selector button and adds it to the DOM.
     */
    createLanguageButton() {
        const button = document.createElement('button');
        button.id = 'language-button';
        button.className = 'language-button';
        button.innerHTML = '🌐 Language';
        
        // Add touch feedback for mobile devices
        button.style.touchAction = 'manipulation';
        button.style.webkitTapHighlightColor = 'transparent';
        
        document.body.appendChild(button);
        this.button = button;
    }
    
    /**
     * Creates the language selection popup and adds it to the DOM.
     */
    createLanguagePopup() {
        const popup = document.createElement('div');
        popup.id = 'language-popup';
        popup.className = 'language-popup hidden';
        
        // Add a header to the popup
        const header = document.createElement('div');
        header.className = 'popup-header';
        header.textContent = 'Select Language';
        popup.appendChild(header);
        
        // Add languages to the popup
        this.updateLanguageItems(popup);
        
        document.body.appendChild(popup);
        this.popup = popup;
    }
    
    /**
     * Updates language items in the popup
     */
    updateLanguageItems(popup) {
        // Remove existing language items (keep header)
        const existingItems = popup.querySelectorAll('.language-item');
        existingItems.forEach(item => item.remove());
        
        // Add current languages to the popup
        this.languages.forEach(lang => {
            const languageItem = document.createElement('a');
            languageItem.href = lang.link;
            languageItem.target = '_blank';
            languageItem.className = 'language-item';
            
            // Add language names with simplified typography
            languageItem.innerHTML = `
                <div class="language-name">${lang.name}</div>
                <div class="language-local-name">${lang.localName}</div>
            `;
            
            popup.appendChild(languageItem);
        });
    }
    
    /**
     * Sets up event listeners for the language selector.
     */
    setupEventListeners() {
        // Toggle popup on button click
        this.button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from closing the popup immediately
            this.togglePopup();
        });
        
        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.popup.contains(e.target) && e.target !== this.button) {
                this.hidePopup();
            }
        });
        
        // Close popup when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hidePopup();
            }
        });
        
        // Make popup accessible by keyboard navigation
        this.button.setAttribute('aria-haspopup', 'true');
        this.button.setAttribute('aria-expanded', 'false');
    }
    
    /**
     * Toggles the visibility of the language popup.
     */
    togglePopup() {
        if (this.popup.classList.contains('hidden')) {
            this.showPopup();
        } else {
            this.hidePopup();
        }
    }
    
    /**
     * Shows the language popup with enhanced animation.
     */
    showPopup() {
        this.popup.classList.remove('hidden');
        
        // Apply fade-in effect through CSS
        setTimeout(() => {
            this.popup.classList.add('visible');
        }, 10);
        
        this.button.setAttribute('aria-expanded', 'true');
        
        // Prevent body from scrolling when popup is open on mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
    }
    
    /**
     * Hides the language popup with enhanced animation.
     */
    hidePopup() {
        this.popup.classList.remove('visible');
        
        // Hide after fade-out animation completes
        setTimeout(() => {
            this.popup.classList.add('hidden');
        }, 300);
        
        this.button.setAttribute('aria-expanded', 'false');
        
        // Allow body to scroll again when popup is closed
        document.body.style.overflow = '';
    }
    
    /**
     * Checks if the user is in mainland China using IP geolocation
     * @returns {Promise<boolean>} True if user is in mainland China, false otherwise
     */
    async checkIfInMainlandChina() {
        try {
            // Using a free IP geolocation API
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            console.log('Geolocation data:', data);
            
            // If country is China (CN) - this covers mainland China
            // Hong Kong (HK), Macau (MO), and Taiwan (TW) have separate country codes
            if (data.country_code === 'CN') {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking location:', error);
            return false; // Default to not in China if there's an error
        }
    }
    
    /**
     * Get user's browser language preference
     * @returns {string} Browser language code
     */
    getUserBrowserLanguage() {
        return navigator.language || navigator.userLanguage;
    }
    
    /**
     * Determine recommended languages based on location and browser language
     * @param {string} browserLang - Browser language code
     * @param {boolean} isInMainlandChina - Whether user is in mainland China
     * @returns {Array} Array of recommended language objects
     */
    getRecommendedLanguages(browserLang, isInMainlandChina) {
        const recommendations = [];
        
        // Priority 1: If user is in mainland China, force zh-CN (中国大陆)
        if (isInMainlandChina) {
            const zhCNLang = this.originalLanguages.find(lang => lang.code === 'zh-CN');
            if (zhCNLang) {
                recommendations.push(zhCNLang);
                console.log('User in mainland China - recommending zh-CN');
                return recommendations;
            }
        }
        
        // Priority 2: Handle Chinese language variants based on browser language
        if (browserLang && browserLang.toLowerCase().startsWith('zh-')) {
            const lowerCaseBrowserLang = browserLang.toLowerCase();
            
            // Traditional Chinese variants (Hong Kong, Macau, Taiwan)
            const traditionalVariants = ['zh-hk', 'zh-mo', 'zh-tw'];
            const isTraditionalVariant = traditionalVariants.some(variant => 
                lowerCaseBrowserLang === variant || lowerCaseBrowserLang.startsWith(variant + '-')
            );
            
            if (isTraditionalVariant) {
                // Use Traditional Chinese (Taiwan) for HK, MO, TW
                const zhTWLang = this.originalLanguages.find(lang => lang.code === 'zh-TW');
                if (zhTWLang) {
                    recommendations.push(zhTWLang);
                    console.log(`Traditional Chinese variant detected (${browserLang}) - recommending zh-TW`);
                }
            } else {
                // For other Chinese variants (zh-sg, zh-my, zh-cn, etc.), use Simplified Chinese (SEA)
                // Note: zh-cn from browser should go to zh-Hans (华文) unless user is physically in mainland China
                const zhHansLang = this.originalLanguages.find(lang => lang.code === 'zh-Hans');
                if (zhHansLang) {
                    recommendations.push(zhHansLang);
                    console.log(`Other Chinese variant detected (${browserLang}) - recommending zh-Hans`);
                }
            }
            
            return recommendations;
        }
        
        // Priority 3: Check for exact language match (non-Chinese languages)
        if (browserLang) {
            const exactMatch = this.originalLanguages.find(lang => 
                lang.code === browserLang || 
                lang.code === browserLang.split('-')[0] ||
                browserLang.startsWith(lang.code.split('-')[0])
            );
            if (exactMatch && !exactMatch.code.startsWith('zh-')) {
                recommendations.push(exactMatch);
                console.log(`Exact language match found: ${exactMatch.code}`);
            }
        }
        
        // Priority 4: If no match, add Japanese and English as fallbacks
        if (recommendations.length === 0) {
            const japanese = this.originalLanguages.find(lang => lang.code === 'ja');
            const english = this.originalLanguages.find(lang => lang.code === 'en');
            
            if (japanese) recommendations.push(japanese);
            if (english) recommendations.push(english);
            
            console.log('No specific match - using Japanese and English fallbacks');
        }
        
        return recommendations;
    }
    
    /**
     * Apply location-based language restrictions and recommendations
     */
    async applyLocationBasedLanguageRestrictions() {
        try {
            const isInMainlandChina = await this.checkIfInMainlandChina();
            const browserLang = this.getUserBrowserLanguage();
            
            console.log('Browser language:', browserLang);
            console.log('Is in mainland China:', isInMainlandChina);
            
            // Get recommended languages based on location and browser language
            const recommendedLangs = this.getRecommendedLanguages(browserLang, isInMainlandChina);
            
            if (isInMainlandChina) {
                // If user is in mainland China, only show zh-CN in the popup
                this.languages = recommendedLangs;
                console.log('Restricting popup to mainland China languages only');
            } else {
                // If user is not in mainland China, show all languages in popup
                this.languages = [...this.originalLanguages];
                console.log('Showing all languages in popup');
            }
            
            // Update the popup with current languages
            this.updateLanguagePopup();
            
            // Return recommended languages for main page display
            return {
                recommendedLangs,
                detectedLanguage: recommendedLangs.length > 0 ? recommendedLangs[0].code : 'en',
                isInMainlandChina
            };
            
        } catch (error) {
            console.error('Error in applyLocationBasedLanguageRestrictions:', error);
            // Return default values on error
            return {
                recommendedLangs: [this.originalLanguages.find(lang => lang.code === 'en')],
                detectedLanguage: 'en',
                isInMainlandChina: false
            };
        }
    }
    
    /**
     * Updates the language popup with current languages array
     */
    updateLanguagePopup() {
        if (this.popup) {
            this.updateLanguageItems(this.popup);
        }
    }
}

// Initialize the language selector when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    const languageSelector = new LanguageSelector();
    
    // Get stored test mode from localStorage
    const storedTestMode = localStorage.getItem('languageTestMode');
    
    // Add debugging functionality to test different regions
    window.testRegion = (regionType) => {
        console.log(`Testing region: ${regionType}`);
        
        // Store the test mode in localStorage for persistence across page reloads
        if (regionType === 'reset') {
            localStorage.removeItem('languageTestMode');
            console.log('Simulation reset: Using actual location detection');
        } else {
            localStorage.setItem('languageTestMode', regionType);
            console.log(`Simulation: User is ${regionType === 'mainland-china' ? 'in' : 'outside'} Mainland China`);
        }
        
        // Apply the test mode immediately
        applyTestMode(regionType);
    };
    
    // Function to apply test mode
    async function applyTestMode(regionType) {
        // Store the original method for restoration
        const originalCheckMethod = languageSelector.checkIfInMainlandChina.bind(languageSelector);
        
        // Override the check method based on region type
        if (regionType === 'mainland-china') {
            languageSelector.checkIfInMainlandChina = async () => {
                console.log('Test mode: Simulating mainland China location');
                return true;
            };
        } else if (regionType === 'outside-china') {
            languageSelector.checkIfInMainlandChina = async () => {
                console.log('Test mode: Simulating location outside mainland China');
                return false;
            };
        } else {
            // Restore original method if region type is 'reset'
            languageSelector.checkIfInMainlandChina = originalCheckMethod;
        }
        
        // Reapply location-based restrictions with the new method
        try {
            const result = await languageSelector.applyLocationBasedLanguageRestrictions();
            
            // Update the main page display
            if (window.updateMainPageLanguage) {
                window.updateMainPageLanguage(result);
            }
            
            console.log('Region test completed. The test mode will persist even after page refresh.');
        } catch (error) {
            console.error('Error during region test:', error);
        }
    }
    
    // Function to update main page language display
    window.updateMainPageLanguage = (result) => {
        const { recommendedLangs, detectedLanguage } = result;
        
        // Show language text
        document.querySelectorAll('.language-text p').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelectorAll('#language-recommendation h3').forEach(el => {
            el.classList.add('hidden');
        });
        
        const langElements = document.querySelectorAll(`.lang-${detectedLanguage}`);
        if (langElements.length > 0) {
            langElements.forEach(el => {
                el.classList.add('active');
                el.classList.remove('hidden');
            });
        } else {
            // Fallback to English
            document.querySelectorAll('.lang-en').forEach(el => {
                el.classList.add('active');
                el.classList.remove('hidden');
            });
        }
        
        // Update feedback button
        document.querySelectorAll('.feedback-text').forEach(el => {
            el.classList.remove('active');
        });
        const feedbackElement = document.querySelector(`.feedback-text.lang-${detectedLanguage}`);
        if (feedbackElement) {
            feedbackElement.classList.add('active');
        } else {
            document.querySelector('.feedback-text.lang-en').classList.add('active');
        }
        
        // Update changelog button
        document.querySelectorAll('.changelog-text').forEach(el => {
            el.classList.remove('active');
        });
        const changelogElement = document.querySelector(`.changelog-text.lang-${detectedLanguage}`);
        if (changelogElement) {
            changelogElement.classList.add('active');
        } else {
            document.querySelector('.changelog-text.lang-en').classList.add('active');
        }
        
        // Display recommendations
        const langsContainer = document.getElementById('recommended-langs');
        if (langsContainer) {
            langsContainer.innerHTML = '';
            
            recommendedLangs.slice(0, 4).forEach(lang => {
                const link = document.createElement('a');
                link.href = lang.link;
                link.target = '_blank';
                link.className = 'recommended-lang';
                link.textContent = lang.name;
                langsContainer.appendChild(link);
            });
        }
        
        console.log(`Main page updated with language: ${detectedLanguage}`);
    };
    
    // If there's a stored test mode, apply it before checking location
    if (storedTestMode) {
        console.log(`Restoring test mode: ${storedTestMode}`);
        await applyTestMode(storedTestMode);
    } else {
        // Apply location-based language restrictions as usual
        try {
            const result = await languageSelector.applyLocationBasedLanguageRestrictions();
            window.updateMainPageLanguage(result);
        } catch (error) {
            console.error('Error applying location-based restrictions:', error);
            // Continue with default languages if there's an error
            const defaultResult = {
                recommendedLangs: [languageSelector.originalLanguages.find(lang => lang.code === 'en')],
                detectedLanguage: 'en',
                isInMainlandChina: false
            };
            window.updateMainPageLanguage(defaultResult);
        }
    }
    
    // Make the language selector accessible globally for debugging
    window.languageSelector = languageSelector;
    
    // Print debugging instructions to console
    console.log('%cLanguage Selector Debugging Tools:', 'color: #6366f1; font-weight: bold; font-size: 14px;');
    console.log('%c• testRegion("mainland-china")', 'color: #10b981;', '- Simulate user in Mainland China');
    console.log('%c• testRegion("outside-china")', 'color: #10b981;', '- Simulate user outside Mainland China');  
    console.log('%c• testRegion("reset")', 'color: #10b981;', '- Reset to use actual location detection');
    console.log('%c• languageSelector', 'color: #10b981;', '- Access the language selector instance directly');
    console.log('%cTest mode will persist across page refresh', 'color: #f59e0b; font-style: italic;');
    console.log('%c\nLanguage Logic:', 'color: #8b5cf6; font-weight: bold;');
    console.log('%c• Mainland China IP → zh-CN (中国大陆)', 'color: #6b7280;');
    console.log('%c• zh-hk/mo/tw browser → zh-TW (繁體中文)', 'color: #6b7280;');
    console.log('%c• Other Chinese (zh-sg/my/etc) → zh-Hans (华文)', 'color: #6b7280;');
});
