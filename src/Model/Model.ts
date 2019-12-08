interface ModelData {
  min: number,
  max: number,
  step: number,
  value?: Array<number>,
  multiple?: boolean,

}



class Model {
  public modelData: ModelData = {
    min: 100,
    max: 700,
    step: 20,
    value: [200, 500],
    multiple: true
  }
  

}
export { Model };  