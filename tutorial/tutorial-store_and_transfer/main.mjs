import { } from 'game/prototypes';
import { ERR_NOT_IN_RANGE, RESOURCE_ENERGY } from 'game/constants';
import { } from 'arena';
import { getObjectsByPrototype } from 'game/utils';
import { Creep, StructureTower, StructureContainer } from 'game/prototypes';
export function loop() {
    var my_creep = getObjectsByPrototype(Creep).find(creep => creep.my);
    var enemy_creep = getObjectsByPrototype(Creep).find(creep => !creep.my);
    var tower = getObjectsByPrototype(StructureTower)[0];
    var container = getObjectsByPrototype(StructureContainer)[0];

    if (my_creep.store[RESOURCE_ENERGY] == 0) {
        if (my_creep.withdraw(container, RESOURCE_ENERGY) ==  ERR_NOT_IN_RANGE) {
            my_creep.moveTo(container);
        }
    } else {
        if (my_creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            my_creep.moveTo(tower);
        }
    }

    tower.attack(enemy_creep);
}
