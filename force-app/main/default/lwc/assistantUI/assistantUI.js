import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import ASSISTANT_UI_BUNDLE from '@salesforce/resourceUrl/assistantui';

export default class AssistantUI extends LightningElement {
    isAssistantLoaded = false;
    error = null;
    version = '6.0.0'; // Updated with full UI components

    connectedCallback() {
        this.loadAssistantUI();
    }

    async loadAssistantUI() {
        try {
            console.log('[AssistantUI] Starting to load bundle...');
            await loadScript(this, ASSISTANT_UI_BUNDLE + '?v=' + Date.now());
            console.log('[AssistantUI] Bundle loaded successfully');
            
            // Add debug logging
            console.log('[AssistantUI] Checking window.AssistantUI:', window.AssistantUI);
            console.log('[AssistantUI] Window keys with Assistant:', 
                Object.keys(window).filter(k => k.toLowerCase().includes('assistant'))
            );
            
            await new Promise(resolve => setTimeout(resolve, 200));
            
            this.isAssistantLoaded = true;
            setTimeout(() => {
                this.initializeAssistant();
            }, 100);
            
        } catch (error) {
            this.error = error?.message || error?.toString() || 'Unknown error loading Assistant UI';
            console.error('Error loading Assistant UI:', error);
        }
    }

    initializeAssistant() {
        try {
            console.log('[AssistantUI] Starting initialization...');
            
            const waitForContainer = (retries = 10) => {
                const container = this.template.querySelector('.assistant-container');
                console.log('[AssistantUI] Looking for container, retries left:', retries, 'Found:', !!container);
                
                if (container) {
                    console.log('[AssistantUI] Container found, proceeding with init');
                    this.proceedWithReactInit(container);
                } else if (retries > 0) {
                    setTimeout(() => waitForContainer(retries - 1), 100);
                } else {
                    console.error('[AssistantUI] Container not found after all retries');
                    // Even if container not found, check if React mounted itself
                    this.checkForAutoMount();
                }
            };
            
            waitForContainer();
            
        } catch (error) {
            this.error = error?.message || error?.toString() || 'Error initializing Assistant';
            console.error('Error in initializeAssistant:', error);
        }
    }

    proceedWithReactInit(container) {
        try {
            console.log('[AssistantUI] Attempting React init...');
            console.log('[AssistantUI] window.AssistantUI exists?', !!window.AssistantUI);
            
            if (window.AssistantUI && typeof window.AssistantUI.init === 'function') {
                console.log('[AssistantUI] Calling window.AssistantUI.init()');
                const result = window.AssistantUI.init(container);
                console.log('[AssistantUI] Init result:', result);
                this.error = null;
            } else {
                console.warn('[AssistantUI] window.AssistantUI not available, checking for auto-mounted React...');
                // Check if React already mounted itself
                this.checkForAutoMount();
            }
        } catch (error) {
            this.error = error?.message || error?.toString() || 'Error in React initialization';
            console.error('Error initializing assistant:', error);
            // Try fallback
            this.checkForAutoMount();
        }
    }

    checkForAutoMount() {
        console.log('[AssistantUI] Checking for auto-mounted React app...');
        
        // Check various possible React mount points
        const container = this.template.querySelector('.assistant-container');
        const possibleSelectors = [
            '[data-reactroot]',
            '#root',
            '.salesforce-assistant-container',
            '[class*="assistant"]',
            'div[style*="flex"]'
        ];
        
        let reactFound = false;
        for (const selector of possibleSelectors) {
            const element = container ? container.querySelector(selector) : this.template.querySelector(selector);
            if (element) {
                console.log('[AssistantUI] Found potential React element:', selector, element);
                reactFound = true;
                break;
            }
        }
        
        if (reactFound) {
            console.log('[AssistantUI] React appears to have auto-mounted successfully');
            this.error = null;
        } else {
            console.log('[AssistantUI] No React elements found, bundle may need manual initialization');
            // Try to check if the bundle at least loaded
            const scriptTags = document.querySelectorAll('script');
            const assistantScript = Array.from(scriptTags).find(s => s.src && s.src.includes('assistantui'));
            console.log('[AssistantUI] Assistant script tag found:', !!assistantScript);
            
            if (!assistantScript) {
                this.error = 'Assistant UI bundle failed to load';
            }
        }
    }

    get showAssistant() {
        return this.isAssistantLoaded && !this.error;
    }

    get showError() {
        return !!this.error;
    }

    get showLoading() {
        return !this.isAssistantLoaded && !this.error;
    }
}