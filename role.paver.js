var rolePaver = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let homedex = Memory.claim.findIndex(claim => claim.room === creep.memory.home)
        let spawn = Game.getObjectById(Memory.claim[homedex].spawns[0]);
        let speicher = creep.home.storage;
        
    // getting rooms and their roads
        if(!Memory.paving.roads.length){
            if (Memory.paving.raum.length>1){
                Memory.paving.raum.shift();
            }
            else if(Memory.paving.raum.length <=1){
                Memory.paving.raum = Memory.claim.map(claim=> claim.room);
            }
            Memory.paving.current = Memory.paving.raum[0];
            if(Game.rooms[Memory.paving.current]){
                let roads = Game.rooms[Memory.paving.current].find(FIND_STRUCTURES,{filter: (structure) => {return structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER;}});
                for(let n = 0;n < roads.length;n++){
                    Memory.paving.roads[n]=roads[n].id;
                }
            }
        }
        var siteroom = Memory.paving.current;
    // Setting working condition
	    if(creep.memory.werk && creep.carry.energy == 0) {
            creep.memory.werk = false;
	    }
	    if(!creep.memory.werk && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.werk = true;
	    }
	    
        //Time to leave
        if(creep.ticksToLive < creep.carryCapacity/creep.getActiveBodyparts(WORK)+25&&creep.carry.energy == 0){
            creep.say('bye...')
            if(spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE){
                creep.moveTo(spawn);
            }
        }
    // go working
	    else if(creep.memory.werk) {
        //panic reaction
	        if(siteroom == Memory.claim[homedex].AlarmRoom){
	            creep.moveTo(creep.home.controller);
	            creep.say('Yikes!!!',true);
	        }
	        else if(creep.room.name == siteroom){
	            if(creep.pos.x == 0||creep.pos.y == 0){creep.move(3);}
	            else if(creep.pos.x == 49||creep.pos.y == 49){creep.move(8);}
	            var roads =[];
	            for(let each of Memory.paving.roads){
	                if (!Game.getObjectById(each)){
	                    Memory.paving.roads.splice(Memory.paving.roads.indexOf(each),1);
	                }
	                else if (Game.getObjectById(each).hitsMax-Game.getObjectById(each).hits < creep.getActiveBodyparts(WORK)*100){
	                    Memory.paving.roads.splice(Memory.paving.roads.indexOf(each),1);
	                }
	                else{
	                    roads.push(Game.getObjectById(each));
	                }
	            }
	            
	            
                var road = creep.pos.findClosestByRange(roads);
                if(creep.repair(road) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(road);
                }
	        }
	        else{
	            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(siteroom)));
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

module.exports = rolePaver;