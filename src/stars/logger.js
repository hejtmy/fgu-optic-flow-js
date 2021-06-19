const Logger = {
    storage: null,
    storageName: "experimentLog",
    data: null,

    init: function(window, storageName = "experimentLog"){
        var d = new Date();
        //var timestamp = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
        var timestamp = new Date().getTime();
        this.data = {"timestamp": timestamp, "data":[]};
        this.storageName = storageName;  
        this.window = window;
        this.storage = this.window.localStorage;
    },

    logMessage: function(message){
        this.data.data.push({"time":new Date().getTime(), "content":message});
        this.saveToStorage();
    },

    saveToStorage: function(){
        this.storage.setItem(this.storageName, JSON.stringify(this.data));
    },

    getStorageData: function(){
        return JSON.parse(this.storage.getItem(this.storageName));
    },

    getExperimentData: function(timestamp){

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