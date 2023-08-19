export default {
    log: (message?: any, ...optionalParams: any[]): void => {
        console.log(message, ...optionalParams)
    },
    error: (message?: any, ...optionalParams: any[]): void => {
        console.error(message, ...optionalParams)
    },
}