<div class="link-container list-group">
{{#each itemHtmlList}}
    {{{./this}}}
{{/each}}
</div>
<div class="array-control-container">
{{#if hasOptions}}
<button class="btn btn-default btn-block" type="button" data-action="showAddModal">{{translate 'Add'}}</button>
{{/if}}
{{#if allowCustomOptions}}
<div class="input-group addItem">
    <input class="main-element form-control select addItem" type="text" autocomplete="espo-{{name}}" placeholder="{{#if this.options}}{{translate 'Select'}}{{else}}{{translate 'typeAndPressEnter' category='messages'}}{{/if}}"{{#if maxItemLength}} maxlength="{{maxItemLength}}"{{/if}}>
    <span class="input-group-btn">
        <button data-action="addItem" class="btn btn-default btn-icon" type="button" tabindex="-1" title="{{translate 'Add Item'}}"><span class="fas fa-plus"></span></button>
    </span>
</div>
<div class="input-group updateItem" style="display:none;">
    <input class="main-element form-control select updateItem" type="text" autocomplete="espo-{{name}}" placeholder="{{#if this.options}}{{translate 'Select'}}{{else}}{{translate 'typeAndPressEnter' category='messages'}}{{/if}}"{{#if maxItemLength}} maxlength="{{maxItemLength}}"{{/if}}>
    <span class="input-group-btn">
        <button data-action="updateItem" class="btn btn-default btn-icon" type="button" tabindex="-1" title="{{translate 'Update Item'}}"><span class="fas fa-check"></span></button>
    </span>
</div>
{{/if}}
</div>
