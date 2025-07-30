import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import ASSISTANT_UI_BUNDLE from '@salesforce/resourceUrl/assistantui_nextjs';

export default class AssistantUI extends LightningElement {
    isAssistantLoaded = false;
    error = null;
    version = '6.0.0'; // Updated with full UI components

    connectedCallback() {
        this.loadAssistantUI();
    }

    async loadAssistantUI() {
        try {
            await loadScript(this, ASSISTANT_UI_BUNDLE + '?v=' + Date.now());
            await new Promise(resolve => setTimeout(resolve, 200));
            
            this.isAssistantLoaded = true;
            setTimeout(() => {
                this.initializeAssistant();
            }, 100);
            
        } catch (error) {
            this.error = error.message;
            console.error('Error loading Assistant UI:', error);
        }
    }

    initializeAssistant() {
        try {
            const waitForContainer = (retries = 10) => {
                const container = this.template.querySelector('.assistant-container');
                
                if (container) {
                    this.proceedWithReactInit(container);
                } else if (retries > 0) {
                    setTimeout(() => waitForContainer(retries - 1), 100);
                } else {
                    throw new Error('Assistant container not found');
                }
            };
            
            waitForContainer();
            
        } catch (error) {
            this.error = error.message;
            console.error('Error in initializeAssistant:', error);
        }
    }

    proceedWithReactInit(container) {
        try {
            if (window.AssistantUI && typeof window.AssistantUI.init === 'function') {
                const result = window.AssistantUI.init(container);
                this.error = null;
            } else {
                throw new Error('AssistantUI not available');
            }
        } catch (error) {
            this.error = error.message;
            console.error('Error initializing assistant:', error);
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