import { checkOrCreateDir } from "../common";

export default {
    properties: {
        projectType: {
            description:
                'Do you want to use JavaScript (not available at the moment) or TypeScript? <default: TypeScript>',
            default: 'TypeScript',
            pattern: /TypeScript/,
            message: 'Invalid option. Choose between JavaScript or TypeScript',
            required: true,
        },
        sourceDir: {
            description: 'Where will the code reside? <default: src>',
            default: 'src',
            message: 'Invalid directory path',
            required: true,
            conform: checkOrCreateDir,
        },
        functionName: {
            description:
                'What is the name of your function? <default: my-segment-destination-function>',
            default: 'my-segment-destination-function',
            required: true,
        },
        functionType: {
            description:
                'What is the type of your segment function (only Destination available at the moment)? <default: Destination>',
            pattern: /Destination/,
            message:
                'Invalid option. Only Destination option available at the moment',
            default: 'Destination',
            required: true,
        },
        settingsFile: {
            description:
                'Name of the settings file (this defines the setting/ config of the the segment function)? <default: segment.config.json>',
            default: 'segment.config.json',
            required: true,
        },
        transpiledCodeDir: {
            description: 'Where will the transpiled code reside? <default: .dist>',
            default: '.dist',
            message: 'Invalid directory path',
            required: true,
            conform: checkOrCreateDir,
        },
        buildDir: {
            description: 'Where will the final build reside? <default: .build>',
            default: '.build',
            message: 'Invalid directory path',
            required: true,
            conform: checkOrCreateDir,
        },
        bundleDir: {
            description: 'Where will the final bundle reside? <default: .bundle>',
            default: '.bundle',
            message: 'Invalid directory path',
            required: true,
            conform: checkOrCreateDir,
        },
    },
};