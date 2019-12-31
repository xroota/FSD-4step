import { EventObserver } from '../EventObserver/EventObserver';

const DEFAULT_DATA = {
  min: 1,
  max: 100,
  step: 1,
  value: [50],
  multiple: false,
};
interface ModelData {
  min?: number;

  max?: number;

  step?: number;

  value?: number[];

  multiple?: boolean
}

class Model {
  eventObserver = new EventObserver();

  modelData : {
    min: number,

    max: number,

    step: number,

    value: number[],

    multiple?: boolean
  };

  constructor(data: ModelData = {}) {
    this.modelData = { ...DEFAULT_DATA };


    const newData = this.modelData;

    Object.keys(data).map((key) => {
      if (typeof newData[key] !== 'undefined') {
        newData[key] = data[key];
      }
      return true;
    });

    this.checkMultiple();
    this.checkValue();
  }

  checkMultiple(): void {
    this.modelData.multiple = this.modelData.value.length > 1;
  }

  checkValue(): void {
    if (this.modelData.value[0] > this.modelData.max) {
      this.modelData.value[0] = this.modelData.max;
    }
    if (this.modelData.value[0] < this.modelData.min) {
      this.modelData.value[0] = this.modelData.min;
    }
    if (this.modelData.multiple) {
      if (this.modelData.value[1] > this.modelData.max) {
        this.modelData.value[1] = this.modelData.max;
      }
      if (this.modelData.value[1] < this.modelData.min) {
        this.modelData.value[1] = this.modelData.min;
      }
      if (this.modelData.value[0] >= this.modelData.value[1]) {
        const val = this.modelData.value[0];
        this.modelData.value[1] = val;
      }
    }
  }

  setProperty(prop: string, value: number | number[] | string): void {
    const val = this.modelData.value;
    this.modelData[prop] = value;
    if (prop === 'value') {
      this.checkMultiple();
    }

    if (prop === 'multiple') {
      if ((typeof value === 'boolean') && (value === true)) {
        this.modelData.value = [this.modelData.value[0], this.modelData.max];
      } else {
        this.modelData.value = [this.modelData.value[0]];
      }
    }

    this.checkValue();
    if (val !== this.modelData.value) {
      this.eventObserver.notifyObservers({ message: 'change', property: 'value', value: this.modelData.value });
    }
    this.eventObserver.notifyObservers({ message: 'change', property: prop, value: this.modelData[prop] });
  }

  getProperty(prop: string): number[] | number | string | boolean {
    return this.modelData[prop];
  }
}
export { Model, ModelData };
