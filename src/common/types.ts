export type LanguageType = "JavaScript" | "TypeScript"

export type ConfigType = {
    name: string
    description: string
    type: LanguageType
    transpiler: string
    directories: {
        source: string,
        build: string,
    }
    segment: {
        settings: Array<Record<string, any>>,
    },
}
