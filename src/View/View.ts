/*!
 *
 * Rangeable
 * Copyright (c) 2018 Karl Saunders
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 0.0.1
 *
 */

import { EventObserver } from '../EventObserver/EventObserver';


const SLIDER_CLASSES = {
    input: "slider__input",
    container: "slider__container",
    vertical: "slider--vertical",
    progress: "slider__progress",
    handle: "slider__handle",
    tooltip: "slider__tooltip",
    track: "slider__track",
    multiple: "slider--multiple",
    handleDragging: "slider__handle--dragging",
    handleActive: "slider__handle--active",
    showTooltip: "slider--show-tooltip",
    hasTooltip: "slider--has-tooltip",
    combinedTooltip: "slider--combined-tooltip",

}

interface ElementWithIndex extends JQuery {
    indexElement?: number;
}



interface ElementInput extends JQuery {
    ranger?: object,
    defaultValue?: number,
    value?: number,
    values?: number[],
    min?: number,
    max?: number,
    step?: number,
    form?: Element,
    type?: string
}

class ViewConfig {
    min: number;
    max: number;
    step: number;
    value?: number[];
    defaultValue?: number[];
    tooltip?: boolean;
    vertical?: boolean;
    multiple?: boolean;
    showTooltips?: boolean;
    color1?: string;
    color2?: string;

}

class View {

    eventObserver = new EventObserver();
    slider: ElementInput;
    input: ElementInput;
    config: ViewConfig;
    mouseAxis: { x: string, y: string };
    trackSize: { x: string, y: string };
    trackPos: { x: string, y: string };;
    nodes: {
        container: JQuery
        track: JQuery,
        progress: JQuery,
        handle: ElementWithIndex | ElementWithIndex[],
        tooltip: JQuery | JQuery[]
    };
    rects: {
        container: ClientRect,
        handle: ClientRect[] | ClientRect
    };
    axis: string;
    activeHandle: ElementWithIndex | boolean;
    listeners: {
        down: EventListener,
        move: EventListener,
        up: EventListener,
        update: EventListener,
        change: EventListener,
        reset: EventListener,
        scroll?: EventListener,
        resize?: EventListener,
    };
    accuracy: number;


    constructor(element?: ElementInput, config?: ViewConfig) {
        const defaultConfig = {
            tooltip: true,
            showTooltips: true,
            multiple: false,
            color1: "#3db13d",
            color2: "#ccc",
        };
        const defaultData = { min: 0, max: 100, step: 1, value: [50] };

        // user has passed a CSS3 selector string
        this.slider = $(element);
        this.input = $("<input/>");
        $(this.input).addClass(SLIDER_CLASSES.input)
            .attr("type", "range");
        $(this.slider).append(this.input);

        this.config = Object.assign({}, defaultConfig, defaultData, config);

        if (!this.config.defaultValue) {
            this.config.defaultValue = this.config.value;
        }
        for (let prop in defaultData) {
            // prop set in config
            if (this.config[prop] !== undefined) {
                this.input.attr(prop, this.config[prop]);
            }
        }

        this.mouseAxis = { x: "clientX", y: "clientY" };
        this.trackSize = { x: "width", y: "height" };
        this.trackPos = { x: "left", y: "top" };

        this.render();

    }



	/**
	 * Render the instance
	 * @return {Void}
	 */
    render(): void {
        this.axis = !this.config.vertical ? "x" : "y";

        this.input.ranger = this;

        const container = $("<div/>").addClass(SLIDER_CLASSES.container);
        const track = $("<div/>").addClass(SLIDER_CLASSES.track);
        const progress = $("<div/>").addClass(SLIDER_CLASSES.progress);

        let handle: ElementWithIndex | ElementWithIndex[] = $("<div/>").addClass(SLIDER_CLASSES.handle);
        let tooltip: JQuery | JQuery[] = $("<div/>").addClass(SLIDER_CLASSES.tooltip);


        $(track).append(progress);

        if (this.config.multiple) {
            handle = [$("<div/>").addClass(SLIDER_CLASSES.handle), $("<div/>").addClass(SLIDER_CLASSES.handle)];
            tooltip = [
                $("<div/>").addClass(SLIDER_CLASSES.tooltip),
                $("<div/>").addClass(SLIDER_CLASSES.tooltip),
                $("<div/>").addClass(SLIDER_CLASSES.tooltip)
            ];

            handle.forEach((node, i) => {
                node.indexElement = i;
                $(progress).append(node);
                $(node).append(tooltip[i]);
            });

            if (this.config.vertical) {
                $(progress).append(handle[0]);
            }

            $(progress).append(tooltip[2]);

            $(container).addClass(SLIDER_CLASSES.multiple);
        } else {
            $(progress).append(handle);
            $(handle).append(tooltip);
        }

        this.nodes = { container, track, progress, handle, tooltip };

        $(container).append(track);

        if (this.config.vertical) {
            $(container).addClass(SLIDER_CLASSES.vertical);
        }

        if (this.config.tooltip) {
            $(container).addClass(SLIDER_CLASSES.hasTooltip);
        }

        if (this.config.showTooltips) {
            $(container).addClass(SLIDER_CLASSES.showTooltip);
        }

        if (this.config.color1) {
            document.body.style.setProperty("--primary", this.config["color1"]);
        }
        if (this.config.color2) {
            document.body.style.setProperty("--secondary", this.config["color2"]);
        }

        $(this.slider).append(container);
        $(this.input).insertBefore($(track))
        $(this.input).addClass(SLIDER_CLASSES.input)
        this.bind();

        this.update();
    }

    reset(): void {
        this.setValue(this.config.defaultValue[0], 0);
        if (this.config.multiple) {
            this.setValue(this.config.defaultValue[1], 1);
        }
    }

    setValueFromPosition(e: Event) {
        const min = parseFloat(this.config.min.toString());
        const max = parseFloat(this.config.max.toString());
        const step = parseFloat(this.config.step.toString());
        const rect = this.rects;
        const axis = e[this.mouseAxis[this.axis]];
        const pos = axis - this.rects.container[this.trackPos[this.axis]];
        const size = rect.container[this.trackSize[this.axis]];

        // get the position of the cursor over the bar as a percentage
        let position = this.config.vertical
            ? (size - pos) / size * 100
            : pos / size * 100;

        // work out the value from the position
        let value: number  = position * (max - min) / 100 + min;

        // apply granularity (step)
        value = Math.ceil(value / step) * step;

        let index: number = 0;

        if (this.config.multiple) {
            index = (this.activeHandle as ElementWithIndex).indexElement;

            switch (index) {
                case 0:
                    if (value >= this.config.value[1]) {
                        value = this.config.value[1];
                    }
                    break;
                case 1:
                    if (value <= this.config.value[0]) {
                        value = this.config.value[0];
                    }
                    break;
            }
        }

        // Only update the value if it's different.
        // This allows the onChange event to be fired only on a step
        // and not all the time.
        if (e.type === "mousedown" || parseFloat(value.toString()) !== parseFloat(this.config.value.toString())) {
            this.setValue(value, Number(index));
        }
    }

    change(): void {

        $(this.input).attr("value", this.config.value[0]);
        this.eventObserver.notifyObservers({ message: "valueChange", value: this.config.value });
    }



	/**
	 * Mousesown 
	 * @param  {Object} e
	 * @return {Void}
	 */
    down(e: MouseEvent): void {
        e.preventDefault();
        // show the tip now so we can get the dimensions later
        $(this.nodes.container).addClass(SLIDER_CLASSES.handleDragging);

        this.recalculate();

        (this.activeHandle as ElementWithIndex) = this.getHandle(e);

        $(this.activeHandle as ElementWithIndex).addClass(SLIDER_CLASSES.handleActive);

        this.setValueFromPosition(e);

        document.addEventListener("mousemove", this.listeners.move, false);
        document.addEventListener("mouseup", this.listeners.up, false);


    }

	/**
	 * Mousemove 
	 * @param  {Object} e
	 * @return {Void}
	 */
    move(e: Event): void {
        this.setValueFromPosition(e);

        $(this.input).trigger("input");
    }

	/**
	 * Mouseup 
	 * @param  {Object} e
	 * @return {Void}
	 */
    up(): void {
        $(this.nodes.container).removeClass(SLIDER_CLASSES.handleDragging);



        $(this.activeHandle as ElementWithIndex).removeClass(SLIDER_CLASSES.handleActive);
        this.activeHandle = false;

        document.removeEventListener("mousemove", this.listeners.move);
        document.removeEventListener("mouseup", this.listeners.up);

        $(this.input).trigger("change");
    }

	/**
	 * Recache the dimensions
	 * @return {Void}
	 */
    recalculate(): void {
        let handle: ClientRect[] | ClientRect = [];
        if (this.config.multiple && Array.isArray(this.nodes.handle)) {
            (this.nodes.handle as ElementWithIndex[]).forEach((node, i) => {
                handle[i] = $(node)[0].getBoundingClientRect();
            });
        } else {

            handle = $(this.nodes.handle as ElementWithIndex)[0].getBoundingClientRect()
        }

        this.rects = {
            handle: handle,
            container: $(this.nodes.container)[0].getBoundingClientRect()
        };
    }

	/**
	 * Update the instance
	 * @return {Void}
	 */
    update(): void {
        this.recalculate();

        this.accuracy = 0;

        // detect float
        if (this.config.step.toString().includes(".")) {
            this.accuracy = (this.config.step.toString().split('.')[1] || []).length;
        }

        if (this.config.multiple) {
            this.config.value.forEach((val, i) => {
                this.setValue(val, i);
            });
        } else {
            this.setValue();
        }
    }

	/**
	 * Set the input value
	 * @param {Number} value
	 * @param {Number} index
	 */
    setValue(value?: number | string, index?: number): boolean {
        //const rects = this.rects;
        const nodes = this.nodes;
        const min = parseFloat(this.config.min.toString());
        const max = parseFloat(this.config.max.toString());
        let handle: ElementWithIndex | ElementWithIndex[] = nodes.handle;

        if (this.config.multiple && index === undefined) {
            return false;
        }

        if (value === undefined) {
            value = this.config.value[0];
        }

        value = parseFloat(value.toString());

        value = value.toFixed(this.accuracy);

        if (Number(value) < min) {
            value = min.toFixed(this.accuracy);
        } else if (Number(value) > max) {
            value = max.toFixed(this.accuracy);
        }

        // update the value
        if (this.config.multiple) {
            this.config.value[index] = Number(value);
            const values = this.config.value;
            values[index] = Number(value);

            if (this.config.tooltip) {
                // update the node so we can get the width / height
                $(nodes.tooltip[index]).text(value);

                // check if tips are intersecting...
                const intersecting = this.tipsIntersecting();

                // ... and set the className where appropriate
                $(nodes.container).toggleClass(SLIDER_CLASSES.combinedTooltip, intersecting);

                if (intersecting) {
                    // Format the combined tooltip.
                    // Only show single value if they both match, otherwise show both seperated by a hyphen
                    $(nodes.tooltip[2]).text(values[0] === values[1] ? values[0] : `${values[0]} - ${values[1]}`);
                }
            }
        } else {
            this.config.value = [Number(value)];
            $(nodes.tooltip).text(value);
        }

        // set bar size
        this.setPosition();

    }

	/**
	 * Set the bar size / position based on the value
	 * @param {Number} value
	 */
    setPosition(): void {
        let width: number;

        if (this.config.multiple) {
            let start = this.getPosition(this.config.value[0]);
            let end = this.getPosition(this.config.value[1]);

            // set the start point of the bar
            $(this.nodes.progress).css(this.config.vertical ? "bottom" : "left", `${start}px`);

            width = end - start;
        } else {
            width = this.getPosition();
        }

        // set the end point of the bar
        $(this.nodes.progress).css(this.trackSize[this.axis], `${width}px`);
    }

	/**
	 * Get the position of handle from the value
	 * @param  {Number} value The val to calculate the handle position
	 * @return {Number}
	 */
    getPosition(value: number = this.config.value[0]): number {
        const min = parseFloat(this.config.min.toString());
        const max = parseFloat(this.config.max.toString());

        return (value - min) / (max - min) * this.rects.container[this.trackSize[this.axis]];
    }

	/**
	 * Check whether the tooltips are colliding
	 * @return {Boolean}
	 */
    tipsIntersecting(): boolean {
        const nodes = this.nodes.tooltip;
        const a = $(nodes[0])[0].getBoundingClientRect();
        const b = $(nodes[1])[0].getBoundingClientRect();

        return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
    }

	/**
	 * Get the correct handle on mousedown
	 * @param  {Object} e Event
	 * @return {Obejct} HTMLElement
	 */
    getHandle(e: MouseEvent): ElementWithIndex {
        if (!this.config.multiple) {
            return (this.nodes.handle as ElementWithIndex);
        }

        const r = this.rects;
        const distA = Math.abs(e[this.mouseAxis[this.axis]] - r.handle[0][this.trackPos[this.axis]]);
        const distB = Math.abs(e[this.mouseAxis[this.axis]] - r.handle[1][this.trackPos[this.axis]]);
        const handle = $(e.target).closest(`.${SLIDER_CLASSES.handle}`);

        if (distA > distB) {
            return (this.nodes.handle[1] as ElementWithIndex);
        } else {
            return (this.nodes.handle[0] as ElementWithIndex);
        }
    }

	/**
	 * Destroy the instance
	 * @return {Void}
	 */
    destroy(): void {
        if (this.input.ranger) {
            // remove all event listeners
            this.unbind();
            // remove the className from the input
            $(this.input).removeClass(SLIDER_CLASSES.input);

            $(this.nodes.container).remove();
            // remove the reference from the input
            delete (this.input.ranger);
        }
    }





    bind(): void {
        this.listeners = {
            down: this.down.bind(this),
            move: this.move.bind(this),
            up: this.up.bind(this),
            update: this.update.bind(this),
            change: this.change.bind(this),
            reset: this.reset.bind(this)
        };

        this.listeners.scroll = this.throttle(this.listeners.update, 100);
        this.listeners.resize = this.throttle(this.listeners.update, 50);

        // throttle the scroll callback for performance
        document.addEventListener("scroll", this.listeners.scroll, false);

        // throttle the resize callback for performance
        window.addEventListener("resize", this.listeners.resize, false);

        // detect native change event
        $(this.input).on("change", this.listeners.change);

        //this.input.addEventListener("change", this.listeners.change, false);

        $(this.nodes.container).on("mousedown", this.listeners.down);


        // detect form reset
        if (this.input.form) {
            this.input.form.addEventListener("reset", this.listeners.reset, false);
        }
    }

    unbind(): void {


        $(this.nodes.container).off("mousedown", "*");


        // remove scroll listener
        document.removeEventListener("scroll", this.listeners.scroll);

        // remove resize listener
        window.removeEventListener("resize", this.listeners.resize);

        // remove input listener
        $(this.input).off("change", "*");

        // remove form listener
        if (this.input.form) {
            this.input.form.removeEventListener("reset", this.listeners.reset);
        }

        this.listeners = null;
    }


    // throttler
    throttle(fn?: EventListener, limit?: number, context?: object) {
        let wait: boolean;
        return function () {
            context = context || this;
            if (!wait) {
                fn.apply(context, arguments);
                wait = true;
                return setTimeout(function () {
                    wait = false;
                }, limit);
            }
        };
    }

    setProperty(property: string, val: string | number | boolean | number[]): void {
        if (this.config.hasOwnProperty(property)) {


            if (property !== "tooltip") {
                this.input[property] = val;
                $(this.input).attr(property, val.toString());

            } else {
                if (typeof val === "boolean") {
                    (this.nodes.container).toggleClass(SLIDER_CLASSES.hasTooltip, val);
                }
            }

            if (property === "showTooltips" && typeof val === "boolean") {
                $(this.nodes.container).toggleClass(SLIDER_CLASSES.showTooltip, val);
            }

            this.config[property] = val;


            if (property === "step") {
                this.setValue();
            }

            if (property === "vertical" || property === "multiple") {
                this.destroy();
                setTimeout(() => {
                    this.render();

                }, 10);
            } else {
                this.update();
            }
        }
    }

    getProperty(prop: string): number[] | number | string | boolean {
        return this.config[prop];
    }

}


export { View, ViewConfig };
