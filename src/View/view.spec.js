import { View, ViewConfig } from "../View/View";

describe("View", () => {
  describe("constructor()", () => {
    let view;

    beforeEach(() => {
      setFixtures('<div class="slider"></div> <input id="output">');
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

    it("может быть созан", () => {
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
      setFixtures('<div class="slider"></div> <input id="output">');
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
      setFixtures('<div class="slider"></div> <input id="output">');
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
      setFixtures('<div class="slider"></div> <input id="output">');
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
      setFixtures('<div class="slider"></div> <input id="output">');
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
    it("должен менять значение value при клике мыши", () => {
      let view;
      setFixtures('<div class="slider"></div> <input id="output">');
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
      expect(view.config.value).toEqual([3000]);
    });
  });

  describe("down()", () => {
    let view;
    beforeEach(() => {
      setFixtures('<div class="slider"></div> <input id="output">');
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

    it("должен устанавливать классы при нажатой кнопке мыши", () => {
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
      var clickEvents = $(document);
      console.log(getEventListeners(document));
        jQuery.each(clickEvents, function(key, handlerObj) {
            

      
        });

    });
  });
});
