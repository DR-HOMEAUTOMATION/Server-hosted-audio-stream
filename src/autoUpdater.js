// object that can take an array of {server,clients} to close the server
// uses git-auto-update to update the server
//      - git-auto-update config 

class ServerUpdater {
    // struct :server : {http:[], tcp: [{server,clients}]}
    // struct :config : gitConfig:{`see git-auto-updater`}
    constructor(servers, config){
        this.http = servers.http || []
        this.tcp = servers.tcp || []
        this.initializeUpdater(config) // this is because we need to dynamically import the updater module
    }

    async initializeUpdater(config){
        this.updater = new (await import('auto-git-update')).default(config)  
    }

    update(){
        this.tcp.forEach(({server,clients})=>{
            this.serverShutdown(server,clients)
        })
        this.http.forEach(server=>this.serverShutdown(server))
        this.updater.forceUpdate() // this will update from  git, hard reset the program 
    }

    serverShutdown(tcpServer,tcpClients){
        if (tcpClients) tcpClients.forEach(client=>client.destroy())
        tcpServer.close(()=>console.log(`server closed successfully`))
    }
}

module.exports = ServerUpdater