import { createConstructionSite, getObjectsByPrototype } from 'game/utils';
import { Creep, StructureContainer, StructureTower } from 'game/prototypes';
import { ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from 'game/constants';
import { } from 'arena';

var site;

export function loop() {
    if (site === undefined) {
        site = createConstructionSite({x:50, y:55}, StructureTower).object;
    }
    const creep = getObjectsByPrototype(Creep)[0];
    const container = getObjectsByPrototype(StructureContainer)[0];
    if (creep.store[RESOURCE_ENERGY] == 0) {
        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
        }
    } else {
        if (creep.build(site) == ERR_NOT_IN_RANGE) {
            creep.moveTo(site);
        }
    }
}
