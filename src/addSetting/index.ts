import fs from 'fs';
import { readJson, writeToFileIfNotExists } from "../common";
import prompt from 'prompt'
import { ConfigType, FunctionSettingVariableType, FunctionSetting } from "../common/types";
import path from 'path';
import promptSchema from "./promptSchema";
import log from "../common/log";

export function addSetting() {
    const configFilePath = path.join(process.cwd(), "segment.config.json")
    const config = readJson<ConfigType>(configFilePath)

    prompt.start();

    prompt.get(promptSchema, (err, result) => {
        if (err) {
            log.error(err)
            return;
        }
        config.segment.settings = [
            ...(config.segment.settings || []),
            {
                name: result.name.toString(),
                label: result.label.toString(),
                description: result.description.toString(),
                type: result.type.toString() as FunctionSettingVariableType,
                required: result.require.toString() === "Yes",
                sensitive: result.sensitive.toString() === "YES",
            } as FunctionSetting
        ]
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    })


}