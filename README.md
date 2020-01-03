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

# API

## Парамфетры
Параметр         |Тип       |Значение по умолчанию|Описание
-----------------|----------|---------------------|-----------------
min              |number    |0                    |Минимальное значение
max              |number    |100                  |Максимальное значение
step             |number    |1                    |Шаг слайдера
value            |number[]  |50                   |Значение слайдера
tooltip          |boolean   |true                 |Отображение подсказки
vertical         |boolean   |false                |Вертикльное расположение
showTooltips     |boolean   |true                 |Отбражение подсказки все время
color1           |string    |#3db13d              |Цвет шкалы 
color2           |string    |#ccc                 |Цвет остальных элементов

## Методы

Установить значение параметра слайдера
```JavaScript
$( '.slider' ).slider('setProperty', { min: 20 })
```

Получить значение параметра слайдера

```JavaScript
const parameter = $( '.slider' ).slider('getProperty','max');
```

Уничтожить объект
```JavaScript
$( '.slider' ).slider('destroy');
```

## Пример инициализации

```JavaScript
$( '.selector' ).slider({
      min: 1000, 
      max: 5000, 
      step: 10,
      value: 300,
      vertical: true
})
```

## Пример инициализации data-атрибуты

```html
<div class='slider' data-min=1000 data-max=5000 data-step=10 data-vertical='true' data-value=300></div>

<script>
 $( '.slider' ).slider()
</script>
```