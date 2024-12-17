const pkg = require("./package.json");

class MyPlugin {
	apply(compiler) {
		compiler.hooks.emit.tapAsync("BuildPackageJson", (compilation, callback) => {
			console.log("构建 package.json ....");

			const myBuildPackageJson = {
				name: `${pkg.name}-builder`,
				version: pkg.version,
				dependencies: pkg.dependencies
			};

			compilation.assets['package.json'] = {
				source: () => JSON.stringify(myBuildPackageJson, null, 2),
				size: () => Buffer.byteLength(JSON.stringify(myBuildPackageJson, null, 2), 'utf8')
			};

			console.log('package.json 文件构建完成！');
			callback();
		});
	}
}

module.exports = MyPlugin;
