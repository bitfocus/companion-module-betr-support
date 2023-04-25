const axios = require('axios');
const webhookUrl = 'https://daily-quotes.abacies.com/v1/bitfocus/webhook';
const data = { message: 'Hello, Better Support Webhook' };

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
				console.log('Hello world!', event.options.webhook1)
				triggerWebhook(webhookUrl, data);

			},
		},
	})
}
