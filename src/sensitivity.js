var calc = function(cm360, zoom=1) {
	var zoomfactor = zoom == 1 ? 1 : 1.6*zoom;
	return -0.3+11.7581/Math.pow((cm360*storage.dpi/(zoomfactor)), 1/3);
};

var uncalc = function(sense, zoom=1) {
	var zoomfactor = zoom == 1 ? 1 : zoom*1.6;
	return zoomfactor/storage.dpi * Math.pow(((sense+0.3)/11.7581), -3)
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
var storage = { dpi: 800, sensitivities: {"MouseSensitivity": 0.10763055999711002}, proportional: true };
(function() {
	var ls = window.localStorage && window.localStorage["sensitivity.js"] && JSON.parse(window.localStorage["sensitivity.js"]);
	if (ls) {
		for (var i in ls) {
			if (storage[i] !== undefined && ls[i] !== null && ls[i] !== undefined)
				storage[i] = ls[i];
		}
	}
})();
var saveStorage = function() {
	window.localStorage["sensitivity.js"] = JSON.stringify(storage);
};
var updateTypes = function() {
	if (storage.proportional) {
		var ms = storage.sensitivities["MouseSensitivity"];
		var pr = calc(uncalc(ms, 1) * 1.35, 1.35)
		for (var t in sensitivityTypes) {
			if (t == "MouseSensitivity") {
				continue;
			}
			storage.sensitivities[t] = pr;
		}
	}
	for (var t in sensitivityTypes) {
		var type = sensitivityTypes[t];
		var current = storage.sensitivities[t];
		type.valueInput.val(current);
		for (var l in type.levels) {
			type.levels[l].val(parseFloat(uncalc(current, l).toFixed(11)));
		}
	}
	saveStorage();
};

var target = $("#sensitivityTarget");
var dpiContainer = $("<tr><td><h4>DPI</h4></td><td align=right><input/></td></tr>");
var proportionalContainer = $("<tr><td><h4>Proportional?</h4></td><td align=right><input type=checkbox></td></tr>");
target.append(dpiContainer);
target.append(proportionalContainer);
var dpiInput = dpiContainer.find("input");
var proportionalInput = proportionalContainer.find("input");
dpiInput.on("change", function(e) { storage.dpi = dpiInput.val(); updateTypes(); });
dpiInput.val(storage.dpi);
proportionalInput.prop('checked', storage.proportional);
proportionalContainer.on("change", function(e) { storage.proportional = !!proportionalInput.prop('checked'); updateTypes(); });
for (var t_ in sensitivityTypes) {
	(function() {
		var t = t_;
		var type = sensitivityTypes[t];
		var block = $("<tr><td><h4>" + type.name + "</h4></td><td align=right><input/></td></tr>");
		target.append(block);
		type.valueInput = block.find("input");
		type.valueInput.on('change', function() {
			storage.sensitivities[t] = +type.valueInput.val();
			if (storage.proportional && t != "MouseSensitivity") {
				storage.sensitivities["MouseSensitivity"] = calc(uncalc(+type.valueInput.val(), 1.35)/1.35, 1)
			}
			updateTypes();
		});
		var ks = Object.keys(type.levels).sort(function (a, b) { return a - b; });
		for (var l_ in ks) {
			(function() {
				var l = ks[l_];
				var row = $("<tr><td>" + l + "x &nbsp;</td><td><input class='cm360' type=text/>cm/360</td></tr>")
				var input = row.find("input");
				input.on('change', function() {
					storage.sensitivities[t] = calc(+input.val(), l);
					if (storage.proportional && t != "MouseSensitivity") {
						storage.sensitivities["MouseSensitivity"] = calc(+input.val()/l, 1)
					}
					updateTypes();
				});
				type.levels[l] = input;
				target.append(row);
			})();
		}
	})();
}

updateTypes();

var tarea = $("<textarea/>")
target.append(tarea);
