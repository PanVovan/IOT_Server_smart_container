
function split_topic(topic) 
{
    return topic.toString().split('/');
}

function generate_aliases(topic)
{
    let buffer = split_topic(topic);
    let aliases = [];
    aliases.push(buffer);
    
    for (i = 0; i < buffer.length; i++)
    {
        for (j = i; j < aliases[i].length; j++)
        {
            let copied = aliases[i].slice();
            copied[j] = '+';
            aliases.push(copied);
        }
    }

    for (i = 0; i < buffer.length; i++)
    {
        let copied = buffer.slice(0, i);
        copied[i] = "#";
        aliases.push(copied);
    }

    let strings = [];


    for (i = 0; i < aliases.length; i++)
    {
        strings.push(aliases[i].join("/"));
    }
    return strings;    
}

module.exports.split_topic = split_topic;
module.exports.generate_aliases = generate_aliases;