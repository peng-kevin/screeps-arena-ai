import { findClosestByPath, findClosestByRange, findInRange, getObjectsByPrototype } from 'game/utils';
import { Creep, StructureContainer, StructureSpawn } from 'game/prototypes';
import { CARRY, ERR_BUSY, ERR_NOT_IN_RANGE, MOVE, RANGED_ATTACK, RANGED_ATTACK_DISTANCE_RATE, RESOURCE_ENERGY, TOUGH, WORK } from 'game/constants';
import { } from 'arena';

var spawn_scheduled;

export function loop() {
    manageWorkers();
    manageAttackers();
    manageHealers();
}

function manageWorkers() {
    // Reset state
    spawn_scheduled = false;
    const my_creeps = getMyCreeps();
    const my_spawn = getMySpawn();
    const target_containers = getContainers().filter(c => c.store[RESOURCE_ENERGY] !== 0);

    // Spawn two workers to collect energy from containers
    const my_workers = my_creeps.filter(c => hasBodyParts(c, [CARRY, MOVE]));
    if (my_workers.length < 2) {
        trySpawn([CARRY, CARRY, MOVE], "worker");
    }
    for (const my_worker of my_workers) {
        // Collect energy from containers
        if (my_worker.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            const closest_container = findClosestByPath(my_worker, target_containers);
            if (my_worker.withdraw(closest_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                my_worker.moveTo(closest_container);
            }
        } else {
            // TODO avoid overfilling the spawn
            if (my_worker.transfer(my_spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                my_worker.moveTo(my_spawn);
            }
        }
    }
}

function manageAttackers() {
    const my_creeps = getMyCreeps();
    const enemy_creeps = getEnemyCreeps();
    const enemy_spawn = getEnemySpawn();

    trySpawn([TOUGH, TOUGH, RANGED_ATTACK, MOVE, MOVE, MOVE], "attacker");

    const my_attackers = my_creeps.filter(c => hasBodyParts(c, [RANGED_ATTACK, MOVE]));
    for (const my_attacker of my_attackers) {
        const enemies_in_range = findInRange(my_attacker, enemy_creeps, 3);
        if (enemies_in_range.length !== 0) {
            // If there is an enemy creep within three tiles, engage
            const target = findClosestByRange(my_attacker, enemies_in_range);
            console.log("Attacker", my_attacker.id, "attacking target", target.id);
            if (my_attacker.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                my_attacker.moveTo(target);
            }
        } else {
            //console.log("Attacker", my_attacker.id, "attacking enemy spawn");
            // If no enemies in range, target the enemy base;
            if (my_attacker.rangedAttack(enemy_spawn) == ERR_NOT_IN_RANGE) {
                my_attacker.moveTo(enemy_spawn);
            }
        }
    }
}


function hasBodyParts(creep, body_parts) {
    for (const body_part of body_parts) {
        // If creep does not have body_part, return false
        if (!creep.body.some(b => b.type === body_part)) {
            return false;
        }
    }
    // If it has all the body parts, return true;
    return true;
}

function trySpawn(creepBody, name) {
    if (!spawn_scheduled && getMySpawn().spawning == null) {
        spawn_scheduled = true;
        console.log("Spawning", name);
        getMySpawn().spawnCreep(creepBody)
    }
}

function getMySpawn() {
    return getObjectsByPrototype(StructureSpawn).find(s => s.my);
}

function getEnemySpawn() {
    return getObjectsByPrototype(StructureSpawn).find(s => !s.my);;
}

function getMyCreeps() {
    return getObjectsByPrototype(Creep).filter(c => c.my);;
}

function getEnemyCreeps() {
    return getObjectsByPrototype(Creep).filter(c => !c.my);;
}

function getContainers() {
    return getObjectsByPrototype(StructureContainer);
}
