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
import {View} from './View/View';
import {Model} from './Model/Model';
import {Config} from './View/View';
import {Presenter} from './Presenter/Presenter';
import * as dat from 'dat.gui';


const model: Model = new Model();


const config = new Config();

const view = new View("input", Object.assign({}, config, model.modelData));

const presenter = new Presenter(model,view);

var gui = new dat.GUI({ autoPlace: false });

var customContainer = document.getElementById('my-gui-container');
customContainer.appendChild(gui.domElement);
var customContainer = document.getElementById('my-gui-container');
customContainer.appendChild(gui.domElement);
const f1 = gui.addFolder("Config");
const ft = gui.addFolder("Tooltips");
//const f2 = gui.addFolder("Methods");
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

f1.add(config, "min").min(0).step(1).max(1000).onChange(updateConfig);
f1.add(config, "max").min(0).step(1).max(1000).onChange(updateConfig);
f1.add(config, "step", steps).onChange(updateConfig);
f1.add(config, "vertical").onChange(updateConfig);
f1.add(config, "multiple").onChange(updateConfig);


ft.add(config, "tooltip").onChange(updateConfig);
ft.add(config, "showTooltips").name("Always show?").onChange(updateConfig);


f1.open();
ft.open();

//f2.add(config, "init");
//f2.add(config, "destroy");


f3.addColor(config, 'color1').name('Primary').onChange(val => {
	document.body.style.setProperty("--primary", val);
});
f3.addColor(config, 'color2').name('Secondary').onChange(val => {
	document.body.style.setProperty("--secondary", val);
});

//f2.open();
f3.open();

function updateConfig(val) {
	const prop = this.property;
	
	if ( prop !== "tooltip" ) {
		view.input[prop] = val;
	} else {
		view.nodes.container.classList.toggle("has-tooltip", val);
	}
	
	if ( prop === "showTooltips" ) {
		view.nodes.container.classList.toggle("show-tooltip", val);
	}
	
	config[prop] = val;
	view.config[prop] = val;	

	if ( prop === "step" ) {
		view.setValue();
	}
	
	if ( prop === "vertical" || prop === "multiple" ) {
		view.destroy();
		setTimeout(() => {
			view.init();
		}, 10);
	} else {
		view.update();
	}
}
