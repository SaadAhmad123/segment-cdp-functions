import fs from 'fs';
import { readFileContentSync, readJson } from '../common';
import { ConfigType } from '../common/types';
import path from 'path';
import log from '../common/log';
import {
    configureApis,
    unwrap,
    ListFunctionItemV1,
    CreateFunctionV1Input,
    FunctionSettingV1,
} from '@segment/public-api-sdk-typescript';
import * as dotenv from 'dotenv';
dotenv.config();
import _ from 'lodash';

async function fetchFunctionIdIfExists(
    displayName: string,
    resourceType: 'DESTINATION' | 'INSERT_DESTINATION' | 'SOURCE',
): Promise<ListFunctionItemV1 | undefined> {
    const api = configureApis(process.env.SEGMENT_TOKEN || '');
    let nextPage: string | undefined | null = undefined;
    do {
        const result = await unwrap(
            api.functions.listFunctions({ count: 100 }, resourceType),
        );
        nextPage = result.pagination.next;
        const existingFunc = (result.functions || []).filter(
            (item) => item.displayName === displayName,
        );
        if (existingFunc.length) {
            return existingFunc[0];
        }
    } while (nextPage);
    return undefined;
}

const getToDeploy = () => {
    const configFilePath = path.join(process.cwd(), 'segment.config.json');

    if (!fs.existsSync(configFilePath)) {
        throw new Error('Configuration file segment.config.json not found!');
    }

    const config = readJson<ConfigType>(configFilePath);

    const outputDir = path.join(process.cwd(), config.directories.build);

    if (!fs.existsSync(outputDir)) {
        throw new Error(`Build directory ${outputDir} not found!`);
    }

    const bundleJSPath = path.join(outputDir, 'index.js');

    if (!fs.existsSync(bundleJSPath)) {
        throw new Error('Bundle JS file index.js not found in build directory!');
    }

    const bundleJS = [
        'var exports = {};',
        readFileContentSync(bundleJSPath) || '',
    ].join('\n');
    return {
        settings: config.segment.settings,
        code: bundleJS,
        displayName: config.name,
        logoUrl: '',
        resourceType: config.type,
        description: config.description,
    }
};

export async function deploy() {
    try {
        let toDeploy = getToDeploy();
        let resType = CreateFunctionV1Input.ResourceTypeEnum.DESTINATION;
        if (toDeploy.resourceType === 'Source') {
            resType = CreateFunctionV1Input.ResourceTypeEnum.SOURCE;
        }
        const formatedToDeploy = {
            ...toDeploy,
            resourceType: resType,
            settings: toDeploy.settings.map((item) => {
                let settingDataType = FunctionSettingV1.TypeEnum.STRING;
                if (item.type === 'ARRAY')
                    settingDataType = FunctionSettingV1.TypeEnum.ARRAY;
                if (item.type === 'BOOLEAN')
                    settingDataType = FunctionSettingV1.TypeEnum.BOOLEAN;
                if (item.type === 'TEXT_MAP')
                    settingDataType = FunctionSettingV1.TypeEnum.TEXT_MAP;
                return {
                    ...item,
                    type: settingDataType,
                };
            }),
        };

        let func = await fetchFunctionIdIfExists(
            toDeploy.displayName,
            toDeploy.resourceType === 'Destination'
                ? 'DESTINATION'
                : toDeploy.resourceType === 'Source'
                    ? 'SOURCE'
                    : 'INSERT_DESTINATION',
        );
        const api = configureApis(process.env.SEGMENT_TOKEN || '');
        if (!func?.id) {
            await unwrap(api.functions.createFunction({
                settings: formatedToDeploy.settings,
                code: formatedToDeploy.code,
                displayName: formatedToDeploy.displayName,
                logoUrl: formatedToDeploy.logoUrl ? formatedToDeploy.logoUrl : undefined,
                resourceType: formatedToDeploy.resourceType,
                description: formatedToDeploy.description,
            }));
            log.log('A new Segment function created');
            return;
        }
        const result = await unwrap(api.functions.getFunction(func.id || ''));
        const existingFunction = {
            resourceType: result.function?.resourceType,
            settings: result.function?.settings || [],
            code: result.function?.code || '',
            displayName: result.function?.displayName || '',
            logoUrl: result.function?.logoUrl || '',
            description: result.function?.description || '',
        };

        if (formatedToDeploy.resourceType !== existingFunction.resourceType) {
            throw new Error(
                `Found an existing segment function with the same name. But, cannot update it as the existing type and to deploy types are different`,
            );
        }

        if (_.isEqual(toDeploy, existingFunction)) {
            log.log('Nothing to update');
            return;
        }

        await unwrap(api.functions.updateFunction(func.id, {
            settings: formatedToDeploy.settings,
            code: formatedToDeploy.code,
            displayName: formatedToDeploy.displayName,
            logoUrl: formatedToDeploy.logoUrl ? formatedToDeploy.logoUrl : undefined,
            description: formatedToDeploy.description,
        }));

        log.log('Function successfully updated');
        return;
    } catch (error) {
        throw error;
    }
}
