const RESPONSE =require('../../config/responseState')

module.exports = (mapState)=>{
    if(!mapState.point || !mapState.point.x || !mapState.point.y || 
        !mapState.bounds || !mapState.bounds.min || !mapState.bounds.max ||
        !mapState.Zoom
        ){
            return RESPONSE.VALIDATE_UNDIFINED_ERROR;
    }
    if(mapState.point.x%1===0 || mapState.point.y%1===0 || 
        mapState.bounds.min%1===0 || mapState.bounds.max%1===0 ||
        !Number.isInteger(mapState.Zoom)){
            return RESPONSE.VALIDATE_TYPE_ERROR;
    }
    return RESPONSE.SUCCESS;
}