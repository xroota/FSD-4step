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






function updateModel(val) {
    const prop = this.property;
    if (prop === 0 || prop === 1) {
        model.setValue(prop, val);
    }
    else
        model.setProperty(prop, val);
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


        constructor(element: JQuery, options: object) {

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

            const view = new View(element, Object.assign({}, this.model.modelData, viewConfig));
            const presenter = new Presenter(this.model, view);
            this.OnCreate();


        }


        OnCreate() {
            //this.element.css('color', this.options.color).css('background-color', this.options.backgroundColor);
        }
        getValue() {
            return this.model.modelData.value;
        }

    }




}


declare global {
    interface Window {
        $: JQuery;
    }
    interface JQuery {
        Slider: (
            opts?: object,
        ) => JQuery<Element> | string | number | number[] | boolean;

    }
}

//jquery plugin wrapper.
(function (w, $) {
    if (!$) return false;

    $.fn.extend({
        Slider: function (opts) {

            //defaults
            //var defaults: Coloring.GreenifyOptions = new Coloring.GreenifyOptions('#0F0', '#000');

            //var opts = $.extend(defaults, opts);

            return this.each(function () {
                var o = opts;
                var obj = $(this);
                new Slider.Init(obj, o);

            });
        }
    });
})(window, jQuery);

let configSlider2 = Object.assign({}, {
    tooltip: true,
    vertical: false,
    showTooltips: true,
    color1: "#98890c",
    color2: "#431010",
}, { min: 0, max: 12000, step: 10, value: [2000, 7000] });

let configSlider3 = Object.assign({}, {
    tooltip: true,
    vertical: false,
    showTooltips: true,
    color1: "#98890c",
    color2: "#431010",
}, { min: 0, max: 20000, step: 10, value: [2000] });



$(".slider7").Slider(configSlider3);
$(".slider2").Slider(configSlider2);
var customValue: any = document.querySelector(".slider2 .slider__input");

var ss = customValue["value"];
var dd = 11;

var gui = new dat.GUI({ autoPlace: false });


var customContainer = document.getElementById('my-gui-container');
customContainer.appendChild(gui.domElement);

const f1 = gui.addFolder("Config");
const ft = gui.addFolder("Tooltips");
const f2 = gui.addFolder("Values");
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



var dd = customContainer["min"];
f1.add(view.config, "min").step(1).onChange(updateModel);
f1.add(view.config, "max").step(1).onChange(updateModel);
f1.add(view.config, "step", steps).onChange(updateModel);
f1.add(view.config, "vertical").onChange(updateView);
f1.add(view.config, "multiple").onChange(updateModel);

f2.add(customValue,"values").onChange(updateModel).listen();
f2.add(customValue.value, 1).onChange(updateModel).listen();

ft.add(view.config, "tooltip").onChange(updateView);
ft.add(view.config, "showTooltips").name("Always show?").onChange(updateView);

f1.open();
ft.open();


f3.addColor(viewConfig, 'color1').name('Primary').onChange(val => {
    document.body.style.setProperty("--primary", val);
});
f3.addColor(viewConfig, 'color2').name('Secondary').onChange(val => {
    document.body.style.setProperty("--secondary", val);
});

f2.open();
f3.open();