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
  input: 'slider__input',
  container: 'slider__container',
  vertical: 'slider--vertical',
  progress: 'slider__progress',
  handle: 'slider__handle',
  tooltip: 'slider__tooltip',
  track: 'slider__track',
  multiple: 'slider--multiple',
  handleDragging: 'slider__handle--dragging',
  handleActive: 'slider__handle--active',
  showTooltip: 'slider--show-tooltip',
  hasTooltip: 'slider--has-tooltip',
  combinedTooltip: 'slider--combined-tooltip',

};


const DEFAULT_CONFIG = {
  tooltip: true,
  showTooltips: true,
  vertical: false,
  color1: '#3db13d',
  color2: '#ccc',
  min: 0,
  max: 100,
  step: 1,
  value: [50],
};


interface IJQueryWithIndex extends JQuery {
  indexElement?: number,
}


interface IViewConfig {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  tooltip?: boolean;
  vertical?: boolean;
  multiple?: boolean;
  showTooltips?: boolean;
  color1?: string;
  color2?: string;
}

class View {
  public eventObserver = new EventObserver();

  private slider: JQuery;

  public config: IViewConfig;

  private defaultValue?: number[];

  private mouseAxis: { x: string, y: string };

  private trackSize: { x: string, y: string };

  private trackPos: { x: string, y: string };

  private nodes: {
    container: JQuery,
    input: JQuery;
    track: JQuery,
    progress: JQuery,
    handle: IJQueryWithIndex | IJQueryWithIndex[],
    tooltip: JQuery | JQuery[]
  };

  private rects: {
    container: ClientRect,
    handle: ClientRect[] | ClientRect
  };

  private axis: string;

  private activeHandle: IJQueryWithIndex | boolean;

  private listeners: {
    down: EventListener,
    move: EventListener,
    up: EventListener,
    update: EventListener,
    change: EventListener,
    reset: EventListener,
    scroll?: EventListener,
    resize?: EventListener,
  };

  private accuracy: number;


  constructor(element?: JQuery, config?: IViewConfig) {
    // user has passed a CSS3 selector string
    this.slider = $(element);

    this.config = { ...DEFAULT_CONFIG, ...config };
    if (!this.defaultValue) {
      this.defaultValue = this.config.value;
    }

    this.mouseAxis = { x: 'clientX', y: 'clientY' };
    this.trackSize = { x: 'width', y: 'height' };
    this.trackPos = { x: 'left', y: 'top' };

    this.render();
  }


  /**
      * Render the instance
      * @return {Void}
      */
  private render(): void {
    this.axis = !this.config.vertical ? 'x' : 'y';

    const input = $('<input/>').addClass(SLIDER_CLASSES.input).attr('type', 'range');
    const container = $('<div/>').addClass(SLIDER_CLASSES.container);
    const track = $('<div/>').addClass(SLIDER_CLASSES.track);
    const progress = $('<div/>').addClass(SLIDER_CLASSES.progress);
    let handle: IJQueryWithIndex | IJQueryWithIndex[] = $('<div/>').addClass(SLIDER_CLASSES.handle);
    let tooltip: JQuery | JQuery[] = $('<div/>').addClass(SLIDER_CLASSES.tooltip);

    $(track).append(progress);

    if (this.config.multiple) {
      handle = [$('<div/>').addClass(SLIDER_CLASSES.handle), $('<div/>').addClass(SLIDER_CLASSES.handle)];
      tooltip = [
        $('<div/>').addClass(SLIDER_CLASSES.tooltip),
        $('<div/>').addClass(SLIDER_CLASSES.tooltip),
        $('<div/>').addClass(SLIDER_CLASSES.tooltip),
      ];

      handle.forEach((node, i) => {
        const nodeChange = node;
        nodeChange.indexElement = i;
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

    this.nodes = {
      input, container, track, progress, handle, tooltip,
    };

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
      document.body.style.setProperty('--primary', this.config.color1);
    }
    if (this.config.color2) {
      document.body.style.setProperty('--secondary', this.config.color2);
    }

    $(this.slider).append(container);
    $(this.nodes.input).insertBefore($(track));
    $(this.nodes.input).addClass(SLIDER_CLASSES.input);
    this.bind();

    this.update();
  }

  private reset(): void {
    this.setValue(this.defaultValue[0], 0);
    if (this.config.multiple) {
      this.setValue(this.defaultValue[1], 1);
    }
  }

  private setValueFromPosition(e: Event) {
    const min = parseFloat(this.config.min.toString());
    const max = parseFloat(this.config.max.toString());
    const step = parseFloat(this.config.step.toString());
    const rect = this.rects;
    const axis = e[this.mouseAxis[this.axis]];
    const pos = axis - this.rects.container[this.trackPos[this.axis]];
    const size = rect.container[this.trackSize[this.axis]];

    // get the position of the cursor over the bar as a percentage
    const position = this.config.vertical
      ? ((size - pos) / size) * 100
      : (pos / size) * 100;

    // work out the value from the position
    let value = (position * (max - min)) / 100 + min;


    // apply granularity (step)
    value = Math.ceil(value / step) * step;

    let index = 0;

    if (this.config.multiple) {
      index = (this.activeHandle as IJQueryWithIndex).indexElement;

      switch (index) {
        case 0:
          if (value >= this.config.value[1]) {
            [value] = [this.config.value[1]];
          }
          break;
        case 1:
          if (value <= this.config.value[0]) {
            [value] = [this.config.value[0]];
          }
          break;
        default: break;
      }
    }

    // Only update the value if it's different.
    // This allows the onChange event to be fired only on a step
    // and not all the time.
    if (e.type === 'mousedown' || parseFloat(value.toString()) !== parseFloat(this.config.value[index].toString())) {
      this.setValue(value, Number(index));
    }
  }

  private change(): void {
    $(this.nodes.input).attr('value', this.config.value[0]);
    this.eventObserver.notifyObservers({ message: 'valueChange', value: this.config.value });
  }


  /**
       * Mousesown
       * @param  {Object} e
       * @return {Void}
       */
  private down(e: MouseEvent): void {
    e.preventDefault();
    // show the tip now so we can get the dimensions later
    $(this.nodes.container).addClass(SLIDER_CLASSES.handleDragging);

    this.recalculate();

    (this.activeHandle as IJQueryWithIndex) = this.getHandle(e);

    $(this.activeHandle as IJQueryWithIndex).addClass(SLIDER_CLASSES.handleActive);

    this.setValueFromPosition(e);

    $(document).on('mousemove', this.listeners.move);
    $(document).on('mouseup', this.listeners.up);
  }

  /**
       * Mousemove
       * @param  {Object} e
       * @return {Void}
       */
  private move(e: Event): void {
    this.setValueFromPosition(e);
  }

  /**
       * Mouseup
       * @param  {Object} e
       * @return {Void}
       */
  private up(): void {
    $(this.nodes.container).removeClass(SLIDER_CLASSES.handleDragging);

    $(this.activeHandle as IJQueryWithIndex).removeClass(SLIDER_CLASSES.handleActive);
    this.activeHandle = false;

    $(document).off('mousemove', this.listeners.move as any);
    $(document).off('mouseup', this.listeners.up as any);

    $(this.nodes.input).trigger('change');
  }

  /**
       * Recache the dimensions
       * @return {Void}
       */
  private recalculate(): void {
    let handle: ClientRect[] | ClientRect = [];
    if (this.config.multiple && Array.isArray(this.nodes.handle)) {
      (this.nodes.handle as IJQueryWithIndex[]).forEach((node, i) => {
        handle[i] = $(node)[0].getBoundingClientRect();
      });
    } else {
      handle = $(this.nodes.handle as IJQueryWithIndex)[0].getBoundingClientRect();
    }

    this.rects = {
      handle,
      container: $(this.nodes.container)[0].getBoundingClientRect(),
    };
  }

  /**
       * Update the instance
       * @return {Void}
       */
  private update(): void {
    this.recalculate();

    this.accuracy = 0;

    // detect float
    if (this.config.step.toString().includes('.')) {
      this.accuracy = (this.config.step.toString().split('.')[1] || []).length;
    }

    if (this.config.multiple) {
      this.config.value.forEach((val, i) => {
        this.setValue(val, i);
      });
    } else {
      this.setValue(this.config.value[0], 0);
    }
  }

  /**
       * Set the input value
       * @param {Number} value
       * @param {Number} index
       */
  public setValue(value?: number | string, index?: number): void {
    // const rects = this.rects;
    let val = value;
    const { nodes } = this;
    const min = parseFloat(this.config.min.toString());
    const max = parseFloat(this.config.max.toString());

    if (this.config.multiple && index === undefined) {
      return;
    }

    if (val === undefined) {
      [val] = [this.config.value[0]];
    }

    val = parseFloat(val.toString());

    val = val.toFixed(this.accuracy);

    if (Number(val) < min) {
      val = min.toFixed(this.accuracy);
    } else if (Number(val) > max) {
      val = max.toFixed(this.accuracy);
    }

    // update the value
    if (this.config.multiple) {
      this.config.value[index] = Number(val);
      const values = this.config.value;
      values[index] = Number(value);

      if (this.config.tooltip) {
        // update the node so we can get the width / height
        $(nodes.tooltip[index]).text(val);

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
      this.config.value = [Number(val)];
      $(nodes.tooltip).text(val);
    }

    // set bar size
    this.setPosition();
  }

  /**
       * Set the bar size / position based on the value
       * @param {Number} value
       */
  private setPosition(): void {
    let width: number;

    if (this.config.multiple) {
      const start = this.getPosition(this.config.value[0]);
      const end = this.getPosition(this.config.value[1]);

      // set the start point of the bar
      $(this.nodes.progress).css(this.config.vertical ? 'bottom' : 'left', `${start}px`);

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
  private getPosition(value: number = this.config.value[0]): number {
    const min = parseFloat(this.config.min.toString());
    const max = parseFloat(this.config.max.toString());

    return ((value - min) / (max - min))
    * Math.round(this.rects.container[this.trackSize[this.axis]]);
  }

  /**
       * Check whether the tooltips are colliding
       * @return {Boolean}
       */
  private tipsIntersecting(): boolean {
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
  private getHandle(e: MouseEvent): IJQueryWithIndex {
    if (!this.config.multiple) {
      return (this.nodes.handle as IJQueryWithIndex);
    }

    const r = this.rects;
    const distA = Math.abs(e[this.mouseAxis[this.axis]] - r.handle[0][this.trackPos[this.axis]]);
    const distB = Math.abs(e[this.mouseAxis[this.axis]] - r.handle[1][this.trackPos[this.axis]]);
    // const handle = $(e.target).closest(`.${SLIDER_CLASSES.handle}`);

    if (distA > distB) {
      return (this.nodes.handle[1] as IJQueryWithIndex);
    }
    return (this.nodes.handle[0] as IJQueryWithIndex);
  }

  /**
       * Destroy the instance
       * @return {Void}
       */
  public destroy(): void {
    if (this.nodes.container) {
      // remove all event listeners
      this.unbind();

      $(this.nodes.container).remove();
      // remove the reference from the input
      // delete (this.nodes.input.ranger);
    }
  }


  private bind(): void {
    this.listeners = {
      down: this.down.bind(this),
      move: this.move.bind(this),
      up: this.up.bind(this),
      update: this.update.bind(this),
      change: this.change.bind(this),
      reset: this.reset.bind(this),
    };

    this.listeners.scroll = View.throttle(this.listeners.update, 100);
    this.listeners.resize = View.throttle(this.listeners.update, 50);

    // throttle the scroll callback for performance
    $(document).on('scroll', this.listeners.scroll);

    // throttle the resize callback for performance
    $(window).on('resize', this.listeners.resize);

    // detect native change event
    $(this.nodes.input).on('change', this.listeners.change);


    $(this.nodes.container).on('mousedown', this.listeners.down);
  }

  private unbind(): void {
    $(this.nodes.container).off('mousedown');


    // remove scroll listener
    $(document).off('scroll');

    // remove resize listener
    $(window).off('resize');

    // remove input listener
    $(this.nodes.input).off('change');

    this.listeners = null;
  }


  // throttler
  private static throttle(fn?: EventListener, limit?: number, context?: object) : EventListener {
    let wait: boolean;
    return function func() {
      let cont = context;
      cont = cont || this;
      if (!wait) {
        fn.apply(cont, fn);
        wait = true;
        return setTimeout(() => {
          wait = false;
        }, limit);
      }
      return false;
    };
  }

  public setProperty(property: string, val: string | number | boolean | number[]): void {
    if (Object.prototype.hasOwnProperty.call(this.config, property)) {
      if (property !== 'tooltip') {
        this.config[property] = val;
      } else if (typeof val === 'boolean') {
        (this.nodes.container).toggleClass(SLIDER_CLASSES.hasTooltip, val);
      }

      if (property === 'showTooltips' && typeof val === 'boolean') {
        $(this.nodes.container).toggleClass(SLIDER_CLASSES.showTooltip, val);
      }

      this.config[property] = val;


      if (property === 'step') {
        this.setValue();
      }

      if (property === 'value') {
        return;
      }

      if (property === 'vertical' || property === 'multiple') {
        this.destroy();
        setTimeout(() => {
          this.render();
        }, 10);
      } else {
        this.update();
      }
    }
  }

  public getProperty(prop: string): number[] | number | string | boolean {
    return this.config[prop];
  }
}


export { View, IViewConfig };
