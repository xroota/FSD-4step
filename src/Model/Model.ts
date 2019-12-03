interface ModelData {
    min: number,
    max: number,
    value?: number,
    values?: Array<number>,
    isRange?: boolean
  }
  
  
  
  class Model {
    private modelData :  ModelData = {
      min: 100,
      max: 300,
      value: 250,
      isRange: false,
    }
  
  }
export {Model};  