import { Model } from "../Model/Model";
import { View } from "../View/View";
import { EventObserver, EventData} from "../EventObserver/EventObserver";

class Presenter {
    model: Model;
    view: View;

    constructor(model:Model, view:View ) {
        view.eventObserver.addObserver(this.dataViewChange.bind(this));
        model.eventObserver.addObserver(this.dataModelChange.bind(this));
        this.model = model;
        this.view = view;
    }



    dataViewChange(data:EventData):void {
        if (data.message === "valueChange") {
            //alert(data.message + ' ' + data.value);
            if (Array.isArray(data.value))
            this.model.setProperty("value", data.value);
        }
    }

    dataModelChange(data:EventData) :void  {
        if (data.message === "change") {
            //alert(data.message + ' ' + data.value);
            switch (data.property) {
                case "value": this.view.setValue(data.value[0], 0);
                    if ( Array.isArray(data.value) && data.value.length > 0) this.view.setValue(data.value[1], 1);
                    $("#range-value").text(data.value.toString);
                    break;
                default: this.view.updateConfig(data.property, data.value);
            }
        }


    }

}
export { Presenter }