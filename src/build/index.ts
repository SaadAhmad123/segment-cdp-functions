import fs from 'fs';
import { readFileContentSync, readJson, writeToFileIfNotExists } from "../common";
import { ConfigType } from "../common/types";
import path from 'path';
import log from "../common/log";

export function build() {
    const configFilePath = path.join(process.cwd(), "segment.config.json")
    const config = readJson<ConfigType>(configFilePath)

    const bundleJSPath = path.join(process.cwd(), config.directories.build, 'index.js')
    const bundleJS = readFileContentSync(bundleJSPath)

    fs.writeFileSync(
        path.join(process.cwd(), config.directories.build, 'to_deploy.json'),
        JSON.stringify({
            settings: config.segment.settings,
            code: bundleJS,
            displayName: config.name,
            logoUrl: "",
            resourceType: config.type === "Destination" ? "DESTINATION" : "SOURCE",
            description: config.description
        }, null, 2)
    )
}