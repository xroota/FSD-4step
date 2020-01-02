import { Presenter } from "./Presenter";
import { View, ViewConfig } from "../View/View";
import { Model, config } from "../Model/Model";

describe("Presenter", () => {
	let model;
	let view;
	let presenter;
	let modelConfig;
	let viewConfig;
	beforeEach(() => {
		setFixtures("<div class=\"slider\"></div> <input id=\"output\">");

		modelConfig = {
			min: 1000,
			max: 2000,
			step: 100,
			value: [1500]
		};

		viewConfig = {
			tooltip: true,
			vertical: false,
			showTooltips: true
		};
		model = new Model(modelConfig);

		view = new View(
      $(".slider"),
      Object.assign({}, model.config, viewConfig)
    );
		presenter = new Presenter(model, view, "#output");
	});

	it("должен создавать элементы слайдера в дереве DOM", () => {
		expect($(".slider__container")).toExist();
		expect(jQuery(".slider__input")).toExist();
		expect(jQuery(".slider__track")).toExist();
		expect(jQuery(".slider__progress")).toExist();
		expect(jQuery(".slider__handle")).toExist();
		expect(jQuery(".slider__tooltip")).toExist();
	});

	it("должен создавться с параметрами по умолчанию", () => {
		model = new Model();
		view = new View($(".slider"), model.config);
		presenter = new Presenter(model, view, ".output");
		expect(presenter.model.config).toEqual({
			min: 1,
			max: 100,
			step: 1,
			value: [50],
			multiple: false
		});
		expect(presenter.view.config).toEqual({
			tooltip: true,
			showTooltips: true,
			multiple: false,
			color1: "#3db13d",
			color2: "#ccc",
			min: 1,
			max: 100,
			step: 1,
			value: [50],
			vertical: false
		});
	});

	it("должен создавться с одиночным значением", () => {
		model = new Model();

		view = new View($(".slider"), model.config);
		presenter = new Presenter(model, view, ".output");
		expect(presenter.model.config).toEqual({
			min: 1,
			max: 100,
			step: 1,
			value: [50],
			multiple: false
		});
		expect(presenter.view.config).toEqual({
			tooltip: true,
			showTooltips: true,
			multiple: false,
			vertical: false,
			color1: "#3db13d",
			color2: "#ccc",
			min: 1,
			max: 100,
			step: 1,
			value: [50]
		});
	});

	it("должен создавться для интервала значений", () => {
		modelConfig = {
			min: 1000,
			max: 2000,
			step: 10,
			value: [1500, 1700]
		};

		viewConfig = {
			tooltip: true,
			vertical: false,
			showTooltips: true
		};
		model = new Model(modelConfig);

		view = new View(
      $(".slider"),
      Object.assign({}, model.config, viewConfig)
    );
		presenter = new Presenter(model, view, ".output");
		expect(presenter.model.config).toEqual({
			min: 1000,
			max: 2000,
			step: 10,
			value: [1500, 1700],
			multiple: true
		});
		expect(presenter.view.config).toEqual({
			tooltip: true,
			showTooltips: true,
			multiple: true,
			color1: "#3db13d",
			color2: "#ccc",
			min: 1000,
			max: 2000,
			step: 10,
			value: [1500, 1700],
			vertical: false
		});
	});

	describe("viewConfigChange()", () => {
		it("должен изменять значение value модели", () => {
			presenter.viewConfigChange({
				message: "valueChange",
				property: "value",
				value: [1700]
			});
			expect(presenter.model.config.value).toEqual([1700]);
		});
	});

	describe("modelConfigChange()", () => {
		it("должен изменять значения параметров View", () => {
			let properties = [
        { message: "change", property: "value", value: [1700] },
        { message: "change", property: "step", value: 100 },
        { message: "change", property: "min", value: 100 },
        { message: "change", property: "max", value: 100000 }
			];

			for (let data of properties) {
				presenter.modelConfigChange(data);
				expect(presenter.view.config[data.property]).toEqual(data.value);
			}
		});

		it("должен изменять значения параметрa value range View ", () => {
			presenter.modelConfigChange({
				message: "change",
				property: "tooltip",
				value: true
			});
			expect(presenter.view.config.tooltip).toBe(true);

			presenter.modelConfigChange({
				message: "change",
				property: "value",
				value: [1700]
			});

			modelConfig = {
				min: 1000,
				max: 2000,
				step: 10,
				value: [1500, 1700]
			};

			viewConfig = {
				tooltip: true,
				vertical: false,
				showTooltips: true
			};
			model = new Model(modelConfig);

			view = new View(
        $(".slider"),
        Object.assign({}, model.config, viewConfig)
      );
			presenter = new Presenter(model, view, ".output");

			presenter.modelConfigChange({
				message: "change",
				property: "value",
				value: [1700, 1800]
			});

			expect(presenter.view.config.value).toEqual([1700, 1800]);
		});
	});

	describe("setOutputValue()", () => {
		it("должен изменять значение value элемента #output", () => {
			expect($("#output")).toHaveValue("1500");

			presenter.model.config.value = [1700];
			presenter.setOutputValue();

			expect($("#output")).toHaveValue("1700");
		});
	});



	describe("setOutputValue()", () => {
		it("должен изменять значение value  Model при изменении элеемента #output", () => {
			$("#output").val(1900);
			presenter.getOutputValue();
			expect(presenter.model.config.value).toEqual([1900]);
		});
	});

	describe("setProperty()", () => {
		it("должен изменять значение параметров Model", () => {
			let properties = [
        { property: "value", value: [1700] },
        { property: "step", value: 100 },
        { property: "min", value: 100 },
        { property: "max", value: 100000 }
			];

			for (let data of properties) {
				presenter.setProperty(data.property, data.value);
				expect(presenter.model.config[data.property]).toEqual(data.value);
			}
		});
	});

	it("должен изменять значение параметров View", () => {
		let properties = [
      { property: "tooltip", value: false },
      { property: "vertical", value: true },
      { property: "showTooltips", value: false }
		];

		for (let data of properties) {
			presenter.setProperty(data.property, data.value);
			expect(presenter.view.config[data.property]).toEqual(data.value);
		}
	});

	describe("getProperty()", () => {
		it("должен получать параметры View и Model", () => {
			let properties = [
        { property: "tooltip", value: true },
        { property: "vertical", value: false },
        { property: "showTooltips", value: true },
        { property: "value", value: [1500] },
        { property: "step", value: 100 },
        { property: "min", value: 1000 },
        { property: "max", value: 2000 }
			];

			for (let data of properties) {
				presenter.getProperty(data.property);
				expect(presenter.getProperty(data.property)).toEqual(data.value);
			}
		});
	});

	describe("destroy()", () => {
		it("должен уничтожать view, model, outputElement", () => {
			presenter.destroy();
			expect(presenter.view).not.toBeDefined();
			expect(presenter.model).not.toBeDefined();
			expect(presenter.outputElement).not.toBeDefined();

		});
	});


});
