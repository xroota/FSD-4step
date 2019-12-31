interface EventData {
  message: string;
  value: string | number[] | boolean | number;
  property?: string;
}
class EventObserver {
  observers: Function[] = [];

  addObserver = function func(o: Function): void {
    if (typeof o !== 'function') {
      throw new Error('observer must be a function');
    }
    for (let i = 0, ilen = this.observers.length; i < ilen; i += 1) {
      const observer = this.observers[i];
      if (observer === o) {
        throw new Error('observer already in the list');
      }
    }
    this.observers.push(o);
  };

  removeObserver(o: Function): void {
    for (let i = 0, ilen = this.observers.length; i < ilen; i += 1) {
      const observer = this.observers[i];
      if (observer === o) {
        this.observers.splice(i, 1);
        return;
      }
    }
    throw new Error('could not find observer in list of observers');
  }

  notifyObservers(data: EventData): void {
    // Make a copy of observer list in case the list
    // is mutated during the notifications.
    const observersSnapshot = this.observers.slice(0);
    for (let i = 0, ilen = observersSnapshot.length; i < ilen; i += 1) {
      observersSnapshot[i](data);
    }
  }
}

export { EventObserver, EventData };
