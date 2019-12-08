class Presenter {
    constructor(model,view){
        view.eventObserver.addObserver(this.dataChange.bind(this));

    }
    dataChange(data){
        if (data.message==="valueChange"){
            alert(data.message + ' ' + data.value)
        }
        

    }

}
export {Presenter}