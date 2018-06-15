var roleBummi = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        let homedex = Memory.rooms[creep.memory.home];
        let raum = Memory.claim[homedex].AlarmRoom
        if(!raum){
            raum = creep.memory.raum;
        }
        if(Memory.claim[homedex].Alarm){
            creep.say('Xterminate',true);
        }
        if(creep.hits<creep.hitsMax*3/10){creep.heal(creep);}
        if (creep.room.name === raum){
            if(!enemy){
                if(Memory.init.x){creep.travelTo(new RoomPosition(Memory.init.x,Memory.init.y,raum),{maxOps= 1000});}
                if(!Memory.init.x && creep.pos.lookFor(LOOK_STRUCTURES).filter(s => s.structureType == STRUCTURE_ROAD).length){
                    creep.move(Math.ceil(Math.random()*8));
                }
                if(creep.hits<creep.hitsMax){creep.heal(creep);}
            }
            else if(creep.pos.isNearTo(enemy)){
                creep.rangedAttack(enemy);
                creep.attack(enemy);
            }else{
            creep.heal(creep)
            creep.travelTo(enemy);
            creep.rangedAttack(enemy);
            creep.attack(enemy);
            }
        }
        else{
            creep.travelTo(creep.pos.findClosestByPath(creep.room.findExitTo(raum)));
            if(creep.hits<creep.hitsMax){creep.heal(creep);}
        }
    }
    
};

module.exports = roleBummi;