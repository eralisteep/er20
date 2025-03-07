import {$authHost, $host} from "./index";

export const createBrand = async (brand) => {
    const {data} = await $authHost.post('api/brand', brand)
    return data
}

export const fetchBrands = async () => {
    const {data} = await $host.get('api/brand', )
    return data
}

export const createCount = async (count) => {
    const {data} = await $authHost.post('api/count', count)
    return data
}

export const fetchCounts = async () => {
    const {data} = await $host.get('api/count')
    return data
}

export const createDevice = async (device) => {
    const {data} = await $authHost.post('api/device', device)
    return data
}

export const fetchDevices = async (brandId, page, limit= 5) => {
    const {data} = await $host.get('api/device', {params: {
            brandId, page, limit
        }})
    return data
}

export const fetchOneDevice = async (id) => {
    const {data} = await $host.get(`api/device/${id}`)
    return data
}

export const deleteDevice = async (id) => {
    const {data} = await $authHost.delete(`api/device/${id}`)
    return data
}