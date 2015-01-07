# target: all - Default target. Minify JavaScript and CSS.
all: clean build-js build-css

# target: cordova - Minify JavaScript and CSS, and put files ready for Cordova distribution in the cordova folder.
cordova: clean build-js build-css cp-cordova


### Targets below here are generally just called from the targets above.

# target: build-css - Concatenate main CSS files and run YUI compressor.
build-css: appcache-timestamp rev-timestamp
	cat css/bootstrap.css css/bbgm.css css/bbgm-notifications.css css/DT_bootstrap.css | node_modules/.bin/cleancss -o gen/bbgm.css

# target: build-js - Run the RequireJS optimizer to concatenate and minify all JavaScript files.
build-js: appcache-timestamp rev-timestamp
	r.js -o baseUrl=js paths.requireLib=lib/require optimize=uglify2 preserveLicenseComments=false generateSourceMaps=true name=app include=requireLib mainConfigFile=js/app.js out=gen/app.js

# target: appcache-timestamp - Update the timestamp in bbgm.appcache so that browsers will look for changed files
appcache-timestamp:
	sed -i "s/LAST UPDATED:.*/LAST UPDATED: `date`/" bbgm.appcache

# target: rev-timestamp - Update the timestamp in index.html (year.month.date.minutes)
mins = $$((`date +"%_M"` + 60 * `date +"%_H"`))
rev-timestamp:
	sed -i "s/<!--rev-->.*<\/p>/<!--rev-->`date +"%Y.%m.%d"`.$(mins)<\/p>/" index.html
	sed -i "s/Bugsnag\.appVersion = \".*\"/Bugsnag.appVersion = \"`date +"%Y.%m.%d"`.$(mins)\"/" index.html

# target: clean - Delete files generated by `make all`.
clean:
	rm -f gen/app.js
	rm -f gen/bbgm.css

# target: cp-cordova - Move files needed for Cordova to the cordova folder, removing source maps.
cp-cordova:
	cp index.html cordova/index.html
	cp fonts/* cordova/fonts
	head -n -1 gen/app.js > cordova/gen/app.js # Copy while removing source maps comment
	cp gen/bbgm.css cordova/gen/bbgm.css



###

.PHONY: all check docs lint build-css build-js clean