/* ---- TagPickerController.js ---- */
ensurePackage("rhinounit.example.tagpicker");

rhinounit.example.tagpicker.TagPickerController = function (tagPickerInputView, tagRepository) {

	var instance = this;
	var awaitingSomething = false;
	var tagNameHasChanged = false;
	
	function onLoad() {
		tagPickerInputView.registerOnKeyPressListenerOnTagTextInput(instance.partialTagNameUpdated);
	}
	
	function updateViewWithMatchedTags(matchedTags) {
		tagPickerInputView.updateMatchingTags(matchedTags);
		tagPickerInputView.hideLoadMessage();
		awaitingSomething = false;
		if (tagNameHasChanged) {
			tagNameHasChanged = false;
			instance.partialTagNameUpdated();
		}
	}
	
	this.partialTagNameUpdated = function () {
		tagPickerInputView.showLoadMessage();
		var partialTagName = tagPickerInputView.getPartialTagName();
		if (partialTagName !== "") {
			findTagsByPartial(partialTagName);
		} else {
			tagPickerInputView.hideMatchedTags();
		}
	};
	
	function findTagsByPartial(tagName) {
		if (!awaitingSomething) {
			awaitingSomething = true;
			tagRepository.findMatchingTags(tagName, updateViewWithMatchedTags);
		} else {
			tagNameHasChanged = true;
		}
	}
	
	this.init = function () {
		tagPickerInputView.addLoadEvent(onLoad);
	};

};
