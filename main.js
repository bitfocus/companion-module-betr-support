const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdatePresetDefinitions = require('./preset')


class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		
		this.updatePresets() // export presets
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

	updateActions() {
		UpdateActions(this)
	}
	
	updatePresets() {
		UpdatePresetDefinitions(this)
	}
	
}

runEntrypoint(ModuleInstance, UpgradeScripts)
