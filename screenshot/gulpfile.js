    var gulp = require('gulp');
    var exec = require('child_process').exec;
    var spawn = require('child_process').spawn;
    var path = require('path');

    gulp.task('clean', function() { 
        return spawn('rm', ['-rf', path.join(__dirname, 'dist')])
    });

    gulp.task('build-ts', function(){
         return exec('webpack --watch',(error,stdout,stderr)=>{
            console.log(`build ts====>stdout: ${stdout}`);
            console.log(`build ts====>stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    });
    //自动重启服务器
    gulp.task('restart',function(){
        return exec('supervisor -w dist ./dist/main.js',(error,stdout,stderr)=>{
            console.log(`restart=====>stdout: ${stdout}`);
            console.log(`restart=====>stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    });

    gulp.task('default',gulp.series('clean',gulp.parallel('build-ts','restart')));
