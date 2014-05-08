AWS.config.update({region: 'us-east-1'});

var Voluble = {
  setup: function() {
    this.bindSubmit(this.Credentials);
    this.bindSubmit(this.Volumes);
    this.bindDisplay(this.Message);
  },

  bindSubmit: function(type) {
    formSelector = '#' + type.formName;
    type.form = $(formSelector);
    submitFunction = type.submit.bind(type);
    type.form.submit(submitFunction);
  },

  bindDisplay: function(type) {
    displaySelector = '#' + type.displayName;
    type.display = $(displaySelector);
  }
}

Voluble.Credentials = {
  formName: 'credentials',

  submit: function(event) {
    this.configure();
    this.validate({
      valid: this.transition,
      invalid: this.retry
    });
    event.preventDefault();
  },

  configure: function() {
    var data = this.form.serializeArray();
    var account = this.account(data);
    AWS.config.update(account);
  },

  account: function(data) {
    return data.reduce(function(object, credential) {
      object[credential.name] = credential.value;
      return object;
    }, {})
  },

  validate: function(callbacks) {
    var ec2 = new AWS.EC2();
    ec2.describeAccountAttributes(function(error) {
      if(error) {
        callbacks.invalid();
      } else {
        callbacks.valid();
      }
    });
  },

  transition: function() {
    Voluble.Message.send('transition');
  },

  retry: function() {
    Voluble.Message.send('retry');
  }
}

Voluble.Volumes = {
  formName: 'volumes',

  submit: function(event) {
  }
}

Voluble.Message = {
  displayName: 'message',

  send: function(message) {
    this.display.html(message);
  }
}

Voluble.EC2 = {
  ec2s: [],

  setup: function() {
    primaryEC2 = new AWS.EC2({region: 'us-east-1'});
    regions = primaryEC2.describeRegions(regionsOrBadCredentials);
    ec2s.push(primaryEC2);
  },

  regionsOrBadCredentials: function() {
  }
}


$(function() {
  Voluble.setup();
});
