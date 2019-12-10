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

interface HTMLElementWithIndex extends HTMLElement {
    index?: number;
}

interface ElementInput extends Element {
    ranger? ,defaultValue?,value?,values?, min?,max?,step?,form?
}

interface ViewConfig {
    min: number;
    max: number;
    step: number;
    value?: Array<number>;
    tooltip: boolean;
    vertical: boolean;
    multiple: boolean;
    showTooltips: boolean;
    color1: string;
    color2: string;
    classes?: {
        input: string,
        container: string,
        vertical: string,
        progress: string,
        handle: string,
        tooltip: string,
        track: string,
        multiple: string,

    }
    size?: number;

}

class View {

    eventObserver = new EventObserver();
    input :  ElementInput;
    config: ViewConfig;
    mouseAxis: { x: string, y: string };
    trackSize: { x: string, y: string };
    trackPos: { x: string, y: string };;
    nodes: {
        container: HTMLElement,
        track: HTMLElement,
        progress: HTMLElement,
        handle: HTMLElementWithIndex | [HTMLElementWithIndex, HTMLElementWithIndex],
        tooltip: HTMLElement | [HTMLElement, HTMLElement, HTMLElement]
    };
    rects: {
        container: ClientRect,
        handle: Array<ClientRect> | ClientRect
    };
    axis: string;
    activeHandle: HTMLElementWithIndex | boolean;
    listeners: {
        down: EventListenerOrEventListenerObject,
        move: EventListenerOrEventListenerObject,
        up: EventListenerOrEventListenerObject,
        update: EventListenerOrEventListenerObject,
        change: EventListenerOrEventListenerObject,
        reset: EventListenerOrEventListenerObject,
        scroll?: EventListenerOrEventListenerObject,
        resize?: EventListenerOrEventListenerObject,
    };
    accuracy: number;


    constructor(input?: string | Element, config?: ViewConfig) {
        const defaultConfig = {
            tooltip: true,
            showTooltips: true,
            multiple: false,
            classes: {
                input: "ranger-input",
                container: "ranger-container",
                vertical: "ranger-vertical",
                progress: "ranger-progress",
                handle: "ranger-handle",
                tooltip: "ranger-tooltip",
                track: "ranger-track",
                multiple: "ranger-multiple",
            }
        };

        // user has passed a CSS3 selector string
        if (typeof input === "string") {
            input = document.querySelector(input);
        }

        this.input = input;
        this.config = Object.assign({}, defaultConfig, config);

        this.mouseAxis = { x: "clientX", y: "clientY" };
        this.trackSize = { x: "width", y: "height" };
        this.trackPos = { x: "left", y: "top" };

        this.init();


    }

	/**
	 * Initialise the instance
	 * @return {Void}
	 */
    init(): void {
        let max: number = this.input.max;
        if (!this.input.ranger) {
            const props = { min: 0, max: 100, step: 1, value: this.input.value };

            for (let prop in props) {
                // prop is missing, so add it
                if (!this.input[prop]) {
                    this.input[prop] = props[prop];
                }

                // prop set in config
                if (this.config[prop] !== undefined) {
                    this.input[prop] = this.config[prop];
                }
            }

            if (!this.input.defaultValue) {
                this.input.defaultValue = this.input.value;
            }

            this.axis = !this.config.vertical ? "x" : "y";

            this.input.ranger = this;

            if (this.config.multiple) {
                this.input.values = [];

                if (this.config.value) {
                    this.input.values = this.config.value;
                }
            }

            this.render();
        }
    }

	/**
	 * Render the instance
	 * @return {Void}
	 */
    render(): void {
        const o = this.config;
        const c = o.classes;

        const container = this.createElement("div", c.container);
        const track = this.createElement("div", c.track);
        const progress = this.createElement("div", c.progress);

        let handle: [HTMLElementWithIndex, HTMLElementWithIndex] | HTMLElementWithIndex = this.createElement("div", c.handle);
        let tooltip: [HTMLElement, HTMLElement, HTMLElement] | HTMLElement = this.createElement("div", c.tooltip);

        track.appendChild(progress);

        if (o.multiple) {
            handle = [this.createElement("div", c.handle), this.createElement("div", c.handle)];
            tooltip = [
                this.createElement("div", c.tooltip),
                this.createElement("div", c.tooltip),
                this.createElement("div", c.tooltip)
            ];

            handle.forEach((node, i) => {
                node.index = i;
                progress.appendChild(node);
                node.appendChild(tooltip[i]);
            });

            if (o.vertical) {
                progress.appendChild(handle[0]);
            }

            progress.appendChild(tooltip[2]);

            container.classList.add(c.multiple);
        } else {
            progress.appendChild(handle);
            handle.appendChild(tooltip);
        }

        this.nodes = { container, track, progress, handle, tooltip };

        container.appendChild(track);

        if (o.vertical) {
            container.classList.add(c.vertical);
        }

        if (o.size) {
            container.style[this.trackSize[this.axis]] = !isNaN(o.size)
                ? `${o.size}px`
                : o.size.toString();
        }

        if (o.tooltip) {
            container.classList.add("has-tooltip");
        }

        if (o.showTooltips) {
            container.classList.add("show-tooltip");
        }

        this.input.parentNode.insertBefore(container, this.input);
        container.insertBefore(this.input, track);

        this.input.classList.add(c.input);

        this.bind();

        this.update();
    }

    reset(): void {
        this.setValue(this.input.defaultValue);

    }

    setValueFromPosition(e: Event) {
        const min = parseFloat(this.input.min);
        const max = parseFloat(this.input.max);
        const step = parseFloat(this.input.step);
        const rect = this.rects;
        const axis = e[this.mouseAxis[this.axis]];
        const pos = axis - this.rects.container[this.trackPos[this.axis]];
        const size = rect.container[this.trackSize[this.axis]];

        // get the position of the cursor over the bar as a percentage
        let position = this.config.vertical
            ? (size - pos) / size * 100
            : pos / size * 100;

        // work out the value from the position
        let value: any = position * (max - min) / 100 + min;

        // apply granularity (step)
        value = Math.ceil(value / step) * step;

        let index: number | boolean = false;

        if (this.config.multiple && typeof this.activeHandle !== "boolean") {
            index = this.activeHandle.index;

            switch (index) {
                case 0:
                    if (value >= this.input.values[1]) {
                        value = this.input.values[1];
                    }
                    break;
                case 1:
                    if (value <= this.input.values[0]) {
                        value = this.input.values[0];
                    }
                    break;
            }
        }

        // Only update the value if it's different.
        // This allows the onChange event to be fired only on a step
        // and not all the time.
        if (e.type === "mousedown" || parseFloat(value) !== parseFloat(this.input.value)) {
            this.setValue(value, Number(index));
        }
    }

    change(): void {
        //this.onChange()
        if (!this.config.multiple) this.input.values = [this.input.value];
        this.eventObserver.notifyObservers({ message: "valueChange", value: this.input.values });


    }



	/**
	 * Mousesown 
	 * @param  {Object} e
	 * @return {Void}
	 */
    down(e: Event): void {
        e.preventDefault();
        // show the tip now so we can get the dimensions later
        this.nodes.container.classList.add("dragging");

        this.recalculate();

        if (!Array.isArray(this.getHandle(e))) {
            this.activeHandle = this.getHandle(e);
        }
        if (typeof this.activeHandle !== "boolean")
            this.activeHandle.classList.add('active');

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

        this.input.dispatchEvent(new Event("input"));
    }

	/**
	 * Mouseup 
	 * @param  {Object} e
	 * @return {Void}
	 */
    up(e: Event): void {
        this.nodes.container.classList.remove("dragging");


        if (typeof this.activeHandle !== "boolean")
            this.activeHandle.classList.remove('active');
        this.activeHandle = false;

        document.removeEventListener("mousemove", this.listeners.move);
        document.removeEventListener("mouseup", this.listeners.up);


        this.input.dispatchEvent(new Event("change"));
    }

	/**
	 * Recache the dimensions
	 * @return {Void}
	 */
    recalculate(): void {
        let handle: Array<ClientRect> | ClientRect = [];

        if (this.config.multiple) {
            if (Array.isArray(this.nodes.handle))
                this.nodes.handle.forEach((node, i) => {
                    handle[i] = node.getBoundingClientRect();
                });
        } else {
            if (!Array.isArray(this.nodes.handle))
                handle = this.nodes.handle.getBoundingClientRect()
        }

        this.rects = {
            handle: handle,
            container: this.nodes.container.getBoundingClientRect()
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
        if (this.input.step.includes(".")) {
            this.accuracy = (this.input.step.split('.')[1] || []).length;
        }

        if (this.config.multiple) {
            this.input.values.forEach((val, i) => {
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
        const min = parseFloat(this.input.min);
        const max = parseFloat(this.input.max);
        let handle = nodes.handle;

        if (this.config.multiple && index === undefined) {
            return false;
        }


        if (this.config.multiple) {
            handle = this.activeHandle ? this.activeHandle : nodes.handle[index];

        }

        if (value === undefined) {
            value = this.input.value;
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
            const values = this.input.values;
            values[index] = value;

            if (this.config.tooltip) {
                // update the node so we can get the width / height
                nodes.tooltip[index].textContent = value;

                // check if tips are intersecting...
                const intersecting = this.tipsIntersecting();

                // ... and set the className where appropriate
                nodes.container.classList.toggle("combined-tooltip", intersecting);

                if (intersecting) {
                    // Format the combined tooltip.
                    // Only show single value if they both match, otherwise show both seperated by a hyphen
                    nodes.tooltip[2].textContent = values[0] === values[1] ? values[0] : `${values[0]} - ${values[1]}`;
                }
            }
        } else {
            this.input.value = value;
            if (!Array.isArray(nodes.tooltip))
                nodes.tooltip.textContent = value;
        }

        // set bar size
        this.setPosition(Number(value), index);
        //this.setPosition(value, index);

        this.onChange();
    }

	/**
	 * Set the bar size / position based on the value
	 * @param {Number} value
	 */
    setPosition(value: number, index: number): void {
        let width:number;

        if (this.config.multiple) {
            let start = this.getPosition(this.input.values[0]);
            let end = this.getPosition(this.input.values[1]);

            // set the start point of the bar
            this.nodes.progress.style[this.config.vertical ? "bottom" : "left"] = `${start}px`;

            width = end - start;
        } else {
            width = this.getPosition();
        }

        // set the end point of the bar
        this.nodes.progress.style[this.trackSize[this.axis]] = `${width}px`;
    }

	/**
	 * Get the position of handle from the value
	 * @param  {Number} value The val to calculate the handle position
	 * @return {Number}
	 */
    getPosition(value: number = this.input.value): number {
        const min = parseFloat(this.input.min);
        const max = parseFloat(this.input.max);

        return (value - min) / (max - min) * this.rects.container[this.trackSize[this.axis]];
    }

	/**
	 * Check whether the tooltips are colliding
	 * @return {Boolean}
	 */
    tipsIntersecting(): boolean {
        const nodes = this.nodes.tooltip;
        const a = nodes[0].getBoundingClientRect();
        const b = nodes[1].getBoundingClientRect();

        return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
    }

	/**
	 * Get the correct handle on mousedown
	 * @param  {Object} e Event
	 * @return {Obejct} HTMLElement
	 */
    getHandle(e: any): HTMLElementWithIndex {
        if (!this.config.multiple && !Array.isArray(this.nodes.handle)) {
            return this.nodes.handle;
        }

        const r = this.rects;
        const distA = Math.abs(e[this.mouseAxis[this.axis]] - r.handle[0][this.trackPos[this.axis]]);
        const distB = Math.abs(e[this.mouseAxis[this.axis]] - r.handle[1][this.trackPos[this.axis]]);
        const handle = e.target.closest(`.${this.config.classes.handle}`);

        if (handle) {
            return handle;
        } else {
            if (distA > distB) {
                return this.nodes.handle[1];
            } else {
                return this.nodes.handle[0];
            }
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
            this.input.classList.remove(this.config.classes.input);

            // kill all nodes
            this.nodes.container.parentNode.replaceChild(this.input, this.nodes.container);

            // remove the reference from the input
            delete (this.input.ranger);
        }
    }



    onChange(): void {
        //if (this.isFunction(this.config.onChange)) {
        //    this.config.onChange.call(this, this.input.value);
        //this.eventObserver.notifyObservers("changeData");
        // }

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
        this.input.addEventListener("change", this.listeners.change, false);

        this.nodes.container.addEventListener("mousedown", this.listeners.down);


        // detect form reset
        if (this.input.form) {
            this.input.form.addEventListener("reset", this.listeners.reset, false);
        }
    }

    unbind(): void {


        this.nodes.container.removeEventListener("mousedown", this.listeners.down);


        // remove scroll listener
        document.removeEventListener("scroll", this.listeners.scroll);

        // remove resize listener
        window.removeEventListener("resize", this.listeners.resize);

        // remove input listener
        this.input.removeEventListener("change", this.listeners.change);

        // remove form listener
        if (this.input.form) {
            this.input.form.removeEventListener("reset", this.listeners.reset);
        }

        this.listeners = null;
    }
	/**
	 * Create DOM element helper
	 * @param  {String}   a nodeName
	 * @param  {String|Object}   b className or properties / attributes
	 * @return {Object}
	 */
    createElement(type: string, obj: String | Object): HTMLElementWithIndex {
        const el:HTMLElementWithIndex = document.createElement(type);

        if (typeof obj === "string") {
            el.classList.add(obj);
        } else if (obj === Object(obj)) {
            for (let prop in obj) {
                if (prop in el) {
                    el[prop] = obj[prop];
                } else {
                    el.setAttribute(el[prop], obj[prop]);
                }
            }
        }

        return el;
    }

    isFunction(func: Function): boolean {
        return func && typeof func === "function";
    }

    // throttler
    throttle(fn?, limit?, context?) {
        let wait:boolean;
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

    updateConfig(property: string, val: string | number | boolean | number[]):void {

        if (property !== "tooltip") {
            this.input[property] = val;
        } else {
            if (typeof val === "boolean") {
                this.nodes.container.classList.toggle("has-tooltip", val);
            }
        }

        if (property === "showTooltips" && typeof val === "boolean") {
            this.nodes.container.classList.toggle("show-tooltip", val);
        }

        this.config[property] = val;
        this.config[property] = val;

        if (property === "step") {
            this.setValue();
        }

        if (property === "vertical" || property === "multiple") {
            this.destroy();
            setTimeout(() => {
                this.init();
            }, 10);
        } else {
            this.update();
        }
    }
}





class Config {
    min = 0;
    max = 400;
    step = 10;
    tooltip = true;
    vertical = true;
    multiple = true;
    showTooltips = true;
    color1 = "#3db13d";
    color2 = "#ccc";


}



export { View };
export { Config };