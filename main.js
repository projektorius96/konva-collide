import './style.css';
import CONSTANTS from './src/Constants.js';
import { Node, Stage, Layer, Group, Shape, Rect } from './src/KonvaComponents/index.js';
import { sceneFuncBound } from './src/Callbacks/index.js';

const
  Default = ""
  ,
  StageDefaults = new Node({
    name: Object.keys({Default})[0] + Stage.name,
    container: document.body,
    width: CONSTANTS.VIEWPORT.FULL_VIEWPORT_WIDTH,
    height: CONSTANTS.VIEWPORT.FULL_VIEWPORT_HEIGHT,
  })
  , 
  BoundingBoxDefaults = new Node({
    name: 'DefaultBBox',
    // DEV_NOTE # BoundingBoxDefaults x,y MUST stay in ABSOLUTE 0,0 COORDS ; instead move your group-of-interest (e,g, defaultGroup) x, y coords : this avoids collision bugs that might happen due to Konva.js nature referring to absolute canvas coords system !
    x: 0,
    y: 0,
    fill: '#FFFFFF',
    strokeWidth: 1,
    stroke: '#000000',
    width: StageDefaults.width()/2 * 0.989,
    height: 64,
    draggable: true,
    sceneFunc: function(...args){
      sceneFuncBound.call(this, ...args)
    }
  })
  ,
  defaultGroupStroke = new Rect({
    strokeWidth: 10,
    stroke: 'grey',
  })

globalThis.defaultStage = new Stage( { ...StageDefaults.getAttrs() } ).add(

  globalThis.defaultLayer = new Layer( { name: Object.keys({Default} )[0] + Layer.name, draggable: true }).add(

    defaultGroupStroke,
    globalThis.defaultGroup = new Group( 
      {
        name: Object.keys({Default} )[0] + Group.name,
        x: StageDefaults.width() / 4,
        y: StageDefaults.height() / 4,
      }
    ).add(

      // GOAL: check if B's resultant coords (i.e. resultant ordered pair for each component x,y are equal or less width, height of A - if so then it collides)

      new Shape({
        name: 'shapeA',
        ...BoundingBoxDefaults.getAttrs()
        ,
        fill: 'lightgreen'
      })
      ,
      new Shape({
        name: 'shapeB',
        ...BoundingBoxDefaults.getAttrs()
        ,
        fill: 'orange',
      })
    )

  )

)

if(defaultGroup.hasChildren){

  /* === INITIAL POSITIONING === */

  let incrementalHeight = 0;
  let defaultVerticalPadding = BoundingBoxDefaults.y();
  defaultGroupStroke.setAttrs( defaultGroup.getClientRect() )
  defaultGroupStroke.setAttr('height', (BoundingBoxDefaults.height()*defaultGroup.getChildren().length) )
  defaultGroup.getChildren().forEach((each)=>{
    each.setAttrs({
      y: incrementalHeight+defaultVerticalPadding,
    });
    incrementalHeight += BoundingBoxDefaults.height();
  });

  /* === COLLISION LOGIC === */

  const [shapeA, shapeB] = defaultGroup.getChildren();
  const shapeA$initFill = shapeA.getAttr('fill')
  const shapeB$initDims = shapeB.getClientRect({relativeTo: defaultGroup})

  shapeB.on('dragmove', function(){
    // DEV_NOTE # Without Math.abs collision would work only for right and bottom sides
    if ( Math.abs(this.x()) <= shapeA.width() && Math.abs(this.y()) <= shapeA.height() ){
      /* shapeA.setAttr('fill', 'red') */// instead do something more restrictive such as forced position resetting for shapeB (orange) once collided with shapeA (green)
      shapeB.setAttrs({ x: shapeB$initDims.x, y: shapeB$initDims.y  })
    }
    else {
      shapeA.setAttr('fill', shapeA$initFill)
    }
  })

}

