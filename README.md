# FSD Slider

## Развёртывание
Клонировать
>git clone https://github.com/xroota/FSD-4step.git

Установка
>npm i

Запустить webpack server
>npm run start

Запустить karma тесты
>npm run test

Запустить production build
>npm run build

Запустить Eslint по файлам проекта
> npm run eslint-fix


## Тестовая страница 

[Ссылка](https://xroota.github.io/FSD-4step/dist/index.html)

# Архитектура проекта

Имя класса      | Описание
----------------|----------------------               |
EventObserver   | Реализует паттерн 'наблюдатель'
IEventData      | Интерфейс оповещения об изменении состояния других объектов
MODEL           | 
IModwelConfig   | Интерфейс параметров модели
Model           | Содержит бизнес-логику
VIEW            | 
IViewConfig     | Интерфейс параметров Вида
View            | Отображение данных
PRESENTER       | 
Presenter       | Реализует взаимодействие между Моделью и Видом


## UML диаграмма классов

![Diagram](https://github.com/xroota/FSD-4step/blob/master/uml.png)

# Overview

The tutorial explaining how to use this repo and it's directory structure and
configuration files are in this
[developerlife.com tutorial](http://developerlife.com/2019/07/06/starter-project-typescript-karma-jasmine-webpack/).

<img src="https://raw.githubusercontent.com/nazmulidris/ts-template/master/arch-diagram.jpg" width="50%"></img>

# References

## TypeScript



TypeScript intro

- https://www.youtube.com/watch?v=XShQO3BvOyM

TypeScript and Webpack 4 intro

- https://www.youtube.com/watch?v=8TiZdePyduI
- https://github.com/GeekLaunch/webpack-tutorial
- https://github.com/TypeStrong/ts-loader

## Webpack 4

Webpack 4

- https://wanago.io/2018/07/16/webpack-4-course-part-one-entry-output-and-es6-modules/

Webpack configuration

- https://webpack.js.org/configuration/devtool/
- https://medium.com/@rajaraodv/webpack-the-confusing-parts-58712f8fcad9

Webpack dev server configuration

- https://github.com/webpack/webpack-dev-server/issues/720#issuecomment-268470989
- https://webpack.js.org/guides/development/#using-webpack-dev-server

## Karma, Jasmine

Karma, Jasmine

- http://www.bradoncode.com/blog/2015/02/27/karma-tutorial/
- https://stackoverflow.com/a/17327465/2085356

## All together

Karma, Jasmine, and Webpack setup

- https://mike-ward.net/2015/09/07/tips-on-setting-up-karma-testing-with-webpack/

TypeScript migrate from typings to npm @types

- http://codereform.com/blog/post/migrating-from-typings-to-npm-types/

TypeScript, Webpack, Jasmine, and Karma

- https://templecoding.com/blog/2016/02/02/how-to-setup-testing-using-typescript-mocha-chai-sinon-karma-and-webpack
- https://github.com/thitemple/TypescriptMochaWebpackDemo
# FSD-4step

