import { serialize, decodeJid } from '../lib/Serializer.js';
import path from 'path';
import fs from 'fs/promises';
import config from '../config.cjs';
import { smsg } from '../lib/myfunc.cjs';
import { handleAntilink } from './antilink.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SHENG AI MODE
const shengMode = {
    enabled: true,
    users: {}
};

const triggerWords = ["yooh", "niaje", "mzee", "wozza", "mambo", "uko aje", "freshi", "sasa", "cheza", "vipi", "mzito", "boss", "bigman", "mrembo", "shem", "fala", "mambo vipi"];

const shengReplies = [
    "Niaje mzae, uko aje?", "Aje aje, shwari?", "Mambo vipi, msee!", "Freshi barida?",
    "Sema, uko aje?", "Cheza na mimi, mzae!", "Huko aje, form ni gani?", 
    "Kuna nini leo? Twende kazi!", "Naona leo uko soft, ni aje?", "Leo tunabonga facts au jokes?",
    "Unakaa mtu wa madharau leo, uko sure uko fiti?", "Cheza chini, life ni ngumu!", 
    "Wagwan, unaeza survive ghetto?", "Shem, mbona umenyamaza?", "Weh, fanya form!"
];

const toggleSheng = (m, status) => {
    if (status === "on") {
        shengMode.enabled = true;
        m.reply("✅ *Sheng AI Mode activated!* Tuko mtaa sasa!");
    } else if (status === "off") {
        shengMode.enabled = false;
        m.reply("🚫 *Sheng AI Mode deactivated!* Nime chill sasa.");
    }
};

const shengChat = async (m) => {
    if (!shengMode.enabled) return; 

    const text = m.body.toLowerCase();

    if (triggerWords.includes(text)) {
        m.reply("Yooh semaje mzee, unadai bot ama?");
        shengMode.users[m.sender] = "waitingForYes"; 
    } else if (shengMode.users[m.sender] === "waitingForYes" && ["yes", "eeh", "yap"].includes(text)) {
        m.reply("Naeka na 80 mkuu, uko ready nitume link?");
        shengMode.users[m.sender] = "waitingForConfirm";
    } else if (shengMode.users[m.sender] === "waitingForConfirm" && ["yes", "eeh", "yap"].includes(text)) {
        m.reply("✅ Link hii hapa mkuu:\nhttps://projext-session-server-a9643bc1be6b.herokuapp.com/");
        delete shengMode.users[m.sender];
    } else if (shengMode.users[m.sender]) {
        delete shengMode.users[m.sender]; 
    } else if (Math.random() < 0.3) { 
        m.reply(shengReplies[Math.floor(Math.random() * shengReplies.length)]);
    }
};

// MAIN BOT HANDLER
const Handler = async (chatUpdate, sock, logger) => {
    try {
        if (chatUpdate.type !== 'notify') return;

        const m = serialize(JSON.parse(JSON.stringify(chatUpdate.messages[0])), sock, logger);
        if (!m.message) return;

        const participants = m.isGroup ? await sock.groupMetadata(m.from).then(metadata => metadata.participants) : [];
        const groupAdmins = m.isGroup ? getGroupAdmins(participants) : [];
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botId) : false;
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;

        const PREFIX = /^[\\/!#.]/;
        const isCOMMAND = (body) => PREFIX.test(body);
        const prefixMatch = isCOMMAND(m.body) ? m.body.match(PREFIX) : null;
        const prefix = prefixMatch ? prefixMatch[0] : '/';
        const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
        const text = m.body.slice(prefix.length + cmd.length).trim();
        const botNumber = await sock.decodeJid(sock.user.id);
        const ownerNumber = config.OWNER_NUMBER + '@s.whatsapp.net';
        let isCreator = false;

        if (m.isGroup) {
            isCreator = m.sender === ownerNumber || m.sender === botNumber;
        } else {
            isCreator = m.sender === ownerNumber || m.sender === botNumber;
        }

        if (!sock.public) {
            if (!isCreator) {
                return;
            }
        }

        await handleAntilink(m, sock, logger, isBotAdmins, isAdmins, isCreator);

        const { isGroup, type, sender, from, body } = m;

        // SHENG AI CHAT
        await shengChat(m);

        // PLUGIN SYSTEM
        const pluginDir = path.resolve(__dirname, '..', 'plugins');  
        
        try {
            const pluginFiles = await fs.readdir(pluginDir);

            for (const file of pluginFiles) {
                if (file.endsWith('.js')) {
                    const pluginPath = path.join(pluginDir, file);
                    
                    try {
                        const pluginModule = await import(`file://${pluginPath}`);
                        const loadPlugins = pluginModule.default;
                        await loadPlugins(m, sock);
                    } catch (err) {
                        console.error(`❌ Failed to load plugin: ${pluginPath}`, err);
                    }
                }
            }
        } catch (err) {
            console.error(`❌ Plugin folder not found: ${pluginDir}`, err);
        }

    } catch (e) {
        console.error(e);
    }
};

export default Handler;
export { toggleSheng };
