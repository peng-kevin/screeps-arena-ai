import { } from 'game/utils';
import { } from 'game/prototypes';
import { BODYPART_COST, HEAL, MAX_CONSTRUCTION_SITES, RANGED_ATTACK } from 'game/constants';
import { } from 'arena';
import { getObjectsByPrototype } from 'game/utils';
import { Creep } from 'game/prototypes';
import { ERR_NOT_IN_RANGE } from 'game/constants';
import { ATTACK } from 'game/constants';

export function loop() {
    var my_creeps = getObjectsByPrototype(Creep).filter(creep => creep.my);
    var enemy_creep = getObjectsByPrototype(Creep).find(creep => !creep.my);
    for (const my_creep of my_creeps) {
        if (my_creep.body.some(bodyPart => bodyPart.type == ATTACK)) {
            if(my_creep.attack(enemy_creep) == ERR_NOT_IN_RANGE) {
                my_creep.moveTo(enemy_creep);
            }
        }

        if (my_creep.body.some(bodyPart => bodyPart.type == RANGED_ATTACK)) {
            if(my_creep.rangedAttack(enemy_creep) == ERR_NOT_IN_RANGE) {
                my_creep.moveTo(enemy_creep);
            }
        }

        if (my_creep.body.some(bodyPart => bodyPart.type == HEAL)) {
            console.log("identified heal creep");
            var friendly_creep = my_creeps.find(creep => creep.id != my_creep.id);
            if(my_creep.heal(friendly_creep) == ERR_NOT_IN_RANGE) {
                my_creep.moveTo(friendly_creep);
            }
        }
    }
}
