<aura:application extends="force:slds">
    <aura:dependency resource="c:assistantUI"/>
    
    <div class="slds-p-around_large">
        <div class="slds-card">
            <div class="slds-card__header slds-grid">
                <header class="slds-media slds-media_center slds-has-flexi-truncate">
                    <div class="slds-media__body">
                        <h2 class="slds-card__header-title">
                            <a href="#" class="slds-card__header-link slds-truncate" title="AI Assistant Demo">
                                <span>AI Assistant Demo</span>
                            </a>
                        </h2>
                    </div>
                </header>
            </div>
            <div class="slds-card__body slds-card__body_inner">
                <c:assistantUI></c:assistantUI>
            </div>
        </div>
    </div>
</aura:application>