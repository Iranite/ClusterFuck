var roleBummi = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var raum = Memory.init.AlarmRoom
        let spawn = Game.getObjectById(Memory.claim[Memory.claim.findIndex(claim => claim.room === creep.memory.home)].spawns[0]);
        if(!raum){
            var raum = creep.memory.raum;
        }
        if(creep.hits<creep.hitsMax*3/10){creep.heal(creep);}
        if (creep.room.name === raum){
            if(!enemy){
                creep.moveTo(5+Math.floor(Math.random()*40),5+Math.floor(Math.random()*40));
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