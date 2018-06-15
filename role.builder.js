var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep,noLimits) {
        let speicher = creep.home.storage;
        let homedex = Memory.rooms[creep.memory.home];
        let spawn = Game.getObjectById(Memory.claim[homedex].spawns[0]);
        let sites = noLimits[homedex].sites;
        let siteroom = noLimits[homedex].siteroom;
        let index = Memory.rooms[siteroom];
    
    
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
                creep.travelTo(spawn);
            }
        }
        // go working
	    else if(creep.memory.werk) {
            //panic reaction
	        if(siteroom == Memory.claim[homedex].AlarmRoom){
	            creep.travelTo(creep.home.controller);
	            creep.say('Yikes!!!',true);
	        }
	        else if(creep.room.name == siteroom){
	            //if(creep.pos.x == 0||creep.pos.y == 0){creep.move(3);}
	            //else if(creep.pos.x == 49||creep.pos.y == 49){creep.move(8);}
                
                var site = creep.pos.findClosestByRange(sites);
                if(creep.build(site) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(site,{range: 2});
                }
                else if(creep.pos.lookFor(LOOK_STRUCTURES).filter(s => s.structureType == STRUCTURE_ROAD).length){
                    creep.move(Math.ceil(Math.random()*8));
                }
	        }
	        else if(Game.rooms[siteroom]){
	            creep.travelTo(Game.rooms[siteroom].controller);
	        }
	        else{
	            creep.travelTo(creep.pos.findClosestByPath(creep.room.findExitTo(siteroom)));
	        }
	    }
        // getting energy
        else if(creep.room.name !== creep.home.name){
            let drops = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: drop => drop.amount > creep.carryCapacity-creep.carry.energy});
            if(!drops){
                let conti = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: conti => conti.structureType == STRUCTURE_CONTAINER && conti.store.energy > creep.carryCapacity-creep.carry.energy});
                if(!conti){
                    if(creep.room.storage){
                        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                        creep.travelTo(creep.room.storage);
                    }
                    else{
                        creep.travelTo(spawn);
                    }
                }
                else if(creep.withdraw(conti, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE){
                    creep.travelTo(conti);
                }    
            }
            else if(creep.pickup(drops)== ERR_NOT_IN_RANGE){
                creep.travelTo(drops);
            }
        }
	    else if(speicher){
            if(creep.pos.isNearTo(speicher)){
                creep.withdraw(speicher,RESOURCE_ENERGY);
            }
            else{
                creep.travelTo(speicher);
            }
        }else if(creep.home.energyAvailable == creep.home.energyCapacityAvailable){
                creep.withdraw(spawn,RESOURCE_ENERGY);
                creep.travelTo(spawn);
        }
	}
};

module.exports = roleBuilder;