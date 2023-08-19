import prompt from 'prompt';
import path from 'path';
import { runCliCommands, writeToFileIfNotExists } from '../common';
import promptSchema from './promptSchema';
import * as createProjectFiles from './createProjectFiles'
import log from '../common/log';
import { ConfigType } from '../common/types'

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
      type: result.functionType.toString() as "JavaScript" | "TypeScript",
      transpiler: result.projectType.toString(),
      directories: {
        source: result.sourceDir.toString(),
        transpiled: result.transpiledCodeDir.toString(),
        build: result.buildDir.toString(),
        bundle: result.bundleDir.toString(),
      },
      segment: {
        settings: [],
      },
    };

    writeToFileIfNotExists(
      path.join(process.cwd(), result.settingsFile as string),
      JSON.stringify(config, null, 2),
    );

    createProjectFiles.babelRc()
    createProjectFiles.tsConfig(config)
    createProjectFiles.packageJson(config)
    createProjectFiles.gitIgnore(config)
    createProjectFiles.rollupConfig(config)
    createProjectFiles.src(config)

    log.log('Configuration saved successfully!');
    try {
      runCliCommands([
        config.type === "TypeScript" ? "npm install typescript ts-node segment-cdp-functions --save-dev" : "",
        "npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/preset-typescript @babel/plugin-transform-modules-commonjs @rollup/plugin-commonjs rollup",
        "npm install --save-dev atob aws-sdk btoa fetch-retry form-data @google-cloud/automl @google-cloud/bigquery @google-cloud/datastore @google-cloud/firestore @google-cloud/functions @google-cloud/pubsub @google-cloud/storage @google-cloud/tasks @hubspot/api-client jsforce jsonwebtoken libphonenumber-js lodash mailjet moment-timezone node-fetch oauth @sendgrid/client @sendgrid/mail skyflow stripe twilio uuidv5 winston xml xml2js zlib",
        "git init"
      ].filter(item => Boolean(item.trim().length)))
    } catch (error) {
      log.error('Failed to install packages:', (error as Error).message);
      return;
    }
    log.log('Project initialised successfully!');
  });
}

