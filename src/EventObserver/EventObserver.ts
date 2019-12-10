interface EventData{
    message: string,
    value: string|Array<number>|boolean|number,
    property?: string
}
class EventObserver {
    observers : Array<Function>=[];
    addObserver = function (o: Function) {
        if (typeof o !== 'function') {
            throw new Error('observer must be a function');
        }
        for (var i = 0, ilen = this.observers.length; i < ilen; i += 1) {
            var observer = this.observers[i];
            if (observer === o) {
                throw new Error('observer already in the list');
            }
        }
        this.observers.push(o);
    };
    removeObserver(o: Function) {
        for (var i = 0, ilen = this.observers.length; i < ilen; i += 1) {
            var observer = this.observers[i];
            if (observer === o) {
                this.observers.splice(i, 1);
                return;
            }
        }
        throw new Error('could not find observer in list of observers');
    };
    notifyObservers = function (data:EventData) {
        // Make a copy of observer list in case the list
        // is mutated during the notifications.
        let observersSnapshot = this.observers.slice(0);
        for (var i = 0, ilen = observersSnapshot.length; i < ilen; i += 1) {
            observersSnapshot[i](data);
        }
    };
       
}

export { EventObserver , EventData};