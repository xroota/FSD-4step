import { View } from './View/View';
import { Model } from './Model/Model';
import { Presenter } from './Presenter/Presenter';
import './jquery.slider.scss';

declare global {
  interface Window {
    $: JQuery;
  }
  interface JQuery {
    slider: (
      opts?: object | string,
      opts2?: object | string,

    ) => JQuery<Element> | string | number | number[] | boolean;

  }
}

// jquery plugin wrapper.
(function initialization(w: Window, $: JQueryStatic) {
  if (!$) return false;
  const $plugin = $;
  $plugin.fn.slider = function plugin(
    opts: object | string,
    opts2?: {property?:string;value?:number | number[] | string},
  ) {
    const methods = {
      init(element: JQuery, options: object): void {
        this.model = new Model(options);
        const view = new View(element, ({ ...options, ...this.model.modelData }));
        const presenter = new Presenter(this.model, view, (opts2 as string));
        $(this).data('slider', presenter);
      },

      update(element: JQuery, options: {property?:string;value?:number | number[] | string}): void {
        const slider = $(this).data('slider');
        slider.setProperty(options.property, options.value);
      },
      getProperty(
        element: JQuery,
        options: {property?:string},
      ): number[] | number | string | boolean {
        const slider = $(this).data('slider');

        return slider.getProperty(options.property);
      },

      destroy(): void {
        let slider = $(this).data('slider');
        slider.destroy();
        slider = null;
        $(this).data('slider', null);
      },

    };
    if (methods[opts as string]) {
      return methods[opts as string].call(this, opts, opts2);
    }
    return this.each(function func() {
      const o = opts;
      const obj = $(this);
      methods.init.call(this, obj, (o as object), opts2);
    });
  };
  return true;
}(window, jQuery));
