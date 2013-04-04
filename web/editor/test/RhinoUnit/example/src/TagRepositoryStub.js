/* ---- TagRepositoryStub.js ---- */
ensurePackage("rhinounit.example.tagpicker");

rhinounit.example.tagpicker.TagRepositoryStub = function () {
	this.findMatchingTags = function (tagName, callback) {
		setTimeout(function () {
			var matchedTags = [
				{
					id: 123,
					internalName: tagName + "-fooo (Keyword)",
					type: "Keyword"
				},
				{
					id: 234,
					internalName: tagName + "-duplex (Series)",
					type: "Series"
				},
				{
					id: 345,
					internalName: tagName + "-hoopla (Keyword)",
					type: "Keyword"
				},
				{
					id: 456,
					internalName: tagName + "-cheese (Keyword)",
					type: "Keyword"
				}
			];
			callback(matchedTags);
		}, 1000 + (2000 * Math.random())); // random delay to demonstrate race conditions
	};
};
