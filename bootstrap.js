require([
	'app/IssueViewer'
], function (IssueViewer) {
	var viewer = window.viewer = new IssueViewer();
	viewer.placeAt('wrapper');
	viewer.startup();
});
