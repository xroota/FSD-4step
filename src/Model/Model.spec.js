import { Model, ModelData } from "./Model";

describe("Model", () => {
	it("может быть создн", () => {
		const model = new Model();
		expect(model).toBeDefined();
	});
  
	it("может быть создан с параметрами по умолчанию", () => {
		const model = new Model();
		expect(model.modelData).toEqual({ min: 1, max: 100, step: 1, value: [ 50 ], multiple: false });
	});
  
	it("может быть создан с нужными параметрами", () => {
		const model = new Model({
			min: 1000,
			max: 2000,
			step: 10,
			value: [1500]
		});
		expect(model.modelData).toEqual({ min: 1000, max: 2000, step: 10, value: [ 1500 ], multiple: false });
	});

	it("может быть создан с нужными параметрами(диапазон)", () => {
		const model = new Model({
			min: 10000,
			max: 20000,
			step: 1000,
			value: [14000,15000]
		});
		expect(model.modelData).toEqual({ min: 10000, max: 20000, step: 1000, value: [ 14000,15000 ], multiple: true });
	});

	it("может исправить неправильные параметры (value1 > value2 )", () => {
		const model = new Model({
			min: 10000,
			max: 20000,
			step: 1000,
			value: [14000,12000]
		});
		expect(model.modelData).toEqual({ min: 10000, max: 20000, step: 1000, value: [ 14000,14000 ], multiple: true });
	});

	it("может исправить неправильные параметры (value > max )", () => {
		const model = new Model({
			min: 10000,
			max: 20000,
			step: 1000,
			value: [25000]
		});
		expect(model.modelData).toEqual({ min: 10000, max: 20000, step: 1000, value: [ 20000 ], multiple: false });
	});

	it("может исправить неправильные параметры (value < min )", () => {
		const model = new Model({
			min: 10000,
			max: 20000,
			step: 1000,
			value: [7000]
		});
		expect(model.modelData).toEqual({ min: 10000, max: 20000, step: 1000, value: [ 10000 ], multiple: false });
	});


      
	it("может изменять значение параметров Model", () => {
		const model = new Model({
			min: 10000,
			max: 20000,
			step: 1000,
			value: [12000]
		});
    
		let properties = [
      { property: "value", value: [1700] },
      { property: "value", value: [1700,1800] },
      { property: "step", value: 100 },
      { property: "min", value: 100 },
      { property: "max", value: 100000 }
		];

		for (let data of properties) {
			model.setProperty(data.property,data.value);
			expect(model.modelData[data.property]).toEqual(data.value);
		}
	});


 
	it("должен получать параметры View и Model", () => {
		const model = new Model({
			min: 10000,
			max: 20000,
			step: 1000,
			value: [12000]
		});
    
    
		let properties = [

      { property: "value", value: [12000] },
      { property: "step", value: 1000 },
      { property: "min", value: 10000 },
      { property: "max", value: 20000 },
      { property: "multiple", value : false}
		];

		for (let data of properties) {
			expect(model.getProperty(data.property)).toEqual(data.value);
		}
	});


  
	it("checkMultiple() work 1", () => {
		const model = new Model({
			min: 10000,
			max: 20000,
			step: 1000,
			value: [12000,17000]
		});

		model.modelData.value= [16000];
		model.checkMultiple();
    
		expect(model.getProperty("multiple")).toEqual(false);
	});

	it("checkMultiple() work 2", () => {
		const model = new Model({
			min: 10000,
			max: 20000,
			step: 1000,
			value: [7000]
		});

		model.modelData.value= [16000,18000];
		model.checkMultiple();
    
		expect(model.modelData.multiple).toEqual(true);
	});
  

	it("checkValue() может исправить value1 > value2", () => {
		const model = new Model({
			min: 10000,
			max: 20000,
			step: 1000,
			value: [16000,15000]
		});

		model.modelData.value= [16000,15000];
		model.checkValue();
    
		expect(model.modelData.value).toEqual([16000,16000]);
	});

	it("checkValue()  может исправить  value2 > max", () => {
		const model = new Model({
			min: 10000,
			max: 20000,
			step: 1000,
			value: [16000,17000]
		});

		model.modelData.value= [16000,25000];
		model.checkValue();
    
		expect(model.modelData.value).toEqual([16000,20000]);
	});
  
	it("checkValue() может исправить value1 < min", () => {
		const model = new Model({
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