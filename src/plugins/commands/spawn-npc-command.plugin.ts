import { commandActionHandler } from '@engine/world/action/player-command.action';
import { world } from '@engine/game-server';
import { Npc } from '@engine/world/actor/npc/npc';
import { findNpc } from '@engine/config';
import { NpcDetails } from '@engine/config/npc-config';
import { NpcSpawn } from '@engine/config/npc-spawn-config';

const action: commandActionHandler = ({ player, args }) => {
    let npcKey: string | number = args.npcKey;
    let npcDetails: NpcDetails;

    if(typeof npcKey === 'string' && npcKey.match(/^[0-9]+$/)) {
        npcKey = parseInt(npcKey, 10);
    }

    if(typeof npcKey === 'string') {
        npcDetails = findNpc(npcKey) || null;

        if(!npcDetails) {
            player.sendMessage(`NPC ${npcKey} is not yet registered on the server.`);
            return;
        }

        npcKey = npcDetails.gameId;
    }

    const npc = new Npc(npcDetails ? npcDetails : npcKey,
        new NpcSpawn(npcDetails ? npcDetails.key : `unknown-${npcKey}`,
            player.position.clone(), 0, 'WEST'), player.instance.instanceId);

    world.registerNpc(npc);
};

export default {
    pluginId: 'rs:spawn_npc_command',
    hooks: [
        {
            type: 'player_command',
            commands: [ 'npc', 'spawnnpc', 'spawn_npc' ],
            args: [
                {
                    name: 'npcKey',
                    type: 'either'
                }
            ],
            handler: action
        }
    ]
};
