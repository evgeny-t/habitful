import _ from 'lodash';

export default function wrap(module) {
  for (let k in module.exports) {
    if (typeof module.exports[k] === 'function') {
      const property = Object.getOwnPropertyDescriptor(module.exports, k);
      if (!property.configurable) {
        continue;
      }

      const constName = _.snakeCase(module.exports[k].name).toUpperCase();
      module.exports[constName] = constName;
      const old = module.exports[k];
      module.exports[k] = (...args) => {
        const result = old(...args);
        return (typeof result === 'function') ?
          result : { type: constName, ...result };
      };
    }
  }
}
