import {makeAutoObservable} from "mobx";

export default class DeviceStore {
    constructor() {
        this._brands = []
        this._counts = []
        this._devices = []
        this._selectedDevice = {}
        this._selectedBrand = {}
        this._selectedCount = {}
        makeAutoObservable(this)
    }

    setBrands(brands) {
        this._brands = brands
    }
    setCounts(counts) {
        this._counts = counts
    }
    setDevices(devices) {
        this._devices = devices
    }
    setSelectedDevice(device) {
        this._selectedDevice = device
    }
    setSelectedBrand(brand) {
        this._selectedBrand = brand
    }
    setSelectedCount(count) {
        this._selectedCount = count
    }

    get brands() {
        return this._brands
    }
    get counts() {
        return this._counts
    }
    get devices() {
        return this._devices
    }
    get selectedDevice() {
        return this._selectedDevice
    }
    get selectedBrand() {
        return this._selectedBrand
    }
    get selectedCount() {
        return this._selectedCount
    }
    
}
