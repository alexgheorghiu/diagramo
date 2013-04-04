/* ---- TemplateRenderer.js ---- */
ensurePackage("rhinounit.example");

rhinounit.example.TemplateRenderer = function () {

	var instance = this;

	this.renderTemplate = function (targetElement, tags) {
		var result = ['<ol>'];
		forEachElementOf(tags, function (tag) {
			result.push('<li>');
			result.push(tag.internalName);
			result.push('</li>');
		});
		result.push('</ol>');
		targetElement.innerHTML = result.join('');
	};
	
};
