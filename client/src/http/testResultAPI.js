import {$authHost, $host} from "./index";

export const createTestResult = async (testResult) => {
    const {data} = await $authHost.post('api/testResult', testResult)
    return data
}

export const fetchTestResult = async (deviceId) => {
    const {data} = await $host.get('api/device', {params: {
            deviceId
        }})
    return data
}