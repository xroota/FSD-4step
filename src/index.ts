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
import './index.scss';
import * as dat from 'dat.gui';
import './jquery.slider.ts';
import { IViewConfig } from './View/View';


class SliderPanel {
  static updateModel(prop: string, val: number| number[] | boolean, slider: JQuery): void {
    slider.slider('setProperty', { property: prop, value: val });
  }

  constructor(slider, elementOutput, config) {
    const gui = new dat.GUI({ autoPlace: false });
    const customContainer = document.getElementById(elementOutput);
    customContainer.appendChild(gui.domElement);
    const f1 = gui.addFolder('Config');
    const ft = gui.addFolder('Tooltips');
    const steps = {
      0.001: 0.001,
      0.01: 0.01,
      0.1: 0.1,
      1: 1,
      1.25: 1.25,
      '2.0': 2.0,
      2.5: 2.5,
      '5.0': 5.0,
      '10.0': 10.0,
      100: 100.0,
      '1000.0': 1000.0,
    };


    f1.add(config, 'min').step(1).onChange((val) => { SliderPanel.updateModel('min', val, slider); });
    f1.add(config, 'max').step(1).onChange((val) => { SliderPanel.updateModel('max', val, slider); });
    f1.add(config, 'step', steps).onChange((val) => { SliderPanel.updateModel('step', val, slider); });
    f1.add(config, 'multiple').onChange((val) => { SliderPanel.updateModel('multiple', val, slider); });
    f1.add(config, 'vertical').onChange((val) => { SliderPanel.updateModel('vertical', val, slider); });
    ft.add(config, 'tooltip').onChange((val) => { SliderPanel.updateModel('tooltip', val, slider); });
    ft.add(config, 'showTooltips').name('Always show?').onChange((val) => { SliderPanel.updateModel('showTooltips', val, slider); });

    f1.open();
    ft.open();
  }
}


const configColor = {
  color1: '#98890c',
  color2: '#431010',
};
const gui = new dat.GUI({ autoPlace: false });

const customContainer = document.getElementById('color-config__container');
customContainer.appendChild(gui.domElement);
const f = gui.addFolder('Color');

f.addColor(configColor, 'color1').name('Primary').onChange((val) => {
  document.body.style.setProperty('--primary', val);
});
f.addColor(configColor, 'color2').name('Secondary').onChange((val) => {
  document.body.style.setProperty('--secondary', val);
});
f.open();


const configSlider1: IViewConfig = {
  tooltip: true,
  vertical: false,
  showTooltips: true,
  min: 0,
  max: 12000,
  step: 1,
  value: [2000, 4000],
  color1: configColor.color1,
  color2: configColor.color2,

};

const configSlider2: IViewConfig = {
  tooltip: true,
  vertical: false,
  showTooltips: true,
  min: 0,
  max: 20000,
  step: 10,
  value: [2000],
  color1: configColor.color1,
  color2: configColor.color2,
};

const configSlider3: IViewConfig = {
  tooltip: true,
  vertical: true,
  showTooltips: true,
  min: 0,
  max: 1000000,
  step: 1000,
  value: [234000, 567000],
  color1: configColor.color1,
  color2: configColor.color2,
};

const configSlider4: IViewConfig = {
  tooltip: true,
  vertical: true,
  showTooltips: true,
  min: 3000,
  max: 15000,
  step: 100,
  value: [7600],
  color1: configColor.color1,
  color2: configColor.color2,
};
const slider1: JQuery = $('.slider-panel__slider1').slider(configSlider1, '#slider-panel__value1') as JQuery;
configSlider1.multiple = slider1.slider('getProperty', { property: 'multiple' }) as boolean;
const slider2: JQuery = $('.slider-panel__slider2').slider(configSlider2, '#slider-panel__value2') as JQuery;
configSlider2.multiple = slider2.slider('getProperty', { property: 'multiple' }) as boolean;
const slider3: JQuery = $('.slider-panel__slider3').slider(configSlider3, '#slider-panel__value3') as JQuery;
configSlider3.multiple = slider3.slider('getProperty', { property: 'multiple' }) as boolean;
const slider4: JQuery = $('.slider-panel__slider4').slider(configSlider4, '#slider-panel__value4') as JQuery;
configSlider4.multiple = slider4.slider('getProperty', { property: 'multiple' }) as boolean;

const sliderPanel1 = new SliderPanel(slider1, 'slider-panel__container1', configSlider1);
const sliderPanel2 = new SliderPanel(slider2, 'slider-panel__container2', configSlider2);
const sliderPanel3 = new SliderPanel(slider3, 'slider-panel__container3', configSlider3);
const sliderPanel4 = new SliderPanel(slider4, 'slider-panel__container4', configSlider4);
