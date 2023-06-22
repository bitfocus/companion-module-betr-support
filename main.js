const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdatePresetDefinitions = require('./presets')
const getVariables = require('./variables')

const WebSocket = require('ws');

class ModuleInstance extends InstanceBase {
    constructor(internal) {
        super(internal)
    }

    isInitialized = false

    wsRegex = '^ws?:\\/\\/([\\da-z\\.-]+)(:\\d{1,5})?(?:\\/(.*))?$'

    async init(config) {
        this.config = config

        this.initWebSocket()
        this.isInitialized = true

        // this.updateStatus(InstanceStatus.Ok)

        this.updateActions() // export actions
        
        this.updatePresets() // export presets

        this.updateVariableDefinitions() // export variables

        this.runTest()
    }
    // When module gets deleted
    async destroy() {
        this.log('debug', 'destroy')
    }

    async configUpdated(config) {
        this.config = config
    }

    async destroy() {
		this.isInitialized = false
		if (this.reconnect_timer) {
			clearTimeout(this.reconnect_timer)
			this.reconnect_timer = null
		}
		if (this.ws) {
			this.ws.close(1000)
			delete this.ws
		}
	}

    initWebSocket() {
		if (this.reconnect_timer) {
			clearTimeout(this.reconnect_timer)
			this.reconnect_timer = null
		}

		const url = 'ws://34.238.206.176:3001/betr-twilio'
		if (!url || url.match(new RegExp(this.wsRegex)) === null) {
			this.updateStatus(InstanceStatus.BadConfig, `WS URL is not defined or invalid`)
			return
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.ws) {
			this.ws.close(1000)
			delete this.ws
		}
		this.ws = new WebSocket(url)

		this.ws.on('open', () => {
			this.updateStatus(InstanceStatus.Ok)
			this.log('debug', `Connection opened`)
		})
		this.ws.on('close', (code) => {
			this.log('debug', `Connection closed with code ${code}`)
			this.updateStatus(InstanceStatus.Disconnected, `Connection closed with code ${code}`)
			this.maybeReconnect()
		})

		this.ws.on('message', this.messageReceivedFromWebSocket.bind(this))

		this.ws.on('error', (data) => {
			this.log('error', `WebSocket error: ${data}`)
		})
	}

    maybeReconnect() {
		if (this.isInitialized) {
			if (this.reconnect_timer) {
				clearTimeout(this.reconnect_timer)
			}
			this.reconnect_timer = setTimeout(() => {
				this.initWebSocket()
			}, 5000)
		}
	}

    messageReceivedFromWebSocket(data) {
        console.log("***** messageReceivedFromWebSocket ***********")
		let msgValue = null
		try {
            console.log("***** Received MSG ***********")
			msgValue = data.toString()
            console.log(msgValue)
            if (msgValue && msgValue == 'reply to response success') {
                this.runTest()
            } else throw msgValue
		} catch (e) {
            console.log("***** Received MSG Errr ***********")
			msgValue = data.toString()
            console.log(e)
            console.log(msgValue)
            this.runTest("error")
		}
	}

    // Return config fields for web config
    getConfigFields() {
        return [
            {
                type: 'textinput',
                id: 'api_key',
                label: 'API key',
                width: 8,
                // regex: Regex.IP,
            },
            {
                type: 'textinput',
                id: 'group_id',
                label: 'Group id',
                width: 4,
                // regex: Regex.PORT,
            },
        ]
    }

    updateVariableDefinitions() {
		const variables = getVariables.bind(this)()
		this.setVariableDefinitions(variables)
	}

    updateActions() {
        UpdateActions(this)
    }
    
    updatePresets() {
        UpdatePresetDefinitions(this)
    }

    runTest(vars) {
        console.log(" ---- run test ---- ")
        var self = this;
        if (vars === "init") {
            this.setVariableValues({ test_status: 'Help is on the way...'})
            this.setVariableValues({ text_size: 14})
        } else if (vars === "error") {
            this.setVariableValues({ test_status: 'Error...'})
            this.setVariableValues({ text_size: 14})
            setTimeout(function() { self.runTest() }, 7000);
        } else {
		    this.setVariableValues({ test_status: '⚠'})
		    this.setVariableValues({ text_size: 30})
		}
	}    
}

runEntrypoint(ModuleInstance, UpgradeScripts)