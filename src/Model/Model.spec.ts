import { Model, ModelData } from './Model';

describe('Model', () => {
  it('can create', () => {
    const model: Model = new Model();
    expect(model).not.toBe(null);
  });
  
  it('have default settings', () => {
    const model: Model = new Model();
    expect(model.modelData).toEqual({ min: 1, max: 100, step: 1, value: [ 50 ], multiple: false });
  });
  
  it('create with right settings', () => {
    const model: Model = new Model({
      min: 1000,
      max: 2000,
      step: 10,
      value: [1500]
    });
    expect(model.modelData).toEqual({ min: 1000, max: 2000, step: 10, value: [ 1500 ], multiple: false });
  });

  it('create with right settings(range)', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [14000,15000]
    });
    expect(model.modelData).toEqual({ min: 10000, max: 20000, step: 1000, value: [ 14000,15000 ], multiple: true });
  });

  it('fix wrong settings(value1 > value2 )', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [14000,12000]
    });
    expect(model.modelData).toEqual({ min: 10000, max: 20000, step: 1000, value: [ 14000,14000 ], multiple: true });
  });

  it('fix wrong settings(value > max )', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [25000]
    });
    expect(model.modelData).toEqual({ min: 10000, max: 20000, step: 1000, value: [ 20000 ], multiple: false });
  });

  it('fix wrong settings(value < min )', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [7000]
    });
    expect(model.modelData).toEqual({ min: 10000, max: 20000, step: 1000, value: [ 10000 ], multiple: false });
  });

  it('set property min', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [12000]
    });
    model.setProperty("min",9000)
    expect(model.modelData).toEqual({ min: 9000, max: 20000, step: 1000, value: [ 12000 ], multiple: false });
  });

  it('set property max', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [12000]
    });
    model.setProperty("max",19000)
    expect(model.modelData).toEqual({ min: 10000, max: 19000, step: 1000, value: [ 12000 ], multiple: false });
  });

  it('set property step', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [12000]
    });
    model.setProperty("step",2000)
    expect(model.modelData).toEqual({ min: 10000, max: 20000, step: 2000, value: [ 12000 ], multiple: false });
  });

  it('set property value', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [12000]
    });
    model.setProperty("value",[13000])
    expect(model.modelData).toEqual({ min: 10000, max: 20000, step: 1000, value: [ 13000 ], multiple: false });
  });

  it('set property value (range)', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [12000,17000]
    });
    model.setProperty("value",[13000, 19000])
    expect(model.modelData).toEqual({ min: 10000, max: 20000, step: 1000, value: [ 13000, 19000 ], multiple: true });
  });

  it('get property min', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [12000,17000]
    });
    
    expect(model.getProperty("min")).toEqual(10000);
  });

  it('get property max', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [12000,17000]
    });
    
    expect(model.getProperty("max")).toEqual(20000);
  });

  it('get property step', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [12000,17000]
    });
    
    expect(model.getProperty("step")).toEqual(1000);
  });


  it('get property value', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [12000,17000]
    });
    
    expect(model.getProperty("value")).toEqual([12000,17000]);
  });

  it('get property multiple', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [12000,17000]
    });
    
    expect(model.getProperty("multiple")).toEqual(true);
  });


  it('checkMultiple() work 1', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [12000,17000]
    });

    model.modelData.value= [16000];
    model.checkMultiple();
    
    expect(model.getProperty("multiple")).toEqual(false);
  });

  it('checkMultiple() work 2', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [7000]
    });

    model.modelData.value= [16000,18000];
    model.checkMultiple();
    
    expect(model.modelData.multiple).toEqual(true);
  });
  

  it('checkValue() fix value1 > value2', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [16000,15000]
    });

    model.modelData.value= [16000,15000];
    model.checkValue();
    
    expect(model.modelData.value).toEqual([16000,16000]);
  });

  it('checkValue() fix value2 > max', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [16000,17000]
    });

    model.modelData.value= [16000,25000];
    model.checkValue();
    
    expect(model.modelData.value).toEqual([16000,20000]);
  });
  
  it('checkValue() fix value1 < min', () => {
    const model: Model = new Model({
      min: 10000,
      max: 20000,
      step: 1000,
      value: [16000,17000]
    });

    model.modelData.value= [6000,17000];
    model.checkValue();
    
    expect(model.modelData.value).toEqual([10000,17000]);
  });

});