/** 
 * This is the start of build a bitmap sort coordinate matrix to use for automatic base-building!
**/

module.exports = {
    first: function(){
        let span = 5; // use this to show the span of a square around your spawn. you have to manually adapt the "array"
        let x = [];
        for(let n = -span;n <= x;n++){x.push(n);}
        let s = STRUCTURE_SPAWN;
        let r = STRUCTURE_ROAD;
        let e = STRUCTURE_EXTENSION;
        
        
//      x:      -5 -4 -3 -2 -1  0  1  2  3  4  5
        y[0] = [ 0, 0, 0, 0, 0, 0, e, e, r, e, e];//-5
        y[1] = [ 0, 0, 0, 0, 0, 0, e, r, e, r, e];//-4
        y[2] = [ 0, 0, 0, 0, 0, 0, r, e, e, e, r];//-3
        y[3] = [ 0, 0, 0, e, r, r, r, e, e, r, e];//-2
        y[4] = [ 0, 0, 0, r, r, r, r, r, r, e, e];//-1
        y[5] = [ 0, 0, 0, r, r, s, r, r, 0, 0, 0];// 0
        y[6] = [ 0, 0, 0, r, s, r, s, r, 0, 0, 0];// 1
        y[7] = [ 0, 0, 0, e, r, r, r, e, 0, 0, 0];// 2
        y[8] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];// 3
        y[9] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];// 4
       y[10] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];// 5
        
    }
};