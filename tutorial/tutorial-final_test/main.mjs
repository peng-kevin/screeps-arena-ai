import { createConstructionSite, getObjectsByPrototype } from 'game/utils';
import { Creep, Source, StructureSpawn } from 'game/prototypes';
import { CARRY, ERR_NOT_IN_RANGE, HEAL, MOVE, RANGED_ATTACK, RESOURCE_ENERGY, TOUGH, WORK } from 'game/constants';
import { } from 'arena';

export function loop() {
    const spawn = getObjectsByPrototype(StructureSpawn)[0];
    const source = getObjectsByPrototype(Source)[0];
    const my_creeps = getObjectsByPrototype(Creep).filter(creep => creep.my);
    const enemy_creeps = getObjectsByPrototype(Creep).filter(creep => !creep.my);
    const enemy_healers = enemy_creeps.filter(creep => hasBodyPart(creep, HEAL));
    const my_harvesters = my_creeps.filter(creep => hasBodyPart(creep, WORK));
    const my_ranged_attackers = my_creeps.filter(creep => hasBodyPart(creep, RANGED_ATTACK));

    if (my_harvesters.length  < 2) {
        spawn.spawnCreep([CARRY, WORK, WORK, WORK, WORK, MOVE]);
    } else {
        spawn.spawnCreep([TOUGH, TOUGH, TOUGH, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE]);
    }

    if (my_ranged_attackers.length >= 2) {
        var target;
        if (enemy_healers.length > 0) {
            target = enemy_healers[0];
        } else {
            target = enemy_creeps[0];
        }
        for (const ranged_attacker of my_ranged_attackers) {
            if (ranged_attacker.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                ranged_attacker.moveTo(target);
            }
        }
    }

    for (const harvester of my_harvesters) {
        if (harvester.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            if (harvester.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                harvester.moveTo(spawn);
            }
        } else {
            if (harvester.harvest(source) == ERR_NOT_IN_RANGE) {
                harvester.moveTo(source);
            }
        }
    }
}

function hasBodyPart(creep, part) {
    return creep.body.some(bodypart => bodypart.type == part);
}
