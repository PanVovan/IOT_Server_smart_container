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
        this.client.publish('connected', 'on');
    }

    process(topic, message)
    {
        let a = topic.split('/');
        a[1] = '+';
        a = a.join('/');
        if(this.topics.has(a))
        {
            this.topics.get(a)(topic, message);
        }
        else
        {
            this.topics.get(topic)(topic, message);
        }
    }

    stop()
    {
        this.client.publish('connected', 'off');
    }

};

export {MQTTMessageHandler};