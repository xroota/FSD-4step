import { EventObserver } from '../EventObserver/EventObserver';
import { throws } from 'assert';

const DEFAULT_DATA = {
  min: 1,
  max: 100,
  step: 1,
  value: [10, 50],
  multiple: true
}
class ModelData {
  min: number = DEFAULT_DATA.min;
  max: number =  DEFAULT_DATA.max;
  step: number =  DEFAULT_DATA.step;
  value: number[] = DEFAULT_DATA.value;
  multiple?: boolean = DEFAULT_DATA.multiple;
}

class Model {
  eventObserver = new EventObserver();
  modelData: ModelData;

  constructor(data: ModelData) {
    this.modelData = data;
    this.checkMultiple();
  }
 
  checkMultiple(){
    this.modelData.multiple = this.modelData.value.length > 1 ? true : false;

  }

  setProperty(prop: string, value: number | number[] | string): void {
    this.modelData[prop] = value;
    if (prop === "value")  {
      this.checkMultiple();
    }
    this.eventObserver.notifyObservers({ message: "change", property: prop, value: this.modelData[prop] });
  }
  setValue(index: number, value: number): void {
    this.modelData.value[index] = value;
    this.eventObserver.notifyObservers({ message: "change", property: "value", value: this.modelData.value });
  }





}
export { Model, ModelData };  