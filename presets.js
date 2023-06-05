const { combineRgb } = require('@companion-module/base')

module.exports = function (self) {
	self.setPresetDefinitions({
		help_trigger: {
			type: 'button',
			category: 'Help',
			name: 'Help',
			style: {
				text: '',
				png64: 'data:image/png;base64,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',
				pngalignment: 'center:center',
				size: '8',
				color: combineRgb(245, 49, 35),
				bgcolor: combineRgb(255, 255, 255),
				latch: false,
			},
			steps: [
				{
					down: [
						{
							actionId: 'sample_action',
							options: { graphicId: 'help1', status: 'toggle' },
						},
					],
					up: [],
				},
			],
			feedbacks: [
			{
				feedbackId: 'graphic_status',
				options: {
					graphicId: 'help1',
					status: 'coming',
				},
				style: {
					bgcolor: combineRgb(132, 0, 0),
				},
			},
				],
		},
		
	})
}