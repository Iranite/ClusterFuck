var roleBummi = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        let homedex = Memory.rooms[creep.memory.home];
        let raum = Memory.claim[homedex].AlarmRoom
        let spawn = Game.getObjectById(Memory.claim[homedex].spawns[0]);
        if(!raum){
            raum = creep.memory.raum;
        }
        if(Memory.claim[homedex].Alarm){
            creep.say('Xterminate',true);
        }
        if(creep.hits<creep.hitsMax*3/10){creep.heal(creep);}
        if (creep.room.name === raum){
            if(!enemy){
                creep.moveTo(Memory.init.x,Memory.init.y);
                if(creep.hits<creep.hitsMax){creep.heal(creep);}
            }
            else if(creep.pos.isNearTo(enemy)){
                creep.rangedAttack(enemy);
                creep.attack(enemy);
            }else{
            creep.heal(creep)
            creep.moveTo(enemy);
            creep.rangedAttack(enemy);
            creep.attack(enemy);
            }
        }
        else{
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(raum)));
            if(creep.hits<creep.hitsMax){creep.heal(creep);}
        }
    }
    
};

module.exports = roleBummi;