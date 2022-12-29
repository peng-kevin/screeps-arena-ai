import { getObjectsByPrototype } from 'game/utils';
import { Creep, StructureSpawn, Flag } from 'game/prototypes';
import { MOVE } from 'game/constants';
import { } from 'arena';

export function loop() {
    const spawn = getObjectsByPrototype(StructureSpawn)[0];
    const my_creeps = getObjectsByPrototype(Creep);
    const flags = getObjectsByPrototype(Flag)
    console.log(flags)
    if (my_creeps.length < 2) {
        spawn.spawnCreep([MOVE]);
    }
    for (var i = 0; i < my_creeps.length; i++) {
        my_creeps[i].moveTo(flags[i]);
    }
}
