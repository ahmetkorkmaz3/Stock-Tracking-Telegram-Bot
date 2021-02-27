const commandArgs = () => (ctx, next) => {
  if (ctx.updateType == "message" && ctx.update.message.text) {
    const text = ctx.update.message.text.toLowerCase();
    if (text.startsWith("/")) {
      const match = text.match(/^\/([^\s]+)\s?(.+)?/);
      let arg = '';
      let command;
      if (match !== null) {
        if (match[1]) {
          command = match[1];
        }
        if (match[2]) {
          arg = match[2].split(" ")[0];
        }
      }

      ctx.state.command = {
        raw: text,
        command,
        arg,
      };
    }
  }
  return next();
};

module.exports = commandArgs;
