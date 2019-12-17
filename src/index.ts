/*
 * Copyright 2019 Nazmul Idris. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '../dist/index.scss';
import { View, ViewConfig } from './View/View';
import { Model, ModelData } from './Model/Model';

import { Presenter } from './Presenter/Presenter';
import * as dat from 'dat.gui';









let configSlider = Object.assign({}, {
    tooltip: true,
    vertical: false,
    showTooltips: true,
    color1: "#98890c",
    color2: "#431010",
}, { min: 0, max: 10000, step: 10, value: [2000, 4000] });

let modelConfig = new ModelData();

let viewConfig = new ViewConfig();

for (let key in configSlider) {
    if (key in modelConfig) {
        modelConfig[key] = configSlider[key];
    }
    else viewConfig[key] = configSlider[key];
}


const model = new Model(modelConfig);

const view = new View($(".slider88"), Object.assign({}, model.modelData, viewConfig));
const presenter = new Presenter(model, view);






function updateModel(prop,val, slider)  {

    if (prop === 0 || prop === 1) {
        slider.slider("update", {property:prop, value: val});
    }
    else
        slider.slider("update", {property:prop, value: val});
}

function updateView(val) {
    const prop = this.property;
    //  view.updateConfig(prop, val);
}


module Slider {



    export class Init {

        element: JQuery;
        options: object;
        model: Model;
        //view: View;
        //presenter: Presenter;
        dateCreate: string;





        constructor(element: JQuery, options: object, outputElement?: string) {

            this.element = element;
            this.options = options;

            let modelConfig = new ModelData();
            let viewConfig = new ViewConfig();

            for (let key in options) {
                if (key in modelConfig) {
                    modelConfig[key] = options[key];
                }
                else viewConfig[key] = options[key];
            }

            this.model = new Model(modelConfig);

            let view = new View(element, Object.assign({}, this.model.modelData, viewConfig));
            let presenter = new Presenter(this.model, view, outputElement);

        }


        OnCreate() {
            //this.element.css('color', this.options.color).css('background-color', this.options.backgroundColor);
        }
        method(name, opts) {
            alert("aa");
        }

    }




}


declare global {
    interface Window {
        $: JQuery;
    }
    interface JQuery {
        slider: (
            opts?: object | string,
            outputElement?: string
        ) => JQuery<Element> | string | number | number[] | boolean;

    }
}

//jquery plugin wrapper.
(function initialization(w, $: JQueryStatic) {
    if (!$) return false;







    $.fn.slider = function (opts, opts2?) {

        //defaults
        //var defaults: Coloring.GreenifyOptions = new Coloring.GreenifyOptions('#0F0', '#000');

        //var opts = $.extend(defaults, opts);

        let methods = {
            init: function (element: JQuery, options: object, outputElement?: string){

                let modelConfig = new ModelData();
                let viewConfig = new ViewConfig();

                for (let key in options) {
                    if (key in modelConfig) {
                        modelConfig[key] = options[key];
                    }
                    else viewConfig[key] = options[key];
                }

                this.model = new Model(modelConfig);

                let view = new View(element, Object.assign({}, this.model.modelData, viewConfig));
                let presenter = new Presenter(this.model, view, opts2);
                var $this = $(this);
                $(this).data('slider', presenter);

            }
        };



        if (opts === "update") {
            var $this = $(this),
            data = $this.data('slider');

            let slider = $(this).data('slider');
            slider.setProperty(opts2["property"], opts2["value"],);

        }

        else

            return this.each(function () {
                let o = opts;
                let obj = $(this);
                //let slider = new Slider.Init(obj, o, outputElement);
                methods.init.call(this, obj, (o as object), opts2);

            });
    }
        ;
})(window, jQuery);

let configSlider1 = Object.assign({}, {
    tooltip: true,
    vertical: false,
    showTooltips: true,
    color1: "#98890c",
    color2: "#431010",
}, { min: 0, max: 12000, step: 10, value: [2000, 7000] });

let configSlider2 = Object.assign({}, {
    tooltip: true,
    vertical: false,
    showTooltips: true,
    color1: "#98890c",
    color2: "#431010",
}, { min: 0, max: 20000, step: 10, value: [2000] });



let slider1: any = $(".slider1").slider(configSlider1, "#range-value");
let slider2: any  = $(".slider2").slider(configSlider2, "#range-value2");
//slider1.slider("update");
//slider2.slider("update");
var gui = new dat.GUI({ autoPlace: false });


var customContainer = document.getElementById('my-gui-container');
customContainer.appendChild(gui.domElement);

const f1 = gui.addFolder("Config");
const ft = gui.addFolder("Tooltips");
//const f2 = gui.addFolder("Values");
const f3 = gui.addFolder("Color");
const steps = {
    "0.001": 0.001,
    "0.01": 0.01,
    "0.1": 0.1,
    "1": 1,
    "1.25": 1.25,
    "2.0": 2.0,
    "2.5": 2.5,
    "5.0": 5.0,
    "10.0": 10.0
};



f1.add(configSlider1, "min").step(1).onChange((val)=>{updateModel("min",val,slider1)});
f1.add(configSlider1, "max").step(1).onChange((val)=>{updateModel("max",val,slider1)});
f1.add(configSlider1, "step", steps).onChange((val)=>{updateModel("step",val,slider1)});
f1.add(configSlider1, "vertical").onChange((val)=>{updateModel("vertical",val,slider1)});
//f1.add(configSlider1, "multiple").onChange((val)=>{updateModel("multiple",val,slider1)});

//f2.add(configSlider2, "values").onChange(updateModel).listen();
//f2.add(configSlider2.value, 1).onChange(updateModel).listen();

ft.add(configSlider1, "tooltip").onChange((val)=>{updateModel("tooltip",val,slider1)});
ft.add(configSlider1, "showTooltips").name("Always show?").onChange((val)=>{updateModel("showTooltips",val,slider1)});

f1.open();
ft.open();


f3.addColor(configSlider1, 'color1').name('Primary').onChange(val => {
    document.body.style.setProperty("--primary", val);
});
f3.addColor(configSlider1, 'color2').name('Secondary').onChange(val => {
    document.body.style.setProperty("--secondary", val);
});

//f2.open();
f3.open();


var gui2 = new dat.GUI({ autoPlace: false });


var customContainer2 = document.getElementById('my-gui-container2');
customContainer2.appendChild(gui2.domElement);

const f21 = gui2.addFolder("Config");
const ft2 = gui2.addFolder("Tooltips");
//const f2 = gui.addFolder("Values");
const f23 = gui2.addFolder("Color");
const steps2 = {
    "0.001": 0.001,
    "0.01": 0.01,
    "0.1": 0.1,
    "1": 1,
    "1.25": 1.25,
    "2.0": 2.0,
    "2.5": 2.5,
    "5.0": 5.0,
    "10.0": 10.0
};



f21.add(configSlider2, "min").step(1).onChange((val)=>{updateModel("min",val,slider2)});
f21.add(configSlider2, "max").step(1).onChange((val)=>{updateModel("max",val,slider2)});
f21.add(configSlider2, "step", steps2).onChange((val)=>{updateModel("step",val,slider2)});
f21.add(configSlider2, "vertical").onChange((val)=>{updateModel("vertical",val,slider2)});
//f21.add(configSlider2, "multiple").onChange((val)=>{updateModel("multiple",val,slider2)});

//f2.add(configSlider2, "values").onChange(updateModel).listen();
//f2.add(configSlider2.value, 1).onChange(updateModel).listen();

ft2.add(configSlider2, "tooltip").onChange((val)=>{updateModel("tooltip",val,slider2)});
ft2.add(configSlider2, "showTooltips").name("Always show?").onChange((val)=>{updateModel("showTooltips",val,slider2)});

f21.open();
ft2.open();


f23.addColor(configSlider2, 'color1').name('Primary').onChange(val => {
    document.body.style.setProperty("--primary", val);
});
f23.addColor(configSlider2, 'color2').name('Secondary').onChange(val => {
    document.body.style.setProperty("--secondary", val);
});

//f2.open();
f23.open();