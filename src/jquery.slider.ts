import { View, ViewConfig } from './View/View';
import { Model, ModelData } from './Model/Model';
import { Presenter } from './Presenter/Presenter';
import './jquery.slider.scss';

declare global {
    interface Window {
        $: JQuery;
    }
    interface JQuery {
        slider: (
            opts?: object | string,
            opts2?: string
        ) => JQuery<Element> | string | number | number[] | boolean;

    }
}

//jquery plugin wrapper.
(function (w, $) {
    if (!$) return false;

    $.fn.slider = function (opts, opts2?) {


        let methods = {
            init: function (element: JQuery, options: object, outputElement?: string) {

                let modelConfig = new ModelData();
                let viewConfig = new ViewConfig();

                for (let key in options) {
                    if (key in modelConfig) {
                        modelConfig[key] = options[key];
                    }
                    else viewConfig[key] = options[key];
                }

                this.model = new Model(modelConfig);

                let view = new View(element, Object.assign({}, this.model.modelData, viewConfig));
                let presenter = new Presenter(this.model, view, opts2);
                var $this = $(this);
                $(this).data('slider', presenter);

            },

            update: function (element: JQuery, options: object, options2?: string) {

                let $this = $(this),
                    data = $this.data('slider');

                let slider = $(this).data('slider');
                slider.setProperty(opts2["property"], opts2["value"]);

            },
            getProperty: function (element: JQuery, options: object, options2?: string) {
                let $this = $(this),
                    data = $this.data('slider');

                let slider = $(this).data('slider');

                return slider.getProperty(opts2["property"]);
            }

        };
        if (methods[opts as string]) {
            
            return methods[opts as string].call(this, opts, opts2)

        }
        else

            return this.each(function () {
                let o = opts;
                let obj = $(this);
                methods.init.call(this, obj, (o as object), opts2);

            });
    }
        ;
})(window, jQuery);