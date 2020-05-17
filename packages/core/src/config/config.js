const { NODE_ENV } = process.env;

const config = {
  developMode: NODE_ENV !== "production"
};

const isDevelopMode = config.developMode === true;

const setDevelopMode = developMode => {
  config.developMode = !!developMode;
};

module.exports = {
  config,
  isDevelopMode,
  setDevelopMode
};
