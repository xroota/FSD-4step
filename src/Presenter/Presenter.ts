import { Model } from '../Model/Model';
import { View } from '../View/View';
import { IEventData } from '../EventObserver/EventObserver';

class Presenter {
  public view: View;

  public model: Model;

  private outputElement: JQuery;

  constructor(model: Model, view: View, outputElement?: string) {
    view.eventObserver.addObserver(this.viewConfigChange.bind(this));
    model.eventObserver.addObserver(this.modelConfigChange.bind(this));
    this.model = model;
    this.view = view;
    this.outputElement = $(outputElement);
    this.setOutputValue();
    $(this.outputElement).change(this.getOutputValue.bind(this));
  }


  private viewConfigChange(data: IEventData): void {
    if (data.message === 'valueChange') {
      if (Array.isArray(data.value)) this.model.setProperty('value', data.value);
    }
  }

  private modelConfigChange(data: IEventData): void {
    if (data.message === 'change') {
      switch (data.property) {
        case 'value':
          this.view.setValue(data.value[0], 0);
          if (Array.isArray(data.value) && data.value.length > 0) {
            this.view.setValue(data.value[1], 1);
          }
          this.setOutputValue();
          break;
        case 'multiple':
          this.view.setProperty('value', this.model.config.value);
          this.view.setProperty(data.property, data.value);
          break;
        default: this.view.setProperty(data.property, data.value);
      }
    }
  }

  private setOutputValue(): void {
    const { value } = this.model.config;
    if (this.outputElement.is('input')) {
      this.outputElement.val(value[1] ? (value as number[]).join('-') : value[0]);
      this.outputElement.attr('value', value[1] ? (value as number[]).join('-') : value[0]);
    } else {
      this.outputElement.text(value[1] ? (value as number[]).join('-') : value[0]);
    }
  }

  private getOutputValue(): void {
    const val = $(this.outputElement).val().toString();
    const valArr = val.split('-').map(Number);
    this.model.setProperty('value', valArr);
  }

  public setProperty(prop: string, value: number | number[] | string): void {
    if (prop in this.model.config) {
      this.model.setProperty(prop, value);
    } else {
      this.view.setProperty(prop, value);
    }
  }


  public getProperty(prop: string): number[] | number | string | boolean {
    if (prop in this.model.config) {
      return this.model.getProperty(prop);
    }

    return this.view.getProperty(prop);
  }

  private destroy(): void {
    this.view.destroy();
    delete this.view;
    delete this.model;
    delete this.outputElement;
  }
}
export { Presenter };
export default Presenter;
