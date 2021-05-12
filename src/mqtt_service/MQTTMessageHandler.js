const {generate_aliases} = require("./topic_parser");

class MQTTMessageHandler
{
       
    constructor(client, emiter)
    {
        this.client = client;
        this.topics = new Map();
        this.emiter = emiter;
    }

    on(topic, handler)
    {
        this.client.subscribe(topic);
        this.topics.set(topic, handler);
    }

    emit(message, ...args)
    {
        this.emiter.emit(message, args);
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
            }
        });
    }

    stop()
    {
        this.client.publish('connected', 'false');
    }

};

module.exports = {MQTTMessageHandler};