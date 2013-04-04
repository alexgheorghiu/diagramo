/* ---- TagPickerInputView.js ---- */
ensurePackage("rhinounit.example.tagpicker");

rhinounit.example.tagpicker.TagPickerInputView = function (templateRenderer, tagPickerDivId) {

	this.addLoadEvent = function (callback) {
		addSafeLoadEvent(callback);
	};
		
	function getTagPickerDiv() {
		return document.getElementById(tagPickerDivId);
	}
	
	function getTagPickerInputElement() {
		return getElementsByClassName("tag-picker-input", "input", getTagPickerDiv())[0];
	}
	
	function getTagPickerMatchedTagsElement() {
		return getElementsByClassName("tag-picker-matched-tags", "div", getTagPickerDiv())[0];
	}
	
	function getTagPickerLoadMessageElement() {
		return getElementsByClassName("tag-picker-load-message", "div", getTagPickerDiv())[0];
	}
	
	this.registerOnKeyPressListenerOnTagTextInput = function (callback) {
		addEvent(getTagPickerInputElement(), 'keyup', callback);
	};

	this.updateMatchingTags = function (tags) {
		var targetElement = getTagPickerMatchedTagsElement();
		templateRenderer.renderTemplate(targetElement, tags);
	};
	
	this.getPartialTagName = function () {
		return getTagPickerInputElement().value;
	};
	
	this.hideMatchedTags = function () {
		getTagPickerMatchedTagsElement().innerHTML = "";
	};
	
	this.hideLoadMessage = function () {
		getTagPickerLoadMessageElement().style.display = "none";
	};
	
	this.showLoadMessage = function () {
		getTagPickerLoadMessageElement().style.display = "block";
	};

};
