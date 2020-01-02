import "./jquery.slider.ts";
describe("JQuery Slider", () => {
	let slider1;

	beforeEach(() => {
		setFixtures("<div class=\"slider slider1\"></div> <input id=\"output\">");
		slider1 = $(".slider1").slider(
			{
				tooltip: true,
				vertical: false,
				showTooltips: true,
				min: 0,
				max: 12000,
				step: 1,
				value: [2000, 4000]
			},
      "output"
    );
	});

	describe("JQuery Slider", () => {


		//expect($(".slider1")).toBeDefined();
	}); 
});
