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
            console.log('[AssistantUI] Bundle URL:', ASSISTANT_UI_BUNDLE);
            
            const scriptUrl = ASSISTANT_UI_BUNDLE + '?v=' + Date.now();
            console.log('[AssistantUI] Full script URL:', scriptUrl);
            
            // Check CSP headers
            try {
                const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
                if (cspMeta) {
                    console.log('[AssistantUI] CSP Meta found:', cspMeta.content);
                }
                console.log('[AssistantUI] Current domain:', window.location.origin);
            } catch (cspError) {
                console.error('[AssistantUI] Error checking CSP:', cspError);
            }
            
            // Check if static resource exists by trying to fetch it first
            try {
                const response = await fetch(scriptUrl, { method: 'HEAD' });
                console.log('[AssistantUI] Static resource check - Status:', response.status);
                console.log('[AssistantUI] Static resource check - Headers:', Array.from(response.headers.entries()));
            } catch (fetchError) {
                console.error('[AssistantUI] Failed to check static resource:', fetchError);
                console.error('[AssistantUI] Fetch error suggests possible CSP or network issue');
            }
            
            console.log('[AssistantUI] Calling loadScript...');
            
            try {
                await loadScript(this, scriptUrl);
                console.log('[AssistantUI] loadScript completed successfully');
            } catch (loadScriptError) {
                console.error('[AssistantUI] loadScript failed, trying alternative method');
                console.error('[AssistantUI] LoadScript error:', loadScriptError);
                
                // Check if error is CSP-related
                if (loadScriptError?.message?.includes('Content Security Policy') || 
                    loadScriptError?.message?.includes('CSP') ||
                    loadScriptError?.name === 'SecurityError') {
                    console.error('[AssistantUI] CSP violation detected!');
                }
                
                // Try alternative loading method
                await this.loadScriptAlternative(scriptUrl);
            }
            
            // Check immediately after loadScript
            console.log('[AssistantUI] Immediate check - window.AssistantUI:', window.AssistantUI);
            console.log('[AssistantUI] Immediate check - window keys with Assistant:', 
                Object.keys(window).filter(k => k.toLowerCase().includes('assistant'))
            );
            
            console.log('[AssistantUI] Waiting 200ms for bundle initialization...');
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Check again after delay
            console.log('[AssistantUI] After delay - window.AssistantUI:', window.AssistantUI);
            console.log('[AssistantUI] After delay - window keys with Assistant:', 
                Object.keys(window).filter(k => k.toLowerCase().includes('assistant'))
            );
            
            this.isAssistantLoaded = true;
            console.log('[AssistantUI] Setting up initialization timeout...');
            setTimeout(() => {
                this.initializeAssistant();
            }, 100);
            
        } catch (error) {
            console.error('[AssistantUI] Error in loadAssistantUI - Error object:', error);
            console.error('[AssistantUI] Error name:', error?.name);
            console.error('[AssistantUI] Error message:', error?.message);
            console.error('[AssistantUI] Error stack:', error?.stack);
            
            // Check for specific CSP error patterns
            const errorMsg = error?.message || error?.toString() || '';
            if (errorMsg.includes('Content Security Policy') || 
                errorMsg.includes('CSP') || 
                errorMsg.includes('SecurityError') ||
                error?.name === 'SecurityError') {
                console.error('[AssistantUI] *** CSP VIOLATION DETECTED ***');
                this.error = 'Content Security Policy blocked script loading. Contact admin to whitelist static resources.';
            } else {
                this.error = error?.message || error?.toString() || 'Unknown error loading Assistant UI';
            }
            
            console.error('Error loading Assistant UI:', error);
        }
    }

    async loadScriptAlternative(scriptUrl) {
        console.log('[AssistantUI] Trying alternative script loading method...');
        
        return new Promise((resolve, reject) => {
            try {
                // Try creating script tag manually
                const script = document.createElement('script');
                script.src = scriptUrl;
                script.type = 'text/javascript';
                script.async = true;
                
                script.onload = () => {
                    console.log('[AssistantUI] Alternative loading successful');
                    resolve();
                };
                
                script.onerror = (error) => {
                    console.error('[AssistantUI] Alternative loading also failed:', error);
                    reject(new Error('Alternative script loading failed: ' + error));
                };
                
                // Try appending to different locations
                const targets = [
                    this.template.querySelector('.assistant-container'),
                    document.head,
                    document.body
                ];
                
                let appended = false;
                for (const target of targets) {
                    if (target) {
                        console.log('[AssistantUI] Appending script to:', target.tagName);
                        target.appendChild(script);
                        appended = true;
                        break;
                    }
                }
                
                if (!appended) {
                    reject(new Error('No suitable container found for script'));
                }
                
            } catch (altError) {
                console.error('[AssistantUI] Alternative loading method failed:', altError);
                reject(altError);
            }
        });
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