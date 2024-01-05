function injectMessage(message, data) {
  let inject = (str, obj) => str.replace(/{(.*?)}/g, (x, g) => obj[g]);
  let msg = inject(message, data);
  return msg;
}

export { injectMessage };