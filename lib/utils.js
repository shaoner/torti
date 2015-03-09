module.exports.flattenBody = function (obj) {
    var bData = { };
    var _flatten = function (obj, data) {
        if (typeof obj == 'object') {
            for (var subKey in obj) {
                data.push(subKey);
                data = _flatten(obj[subKey], data, bData);
                data.pop();
            }
        } else {
            var sProp = data[0];
            for (var i = 1, len = data.length; i < len; ++i) {
                sProp += '[' + data[i] + ']';
            }
            bData[sProp] = obj;
        }
        return data;
    };
    _flatten(obj, [ ]);
    return bData;
};
