import { View, ViewConfig } from "../View/View";
import { Model } from "../Model/Model";
import { Presenter } from "../Presenter/Presenter";

describe("View", () => {
	describe("constructor()", () => {
		let view; 

		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				multiple: false,
				vertical: false,
				color1: "#3db13d",
				color2: "#ccc",
				min: 1,
				max: 100,
				step: 1,
				value: [50],
				multiple: false
			});
		});

		it("может быть создан", () => {
			expect(view).toBeDefined();
		});

		it("будет созан элемент input с классом slider__input в DOM ", () => {
			expect($("input")).toBeDefined();
			expect($("input")).toHaveClass("slider__input");
		});
	});

	describe("getProperty()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: false,
				color1: "#3db13d",
				color2: "#ccc",
				min: 1,
				max: 100,
				step: 1,
				value: [50],
				multiple: false
			});
		});

		it("должен получать параметры View", () => {
			let properties = [
        { property: "tooltip", value: true },
        { property: "vertical", value: false },
        { property: "showTooltips", value: true },
        { property: "value", value: [50] },
        { property: "step", value: 1 },
        { property: "min", value: 1 },
        { property: "max", value: 100 },
        { property: "multiple", value: false }
			];

			for (let data of properties) {
				expect(view.getProperty(data.property)).toEqual(data.value);
			}
		});
	});

	describe("setProperty()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: false,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 10,
				value: [2000]
			});
		});

		it("должен устанавливать параметры View", () => {
			let properties = [
        { property: "tooltip", value: true },
        { property: "vertical", value: false },
        { property: "showTooltips", value: true },
        { property: "value", value: [50] },
        { property: "step", value: 1 },
        { property: "min", value: 1 },
        { property: "max", value: 100 },
        { property: "multiple", value: false }
			];

			for (let data of properties) {
				view.setProperty(data.property, data.value);

				expect(view.config[data.property]).toEqual(data.value);
			}
		});
	});

	describe("render()", () => {
		it("должен создавать элементы слайдера в DOM", () => {
			let view;
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: false,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 10,
				value: [2000]
			});

			view.destroy();
			expect($(".slider")).toHaveHtml("");
			view.render();
			expect(
        $("div.slider__container.slider--has-tooltip.slider--show-tooltip")
      ).toExist();
			expect($("input.slider__input")).toExist();
			expect($("div.slider__track")).toExist();
			expect($("div.slider__handle")).toExist();
			expect($("div.slider__tooltip")).toExist();
		});
	});

	describe("reset()", () => {
		it("должен сбрасывать настройки value", () => {
			let view;
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: false,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 10,
				value: [2000]
			});

			view.setProperty("value", [3000]);
			expect(view.config.value).toEqual([3000]);
			view.reset();
			expect(view.config.value).toEqual([2000]);
		});
	});

	describe("setValueFromPosition()", () => {
		it("может менять значение value при клике мыши", () => {
			let view;
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: false,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 10,
				value: [2000]
			});

			$(".slider__track").click();

			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        142, // координаты x
        0, // координаты y
        false,
        false,
        false,
        false,
        0,
        null
      );
			view.setValueFromPosition(evt);
			expect(view.config.value).toEqual([12510]);
		});
	});

	describe("down()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: false,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 10,
				value: [2000]
			});
		});

		it("может устанавливать классы при нажатой кнопке мыши", () => {
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        142, // координаты x
        0, // координаты y
        false,
        false,
        false,
        false,
        0,
        null
      );
			view.down(evt);
			expect($(".slider__container")).toHaveClass("slider__handle--dragging");
			expect($(".slider__handle")).toHaveClass("slider__handle--active");
		});
	});

	describe("move()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: false,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 10,
				value: [2000]
			});
		});

		it("может менять значение при перемещении мыши", () => {
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        120, // координаты x
        0, // координаты y
        false,
        false,
        false,
        false,
        0,
        null
      );
			view.down(evt);

			expect(view.config.value).toEqual([10090]);

			evt.initMouseEvent(
        "mousemove",
        true,
        true,
        window,
        0,
        0,
        0,
        180, // координаты x
        0, // координаты y
        false,
        false,
        false,
        false,
        0,
        null
      );
			view.move(evt);

			expect(view.config.value).toEqual([16670]);

			expect($(".slider__container")).toHaveClass("slider__handle--dragging");
			expect($(".slider__handle")).toHaveClass("slider__handle--active");
		});
	});

	describe("up()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: false,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 10,
				value: [2000]
			});
		});

		it("может удалать классы", () => {
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        142, // координаты x
        0, // координаты y
        false,
        false,
        false,
        false,
        0,
        null
      );
			view.down(evt);

			expect($(".slider__container")).toHaveClass("slider__handle--dragging");
			expect($(".slider__handle")).toHaveClass("slider__handle--active");

			evt.initMouseEvent(
        "mouseup",
        true,
        true,
        window,
        0,
        0,
        0,
        187, // координаты x
        0, // координаты y
        false,
        false,
        false,
        false,
        0,
        null
      );

			view.move(evt);
			view.up();

			expect($(".slider__container")).not.toHaveClass(
        "slider__handle--dragging"
      );
			expect($(".slider__handle")).not.toHaveClass("slider__handle--active");
		});
	});

	describe("recalculate()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: false,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 10,
				value: [2000]
			});
		});

		it("может сохранять DOMRect hanle и container", () => {
			view.rects = {};

			view.recalculate();
			var obj = $.extend({}, view.rects.handle);
			delete obj.toJSON;
			expect(obj).toEqual({
				x: 35.1875,
				y: 102.1875,
				width: 22,
				height: 22,
				top: 102.1875,
				right: 57.1875,
				bottom: 124.1875,
				left: 35.1875,
       
			});
			obj = $.extend({}, view.rects.container);
			delete obj.toJSON;
			expect(obj).toEqual({
				x: 28,
				y: 109.1875,
				width: 182.390625,
				height: 8,
				top: 109.1875,
				right: 210.390625,
				bottom: 117.1875,
				left: 28,
       
			});
		});
	});

	describe("change()", () => {
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
				step: 10,
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
        Object.assign({}, model.modelData, viewConfig)
      );
			presenter = new Presenter(model, view, "#output");
		});

		it("может отравлять value подписанной на событие model", () => {
			presenter.view.config.value = [1700];
			presenter.view.change();
			expect(presenter.model.modelData.value).toEqual([1700]);
		});
	});

	describe("update()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: true,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 0.1,
				value: [2000, 5000]
			});
		});

		it("может станавливать значение accuracy", () => {
			expect(view.accuracy).toEqual(1);
		});
	});

	describe("setValue()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: true,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 0.1,
				value: [2000, 2200]
			});
		});

		it("может устанавливать значение value", () => {
			view.setValue([2500], 0);
			expect(view.config.value[0]).toEqual(2500);
			view.setValue([5500], 1);
			expect(view.config.value[1]).toEqual(5500);
		});

		it("может устанавливать значение текста tooltip", () => {
			view.setValue([2500], 0);
			expect($(".slider__tooltip")[0]).toHaveText("2500.0");
			view.setValue([5500], 1);
			expect($(".slider__tooltip")[1]).toHaveText("5500.0");
		});

		it("может устанавливать класс combinedTooltip", () => {
			view.setValue([2300], 0);
			expect($(".slider__container")).toHaveClass("slider--combined-tooltip");
		});
	});

	describe("setPosition()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: true,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0, 
				max: 20000,
				step: 0.1,
				value: [2000, 12000]
			});
		});

		it("может устанавливать значение css slider__progress", () => {
			expect($(".slider__progress")).toHaveCss({ left: "18.2px"});
			expect($(".slider__progress")).toHaveCss({ width: "91px"});
		});
	});

	describe("getPosition()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: true,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 0.1,
				value: [2000, 12000]
			});
		});

		it("может получать длинну slider__progress", () => {
			expect(view.getPosition(6000)).toEqual(54.6);
		});
	});

	describe("tipsIntersecting()", () => {
		let view;
		beforeEach(() => {
			setFixtures(
        "@import \"../jquery.slider.scss\";<div style=\"width: 300px; height: 400px\" class=\"slider\" ></div> <input id=\"output\">"
      );
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: true,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 0.1,
				value: [2000, 4000]
			});
		});

		it("может вычислять нужно ли оъединять текст tooltip", () => {
			expect(view.tipsIntersecting()).toEqual(true);
		});
	});

	describe("getHandle()", () => {
		it("может возвращать handle который нажат, или находитя ближе", () => {
			let view;
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: false,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 10,
				value: [2000]
			});

			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        142, // координаты x
        0, // координаты y
        false,
        false,
        false,
        false,
        0,
        null
      );
			let handle = view.getHandle(evt);
			expect(handle).toExist();
		});
	});

	describe("destroy()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: true,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 0.1,
				value: [2000, 4000]
			});
		});

		it("может удалять DOM элементы слайдера", () => {
			expect($(".slider__container")).toExist();

			view.destroy();

			expect($(".slider__container")).not.toExist();
		});

		it("может удалять объект слайдера", () => {
			expect(view.input.ranger).toExist();

			view.destroy();

			expect(view.input.ranger).not.toExist();
		});
	});

	describe("bind()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: true,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 0.1,
				value: [2000, 4000]
			});
		});

		it("может вешать события", () => {
			view.unbind();
			expect($(".slider__input")).not.toHandle("change");
			expect($(document)).not.toHandle("scroll");
			expect($(window)).not.toHandle("resize");
			expect($(".slider__container")).not.toHandle("mousedown");
			view.bind();
			expect($(".slider__input")).toHandle("change");
			expect($(document)).toHandle("scroll");
			expect($(window)).toHandle("resize");
			expect($(".slider__container")).toHandle("mousedown");
		});
	});

	describe("unbind()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: true,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 0.1,
				value: [2000, 4000]
			});
		});

		it("может удалять события", () => {
			view.unbind();
			expect($(".slider__input")).not.toHandle("change");
			expect($(document)).not.toHandle("scroll");
			expect($(window)).not.toHandle("resize");
			expect($(".slider__container")).not.toHandle("mousedown");
		});
	});

	describe("throttle()", () => {
		let view;
		beforeEach(() => {
			setFixtures("<div class=\"slider\"></div> <input id=\"output\">");
			view = new View($(".slider"), {
				tooltip: true,
				showTooltips: true,
				vertical: false,
				multiple: true,
				color1: "#3db13d",
				color2: "#ccc",
				min: 0,
				max: 20000,
				step: 0.1,
				value: [2000, 4000]
			});
		});

		it("возвращает функцию", () => {
			expect(view.throttle(function() {})).toBeInstanceOf(Function);
		});
	});
});
