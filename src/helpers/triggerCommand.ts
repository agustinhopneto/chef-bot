import { config } from '../config';

const getTriggerRegex = () => {
  return new RegExp(`^-${config.prefix}\\s`);
};

export default getTriggerRegex;
