interface ViewOptions {
    animate: boolean,
    classes: object,
    distance: number,
    max: number,
    min: number,
    orientation: string,
    range: boolean,
    step: number,
    value: number,
    values: Array<number>,

    // Callbacks
    change: object,
    slide: object,
    start: object,
    stop: object
}

class View {
    public options: ViewOptions = {
        animate: false,
        classes: {
            "ui-slider": "ui-corner-all",
            "ui-slider-handle": "ui-corner-all",

            // Note: ui-widget-header isn't the most fittingly semantic framework class for this
            // element, but worked best visually with a variety of themes
            "ui-slider-range": "ui-corner-all ui-widget-header"
        },
        distance: 0,
        max: 100,
        min: 0,
        orientation: "horizontal",
        range: false,
        step: 1,
        value: 0,
        values: null,

        // Callbacks
        change: null,
        slide: null,
        start: null,
        stop: null
    }

    public show(msg: string) {
        $('<div/>').appendTo($("body"));
        $('<div/>').appendTo($("div"));
        //$(msg).appendTo($("body"));
    }

} 

export {View};