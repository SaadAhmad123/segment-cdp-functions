import fs from 'fs';
import { readJson, writeToFileIfNotExists } from '../common';
import prompt from 'prompt';
import {
  ConfigType,
  FunctionSettingVariableType,
  FunctionSetting,
} from '../common/types';
import path from 'path';
import promptSchema from './promptSchema';
import log from '../common/log';

export function addSetting() {
  const configFilePath = path.join(process.cwd(), 'segment.config.json');

  if (!fs.existsSync(configFilePath)) {
    log.error('Configuration file segment.config.json does not exist.');
    return;
  }

  let config: ConfigType;
  try {
    config = readJson<ConfigType>(configFilePath);
  } catch (error) {
    log.error('Failed to read the configuration file.');
    return;
  }

  prompt.start();

  prompt.get(promptSchema, (err, result) => {
    if (err) {
      log.error(`Failed to retrieve input: ${err.message}`);
      return;
    }

    if (!config.segment) {
      config.segment = { settings: [] };
    }

    const newSetting: FunctionSetting = {
      name: result.name.toString(),
      label: result.label.toString(),
      description: result.description.toString(),
      type: result.type.toString() as FunctionSettingVariableType,
      required: result.required.toString() === 'Yes',
      sensitive: result.sensitive.toString() === 'YES',
    };

    config.segment.settings = [...(config.segment.settings || []), newSetting];

    try {
      fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    } catch (error) {
      log.error(
        `Failed to write to the configuration file: ${
          (error as Error).message
        }`,
      );
    }
  });
}
