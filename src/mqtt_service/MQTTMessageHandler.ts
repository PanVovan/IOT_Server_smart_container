class MQTTMessageHandler
{
       
    constructor(client)
    {
        this.client = client;
        this.topics = new Map();
    }

    client;
    topics;

    on(topic, handler)
    {
        this.client.subscribe(topic);
        this.topics.set(topic, handler);
    }

    debug()
    {
        console.log("debug info")
    }

    process(topic, message)
    {
        this.topics.get(topic)(topic, message);
    }
};

export {MQTTMessageHandler};