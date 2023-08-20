import fs from 'fs';
import { readFileContentSync, readJson, writeToFileIfNotExists } from "../common";
import { ConfigType } from "../common/types";
import path from 'path';
import log from "../common/log";

export function build() {
    try {
        const configFilePath = path.join(process.cwd(), "segment.config.json");

        if (!fs.existsSync(configFilePath)) {
            throw new Error("Configuration file segment.config.json not found!")
        }

        const config = readJson<ConfigType>(configFilePath);

        const outputDir = path.join(process.cwd(), config.directories.build);

        if (!fs.existsSync(outputDir)) {
            throw new Error(`Build directory ${outputDir} not found!`);
        }

        const bundleJSPath = path.join(outputDir, 'index.js');

        if (!fs.existsSync(bundleJSPath)) {
            throw new Error("Bundle JS file index.js not found in build directory!");
        }

        const bundleJS = readFileContentSync(bundleJSPath).split("\n").splice(1, 0, "var exports = {}").join("\n");

        const outputFilePath = path.join(outputDir, 'to_deploy.json');
        fs.writeFileSync(
            outputFilePath,
            JSON.stringify({
                settings: config.segment.settings,
                code: bundleJS,
                displayName: config.name,
                logoUrl: "",
                resourceType: config.type === "Destination" ? "DESTINATION" : "SOURCE",
                description: config.description
            }, null, 2)
        );

        log.log("Build process completed successfully!");

    } catch (error) {
        throw error
    }
}
