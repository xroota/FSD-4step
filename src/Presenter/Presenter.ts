import { Model } from "../Model/Model";
import { View } from "../View/View";
import { EventObserver, EventData } from "../EventObserver/EventObserver";

class Presenter {
    model: Model;
    view: View;
    outputElement: JQuery;
    constructor(model: Model, view: View, outputElement?: string) {
        view.eventObserver.addObserver(this.dataViewChange.bind(this));
        model.eventObserver.addObserver(this.dataModelChange.bind(this));
        this.model = model;
        this.view = view;
        this.outputElement = $(outputElement);
        this.setOutput();
        $(this.outputElement).change( this.setModelValue.bind(this));

    }



    dataViewChange(data: EventData): void {
        if (data.message === "valueChange") {
            //alert(data.message + ' ' + data.value);
            if (Array.isArray(data.value))
                this.model.setProperty("value", data.value);
        }
    }

    dataModelChange(data: EventData): void {
        if (data.message === "change") {
            //alert(data.message + ' ' + data.value);
            switch (data.property) {
                case "value": this.view.setValue(data.value[0], 0);
                    if (Array.isArray(data.value) && data.value.length > 0) this.view.setValue(data.value[1], 1);
                    this.setOutput();
                    break;
                default: this.view.updateConfig(data.property, data.value);
            }
        }



    }
    setOutput() {
        let value = this.model.modelData.value;
        if (this.outputElement.is("input")) {
            this.outputElement.val(value[1] ? (value as number[]).join("-") : value[0]);
        }
        else {
            this.outputElement.text(value[1] ? (value as number[]).join("-") : value[0]);
        }

    }

    setModelValue(){
        let val:string    = $(this.outputElement).val().toString();
        let valArr: number[] =val.split("-").map(Number);
        this.model.setProperty("value", valArr);


    }

    setProperty(prop: string, value: number | number[] | string): void {
        this.model.setProperty
            if (prop in this.model.modelData) {
                this.model.setProperty(prop,value);
            }
            else {
                this.view.updateConfig(prop,value);
            }


    }


}
export { Presenter }