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
    this.checkValue();
  }
 
  checkMultiple(){
    this.modelData.multiple = this.modelData.value.length > 1 ? true : false;

  }
  checkValue(){
   
    if(this.modelData.value[0] > this.modelData.max ) {this.modelData.value[0] = this.modelData.max};
    if(this.modelData.value[0] < this.modelData.min ) {this.modelData.value[0] = this.modelData.min};
    if (this.modelData.multiple){
      if(this.modelData.value[1] > this.modelData.max ) {this.modelData.value[1] = this.modelData.max};
      if(this.modelData.value[1] < this.modelData.min ) {this.modelData.value[1] = this.modelData.min}; 
    }

  }

  setProperty(prop: string, value: number | number[] | string): void {
    let val= this.modelData.value;
    this.modelData[prop] = value;
    if (prop === "value")  {
      this.checkMultiple();
    }  

    if (prop === "multiple")  {
      if ((typeof value ==="boolean") && (value === true))  {
        this.modelData.value = [this.modelData.value[0],this.modelData.max];
      }
      else {
        this.modelData.value = [this.modelData.value[0]];
      }
      

    }  
    
    this.checkValue();
    if (val !== this.modelData.value) {
      this.eventObserver.notifyObservers({ message: "change", property:"value", value: this.modelData.value });
    }
    this.eventObserver.notifyObservers({ message: "change", property: prop, value: this.modelData[prop] });


  }
  getProperty(prop:string){
    return this.modelData[prop];
  }


}
export { Model, ModelData };  