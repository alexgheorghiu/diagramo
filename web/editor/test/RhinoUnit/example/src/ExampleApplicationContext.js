/* ---- ExampleApplicationContext.js ---- */
ensurePackage("rhinounit.example");

rhinounit.example.tagpicker.ExampleApplicationContext = function (serverData) {
	this.createTagPickerController = function (tagPickerDivId) {
        var templateRenderer = new rhinounit.example.TemplateRenderer();
        var tagPickerInputView = new rhinounit.example.tagpicker.TagPickerInputView(templateRenderer, tagPickerDivId);
        var tagRepository = new rhinounit.example.tagpicker.TagRepositoryStub();
        return new rhinounit.example.tagpicker.TagPickerController(tagPickerInputView, tagRepository);
	};

};
