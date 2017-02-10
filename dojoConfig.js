var dojoConfig = {
	async: true,
	isDebug: true,
	tlmSiblingOfDojo: false,
	baseUrl: '.',
	packages: [
		{ name: 'dojo', location: 'node_modules/dojo' },
		{ name: 'dijit', location: 'node_modules/dijit' },
		{ name: 'dgrid', location: 'node_modules/dgrid' },
		{ name: 'dstore', location: 'node_modules/dojo-dstore' },
		{ name: 'app', location: './src' }
	]
};
