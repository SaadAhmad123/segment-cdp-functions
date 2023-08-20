export type LanguageType = "JavaScript" | "TypeScript"
export type FunctionType = 'Destination' | 'Source'

export type ConfigType = {
    name: string
    description: string
    type: FunctionType
    transpiler: LanguageType
    directories: {
        source: string,
        build: string,
    }
    segment: {
        settings: Array<Record<string, any>>,
    },
}
