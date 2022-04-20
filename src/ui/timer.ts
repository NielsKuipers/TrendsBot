import {Message, MessageEmbed} from "discord.js";

export class Timer {
    static setCountdown(embed: MessageEmbed, msg: Message, time: number, text: string) {
        let intervalTimer = time / 1000;

        let interval = setInterval(async () => {
            embed.setTitle(text + (intervalTimer) + ' seconds');
            intervalTimer--;
            await msg.edit({embeds: [embed]});

            if (intervalTimer <= 0)
                clearInterval(interval);
        }, 1000);
    }
}