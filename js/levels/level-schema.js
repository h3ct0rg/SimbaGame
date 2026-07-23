/**
 * @typedef {Object} LevelData
 * @property {string} id
 * @property {string} name
 * @property {string} treasureId
 * @property {{sky:{top:string,bottom:string}, fog:string, accent:string}} palette
 * @property {{width:number, height:number}} bounds
 * @property {{x:number, y:number}} spawn
 * @property {{layers:string[], particles:{type:string,density:number}[], weather:?string}} background
 * @property {{x:number,y:number,w:number,h:number}[]} platforms
 * @property {{x:number,y:number,w:number,h:number,kind:string,range?:number,speed?:number}[]} hazards
 * @property {{x:number,y:number,kind:string,dialogue:string[],triggerRadius?:number}[]} npcs
 * @property {{x:number,y:number,treasureId:string,icon:string}} collectible
 * @property {string} spiritLine
 * @property {{ambientProfile:string}} music
 */

export function validateLevel(data) {
  const required = ['id', 'name', 'treasureId', 'bounds', 'spawn', 'platforms', 'collectible', 'spiritLine'];
  const missing = required.filter((key) => data[key] === undefined);
  if (missing.length) {
    console.warn(`Level "${data.id || '?'}" is missing fields: ${missing.join(', ')}`);
  }
  return missing.length === 0;
}
