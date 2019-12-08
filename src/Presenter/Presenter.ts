import { Model } from "../Model/Model";
import { View } from "../View/View";


class Presenter {
    model: Model;
    view: View;
    
    constructor(model,view){
        view.eventObserver.addObserver(this.dataViewChange.bind(this));
        model.eventObserver.addObserver(this.dataModelChange.bind(this));
        this.model= model;
        this.view= view;
    }
    


    dataViewChange(data){
        if (data.message==="valueChange"){
            alert(data.message + ' ' + data.value);
            this.model.setValue(data.value);
        }
    }

    
    dataModelChange(data){
        if (data.message==="valueChange"){
            alert(data.message + ' ' + data.value);
            this.view.setValue(data.value);
        }
    }
        

}
export {Presenter}