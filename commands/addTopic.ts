import {SlashCommandBuilder} from "@discordjs/builders";
import Topic from "../database/models/topic";
import Term from "../database/models/term";
import {ITerm} from "../database/models/term";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtopic')
        .setDescription('Add a new custom topic')
        .addStringOption(o => o.setName('topicname').setDescription('The name of your topic').setRequired(true))
        .addStringOption(o => o.setName('terms').setDescription('Add your terms separated by a comma').setRequired(true))
        .addStringOption(o => o.setName('topicdescription').setDescription('Description of the topic').setRequired(false)),
    async execute(interaction: any) {
        let terms: ITerm[] = [];
        const strings: string[] = interaction.options.getString('terms').split(',');

        for (const term of strings) {
            const result = new Term({term: term});
            await result.save();
            terms.push(result);
        }

        const topic = new Topic({
            name: interaction.options.getString('topicname'),
            description: interaction.options.getString('topicdescription') || '',
            terms: terms
        });

        await Topic.create(topic);
        interaction.reply({content: 'Topic successfully added!', ephemeral: true});
    }
}