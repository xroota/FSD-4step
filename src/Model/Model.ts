import { EventObserver } from '../EventObserver/EventObserver';

interface ModelData {
  min: number,
  max: number,
  step: number,
  value?: Array<number>,
  multiple?: boolean,

}

class Model {
  eventObserver = new EventObserver();
  public modelData: ModelData = {
    min: 100,
    max: 700,
    step: 10,
    value: [200, 500],
    multiple: true
  }

  setProperty(prop: string, value: number|number[]|string): void {

    this.modelData[prop] = value;
    this.eventObserver.notifyObservers({ message: "change", property: prop, value: this.modelData[prop] });
  }
  setValue(index: number, value: number): void {
    this.modelData.value[index] = value;
    this.eventObserver.notifyObservers({ message: "change", property: "value", value: this.modelData.value });
  }





}
export { Model };  