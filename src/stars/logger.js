const Logger = {
    storage: null,
    storageName: "experimentLog",
    logTimestamp: null,
    data: null,

    init: function(window, storageName = "experimentLog"){
        var d = new Date();
        //var timestamp = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
        this.logTimestamp = new Date().getTime();
        this.storageName = storageName;  
        this.storage = window.localStorage;

    },
    startLogging: function(){
        let data = this.getStorageData();
        if(data == null){
            this.data = {[this.logTimestamp]:{"data":[]}};
        } else {
            data[this.logTimestamp] = {"data":[]};
            this.data = data;
        }
    },
    logMessage: function(message){
        this.data[this.logTimestamp].data.push({"time":new Date().getTime(), "content":message});
        this.saveToStorage();
    },

    saveToStorage: function(){
        this.storage.setItem(this.storageName, JSON.stringify(this.data));
    },

    getStorageData: function(){
        return JSON.parse(this.storage.getItem(this.storageName));
    },

    getExperimentData: function(timestamp){
        let data = this.getStorageData();
        return data[timestamp];
    },

    clearStorage: function(){
        this.storage.removeItem(this.storageName);
    },

    getExistingTimestamps: function(){
        return Object.keys(this.getStorageData());
    },

    saveToPC: function(){

    }
}

export default Logger;