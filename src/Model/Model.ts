import {EventObserver} from '../EventObserver/EventObserver';

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
    step: 20,
    value: [200, 500],
    multiple: true
  }



  setValue(value: Array<number>){
    this.modelData.value = value;
    alert("model data set=" + value );
    this.eventObserver.notifyObservers({message: "valueChange", value: this.modelData.value});
  }


}
export { Model };  