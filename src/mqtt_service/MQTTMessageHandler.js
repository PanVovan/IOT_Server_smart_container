const { parse_topic, split_topic, generate_aliases} = require("./topic_parser");

class MQTTMessageHandler
{
       
    constructor(client)
    {
        this.client = client;
        this.topics = new Map();
    }

    on(topic, handler)
    {
        this.client.subscribe(topic);
        this.topics.set(topic, handler);
    }

    start()
    {
        this.client.publish('connected', 'true');
    }

    process(topic, message)
    {
        let aliases = generate_aliases(topic);
        aliases.forEach(element => {
            if(this.topics.has(element))
            {
                this.topics.get(element)(topic, message);
                break;
            }
        });
    }

    stop()
    {
        this.client.publish('connected', 'false');
    }

};

module.exports = {MQTTMessageHandler};