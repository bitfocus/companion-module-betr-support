const axios = require('axios');
const webhookUrl = 'http://34.238.206.176:3001/data'; //http://34.238.206.176:3001/data

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
        help_trigger: {
            name: 'Trigger Better Webhook 1',
            options: [],
            callback: async () => {
                const data = self.config
                self.runTest("init")
                var res = await triggerWebhook(webhookUrl, data);
                if (res && res.data.message === 'Error') {
                    setTimeout(function() { self.runTest('error') }, 1400);
                }
            },
        },
    })
}