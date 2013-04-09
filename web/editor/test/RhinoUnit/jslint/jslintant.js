// jslintant.js
// The following is copied almost completely from John Snyders' blog at
//
// http://dev2dev.bea.com/blog/jsnyders/archive/2007/11/using_jslint_from_ant.html
//
// It is included as part of the rhinounit testsuite for completeness

importClass(java.io.File);
importClass(Packages.org.apache.tools.ant.util.FileUtils);
importClass(java.io.FileReader);

var options = attributes.get("options")
var fileset;
var ds;
var srcFiles;
var jsfile;
var fulljslint;
var lintfailed = false;
// read fulljslint and eval it into this script.
var jsLintPath = "jslint/fulljslint.js";
if (attributes.get("jslintpath")) {
	jsLintPath = attributes.get("jslintpath");
}

var jsLintFile = new File(jsLintPath);
if (jsLintFile.isAbsolute() === false)
{
	jsLintFile = new File(project.getProperty("basedir"), jsLintPath);
}

var readerLint = new FileReader(jsLintFile);
var fulljslint = new String(FileUtils.readFully(readerLint));
eval(fulljslint.toString());

// continue
self.log("Attribute options = " + options);
eval("options = " + options + ";");

var filesets = elements.get("fileset");
for (var j = 0; j < filesets.size(); j++) {
    fileset = filesets.get(j);

    ds = fileset.getDirectoryScanner(project);
    srcFiles = ds.getIncludedFiles();

    // for each srcFile
    for (i = 0; i < srcFiles.length; i++) {
        jsfile = new File(fileset.getDir(project), srcFiles[i]);

        checkFile(jsfile);
    }
}

if (lintfailed) {
	self.fail("JS Lint validation failed.")
}

function checkFile(file){
    // read the file into a string and make it a real
    // JavaScript string!
    var reader = new FileReader(file);
    // readFully returns java.lang.String
    // new String makes it a java String object
    var input = new String(FileUtils.readFully(reader));
    // this makes the type string, which is important
    // because JSLINT assumes that input is an array
    // if it is not typeof string.
    input = input.toString().replace(/\t/g,"    ");
    if (!input) {
        print("jslint: Couldn't open file '" + file.toString() + "'.");
        return;
    }
    if (!JSLINT(input, options)) {
        self.log("jslint: " + JSLINT.errors.length + " Problems found in " + file.toString());

        for (var i = 0; i < JSLINT.errors.length; i += 1) {
            var e = JSLINT.errors[i];
            if (e) {
                self.log('Lint at line ' + (e.line + 1) + ' character ' +
                        (e.character + 1) + ': ' + e.reason);
                self.log((e.evidence || '').
                        replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
               self.log('');
            }
        }
                self.log("<exclude name=\"" + file.toString() + "\"/>");

		lintfailed = true;
    } else {
        self.log("jslint: No problems found in " + file.toString());
    }
}
