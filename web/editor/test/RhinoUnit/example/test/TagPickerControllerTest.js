var navigator = {};
var document = {};
eval(loadFile("example/lib/adminUtils.js"));
eval(loadFile("example/src/TagPickerController.js"));

var controller;
var tagPickerInputView;
var tagRepository;

testCases(test,
	function setUp() {
		tagRepository = {
			findMatchingTags : function () {}
		};
		
		tagPickerInputView = {
			registerOnKeyPressListenerOnTagTextInput: function () {},
			addLoadEvent : function (loadAction) {
                loadAction();
            },
			getPartialTagName : function () {},
			updateMatchingTags : function () {},
			hideMatchedTags : function () {},
			showLoadMessage : function () {},
			hideLoadMessage : function () {}
		};
        controller = new rhinounit.example.tagpicker.TagPickerController(tagPickerInputView, tagRepository);
	},
	
	function shouldRegisterOnLoadEventWithTagPickerInputView() {
		assert.mustCall(tagPickerInputView, "addLoadEvent");
		controller.init();
	},
	
	function shouldRegisterKeyPressWithTagPickerInputView() {
		tagPickerInputView.registerOnKeyPressListenerOnTagTextInput = function (callback) {
			assert.that(callback, eq(controller.partialTagNameUpdated));
		};
		assert.mustCall(tagPickerInputView, "registerOnKeyPressListenerOnTagTextInput");
		controller.init();
	},
	
	function shouldPopulateViewWithTagsThatMatchesPartialName() {
		tagRepository.findMatchingTags = function (tagName, callback) {
			callback();
		};
		assert.mustCall(tagPickerInputView, "updateMatchingTags");
		controller.partialTagNameUpdated();
	},
	
	function shouldGetPartialNameFromViewOnPartialNameUpdate() {
		assert.mustCall(tagPickerInputView, "getPartialTagName");
		controller.partialTagNameUpdated();
	},
	
	function shouldPassThePartialTagNameToTheTagRepositoryToRetriveMatchingTags() {
		var tagName = "foo";
		tagRepository.findMatchingTags = function (actualTagName, callback) {
			assert.that(actualTagName, eq(tagName));
		};
		tagPickerInputView.getPartialTagName = function () {
			return tagName;
		};
		
		controller.partialTagNameUpdated();
	},
	
	function shouldUpdateMatchedTagsWithValuesReturnedFromTagRepository() {
		var matchedTags = [{}, {}, {}];
		tagRepository.findMatchingTags = function (tagName, callback) {
			callback(matchedTags);
		};
		tagPickerInputView.updateMatchingTags = function (actualMatchedTags) {
			assert.that(actualMatchedTags, eq(matchedTags));
		};
		
		controller.partialTagNameUpdated();
	},
	
	function shouldSetMatchedTagsToEmptyIfPartialTagNameIsBlank() {
		var tagName = "";
		tagPickerInputView.getPartialTagName = function () {
			return tagName;
		};
		assert.mustCall(tagPickerInputView, "hideMatchedTags");
		controller.partialTagNameUpdated();
	},
	
	function shouldNotFireMultipleRequestsToTagRepository() {
		assert.mustCallNTimes(tagRepository, 1, "findMatchingTags");
		
		controller.partialTagNameUpdated();
		controller.partialTagNameUpdated();
	},
	
	function shouldNotFireMultipleRequestsToTagRepositoryUntilResponseHasBeenReceived() {
		tagRepository.findMatchingTags = function (tagName, callback) {
			callback();
		};
		assert.mustCallNTimes(tagRepository, 2, "findMatchingTags");
		
		controller.partialTagNameUpdated();
		controller.partialTagNameUpdated();
	},
	
	function shouldNotFireMultipleRequestsToTagRepositoryUntilResponseHasBeenReceived() {
		tagRepository.findMatchingTags = function (tagName, callback) {
			callback();
		};
		assert.mustCallNTimes(tagRepository, 2, "findMatchingTags");
		
		controller.partialTagNameUpdated();
		controller.partialTagNameUpdated();
	},

	function shouldRequestTagsAgainIfPartialTagNameHasUpdatedWhileWaitingForRequest() {
		var expectedTagName;
		var actualCallback;
		tagRepository.findMatchingTags = function (actualTagName, callback) {
			assert.that(actualTagName, eq(expectedTagName));
			actualCallback = callback;
		};
		assert.mustCallNTimes(tagRepository, 2, "findMatchingTags");
		
		var tagName = "";
		tagPickerInputView.getPartialTagName = function () {
			return tagName;
		};

		/* send a request for 'f' */
		tagName = "f";
		expectedTagName = "f";
		controller.partialTagNameUpdated();
		
		/* we are in the middle of a request, don't send one for 'fo' */
		tagName = "fo";
		controller.partialTagNameUpdated();

		/* still in the middle of a request, don't send */
		tagName = "foo";
		expectedTagName = "foo";
		controller.partialTagNameUpdated();
		
		/* got request back, but the tagName has changed, so send another one! */
		actualCallback();
	},

	function shouldNotRequestTagsAgainIfAlreadyGotRequestForUpdatedPartialTagName() {
		var expectedTagName;
		var actualCallback;
		tagRepository.findMatchingTags = function (actualTagName, callback) {
			actualCallback = callback;
		};
		
		var tagName = "";
		tagPickerInputView.getPartialTagName = function () {
			return tagName;
		};

		tagName = "f";
		controller.partialTagNameUpdated();
		
		/* we are in the middle of a request, don't send one for 'fo' */
		/* this will result in the controller thinking that the tagName has changed */
		tagName = "fo";
		controller.partialTagNameUpdated();
		
		/* got request back, but the tagName has changed, so we will send another one! */
		tagRepository.findMatchingTags = function (actualTagName, callback) {
			callback();
		};
		assert.mustCallNTimes(tagRepository, 1, "findMatchingTags");
		actualCallback();
		
	},
	
	function shouldDisplayLoadMessageWhenWaitingForResponseFromTagRepository() {
		assert.mustCall(tagPickerInputView, "showLoadMessage");
		controller.partialTagNameUpdated();
	},
	
	function shouldHideLoadMessageWhenResponseReceivedFromTagRepository() {
		tagRepository.findMatchingTags = function (tagName, callback) {
			callback();
		};
		assert.mustCall(tagPickerInputView, "hideLoadMessage");
		controller.partialTagNameUpdated();
	});
