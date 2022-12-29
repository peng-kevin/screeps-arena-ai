import { } from 'game/utils';
import { Flag } from 'game/prototypes';
import { } from 'game/constants';
import { } from 'arena';

import { getObjectsByPrototype } from 'game/utils';
import { Creep } from 'game/prototypes';

export function loop() {
    var creeps = getObjectsByPrototype(Creep);
    var flags = getObjectsByPrototype(Flag);
    creeps[0].moveTo(flags[0]);
}
