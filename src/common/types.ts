type ConfigType = {
    name: string
    description: string
    type: "JavaScript" | "TypeScript"
    transpiler: string
    directories: {
        source: string,
        transpiled: string,
        build: string,
        bundle: string,
    }
    segment: {
        settings: Array<Record<string, any>>,
    },
}
