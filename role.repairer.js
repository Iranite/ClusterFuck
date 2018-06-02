var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep,defenses) {
        let spawn = Game.getObjectById(Memory.claim[Memory.claim.findIndex(claim => claim.room === creep.memory.home)].spawns[0]);
        let speicher = creep.home.storage;
	    if(creep.memory.werk && creep.carry.energy == 0) {
            creep.memory.werk = false;
	    }
	    if(!creep.memory.werk && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.werk = true;
	    }
    
        //Time to leave
        if(creep.ticksToLive < creep.carryCapacity/creep.getActiveBodyparts(WORK)+15&&creep.carry.energy == 0){
            creep.say('bye...')
            if(spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE){
                creep.moveTo(spawn);
            }
        }
	    else if(creep.memory.werk) {
	        if (creep.room.name === creep.home.name){
    	        var Defenses =[]
    	        for(let each of defenses){
    	            Defenses[defenses.indexOf(each)]=Game.getObjectById(each)
    	        }
                var defense = creep.pos.findClosestByRange(Defenses);
                if(creep.repair(defense) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(defense);
                }
	        }else{
	            creep.moveTo(creep.home.controller);
	        }
	    }
	    else if(speicher){
            if(creep.pos.isNearTo(speicher)){
                creep.withdraw(speicher,RESOURCE_ENERGY);
            }
            else{
                creep.moveTo(speicher);
            }
        }else if(spawn.room.energyAvailable == spawn.room.energyCapacityAvailable){
                creep.withdraw(spawn,RESOURCE_ENERGY);
                creep.moveTo(spawn);
        }
	}
};

module.exports = roleRepairer;