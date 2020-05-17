const { config, isDevelopMode, setDevelopMode } = require("./config/config");

const { container, clear } = require("./container/container");
const { register, registerLazyLoader } = require("./container/register");
const { resolve } = require("./container/resolve");

const { Inject, inject } = require("./injects/inject");
const { Bind, bind } = require("./injects/bind");
const { Named, named } = require("./injects/named");

const { Provides, provides } = require("./provides/provides");
const { Singleton, singleton } = require("./provides/singleton");
const { registerModule } = require("./provides/module");

module.exports = {
  config,
  isDevelopMode,
  setDevelopMode,
  container,
  clear,
  register,
  registerLazyLoader,
  resolve,
  Inject,
  inject,
  Bind,
  bind,
  Named,
  named,
  Provides,
  provides,
  Singleton,
  singleton,
  registerModule
};
