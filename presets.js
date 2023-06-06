const { combineRgb } = require('@companion-module/base')

module.exports = function (self) {
    self.setPresetDefinitions({
        help_trigger: {
            type: 'button',
            category: 'Help',
            name: 'Help',
            label: '',
            style: {
                text: '$(betr:test_status)',
                pngalignment: 'center:center',
                size: '$(betr:text_size)',
                color: combineRgb(255, 255, 255),
                bgcolor: combineRgb(245, 49, 35),
                latch: true,
                topbar: 'Hide'
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'help_trigger',
                        },
                    ],
                    up: [],
                },
            ],
            feedbacks: [],
        },
        
    })
}