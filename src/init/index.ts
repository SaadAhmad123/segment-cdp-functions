import prompt from 'prompt';
import path from 'path';
import { checkOrCreateDir, runCliCommands, writeToFileIfNotExists } from '../common';
import promptSchema from './promptSchema';
import * as createProjectFiles from './createProjectFiles'
import log from '../common/log';
import { ConfigType, FunctionType, LanguageType } from '../common/types'

export default function init() {
  prompt.start();

  prompt.get(promptSchema, (err, result) => {
    if (err) {
      log.error(err)
      return;
    }

    const config: ConfigType = {
      name: result.functionName.toString(),
      description: 'A custom segment function',
      type: result.functionType.toString() as FunctionType,
      transpiler: result.projectType.toString() as LanguageType,
      directories: {
        source: result.sourceDir.toString(),
        build: result.buildDir.toString(),
      },
      segment: {
        settings: [],
      },
    };

    writeToFileIfNotExists(
      path.join(process.cwd(), "segment.config.json"),
      JSON.stringify(config, null, 2),
    );

    createProjectFiles.tsConfig(config)
    createProjectFiles.packageJson(config)
    createProjectFiles.gitIgnore(config)
    createProjectFiles.rollupConfig(config)
    createProjectFiles.src(config)

    log.log('Configuration saved successfully!');
    try {
      runCliCommands([
        config.transpiler === "TypeScript" ? "npm install typescript tslib ts-node segment-cdp-functions rollup @rollup/plugin-typescript --save-dev" : "",
        //"npm install atob @types/atob aws-sdk btoa @types/btoa fetch-retry form-data @google-cloud/automl @google-cloud/bigquery @google-cloud/datastore @google-cloud/firestore @google-cloud/functions @google-cloud/pubsub @google-cloud/storage @google-cloud/tasks @hubspot/api-client jsforce jsonwebtoken libphonenumber-js  @types/lodash mailjet moment-timezone node-fetch oauth @sendgrid/client @sendgrid/mail skyflow stripe twilio uuidv5 winston xml xml2js zlib",
        "git init"
      ].filter(item => Boolean(item.trim().length)))
    } catch (error) {
      log.error('Failed to install packages:', (error as Error).message);
      return;
    }
    log.log('Project initialised successfully!');
  });
}

