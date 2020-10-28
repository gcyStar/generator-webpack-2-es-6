'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

module.exports = Generator.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ultimate ' + chalk.red('generator-webpack-2-es-6') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someAnswer',
      message: 'Would you like to enable this option?',
      default: true
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('dist'),
      this.destinationPath('dist')
    );
    this.fs.copy(
      this.templatePath('src'),
      this.destinationPath('src')
    );
    this.fs.copy(
      this.templatePath('view'),
      this.destinationPath('view')
    );
    this.fs.copy(
        this.templatePath('test'),
        this.destinationPath('test')
    );
    this.fs.copy(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
    this.fs.copy(
        this.templatePath('.eslintrc.js'),
        this.destinationPath('.eslintrc.js')
    );
    this.fs.copy(
        this.templatePath('package.json'),
        this.destinationPath('package.json')
    );
  },

  install: function () {
    // this.installDependencies();
  }
});
