const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdatePresetDefinitions = require('./presets')
const getVariables = require('./variables')


class ModuleInstance extends InstanceBase {
    constructor(internal) {
        super(internal)
    }

    async init(config) {
        this.config = config

        this.updateStatus(InstanceStatus.Ok)

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
        if (vars === "init") {
            this.setVariableValues({ test_status: 'Help is on the way...'})
            this.setVariableValues({ text_size: 14})
        } else if (vars === "error") {
            this.setVariableValues({ test_status: 'Error...'})
            this.setVariableValues({ text_size: 14})
        } else {
		    this.setVariableValues({ test_status: '⚠'})
		    this.setVariableValues({ text_size: 30})
		}
	}    
}

runEntrypoint(ModuleInstance, UpgradeScripts)