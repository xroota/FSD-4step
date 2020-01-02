import { EventObserver } from '../EventObserver/EventObserver';

const DEFAULT_CONFIG = {
  min: 1,
  max: 100,
  step: 1,
  value: [50],
  multiple: false,
};
interface IModelConfig {
  min?: number;

  max?: number;

  step?: number;

  value?: number[];

  multiple?: boolean
}

class Model {
  public eventObserver = new EventObserver();

  public config : IModelConfig;

  constructor(config: IModelConfig = {}) {
    this.config = { ...DEFAULT_CONFIG };

    Object.keys(config).map((key) => {
      if (typeof this.config[key] !== 'undefined') {
        this.config[key] = config[key];
      }
      return true;
    });

    this.checkMultiple();
    this.checkValue();
  }

  private checkMultiple(): void {
    this.config.multiple = this.config.value.length > 1;
  }

  private checkValue(): void {
    if (this.config.value[0] > this.config.max) {
      this.config.value[0] = this.config.max;
    }
    if (this.config.value[0] < this.config.min) {
      this.config.value[0] = this.config.min;
    }
    if (this.config.multiple) {
      if (this.config.value[1] > this.config.max) {
        this.config.value[1] = this.config.max;
      }
      if (this.config.value[1] < this.config.min) {
        this.config.value[1] = this.config.min;
      }
      if (this.config.value[0] >= this.config.value[1]) {
        const val = this.config.value[0];
        this.config.value[1] = val;
      }
    }
  }

  public setProperty(prop: string, value: number | number[] | string): void {
    const val = this.config.value;
    this.config[prop] = value;
    if (prop === 'value') {
      this.checkMultiple();
    }

    if (prop === 'multiple') {
      if ((typeof value === 'boolean') && (value === true)) {
        this.config.value = [this.config.value[0], this.config.max];
      } else {
        this.config.value = [this.config.value[0]];
      }
    }

    this.checkValue();
    if (val !== this.config.value) {
      this.eventObserver.notifyObservers({ message: 'change', property: 'value', value: this.config.value });
    }
    this.eventObserver.notifyObservers({ message: 'change', property: prop, value: this.config[prop] });
  }

  public getProperty(prop: string): number[] | number | string | boolean {
    return this.config[prop];
  }
}
export { Model, IModelConfig };
