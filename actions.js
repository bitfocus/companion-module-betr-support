const axios = require('axios');
const webhookUrl = 'http://34.238.206.176:3001/data';

async function triggerWebhook(webhookUrl, data) {
	try {
	  const response = await axios.post(webhookUrl, data);
	  console.log('Webhook triggered successfully');
	  return response
	} catch (error) {
	  console.error('Error triggering webhook:', error);
	  return error
	}
  }
  


module.exports = function (self) {
	self.setActionDefinitions({
		sample_action: {
			name: 'Trigger Better Webhook 1',
			options: [],
			callback: async (event) => {
				console.log('log ---------- testing')
				console.log('data -----', self.config)
				const data = self.config
				var res = await triggerWebhook(webhookUrl, data);
				console.log('res', res)
			},
		},
	})
}
