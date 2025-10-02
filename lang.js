/**
 * Language Selector Popup
 * Manages the language selection popup and redirect functionality with glass morphism design.
 */
class LanguageSelector {
    constructor() {
        // Language data with names and external links
        this.languages = [
            { code: 'en', name: 'English', localName: 'English', link: 'https://chronie-shizutoki.github.io/self-info-en' },
            { code: 'ja', name: '日本語', localName: 'Japanese', link: 'https://self-info-ja.netlify.app/' },
            { code: 'zh-CN', name: '简体中文（中国大陆）', localName: 'Simplified Chinese (China)', link: 'https://chronie-shizutoki-self-info-zh-cn.netlify.app/' },
            { code: 'zh-MY', name: '华文（马来西亚）', localName: 'Chinese (Malaysia)', link: 'https://chronie-shizutoki.github.io/self-info-zh-my/' },
            { code: 'zh-SG', name: '华文（新加坡）', localName: 'Chinese (Singapore)', link: 'https://chronie-shizutoki.github.io/self-info-zh-sg/' },
            { code: 'zh-TW', name: '繁體中文（台灣）', localName: 'Traditional Chinese (Taiwan)', link: 'https://chronie-shizutoki.github.io/self-info-zh-tw/' },
        ];
        
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
        
        // Add languages to the popup
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
        
        // Add a header to the popup
        const header = document.createElement('div');
        header.className = 'popup-header';
        header.textContent = 'Select Language';
        
        // Insert header at the beginning of the popup
        popup.insertBefore(header, popup.firstChild);
        
        document.body.appendChild(popup);
        this.popup = popup;
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
        
        // Prevent body from scrolling when popup is open
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Hides the language popup with enhanced animation.
     */
    hidePopup() {
        this.popup.classList.remove('visible');
        
        // Hide after fade-out animation completes
        setTimeout(() => {
            this.popup.classList.add('hidden');
        }, 200);
        
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
            
            // If country is China and region is not Hong Kong or Macau
            if (data.country_code === 'CN' && data.region !== '91' && data.region !== '92') {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking location:', error);
            return false; // Default to not in China if there's an error
        }
    }
    
    /**
     * Filters languages based on user location
     * If user is in mainland China, only show Simplified Chinese (China) version
     */
    async applyLocationBasedLanguageRestrictions() {
        const isInMainlandChina = await this.checkIfInMainlandChina();
        
        if (isInMainlandChina) {
            // User is in mainland China, only show Simplified Chinese (China) version
            const zhCNLang = this.languages.find(lang => lang.code === 'zh-CN');
            if (zhCNLang) {
                // Update the languages array to only include Simplified Chinese (China)
                this.languages = [zhCNLang];
                
                // Recreate the popup with filtered languages
                this.updateLanguagePopup();
            }
        }
    }
    
    /**
     * Updates the language popup with current languages array
     */
    updateLanguagePopup() {
        // Clear existing language items except header
        const header = this.popup.querySelector('.popup-header');
        this.popup.innerHTML = '';
        
        // Re-add header
        if (header) {
            this.popup.appendChild(header);
        }
        
        // Add updated language items
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
            
            this.popup.appendChild(languageItem);
        });
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
    function applyTestMode(regionType) {
        // Store the original method for restoration
        const originalCheckMethod = languageSelector.constructor.prototype.checkIfInMainlandChina;
        
        // Override the check method based on region type
        if (regionType === 'mainland-china') {
            languageSelector.checkIfInMainlandChina = async () => true;
        } else if (regionType === 'outside-china') {
            languageSelector.checkIfInMainlandChina = async () => false;
        } else {
            // Restore original method if region type is 'reset'
            languageSelector.checkIfInMainlandChina = originalCheckMethod;
        }
        
        // Reapply location-based restrictions with the new method
        languageSelector.applyLocationBasedLanguageRestrictions().then(() => {
            console.log('Region test completed. The test mode will persist even after page refresh.');
        }).catch(error => {
            console.error('Error during region test:', error);
        });
    }
    
    // If there's a stored test mode, apply it before checking location
    if (storedTestMode) {
        console.log(`Restoring test mode: ${storedTestMode}`);
        applyTestMode(storedTestMode);
    } else {
        // Apply location-based language restrictions as usual
        try {
            await languageSelector.applyLocationBasedLanguageRestrictions();
        } catch (error) {
            console.error('Error applying location-based restrictions:', error);
            // Continue with default languages if there's an error
        }
    }
    
    // Make the language selector accessible globally for debugging
    window.languageSelector = languageSelector;
    
    // Print debugging instructions to console
    console.log('%cLanguage Selector Debugging Tools:', 'color: #6366f1; font-weight: bold;');
    console.log('• testRegion(\'mainland-china\') - Simulate user in Mainland China');
    console.log('• testRegion(\'outside-china\') - Simulate user outside Mainland China');
    console.log('• testRegion(\'reset\') - Reset to use actual location detection');
    console.log('• languageSelector - Access the language selector instance directly');
    console.log('• Test mode will persist across page refresh');
});