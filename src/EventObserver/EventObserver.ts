class EventObserver {
    makeObservableSubject = function () {
        let observers = [];
        let addObserver = function (o: Function) {
            if (typeof o !== 'function') {
                throw new Error('observer must be a function');
            }
            for (var i = 0, ilen = observers.length; i < ilen; i += 1) {
                var observer = observers[i];
                if (observer === o) {
                    throw new Error('observer already in the list');
                }
            }
            observers.push(o);
        };
        let removeObserver = function (o: Function) {
            for (var i = 0, ilen = observers.length; i < ilen; i += 1) {
                var observer = observers[i];
                if (observer === o) {
                    observers.splice(i, 1);
                    return;
                }
            }
            throw new Error('could not find observer in list of observers');
        };
        let notifyObservers = function (data) {
            // Make a copy of observer list in case the list
            // is mutated during the notifications.
            let observersSnapshot = observers.slice(0);
            for (var i = 0, ilen = observersSnapshot.length; i < ilen; i += 1) {
                observersSnapshot[i](data);
            }
        };
        return {
            addObserver: addObserver,
            removeObserver: removeObserver,
            notifyObservers: notifyObservers,
            notify: notifyObservers
        };
    };
}