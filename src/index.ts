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
import {Car} from './Car';
import {View} from './View/View';
import {Model} from './Model/Model';
import {Config} from './View/View';
import {Presenter} from './Presenter/Presenter';


console.log('hi');
const car: Car = new Car(); 
car.go('vroom');
const model: Model = new Model();


const config = new Config();

const view = new View("input", Object.assign({}, config, model.modelData));

const presenter = new Presenter(model,view);

//view.show('hi, world!');
//view.show('hi, world!');
