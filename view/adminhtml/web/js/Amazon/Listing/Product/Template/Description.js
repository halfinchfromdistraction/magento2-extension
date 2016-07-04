define([
    'Magento_Ui/js/modal/modal',
    'M2ePro/Plugin/Messages',
    'M2ePro/Action'
], function (modal, MessageObj) {

    window.AmazonListingProductTemplateDescription = Class.create(Action, {

        // ---------------------------------------

        initialize: function ($super, gridHandler) {
            var self = this;

            $super(gridHandler);

        },

        // ---------------------------------------

        options: {},

        setOptions: function (options) {
            this.options = Object.extend(this.options, options);
            return this;
        },

        // ---------------------------------------

        mapToTemplateDescription: function (el, templateId, mapToGeneralId) {
            var self = this;

            if (!confirm(M2ePro.translator.translate('Are you sure?'))) {
                return;
            }

            new Ajax.Request(M2ePro.url.get('amazon_listing_product_template_description/mapToTemplateDescription'), {
                method: 'post',
                parameters: {
                    products_ids: self.templateDescriptionPopup.productsIds,
                    template_id: templateId
                },
                onSuccess: function (transport) {

                    if (!transport.responseText.isJSON()) {
                        alert(transport.responseText);
                        return;
                    }

                    var response = transport.responseText.evalJSON();

                    if (mapToGeneralId) {
                        ListingGridHandlerObj.productSearchHandler.addNewGeneralId(response.products_ids);
                    } else {
                        self.gridHandler.unselectAllAndReload();

                        if (response.messages.length > 0) {
                            MessageObj.clear();
                            response.messages.each(function (msg) {
                                MessageObj['add' + response.type[0].toUpperCase() + response.type.slice(1) + 'Message'](msg);
                            });
                        }
                    }
                }
            });

            self.templateDescriptionPopup.modal('closeModal');
        },

        // ---------------------------------------
        unassignFromTemplateDescrition: function (productsIds) {
            var self = this;

            new Ajax.Request(M2ePro.url.get('amazon_listing_product_template_description/unmapFromTemplateDescription'), {
                method: 'post',
                parameters: {
                    products_ids: productsIds
                },
                onSuccess: function (transport) {

                    if (!transport.responseText.isJSON()) {
                        alert(transport.responseText);
                        return;
                    }

                    self.gridHandler.unselectAllAndReload();

                    var response = transport.responseText.evalJSON();

                    MessageObj.clear();
                    response.messages.each(function (msg) {
                        MessageObj['add' + msg.type[0].toUpperCase() + msg.type.slice(1) + 'Message'](msg.text);
                    });
                }
            });
        },

        // ---------------------------------------

        validateProductsForTemplateDescriptionAssign: function (productsIds) {
            var self = this;
            self.flagSuccess = false;

            productsIds = productsIds || ListingGridHandlerObj.productSearchHandler.params.productId;

            new Ajax.Request(M2ePro.url.get('amazon_listing_product_template_description/validateProductsForTemplateDescriptionAssign'), {
                method: 'post',
                parameters: {
                    products_ids: productsIds
                },
                onSuccess: function (transport) {

                    if (!transport.responseText.isJSON()) {
                        alert(transport.responseText);
                        return;
                    }

                    var response = transport.responseText.evalJSON();

                    if (response.messages.length > 0) {
                        MessageObj.clear();
                        response.messages.each(function (msg) {
                            MessageObj['add' + msg.type[0].toUpperCase() + msg.type.slice(1) + 'Message'](msg.text);
                        });
                    }

                    if (!response.html) {
                        return;
                    }

                    if (typeof popUp != 'undefined') {
                        self.templateDescriptionPopup.modal('closeModal');
                    }

                    self.openPopUp(0, M2ePro.translator.translate('templateDescriptionPopupTitle'), response.products_ids, response.html);
                }
            });
        },

        // ---------------------------------------

        openPopUp: function (mode, title, productsIds, contentData, checkIsNewAsinAccepted) {
            var self = this;
            self.gridHandler.unselectAll();

            MessageObj.clear();

            if (!$('template_description_pop_up_content')) {
                $('html-body').insert({bottom: contentData});
            }

            self.templateDescriptionPopup = jQuery('#template_description_pop_up_content');

            modal({
                title: title,
                type: 'slide',
                buttons: [{
                    text: M2ePro.translator.translate('Add New Description Policy'),
                    class: 'action primary ',
                    click: function () {
                        self.createTemplateDescriptionInNewTab(M2ePro.url.get('newTemplateDescriptionUrl'));
                    }
                }]
            }, self.templateDescriptionPopup);

            self.templateDescriptionPopup.modal('openModal');

            self.templateDescriptionPopup.productsIds = productsIds;
            self.templateDescriptionPopup.checkIsNewAsinAccepted = checkIsNewAsinAccepted || 0;

            self.loadTemplateDescriptionGrid();
        },

        loadTemplateDescriptionGrid: function () {
            var self = this;

            new Ajax.Request(M2ePro.url.get('amazon_listing_product_template_description/viewTemplateDescriptionsGrid'), {
                method: 'post',
                parameters: {
                    products_ids: self.templateDescriptionPopup.productsIds,
                    check_is_new_asin_accepted: self.templateDescriptionPopup.checkIsNewAsinAccepted
                },
                onSuccess: function (transport) {
                    $('template_description_grid').update(transport.responseText);
                    $('template_description_grid').show();
                }
            });
        },

        // ---------------------------------------

        createTemplateDescriptionInNewTab: function (stepWindowUrl) {
            var self = this;
            var win = window.open(stepWindowUrl);

            var intervalId = setInterval(function () {
                if (!win.closed) {
                    return;
                }

                clearInterval(intervalId);

                amazonTemplateDescriptionGridJsObject.reload();
            }, 1000);
        }

        // ---------------------------------------
    });

});