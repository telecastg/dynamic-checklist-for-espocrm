/************************************************************************
 * This file is part of EspoCRM.
 *
 * EspoCRM - Open Source CRM application.
 * Copyright (C) 2014-2019 Yuri Kuznetsov, Taras Machyshyn, Oleksiy Avramenko
 * Website: https://www.espocrm.com
 *
 * EspoCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * EspoCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with EspoCRM. If not, see http://www.gnu.org/licenses/.
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "EspoCRM" word.
 ************************************************************************/

define('dynamic-checklist:views/fields/dynamic-checklist', ['views/fields/array'], function (Dep) {

    return Dep.extend({

        type: 'dynamic-checklist',

        listTemplate: 'fields/array/list',

        detailTemplate: 'fields/array/detail',

        editTemplate: 'fields/array/edit',

        searchTemplate: 'fields/array/search',

        searchTypeList: ['anyOf', 'noneOf', 'allOf', 'isEmpty', 'isNotEmpty'],

        maxItemLength: null,

        validations: ['required', 'maxCount'],

        isInversed: false,

        data: function () {
            var itemHtmlList = [];
            (this.selected || []).forEach(function (jsonItem) {
                itemHtmlList.push(this.getItemHtml(jsonItem));
            }, this);
            
            return _.extend({
                selected: this.selected,
                translatedOptions: this.translatedOptions,
                hasOptions: this.params.options ? true : false,
                itemHtmlList: itemHtmlList,
                isEmpty: (this.selected || []).length === 0,
                valueIsSet: this.model.has(this.name),
                maxItemLength: this.maxItemLength,
                allowCustomOptions: this.allowCustomOptions
            }, Dep.prototype.data.call(this));
        },

        getItemHtml: function(jsonItem) {
            // breakdown a given checklist item into its components: label and checkbox value 
            var label = this.escapeValue(jsonItem.label);
            if (this.translatedOptions) {
                if ((label in this.translatedOptions)) {
                    label = this.translatedOptions[label];
                    label = label.toString();
                    label = this.escapeValue(label);
                }
            }     
            var dataName = 'checklistItem-'+this.name+'-'+label;
            var id = 'checklist-item-'+this.name+'-'+label;           
            var isChecked = false;                        
            if( jsonItem.state == "1"){
                isChecked = true;
            }            
            if(this.isInversed){
                isChecked = !isChecked;
            }
            var dataValue = this.escapeValue(JSON.stringify(jsonItem));
            var itemHtml = '<div class="list-group-item" data-value="'+dataValue+'" style="cursor: default;">';
            itemHtml += '<input type="checkbox" data-name="'+dataName+'" id="'+id+'"';
            if(isChecked) {
                itemHtml += ' checked ';
            }
            itemHtml += '> ';
            itemHtml += '<label for="'+id+'" class="checklist-label">'+label+'</label>';
            itemHtml += '<a href="javascript:" class="pull-right" data-value="'+dataValue+'" data-action="removeValue"><span class="fas fa-times"></span></a>';
            itemHtml += '</div>';      
            return itemHtml;            
        },

        addValue: function (label) {
            var isNew = true;
            // convert the label into a JSON object with the default state value of zero
            var jsonItem = {};
            jsonItem.label = label;
            jsonItem.state = "0";
            // see if the jsonItem already exists in the "selected" array of items
            if (this.selected.indexOf(jsonItem) == -1) {
                // if it doesn't exist, try with the other state value
                jsonItem.state = "1";
                if (this.selected.indexOf(jsonItem) !== -1) {
                    isNew = false;
                } else {
                    // reset the state property to its default value
                    jsonItem.state = "0";
                }                
            } else {
                isNew = false; 
            }
            // it it doesn't exist append to the "selected" array and to the list html
            if(isNew) {
                // create the rendering html code
                var html = this.getItemHtml(jsonItem);
                // append the html to the existing list of items
                this.$list.append(html);
                // append the new dynamic checklist item to the "selected" array
                this.selected.push(jsonItem);
                // trigger the "change" event
                this.trigger('change');                
            }
        },

        getValueForDisplay: function () {
            var list = this.selected.map(function (jsonItem) {
                // get the checklist item label
                var label = this.escapeValue(jsonItem.label);
                if (this.translatedOptions) {
                    if ((label in this.translatedOptions)) {
                        label = this.translatedOptions[label];
                        label = label.toString();
                        label = this.escapeValue(label);
                    }
                }     
                if (label === '') {
                    label = this.translate('None');
                }
                var style = this.styleMap[jsonItem.label] || 'default';
                if (this.params.displayAsLabel) {
                    label = '<span class="label label-md label-'+style+'">' + label + '</span>';
                } else {
                    if (style && style != 'default') {
                        label = '<span class="text-'+style+'">' + label + '</span>';
                    }
                }      
                var displayHtml = '';
                // get the option checkbox boolean value and generate its html code
                var dataName = 'checklistItem-'+this.name+'-'+label;
                var id = 'checklist-item-'+this.name+'-'+label;                        
                var isChecked = false;
                if( jsonItem.state == "1"){
                    isChecked = true;
                }            
                if(this.isInversed){
                    isChecked = !isChecked;
                }
                displayHtml += '<input type="checkbox" data-name="'+dataName+'" id="'+id+'"';
                if(isChecked) {
                    displayHtml += ' checked ';
                }
                // prevent the checkbox element from being editable in display mode 
                displayHtml += 'disabled = "disabled"';
                displayHtml += '>';
                displayHtml += ' '+label;               
                return displayHtml;
            }, this);
            if (this.displayAsList) {
                if (!list.length) return '';
                var itemClassName = 'multi-enum-item-container';
                if (this.displayAsLabel) {
                    itemClassName += ' multi-enum-item-label-container';
                }
                return '<div class="'+itemClassName+'">' +
                    list.join('</div><div class="'+itemClassName+'">') + '</div>';
            } else if (this.displayAsLabel) {
                return list.join(' ');
            } else {
                return list.join(', ');
            }
        },

        fetchFromDom: function () {
            var selected = [];
            this.$el.find('.list-group .list-group-item').each(function (i, el) {
                var updatedValue = {};
                // fetch the original data-value
                var existingValue = $(el).data('value');
                var label = existingValue.label;
                // fetch the current boolean value (0 or 1)
                var currentState = $(el).find('input:checkbox:first:checked').length.toString(); 
                // build the current item object
                updatedValue.label = label;
                updatedValue.state = currentState;
                // update the element's data-value attribute
                $(el).attr('data-value', updatedValue);
                // append the 'selected' array
                selected.push(updatedValue);
            });
            this.selected = selected;
        },

        afterRender: function () {
            if (this.mode == 'edit') {
                this.$list = this.$el.find('.list-group');
                var $select = this.$select = this.$el.find('.select');

                if (this.allowCustomOptions) {
                    this.$addButton = this.$el.find('button[data-action="addItem"]');

                    this.$addButton.on('click', function () {
                        var value = this.$select.val().toString();
                        this.addValue(value);
                        $select.val('');
                        this.controlAddItemButton();
                    }.bind(this));

                    $select.on('input', function () {
                        this.controlAddItemButton();
                    }.bind(this));

                    $select.on('keypress', function (e) {
                        if (e.keyCode == 13) {
                            var value = $select.val().toString();
                            if (this.noEmptyString) {
                                if (value == '') {
                                    return;
                                }
                            }
                            this.addValue(value);
                            $select.val('');
                            this.controlAddItemButton();
                        }
                    }.bind(this));

                    this.controlAddItemButton();
                }

                this.$list.sortable({
                    stop: function () {
                        this.fetchFromDom();
                        this.trigger('change');
                    }.bind(this)
                });
                
            }
            
            if (this.mode == 'search') {
                this.renderSearch();
            }
            
            // whenever any checkbox changes, update the item data-value and trigger the change event
            this.$el.find('input:checkbox').on('change', function () {
                this.fetchFromDom();
                this.trigger('change');
            }.bind(this));
               
        }

    });
});
