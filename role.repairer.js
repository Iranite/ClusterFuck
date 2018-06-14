var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var homedex = Memory.rooms[creep.memory.home];
        let spawn = Game.getObjectById(Memory.claim[homedex].spawns[0]);
        let speicher = creep.home.storage;
        let defenses = Memory.claim[homedex].defenses
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
        // Go working!
	    else if(creep.memory.werk) {
             // move a step into the room when on the Exit...
             if(creep.pos.x == 0||creep.pos.y == 0){creep.move(3);}
             else if(creep.pos.x == 49||creep.pos.y == 49){creep.move(8);}
	        if (creep.room.name === creep.home.name){
    	        var Defenses =[]
    	        for(let each of defenses){
    	            Defenses[defenses.indexOf(each)]=Game.getObjectById(each)
    	        }
                var defense = creep.pos.findClosestByRange(Defenses);
                if(defense){creep.memory.job = defense.id;}
                if(creep.repair(defense) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(defense);
                }
                else if(creep.pos.lookFor(LOOK_STRUCTURES).filter(s => s.structureType == STRUCTURE_ROAD).length){
                    creep.move(Math.ceil(Math.random()*8));
                }
	        }else{
	            if(creep.memory.job){
	                creep.moveTo(Game.getObjectById(creep.memory.job));
	            }
	            else{
	                creep.moveTo(creep.home.controller);
	            }
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