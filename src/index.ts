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

import * as dat from 'dat.gui';
import './jquery.slider.ts';



class sliderPanel {
    updateModel(prop, val, slider) {

        slider.slider("update", { property: prop, value: val });
    }
    
    constructor(slider, elementOutput, config) {
        var gui = new dat.GUI({ autoPlace: false });


        var customContainer = document.getElementById(elementOutput);
        customContainer.appendChild(gui.domElement);

        const f1 = gui.addFolder("Config");
        const ft = gui.addFolder("Tooltips");
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
            "10.0": 10.0,
            "1000.0": 1000.0
        };



        f1.add(config, "min").step(1).onChange((val) => { this.updateModel("min", val, slider) });
        f1.add(config, "max").step(1).onChange((val) => { this.updateModel("max", val, slider) });
        f1.add(config, "step", steps).onChange((val) => { this.updateModel("step", val, slider) });
        f1.add(config, "multiple").onChange((val) => { this.updateModel("multiple", val, slider) });
        f1.add(config, "vertical").onChange((val) => { this.updateModel("vertical", val, slider) });

        ft.add(config, "tooltip").onChange((val) => { this.updateModel("tooltip", val, slider) });
        ft.add(config, "showTooltips").name("Always show?").onChange((val) => { this.updateModel("showTooltips", val, slider) });

        f1.open();
        ft.open();

        f3.addColor(config, 'color1').name('Primary').onChange(val => {
            document.body.style.setProperty("--primary", val);
        });
        f3.addColor(config, 'color2').name('Secondary').onChange(val => {
            document.body.style.setProperty("--secondary", val);
        });

        //f2.open();
        f3.open();

    }
}


let configSlider1 = Object.assign({}, {
    tooltip: true,
    vertical: false,
    showTooltips: true,
    color1: "#98890c",
    color2: "#431010",
    multiple:  null
}, { min: 0, max: 12000, step: 1, value: [2000, 7000] });

let configSlider2 = Object.assign({}, {
    tooltip: true,
    vertical: false,
    showTooltips: true,
    color1: "#98890c",
    color2: "#431010",
    multiple:  null
}, { min: 0, max: 20000, step: 10, value: [2000] });


let configSlider3 = Object.assign({}, {
    tooltip: true,
    vertical: true,
    showTooltips: true,
    color1: "#98890c",
    color2: "#431010",
}, { min: 0, max: 1000000, step: 1000, value: [234000] , multiple:  null});

let slider1 : any = $(".slider1").slider(configSlider1, "#range-value");
configSlider1.multiple = slider1.slider("getProperty",{property:"multiple"});
let slider2 : any= $(".slider2").slider(configSlider2, "#range-value2");
configSlider2.multiple = slider2.slider("getProperty",{property:"multiple"});
let slider3 : any = $(".slider3").slider(configSlider3, "#range-value3");
configSlider3.multiple = slider3.slider("getProperty",{property:"multiple"});
new sliderPanel(slider1,"my-gui-container",configSlider1)
new sliderPanel(slider2,"my-gui-container2",configSlider2)
new sliderPanel(slider3,"my-gui-container3",configSlider3)

