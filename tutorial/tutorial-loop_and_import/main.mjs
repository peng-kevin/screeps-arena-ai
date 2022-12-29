import { } from 'game/utils';
import { } from 'game/prototypes';
import { } from 'game/constants';
import { } from 'arena';
import { getTicks } from 'game/utils';
import { getObjectsByPrototype } from 'game/utils';
import { Creep } from 'game/prototypes';
import { Flag } from 'game/prototypes';


export function loop() {
    var creeps = getObjectsByPrototype(Creep);
    var flags = getObjectsByPrototype(Flag)
    creeps[0].moveTo(flags[0]);
}
