var Synservice = function (service, parameterGroups) {
  this.services = parameterGroups.map(function(parameters) {
    return new service(parameters);
  });
}

Synservice.prototype.applyMethod = function(method) {
  var params = Array.prototype.slice.call(arguments, 1);
  var responses = this.services.map(function(service) {
    return service[method].apply(service, params);
  });
  return this._join(responses);
}

Synservice.prototype._join = function(responses) {
  return responses.reduce(this._joinFields.bind(this), {});
}

Synservice.prototype._joinFields = function(into, from) {
  for(var field in from) {
    if(into[field] && typeof(into[field] == 'object')) {
      this._joinField(into[field], from[field]);
    } else {
      into[field] = from[field];
    }
  }
  return into;
}

Synservice.prototype._joinField = function(into, from) {
  if(into.slice == Array.prototype.slice) {
    from.forEach(function(element) { into.push(element); });
  } else {
    this._joinFields(into, from);
  }
}

if(typeof(module) != 'undefined') {
  module.exports = Synservice;
} else {
  window.Synservice = Synservice;
}
