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

    start()
    {
        this.client.publish('connected', 'true');
    }

    process(topic, message)
    {
        let handled = topic.split('/');
        handled[1] = '+';
        handled = handled.join('/');
        if(this.topics.has(handled))
        {
            this.topics.get(handled)(topic, message);
        }
        else
        {
            this.topics.get(topic)(topic, message);
        }
    }

    stop()
    {
        this.client.publish('connected', 'false');
    }

};

export {MQTTMessageHandler};