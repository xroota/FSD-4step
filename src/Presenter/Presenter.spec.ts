import { Presenter } from './Presenter';
import { View, ViewConfig } from '../View/View';
import { Model, ModelData } from '../Model/Model';



describe('Presenter', () => {
    let model: Model;
    let view: View;
    let presenter: Presenter;
    let modelConfig = new ModelData();
    let viewConfig;
    beforeEach(() => {
        s

        modelConfig = {
            min: 1000,
            max: 2000,
            step: 10,
            value: [1500]
        };

        viewConfig = {
            tooltip: true,
            vertical: false,
            showTooltips: true,

        };
        model = new Model(modelConfig);

        view = new View($('.slider'), Object.assign({}, model.modelData, viewConfig));
        presenter = new Presenter(model, view, (".output" as string));
    });


    it('должен создавться с параметрами по умолчанию', () => {
        model = new Model();
        setFixtures("<>");

        view = new View($('.slider'),model.modelData);
        presenter = new Presenter(model, view, (".output" as string));
        expect(presenter.model.modelData).toEqual({ min: 1, max: 100, step: 1, value: [ 50 ], multiple: false });
        expect(presenter.view.config).toEqual({ tooltip: true, showTooltips: true, multiple: false, color1: '#3db13d', color2: '#ccc', min: 1, max: 100, step: 1, value: [ 50 ] });
    });

    it('должен создавться с одиночным значением', () => {
        model = new Model();

        view = new View($('.slider'),model.modelData);
        presenter = new Presenter(model, view, (".output" as string));
        expect(presenter.model.modelData).toEqual({ min: 1, max: 100, step: 1, value: [ 50 ], multiple: false });
        expect(presenter.view.config).toEqual({ tooltip: true, showTooltips: true, multiple: false, color1: '#3db13d', color2: '#ccc', min: 1, max: 100, step: 1, value: [ 50 ] });
    });


        it('должен создавться для интервала значений', () => {
        modelConfig = {
            min: 1000,
            max: 2000,
            step: 10,
            value: [1500]
        };

        viewConfig = {
            tooltip: true,
            vertical: false,
            showTooltips: true,

        };
        model = new Model(modelConfig);

        view = new View($('.slider'), Object.assign({}, model.modelData, viewConfig));
        presenter = new Presenter(model, view, (".output" as string));
        expect(presenter.model.modelData).toEqual({ min: 1, max: 100, step: 1, value: [ 50 ], multiple: false });
        expect(presenter.view.config).toEqual({ tooltip: true, showTooltips: true, multiple: false, color1: '#3db13d', color2: '#ccc', min: 1, max: 100, step: 1, value: [ 50 ] });
    });












});  