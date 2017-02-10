define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dojo/text!./templates/IssueViewer.html',
	'dojo/request/script',
	'dstore/Memory',
	'dstore/Trackable',
	'dojo/_base/lang',
	'dgrid/OnDemandGrid',
	// widgets used in template
	'dijit/form/TextBox',
	'dijit/form/Button'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, requestScript, Memory, Trackable, lang, OnDemandGrid) {
	var TrackableStore = declare([Memory, Trackable]);
	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,
		store: null,
		postCreate: function () {
			this.inherited(arguments);
			this._createStore();
			this._createGrid();
			this.own(this.submitButton.on('click', lang.hitch(this, '_onSubmit')));
		},

		_createStore: function () {
			this.store = new TrackableStore();
		},

		_createGrid: function () {
			this.grid = new OnDemandGrid({
				columns: {
					title: 'Title',
					user: {
						label: 'Author',
						renderCell: function (object, value) {
							var node = document.createElement('div');
							var imgNode = document.createElement('img');
							imgNode.src = object.user.avatar_url;
							node.appendChild(imgNode);
							imgNode.classList.add('avatar');
							var username = document.createElement('div');
							username.innerHTML = '<a href="' + object.user.html_url + '">@' + object.user.login + '</a>';
							node.appendChild(username);
							return node;
						},
						get: function (obj) {
							return obj.user.login;
						}
					},
					body: {
						label: 'Body',
						get: function (obj) {
							return obj.body.substring(0, 200);
						}
					}
				},
				collection: this.store
			}, this.gridNode);
		},

		startup: function () {
			if (this._started) {
				return;
			}
			this.inherited(arguments);
			this.grid.startup();
		},

		_onSubmit: function () {
			var project = this.projectInput.get('value');
			this._requestData(project).then(function (data) {
				data.forEach(function (item) {
					this.store.put(item);
				}.bind(this));
				// this.store = new Memory({ data: data });
				// this.grid.set('collection', this.store);
			}.bind(this));
		},

		_requestData: function(project) {
			// https://api.github.com/repos/Microsoft/TypeScript/issues
			var url = 'https://api.github.com/repos/' + project + '/issues';
			var promise = requestScript(url, {
				handleAs: 'json',
				jsonp: 'callback'
			}).then(function (data) {
				return data.data;
			});

			return promise;
		}
	});
});
