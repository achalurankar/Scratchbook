<aura:application >
    <aura:handler name="init" action="{!c.doInit}" value="{!this}"/>
    <aura:attribute name="wrapper" type="Object"/>
    <h1>{!v.wrapper}</h1>
    <h2>{!v.wrapper.one}</h2>
</aura:application>