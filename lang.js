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
        
        // Style the button to match the glass effect theme
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.padding = '12px 24px';
        button.style.borderRadius = '30px';
        button.style.background = 'rgba(255, 255, 255, 0.15)';
        button.style.backdropFilter = 'blur(10px)';
        button.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        button.style.color = '#ffffff';
        button.style.fontFamily = 'system-ui, sans-serif';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        button.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        
        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(255, 255, 255, 0.25)';
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'rgba(255, 255, 255, 0.15)';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        });
        
        // Add touch feedback for mobile devices
        button.style.touchAction = 'manipulation';
        button.style.webkitTapHighlightColor = 'transparent';
        
        // Add media query for mobile devices
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 600px) {
                #language-button {
                    padding: 10px 20px !important;
                    font-size: 14px !important;
                    top: 15px !important;
                    right: 15px !important;
                }
            }
        `;
        document.head.appendChild(style);
        
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
        
        // Style the popup with enhanced glass effect
        popup.style.position = 'fixed';
        popup.style.top = '80px';
        popup.style.right = '20px';
        popup.style.width = '280px';
        popup.style.maxWidth = '90vw';
        popup.style.maxHeight = '70vh'; // Limit height for mobile devices
        popup.style.padding = '24px';
        popup.style.borderRadius = '28px';
        popup.style.background = 'rgba(255, 255, 255, 0.15)';
        popup.style.backdropFilter = 'blur(6px) saturate(180%)';
        popup.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        popup.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.25)';
        popup.style.zIndex = '1001';
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        popup.style.transform = 'translateY(-15px) scale(0.95)';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.gap = '12px';
        popup.style.overflowY = 'auto'; // Enable vertical scrolling
        
        // Add custom scrollbar for the popup
        const scrollbarStyle = document.createElement('style');
        scrollbarStyle.textContent = `
            #language-popup::-webkit-scrollbar {
                width: 6px;
            }
            
            #language-popup::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }
            
            #language-popup::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 10px;
            }
            
            #language-popup::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.4);
            }
        `;
        document.head.appendChild(scrollbarStyle);
        
        // Add languages to the popup
        this.languages.forEach(lang => {
            const languageItem = document.createElement('a');
            languageItem.href = lang.link;
            languageItem.target = '_blank';
            languageItem.className = 'language-item';
            
            // Style the language item
            languageItem.style.display = 'block';
            languageItem.style.padding = '14px 18px';
            languageItem.style.borderRadius = '16px';
            languageItem.style.background = 'rgba(255, 255, 255, 0.08)';
            languageItem.style.color = '#ffffff';
            languageItem.style.textDecoration = 'none';
            languageItem.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            languageItem.style.whiteSpace = 'nowrap';
            languageItem.style.overflow = 'hidden';
            languageItem.style.textOverflow = 'ellipsis';
            languageItem.style.fontFamily = 'Segoe UI, system-ui, sans-serif';
            
            // Add hover effect for desktop
            languageItem.addEventListener('mouseenter', () => {
                languageItem.style.background = 'rgba(255, 255, 255, 0.2)';
                languageItem.style.transform = 'translateX(8px)';
                languageItem.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            });
            
            languageItem.addEventListener('mouseleave', () => {
                languageItem.style.background = 'rgba(255, 255, 255, 0.08)';
                languageItem.style.transform = 'translateX(0)';
                languageItem.style.boxShadow = 'none';
            });
            
            // Add touch effect for mobile
            languageItem.addEventListener('touchstart', () => {
                languageItem.style.background = 'rgba(255, 255, 255, 0.2)';
                languageItem.style.transform = 'translateX(8px)';
            });
            
            languageItem.addEventListener('touchend', () => {
                languageItem.style.background = 'rgba(255, 255, 255, 0.08)';
                languageItem.style.transform = 'translateX(0)';
            });
            
            // Add language names with better typography
            languageItem.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 3px; font-size: 16px;">${lang.name}</div>
                <div style="font-size: 13px; opacity: 0.8; font-weight: 300;">${lang.localName}</div>
            `;
            
            popup.appendChild(languageItem);
        });
        
        // Add a header to the popup
        const header = document.createElement('div');
        header.style.fontSize = '18px';
        header.style.fontWeight = 'bold';
        header.style.marginBottom = '16px';
        header.style.textAlign = 'center';
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
        
        // Add animation for showing/hiding
        this.popup.addEventListener('transitionend', () => {
            if (this.popup.classList.contains('hidden')) {
                this.popup.style.display = 'none';
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
        this.popup.style.display = 'flex';
        
        // Trigger reflow before animating
        void this.popup.offsetWidth;
        
        // Apply animations
        this.popup.style.opacity = '1';
        this.popup.style.transform = 'translateY(0) scale(1)';
        this.button.setAttribute('aria-expanded', 'true');
        
        // Prevent body from scrolling when popup is open
        document.body.style.overflow = 'hidden';
        
        // Add button animation
        this.button.style.transform = 'scale(1.05)';
        this.button.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
    }
    
    /**
     * Hides the language popup with enhanced animation.
     */
    hidePopup() {
        this.popup.style.opacity = '0';
        this.popup.style.transform = 'translateY(-15px) scale(0.95)';
        this.popup.classList.add('hidden');
        this.button.setAttribute('aria-expanded', 'false');
        
        // Allow body to scroll again when popup is closed
        document.body.style.overflow = '';
        
        // Reset button animation
        this.button.style.transform = 'scale(1)';
        this.button.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
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
        const header = this.popup.querySelector('div:first-child');
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
            
            // Apply styling
            languageItem.style.display = 'block';
            languageItem.style.padding = '14px 18px';
            languageItem.style.borderRadius = '16px';
            languageItem.style.background = 'rgba(255, 255, 255, 0.08)';
            languageItem.style.color = '#ffffff';
            languageItem.style.textDecoration = 'none';
            languageItem.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            languageItem.style.whiteSpace = 'nowrap';
            languageItem.style.overflow = 'hidden';
            languageItem.style.textOverflow = 'ellipsis';
            languageItem.style.fontFamily = 'Segoe UI, system-ui, sans-serif';
            
            // Add hover effects
            languageItem.addEventListener('mouseenter', () => {
                languageItem.style.background = 'rgba(255, 255, 255, 0.2)';
                languageItem.style.transform = 'translateX(8px)';
                languageItem.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            });
            
            languageItem.addEventListener('mouseleave', () => {
                languageItem.style.background = 'rgba(255, 255, 255, 0.08)';
                languageItem.style.transform = 'translateX(0)';
                languageItem.style.boxShadow = 'none';
            });
            
            // Add language names
            languageItem.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 3px; font-size: 16px;">${lang.name}</div>
                <div style="font-size: 13px; opacity: 0.8; font-weight: 300;">${lang.localName}</div>
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