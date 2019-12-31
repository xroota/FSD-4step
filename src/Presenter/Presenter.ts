import { Model } from '../Model/Model';
import { View } from '../View/View';
import { EventData } from '../EventObserver/EventObserver';

class Presenter {
  view: View;

  model: Model;

  outputElement: JQuery;

  constructor(model: Model, view: View, outputElement?: string) {
    view.eventObserver.addObserver(this.dataViewChange.bind(this));
    model.eventObserver.addObserver(this.dataModelChange.bind(this));
    this.model = model;
    this.view = view;
    this.outputElement = $(outputElement);
    this.setOutput();
    $(this.outputElement).change(this.setModelValue.bind(this));
  }


  dataViewChange(data: EventData): void {
    if (data.message === 'valueChange') {
      if (Array.isArray(data.value)) this.model.setProperty('value', data.value);
    }
  }

  dataModelChange(data: EventData): void {
    if (data.message === 'change') {
      switch (data.property) {
        case 'value':
          this.view.setValue(data.value[0], 0);
          if (Array.isArray(data.value) && data.value.length > 0) {
            this.view.setValue(data.value[1], 1);
          }
          this.setOutput();
          break;
        case 'multiple':
          this.view.setProperty('value', this.model.modelData.value);
          this.view.setProperty(data.property, data.value);
          break;
        default: this.view.setProperty(data.property, data.value);
      }
    }
  }

  setOutput(): void {
    const { value } = this.model.modelData;
    if (this.outputElement.is('input')) {
      this.outputElement.val(value[1] ? (value as number[]).join('-') : value[0]);
      this.outputElement.attr('value', value[1] ? (value as number[]).join('-') : value[0]);
    } else {
      this.outputElement.text(value[1] ? (value as number[]).join('-') : value[0]);
    }
  }


  setProperty(prop: string, value: number | number[] | string): void {
    if (prop in this.model.modelData) {
      this.model.setProperty(prop, value);
    } else {
      this.view.setProperty(prop, value);
    }
  }

  setModelValue(): void {
    const val: string = $(this.outputElement).val().toString();
    const valArr: number[] = val.split('-').map(Number);
    this.model.setProperty('value', valArr);
  }


  getProperty(prop: string): number[] | number | string | boolean {
    if (prop in this.model.modelData) {
      return this.model.getProperty(prop);
    }

    return this.view.getProperty(prop);
  }

  destroy(): void {
    this.view.destroy();
    delete this.view;
    delete this.model;
    delete this.outputElement;
  }
}
export { Presenter };
export default Presenter;
