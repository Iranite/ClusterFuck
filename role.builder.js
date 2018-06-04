var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep,noLimits) {
        let speicher = creep.home.storage;
        let homedex = Memory.claim.findIndex(claim => claim.room === creep.memory.home);
        let spawn = Game.getObjectById(Memory.claim[homedex].spawns[0]);
        let sites = noLimits[homedex].sites;
        let siteroom = noLimits[homedex].siteroom;
        let index = Memory.claim.findIndex(claim => claim.room === siteroom)
    
    
        // Determining working condition
	    if(creep.memory.werk && creep.carry.energy == 0) {
            creep.memory.werk = false;
	    }
	    if(!creep.memory.werk && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.werk = true;
	    }
        
        // Self destruct if no job.
        if(!sites.length){
            creep.say('bye...')
            if(spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE){
                creep.moveTo(spawn);
            }
        }
        // go working
	    else if(creep.memory.werk) {
	        if(creep.room.name == siteroom){
	            if(creep.pos.x == 0||creep.pos.y == 0){creep.move(3);}
	            else if(creep.pos.x == 49||creep.pos.y == 49){creep.move(8);}
                
                var site = creep.pos.findClosestByRange(sites);
                if(creep.build(site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site);
                }
	        }
	        else if(Game.rooms[siteroom]){
	            creep.moveTo(Game.rooms[siteroom].controller);
	        }
	        else{
	            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(siteroom)));
	        }
	    }
        // getting energy
        else if(Memory.claim[index].rank == 0 && creep.room.name !== creep.home.name){
            var drops = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(!drops){
                creep.moveTo(spawn)
            }
            else if(creep.pickup(drops)== ERR_NOT_IN_RANGE){
                creep.moveTo(drops)
            }
        }
	    else if(speicher){
            if(creep.pos.isNearTo(speicher)){
                creep.withdraw(speicher,RESOURCE_ENERGY);
            }
            else{
                creep.moveTo(speicher);
            }
        }else if(creep.home.energyAvailable == creep.home.energyCapacityAvailable){
                creep.withdraw(spawn,RESOURCE_ENERGY);
                creep.moveTo(spawn);
        }
	}
};

module.exports = roleBuilder;