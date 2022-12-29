import { getObjectsByPrototype } from 'game/utils';
import { Creep, Flag } from 'game/prototypes';
import { } from 'game/constants';
import { } from 'arena';

export function loop() {
    const my_creeps = getObjectsByPrototype(Creep).filter(creep => creep.my);
    const flags = getObjectsByPrototype(Flag);
    for (const my_creep of my_creeps) {
        const flag = my_creep.findClosestByPath(flags);
        my_creep.moveTo(flag);
    }
}
