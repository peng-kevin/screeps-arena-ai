import { getObjectsByPrototype } from 'game/utils';
import { Creep, Source, StructureSpawn } from 'game/prototypes';
import { ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from 'game/constants';
import { } from 'arena';

var harvesting = true;

export function loop() {
    const creep = getObjectsByPrototype(Creep)[0];
    const source = getObjectsByPrototype(Source)[0];
    const spawn = getObjectsByPrototype(StructureSpawn)[0];
    if (harvesting && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        harvesting = false;
    }
    if (!harvesting && creep.store[RESOURCE_ENERGY] == 0) {
        harvesting = true;
    }

    if (harvesting) {
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    } else {
        if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
        }
    }
}
