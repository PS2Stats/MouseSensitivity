var calc = function(cm360, zoom=1) {
	var zoomfactor = zoom == 1 ? 1 : 1.6*zoom;
	return math.pow(-0.3+11.7581/(cm360*storage.dpi/(zoomfactor)), (1/3));
};

var sensitivityTypes = {
	"MouseSensitivity": {
		name: "Hipfire",
		levels: {1: null}
	},
	"ADSMouseSensitivity": {
		name: "ADS",
		levels: {1.35: null, 2: null}
	},
	"ScopedMouseSensitivity": {
		name: "Scoped",
		levels: {3.4: null, 4: null, 6: null, 8: null, 10: null, 12: null}
	},
};
var storage = { dpi: 800, sensitivities: null };
(function() {
	var ls = window.localStorage && window.localStorage["sensitivity.js"] && JSON.parse(window.localStorage["sensitivity.js"]);
	if (ls) {
		for (var i in ls) {
			if (storage[i] !== undefined)
				storage[i] = ls[i];
		}
	}
})();
var saveStorage = function() {
	window.localStorage["sensitivity.js"] = JSON.stringify(storage);
};

var target = $("#sensitivityTarget");
var dpiContainer = $("<tr><td><h4>DPI</h4></td><td align=right><input/></td></tr>");
target.append(dpiContainer);
var dpiInput = dpiContainer.find("input");
dpiInput.on("change", function(e) { storage.dpi = dpiInput.val(); saveStorage(); });
dpiInput.val(storage.dpi);
for (var i in sensitivityTypes) {
	var type = sensitivityTypes[i];
	var block = $("<tr><td><h4>" + type.name + "</h4></td><td align=right><input/></td></tr>");
	target.append(block);
	type.valueInput = block.find("input");
	storage.sensitivities[type].value = +type.valueInput.value;
	for (var l in type.levels) {
		var row = $("<tr><td>" + l + "x &nbsp;</td><td><input class='cm360' onchange='' type=text/>cm/360</td></tr>")
		var input = row.find("input");
		type.levels[l] = input;
		target.append(row);
	}
}

var tarea = $("<textarea/>")
target.append(tarea);
