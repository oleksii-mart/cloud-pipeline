(self.webpackChunkHcsImageViewer=self.webpackChunkHcsImageViewer||[]).push([[822],{8915:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return Ot}});var n=r(7462),o=r(7294),i=r(3935),a=r(4942),c=r(9439),s=r(5697),l=r.n(s),u=r(739),f=r(1002),p=r(5671),d=r(3144),v=r(1752),h=r(136),m=r(3930),y=r(1120),b=r(5861),g=r(7757),O=r.n(g),w=r(4088),j=r(8918),P=r(3121);function C(e){var t=e[e.length-1];return 3===t||4===t}function Z(e){if(e&&e.shape){var t=C(e.shape),r=e.shape.slice(t?-3:-2),n=(0,c.Z)(r,2);return{height:n[0],width:n[1]}}}var k,S={column:-1,row:-1},x=function(e){(0,h.Z)(o,e);var t,r,n=(t=o,r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,n=(0,y.Z)(t);if(r){var o=(0,y.Z)(this).constructor;e=Reflect.construct(n,arguments,o)}else e=n.apply(this,arguments);return(0,m.Z)(this,e)});function o(){return(0,p.Z)(this,o),n.apply(this,arguments)}return(0,d.Z)(o,[{key:"renderLayers",value:function(){for(var e=this.props,t=e.loader,r=e.id,n=e.mesh,o=void 0===n?{}:n,i=e.hoveredCell,a=o.rows,c=void 0===a?0:a,s=o.columns,l=void 0===s?0:s,u=o.cells,f=void 0===u?[]:u,p=Z(t[0])||{},d=p.width,v=void 0===d?0:d,h=p.height,m=[],y=v/l,b=(void 0===h?0:h)/c,g=function(e,t){return[e*y,t*b]},O=function(e,t){return[g(e,t),g(e+1,t),g(e+1,t+1),g(e,t+1)]},j=0;j<c;j+=1)for(var C=0;C<l;C+=1)m.push({column:C,row:j});var k=function(e){return e&&i&&i.column===e.column&&i.row===e.row};return m.sort((function(e,t){return Number(k(e))-Number(k(t))})),[new P.Z({id:"line-".concat(r),coordinateSystem:w.Df.CARTESIAN,data:m,getPolygon:function(e){return O(e.column,e.row)},getLineWidth:function(e){return k(e)?2:1},lineWidthUnits:"pixels",getLineColor:function(e){return k(e)?[220,220,220]:[120,120,120]},filled:!1,stroked:!0,updateTriggers:{getLineColor:[i||S]}}),new P.Z({id:"cell-".concat(r),coordinateSystem:w.Df.CARTESIAN,data:f,getPolygon:function(e){return O(e.column,e.row)},filled:!0,stroked:!1,pickable:!0,getFillColor:[255,255,255,0]})]}},{key:"onHover",value:function(e){var t=e.object,r=this.props.onHover;return r&&r(t),!0}},{key:"onClick",value:function(e){var t=e.object,r=this.props.onClick;return r&&r(t),!0}}]),o}(j.Z);x.layerName="CollageMeshLayer",x.defaultProps={loader:{type:"object",value:{getRaster:(k=(0,b.Z)(O().mark((function e(){return O().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",{data:[],height:0,width:0});case 1:case"end":return e.stop()}}),e)}))),function(){return k.apply(this,arguments)}),getRasterSize:function(){return{height:0,width:0}},dtype:"<u2"},compare:!0},id:{type:"string",value:"collage-mesh-layer",compare:!0},pickable:{type:"boolean",value:!0,compare:!0},viewState:{type:"object",value:{zoom:0,target:[0,0,0]},compare:!0},mesh:{type:"object",value:{rows:0,columns:0},compare:!0},onHover:{type:"function",value:function(){},compare:!0},onClick:{type:"function",value:function(){},compare:!0}};var D=x,E=r(5395),L=r(3693);function R(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=(0,y.Z)(e);if(t){var o=(0,y.Z)(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return(0,m.Z)(this,r)}}var I=function(e){(0,h.Z)(r,e);var t=R(r);function r(){return(0,p.Z)(this,r),t.apply(this,arguments)}return(0,d.Z)(r,[{key:"getShaders",value:function(){return{inject:{"fs:#decl":"uniform float accuracy;","fs:DECKGL_FILTER_COLOR":"\n          if (color.r < accuracy && color.g < accuracy && color.b < accuracy) {\n            // is transparent\n            color = vec4(0.0, 0.0, 0.0, 0.0);\n          }\n        "}}}},{key:"updateState",value:function(e){for(var t=e.props.ignoreColorAccuracy,r=void 0===t?.1:t,n=this.getModels(),o=0;o<n.length;o+=1)n[o].setUniforms({accuracy:r})}}]),r}(L.Z);function z(e){if(!e)return[1,1,1,1];if("object"===(0,f.Z)(e)&&Array.isArray(e)){var t=(0,c.Z)(e,4),r=t[0],n=void 0===r?1:r,o=t[1],i=void 0===o?1:o,a=t[2],s=void 0===a?1:a,l=t[3];return[n,i,s,void 0===l?1:l]}if("string"==typeof e&&/^#/i.test(e)){var u=function(e){return parseInt(e||"FF",16)/255};return[u(e.slice(1,3)),u(e.slice(3,5)),u(e.slice(5,7)),u(e.slice(7,9))]}if("number"==typeof e){var p=function(e){return Math.max(0,Math.min(1,e))};return[p(e),p(e),p(e),1]}return[1,1,1,1]}var M=function(e){(0,h.Z)(r,e);var t=R(r);function r(){return(0,p.Z)(this,r),t.apply(this,arguments)}return(0,d.Z)(r,[{key:"getShaders",value:function(){return{inject:{"fs:#decl":"uniform float accuracy; uniform vec4 tint;","fs:DECKGL_FILTER_COLOR":"\n          if (color.r < accuracy && color.g < accuracy && color.b < accuracy) {\n            // is transparent\n            color = vec4(0.0, 0.0, 0.0, 0.0);\n          } else {\n            color = tint;\n          }\n        "}}}},{key:"updateState",value:function(e){for(var t=e.props,r=t.ignoreColorAccuracy,n=void 0===r?.1:r,o=t.color,i=void 0===o?[1,1,1,1]:o,a=this.getModels(),c=0;c<a.length;c+=1)a[c].setUniforms({accuracy:n,tint:z(i)})}}]),r}(L.Z);var A=function(e){(0,h.Z)(o,e);var t,r,n=(t=o,r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,n=(0,y.Z)(t);if(r){var o=(0,y.Z)(this).constructor;e=Reflect.construct(n,arguments,o)}else e=n.apply(this,arguments);return(0,m.Z)(this,e)});function o(){return(0,p.Z)(this,o),n.apply(this,arguments)}return(0,d.Z)(o,[{key:"renderLayers",value:function(){var e=this.props,t=e.loader,r=e.id,n=e.url,o=e.color,i=e.ignoreColor,a=e.ignoreColorAccuracy,c=Z(t[0])||{},s=c.width,l=void 0===s?0:s,u=c.height,f=void 0===u?0:u;return[new E.Z({id:"image-layer-".concat(r),image:n,bounds:[0,f,l,0],ignoreColorAccuracy:a,color:o,extensions:[!(!i||o)&&new I,!(!i||!o)&&new M].filter(Boolean)})]}}]),o}(j.Z);A.layerName="ImageOverlayLayer",A.defaultProps={loader:{type:"object",value:{getRaster:function(){var e=(0,b.Z)(O().mark((function e(){return O().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",{data:[],height:0,width:0});case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),getRasterSize:function(){return{height:0,width:0}},dtype:"<u2"},compare:!0},id:{type:"string",value:"image-overlay-layer",compare:!0},url:{type:"string",value:void 0,compare:!0},color:{type:"string",value:void 0,compare:!0},ignoreColor:{type:"boolean",value:!1,compare:!0},ignoreColorAccuracy:{type:"number",value:.1,compare:!0},pickable:{type:"boolean",value:!0,compare:!0},viewState:{type:"object",value:{zoom:0,target:[0,0,0]},compare:!0},mesh:{type:"object",value:{rows:0,columns:0},compare:!0},onHover:{type:"function",value:function(){},compare:!0},onClick:{type:"function",value:function(){},compare:!0}};var B=A;function V(e){return"-#".concat(e,"#")}function T(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function H(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?T(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):T(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var N=function(e){(0,h.Z)(o,e);var t,r,n=(t=o,r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,n=(0,y.Z)(t);if(r){var o=(0,y.Z)(this).constructor;e=Reflect.construct(n,arguments,o)}else e=n.apply(this,arguments);return(0,m.Z)(this,e)});function o(e){var t;(0,p.Z)(this,o),t=n.call(this,e);var r=e.mesh,i=e.overlayImages,a=void 0===i?[]:i,c=e.onCellHover,s=e.hoveredCell,l=e.onCellClick;return t.onCellHover=c,t.hoveredCell=s,t.onCellClick=l,t.mesh=r,t.overlayImages=a,t}return(0,d.Z)(o,[{key:"getLayers",value:function(e){var t=e.viewStates,r=e.props,n=(0,v.Z)((0,y.Z)(o.prototype),"getLayers",this).call(this,{viewStates:t,props:r}),i=r.loader,a=this.id,c=this.height,s=this.width,l=t[a];return this.overlayImages&&this.overlayImages.forEach((function(e,t){var r,o,u,p;"string"==typeof e?(r=e,o=!0,u=.1):"object"===(0,f.Z)(e)&&e.url&&(r=e.url,o=!!(p=e.color)||!!e.ignoreColor,u=e.ignoreColorAccuracy||.1),r&&n.push(new B({loader:i,url:r,color:p,ignoreColor:o,ignoreColorAccuracy:u,id:"image-".concat(t,"-").concat(V(a)),viewState:H(H({},l),{},{height:c,width:s})}))})),this.mesh&&n.push(new D(H(H({},r),{},{loader:i,id:"mesh-".concat(V(a)),mesh:H({},this.mesh),viewState:H(H({},l),{},{height:c,width:s}),onHover:this.onCellHover,onClick:this.onCellClick,hoveredCell:this.hoveredCell}))),n}}]),o}(u.O6);function F(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function U(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?F(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):F(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var G=function(e){var t=e.loader,r=e.contrastLimits,n=e.colors,i=e.channelsVisible,a=e.viewStates,s=void 0===a?[]:a,l=e.colormap,f=e.overview,p=e.overviewOn,d=e.selections,v=e.hoverHooks,h=void 0===v?{handleValue:function(){},handleCoordinate:function(){}}:v,m=e.height,y=e.width,b=e.lensEnabled,g=void 0!==b&&b,O=e.lensSelection,w=void 0===O?0:O,j=e.lensRadius,P=void 0===j?100:j,C=e.lensBorderColor,Z=void 0===C?[255,255,255]:C,k=e.lensBorderRadius,S=void 0===k?.02:k,x=e.clickCenter,D=void 0===x||x,E=e.transparentColor,L=e.onViewStateChange,R=e.onHover,I=e.onViewportLoad,z=e.extensions,M=void 0===z?[]:z,A=e.deckProps,B=e.mesh,V=e.onCellClick,T=e.overlayImages,H=null==s?void 0:s.find((function(e){return e.id===u.ys})),F=(0,o.useMemo)((function(){return H||(0,u.TI)(t,{height:m,width:y},.5)}),[t,H]),G=(0,o.useState)(void 0),_=(0,c.Z)(G,2),W=_[0],$=_[1],K=(0,o.useCallback)((function(e){e&&!W?$(e):e?e&&W&&e.column!==W.column&&e.row!==W.row&&$(e):$(e)}),[W,$]),q=new N({id:u.ys,height:m,width:y,mesh:B,onCellHover:K,hoveredCell:W,onCellClick:V,overlayImages:T}),J={loader:t,contrastLimits:r,colors:n,channelsVisible:i,selections:d,onViewportLoad:I,colormap:l,lensEnabled:g,lensSelection:w,lensRadius:P,lensBorderColor:Z,lensBorderRadius:S,extensions:M,transparentColor:E},Q=[],X=[],Y=[];if(Q.push(q),X.push(J),Y.push(U(U({},F),{},{id:u.ys})),p&&t){var ee=(null==s?void 0:s.find((function(e){return e.id===u.cl})))||U(U({},F),{},{id:u.cl}),te=new u.A6(U({id:u.cl,loader:t,detailHeight:m,detailWidth:y,clickCenter:D},f));Q.push(te),X.push(U(U({},J),{},{lensEnabled:!1})),Y.push(ee)}return t?o.createElement(u.iP,{layerProps:X,views:Q,viewStates:Y,hoverHooks:h,onViewStateChange:L,onHover:R,deckProps:A}):null},_="set-data",W="set-source-initializing",$="set-source",K="set-source-error",q="set-image",J="set-image-viewport-loaded",Q="set-mesh",X="set-overlay-images";function Y(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ee(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Y(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Y(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function te(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function re(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?te(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):te(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function ne(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function oe(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ne(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ne(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var ie=function(e,t){switch(t.type){case _:return function(e,t){var r=t.url,n=t.offsetsUrl,o=t.callback,i=e.url,a=e.offsetsUrl;return i===r&&n===a?(o&&o(),e):ee(ee({},e),{},{loader:void 0,metadata:void 0,imageIndex:0,imageTimePosition:0,imageZPosition:0,mesh:void 0,source:void 0,sourcePending:!1,sourceError:!1,sourceCallback:o,error:void 0,url:r,offsetsUrl:n})}(e,t);case"set-error":return function(e,t){var r=t.error;return re(re({},e),{},{error:r})}(e,t);case W:return function(e){return oe(oe({},e),{},{loader:void 0,metadata:void 0,imageIndex:0,source:void 0,sourceError:void 0,sourcePending:!0,imagePending:!1,overlayImages:[]})}(e);case K:return function(e,t){var r=t.error,n=e.sourceCallback;return"function"==typeof n&&setTimeout((function(){n({error:r})}),0),oe(oe({},e),{},{loader:void 0,metadata:void 0,imageIndex:0,source:void 0,sourceError:r,sourcePending:!1,sourceCallback:void 0,overlayImages:[]})}(e,t);case $:return function(e,t){var r=t.source,n=e.sourceCallback;"function"==typeof n&&setTimeout((function(){n()}),0);var o=Array.isArray(r)?r:[r],i=o.map((function(e){return e.data})),a=o.map((function(e){return e.metadata}));return oe(oe({},e),{},{loader:i,metadata:a,imageIndex:0,source:r,sourceError:void 0,sourcePending:!1,sourceCallback:void 0,overlayImages:[]})}(e,t);case q:return function(e,t){var r,n=t.index,o=t.ID,i=t.Name,a=t.search,s=t.imageTimePosition,l=void 0===s?0:s,u=t.imageZPosition,f=void 0===u?0:u,p=t.mesh,d=t.overlayImages,v=void 0===d?[]:d,h=e.metadata,m=void 0===h?[]:h;if(null!=n)r=m[n];else if(void 0!==o)r=m.find((function(e){return e.ID===o}));else if(void 0!==i)r=m.find((function(e){return(e.Name||e.name||"").toLowerCase()===i.toLowerCase()}));else if(a&&/^[\d]+_[\d]+$/.test(a)){var y=/^([\d]+)_([\d])+$/.exec(a),b=(0,c.Z)(y,3),g=b[1],O=b[2],w=new RegExp("^\\s*well\\s+".concat(g,"\\s*,\\s*field\\s+").concat(O,"\\s*$"),"i");r=m.find((function(e){return w.test(e.Name||e.name)}))}if(r){var j=m.indexOf(r);return oe(oe({},e),{},{imageIndex:j,imagePending:!0,imageTimePosition:l,imageZPosition:f,mesh:p,overlayImages:v})}return e}(e,t);case J:return function(e){return oe(oe({},e),{},{imagePending:!1})}(e);case Q:return function(e,t){var r=t.mesh;return oe(oe({},e),{},{mesh:r})}(e,t);case X:return function(e,t){var r=t.overlayImages,n=void 0===r?[]:r;return oe(oe({},e),{},{overlayImages:n})}(e,t);default:return e}},ae=r(2407),ce=r(265);var se=function(e){(0,h.Z)(o,e);var t,r,n=(t=o,r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,n=(0,y.Z)(t);if(r){var o=(0,y.Z)(this).constructor;e=Reflect.construct(n,arguments,o)}else e=n.apply(this,arguments);return(0,m.Z)(this,e)});function o(e){var t;return(0,p.Z)(this,o),t=e?n.call(this,"offsets.json file not found: ".concat(e)):n.call(this,"offsets.json file not specified"),(0,m.Z)(t)}return(0,d.Z)(o)}((0,ae.Z)(Error));function le(e,t,r){return ue.apply(this,arguments)}function ue(){return(ue=(0,b.Z)(O().mark((function e(t,r,n){var o,i,a,c,s,l,u,f,p;return O().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,ce.W0)(t);case 2:return i=e.sent,e.next=5,i.getImage(0);case 5:if(a=e.sent,!Boolean(null==a||null===(o=a.fileDirectory)||void 0===o?void 0:o.SubIFDs)){e.next=9;break}return e.abrupt("return",r.reduce((function(e,t){var r=t.Pixels;return r.SizeC*r.SizeT*r.SizeZ+e}),1));case 9:return c=n[0].length,s=r[0].Pixels,l=s.SizeC,u=s.SizeT,f=s.SizeZ,p=l*u*f,e.abrupt("return",p*c);case 13:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function fe(){return fe=(0,b.Z)(O().mark((function e(){var t,r,n,o,i,a,c,s=arguments;return O().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=s.length>0&&void 0!==s[0]?s[0]:{},r=t.url,!(n=t.offsetsUrl)){e.next=8;break}return e.next=5,fetch(n);case 5:e.t0=e.sent,e.next=9;break;case 8:e.t0=void 0;case 9:if(o=e.t0,i=!o||!o.ok){e.next=17;break}return e.next=14,o.json();case 14:e.t1=e.sent,e.next=18;break;case 17:e.t1=void 0;case 18:return a=e.t1,e.next=21,(0,u.$L)(r,{offsets:a,images:"all"});case 21:if(c=e.sent,!i){e.next=28;break}return e.next=25,le(r,c.map((function(e){return e.metadata})),c.map((function(e){return e.data})));case 25:if(!(e.sent>40)){e.next=28;break}throw new se(n);case 28:return e.abrupt("return",c);case 29:case"end":return e.stop()}}),e)}))),fe.apply(this,arguments)}var pe="set-default",de="set-loading",ve="set-loaded",he="set-error",me="set-channel-properties",ye="set-color-map",be="set-lens-channel",ge="set-lens-enabled",Oe="set-global-position",we="set-lock-channels";function je(){var e=[];return{identifiers:[],channels:[],channelsVisibility:[],selections:e,builtForSelections:e,globalSelection:void 0,colors:[],domains:[],realDomains:[],contrastLimits:[],useLens:!1,useColorMap:!1,colorMap:"",lensEnabled:!1,lensChannel:0,use3D:!1,pixelValues:[],xSlice:[0,1],ySlice:[0,1],zSlice:[0,1],ready:!1,isRGB:!1,shapeIsInterleaved:!1,pending:!1,globalDimensions:[],metadata:void 0,loader:[],error:void 0,lockChannels:!1}}var Pe=r(3433),Ce=r(4506);function Ze(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}var ke=r(4925),Se=["channels","colors","domains","contrastLimits"];function xe(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function De(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?xe(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):xe(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var Ee=[],Le=r(4477);function Re(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Ie(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Re(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Re(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var ze=[],Me=[0,1];function Ae(e,t){switch(t.type){case de:return Ie(Ie({},e),{},{pending:!0,error:void 0});case ve:return Ie(Ie({},e),{},{pending:!1});case me:return function(e,t,r){var n=Object.entries(r||{}).filter((function(t){var r=(0,c.Z)(t,1)[0];return e&&e[r]&&Array.isArray(e[r])}));if(n.length>0){var o=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Ze(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ze(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},e||{});return n.forEach((function(e){var r=(0,c.Z)(e,2),n=r[0],i=r[1],a=o[n];o[n]=(0,Pe.Z)(a),o[n][t]=i})),o}return e}(e,t.channel,t.properties);case ye:var r=t.colorMap,n=void 0===r?"":r;return e.useColorMap?Ie(Ie({},e),{},{colorMap:n}):e;case be:var o=t.lensChannel,i=void 0===o?0:o,s=e.lensEnabled,l=e.useLens;return s&&l?Ie(Ie({},e),{},{lensChannel:i}):e;case ge:var u=t.lensEnabled,f=void 0!==u&&u,p=e.lensEnabled,d=e.useLens;return Ie(Ie({},e),{},d&&!p&&f?{lensEnabled:f,lensChannel:0}:{lensEnabled:!1});case Oe:var v=t.position,h=void 0===v?{}:v,m=e.globalDimensions,y=void 0===m?[]:m,b=e.selections,g=void 0===b?[]:b,O=e.globalSelection,w=void 0===O?{}:O,j=function(e,t){var r=(y.find((function(t){return t.label===e}))||{}).size,n=void 0===r?0:r;return Math.max(0,Math.min(n,Math.round(t)))},P=Object.entries(h).filter((function(e){var t=(0,c.Z)(e,1)[0];return Le.Z.includes(t)&&y.find((function(e){return e.label===t}))})).map((function(e){var t=(0,c.Z)(e,2),r=t[0],n=t[1];return{dimension:r,position:j(r,n)}}));if(P.length>0){var C=P.map((function(e){var t=e.dimension,r=e.position;return(0,a.Z)({},t,r)})).reduce((function(e,t){return Ie(Ie({},e),t)}),{}),Z=Ie(Ie({},w),C),k=g.map((function(e){return Ie(Ie({},e),C)}));return Ie(Ie({},e),{},{selections:k,globalSelection:Z})}return e;case we:var S=t.lock,x=e.contrastLimits,D=void 0===x?ze:x,E=e.realDomains,L=void 0===E?ze:E,R=Ie(Ie({},e),{},{lockChannels:S});return S||(R.domains=L.slice(),R.contrastLimits=D.map((function(e,t){var r=L[t];if(r&&Array.isArray(r)&&2===r.length){var n=(0,Ce.Z)(e),o=n[0],i=n[1],a=n.slice(2),s=(0,c.Z)(r,2),l=s[0],u=s[1],f=function(e){return Math.max(l,Math.min(u,e))};return[f(o),f(i)].concat((0,Pe.Z)(a))}return e}))),R;case pe:var I=function(e,t){var r=e||{},n=r.lockChannels,o=void 0!==n&&n,i=r.channels,a=void 0===i?Ee:i,c=r.colors,s=void 0===c?Ee:c,l=r.domains,u=void 0===l?Ee:l,f=r.contrastLimits,p=void 0===f?Ee:f,d=r.channelsVisibility,v=void 0===d?Ee:d,h=t||{},m=h.channels,y=void 0===m?Ee:m,b=h.colors,g=void 0===b?Ee:b,O=h.domains,w=void 0===O?Ee:O,j=h.contrastLimits,P=void 0===j?Ee:j,C=(0,ke.Z)(h,Se);if(!o)return De(De({},C),{},{channels:y,colors:g,domains:w,contrastLimits:P,realDomains:w.slice(),channelsVisibility:y.map((function(){return!0}))});for(var Z=a.slice(),k=[],S=0;S<y.length;S+=1){var x=Z.indexOf(y[S]);-1===x?k.push({channel:y[S],color:g[S],domain:w[S],realDomain:w[S].slice(),contrastLimits:P[S],visibility:!0}):(Z.splice(x,1,void 0),k.push({channel:y[S],color:s[x]||g[S],domain:u[x]||w[S],realDomain:w[S].slice(),contrastLimits:p[x]||P[S],visibility:void 0===v[x]||v[x]}))}return De(De({},C),{},{channels:k.map((function(e){return e.channel})),colors:k.map((function(e){return e.color})),domains:k.map((function(e){return e.domain})),realDomains:k.map((function(e){return e.realDomain})),contrastLimits:k.map((function(e){return e.contrastLimits})),channelsVisibility:k.map((function(e){return e.visibility}))})}(e,t),z=I.channels,M=void 0===z?ze:z,A=I.channelsVisibility,B=void 0===A?ze:A,V=I.selections,T=void 0===V?ze:V,H=I.colors,N=void 0===H?ze:H,F=I.domains,U=void 0===F?ze:F,G=I.realDomains,_=void 0===G?U.slice():G,W=I.contrastLimits,$=void 0===W?ze:W,K=I.useLens,q=void 0!==K&&K,J=I.useColorMap,Q=void 0!==J&&J,X=I.colorMap,Y=void 0===X?Q?e.colorMap:"":X,ee=I.lensEnabled,te=void 0!==ee&&ee,re=I.lensChannel,ne=void 0===re?0:re,oe=I.xSlice,ie=void 0===oe?Me:oe,ae=I.ySlice,ce=void 0===ae?Me:ae,se=I.zSlice,le=void 0===se?Me:se,ue=I.use3D,fe=void 0!==ue&&ue,je=I.ready,xe=void 0!==je&&je,Re=I.isRGB,Ae=void 0!==Re&&Re,Be=I.shapeIsInterleaved,Ve=void 0!==Be&&Be,Te=I.globalDimensions,He=void 0===Te?ze:Te,Ne=I.metadata,Fe=I.loader;return Ie(Ie({},e),{},{identifiers:M.map((function(e,t){return"".concat(e||"channel","-").concat(t)})),channels:M,channelsVisibility:B,selections:T,builtForSelections:T,globalSelection:(T||[])[0],pixelValues:new Array((T||[]).length).fill("-----"),colors:N,domains:U,realDomains:_,contrastLimits:$,useLens:q,useColorMap:Q,colorMap:Y,lensEnabled:te,lensChannel:ne,xSlice:ie,ySlice:ce,zSlice:le,use3D:fe,ready:xe,isRGB:Ae,shapeIsInterleaved:Ve,globalDimensions:He,error:void 0,metadata:Ne,loader:Fe});case he:var Ue=t.error;return Ie(Ie({},e),{},{error:Ue,pending:!1});default:return e}}var Be=r(3467);function Ve(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function Te(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Ve(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ve(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function He(e,t){for(var r=[],n=Te(Te({},function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Le.Z;return e.labels.filter((function(e){return t.includes(e)})).map((function(e){return(0,a.Z)({},e,0)})).reduce((function(e,t){return Te(Te({},e),t)}),{})}(e)),t||{}),o=e.labels.map((function(t,r){return{name:t,size:e.shape[r]}})).find((function(e){return!Le.Z.includes(e.name)&&e.size})),i=0;i<Math.min(4,o.size);i+=1)r.push(Te((0,a.Z)({},o.name,i),n));return C(e.shape)?[Te(Te({},r[0]),{},{c:0})]:r}function Ne(e){return Fe.apply(this,arguments)}function Fe(){return(Fe=(0,b.Z)(O().mark((function e(t){var r,n,o,i,a,c,s;return O().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.loader,n=t.selection,o=Array.isArray(r)?r[r.length-1]:r,e.next=4,o.getRaster({selection:n});case 4:return i=e.sent,a=(0,u.mx)(i.data),c=a.domain,s=a.contrastLimits,e.abrupt("return",{domain:c,contrastLimits:s});case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Ue(e){return Ge.apply(this,arguments)}function Ge(){return(Ge=(0,b.Z)(O().mark((function e(t){var r,n,o,i,a,c,s,l,f,p,d,v;return O().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.loader,n=t.selection,o=r[r.length-1],i=o.shape,a=o.labels,c=i[a.indexOf("z")]>>r.length-1,e.next=6,o.getRaster({selection:Te(Te({},n),{},{z:0})});case 6:return s=e.sent,e.next=9,o.getRaster({selection:Te(Te({},n),{},{z:Math.floor(c/2)})});case 9:return l=e.sent,e.next=12,o.getRaster({selection:Te(Te({},n),{},{z:Math.max(0,c-1)})});case 12:return f=e.sent,p=(0,u.mx)(s.data),d=(0,u.mx)(l.data),v=(0,u.mx)(f.data),e.abrupt("return",{domain:[Math.min(p.domain[0],d.domain[0],v.domain[0]),Math.max(p.domain[1],d.domain[1],v.domain[1])],contrastLimits:[Math.min(p.contrastLimits[0],d.contrastLimits[0],v.contrastLimits[0]),Math.max(p.contrastLimits[1],d.contrastLimits[1],v.contrastLimits[1])]});case 17:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function _e(e){return We.apply(this,arguments)}function We(){return(We=(0,b.Z)(O().mark((function e(t){var r,n,o,i;return O().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.loader,n=t.selection,o=t.use3d,i=o?Ue:Ne,e.abrupt("return",i({loader:r,selection:n}));case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function $e(e){return Ke.apply(this,arguments)}function Ke(){return(Ke=(0,b.Z)(O().mark((function e(t){var r,n,o,i,a,c;return O().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.loader,n=t.selections,o=t.use3d,e.next=3,Promise.all(n.map((function(e){return _e({loader:r,selection:e,use3d:o})})));case 3:return i=e.sent,a=i.map((function(e){return e.domain})),c=i.map((function(e){return e.contrastLimits})),e.abrupt("return",{domains:a,contrastLimits:c});case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function qe(e){var t=Array.isArray(e)?e[0]:e,r=t.shape,n=t.labels,o=function(e){var t,r,n=null!==(t=null==e||null===(r=e.meta)||void 0===r?void 0:r.physicalSizes)&&void 0!==t?t:{},o=n.x,i=n.y,a=n.z;if(null!=o&&o.size&&null!=i&&i.size&&null!=a&&a.size){var c=Math.min(a.size,o.size,i.size),s=[o.size/c,i.size/c,a.size/c];return(new Be.Z).scale(s)}return(new Be.Z).identity()}(t);return[[0,o[0]*r[n.indexOf("x")]],[0,o[5]*r[n.indexOf("y")]],[0,o[10]*r[n.indexOf("z")]]]}function Je(e){var t=e.Pixels||{},r=t.Channels,n=void 0===r?[]:r,o=t.SizeC,i=void 0===o?0:o,a=t.Interleaved,c=void 0!==a&&a,s=t.Type,l=n.length,u=(n[0]||{}).SamplesPerPixel;return 3===(void 0===u?0:u)||3===l&&"uint8"===s||3===i&&1===l&&c}var Qe=[255,0,0],Xe=[0,255,0],Ye=[0,0,255],et=[255,255,255],tt=[Ye,Xe,[255,0,255],[255,255,0],[255,60,0],[154,0,255],et,Qe],rt=[0,255];function nt(e,t){return e.Name||e.name||e.ID||"Channel ".concat(t+1)}function ot(e,t,r,n){return it.apply(this,arguments)}function it(){return(it=(0,b.Z)(O().mark((function e(t,r,n,o){var i,a,s,l,u,f,p,d,v,h,m,y,b,g,w,j,P,Z,k,S,x,D;return O().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i=t[0]||{},a=i.shape,s=i.labels,l=(void 0===s?[]:s).map((function(e,t){return{label:e,size:a[t]||0}})).filter((function(e){return e.size>1&&Le.Z.includes(e.label)})),u=n||He(t[0],o),f=r.Pixels,p=(void 0===f?{}:f).Channels,d=void 0===p?[]:p,v=[],h=[],m=[],y=!1,b=!1,g=Je(r),w=g&&C(a),!g){e.next=18;break}C(a)?(v=[rt.slice()],m=[rt.slice()],h=[Qe]):(v=[rt.slice(),rt.slice(),rt.slice()],m=[rt.slice(),rt.slice(),rt.slice()],h=[Qe,Xe,Ye]),y=!1,b=!1,e.next=26;break;case 18:return e.next=20,$e({loader:t,selections:u,use3d:!1});case 20:j=e.sent,m=j.domains.slice(),v=j.contrastLimits.slice(),h=1===j.domains.length?[et]:j.domains.map((function(e,t){return tt[t]})),y=d.length>1,b=!0;case 26:return P=d.map(nt),Z=qe(t),k=(0,c.Z)(Z,3),S=k[0],x=k[1],D=k[2],e.abrupt("return",{channels:P,selections:u,useLens:y,useColorMap:b,colors:h,domains:m,contrastLimits:v,xSlice:S,ySlice:x,zSlice:D,ready:!0,isRGB:g,shapeIsInterleaved:w,globalDimensions:l,metadata:r,loader:t});case 29:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function at(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ct(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?at(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):at(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function st(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},i=n.selections,a=n.cache,c=n.imageTimePosition,s=void 0===c?0:c,l=n.imageZPosition,u=void 0===l?0:l,f=(0,o.useRef)(0);(0,o.useEffect)((function(){var n=e&&t&&e.Pixels&&t.length;if(n&&(i&&i!==a||!i)){r({type:de}),f.current+=1;var o=f.current;ot(t,e,i,s||u?{t:s,z:u}:void 0).then((function(e){o===f.current&&r(ct({type:pe},e))})).catch((function(e){console.warn("HCS Image Viewer error: ".concat(e.message)),console.error(e),r({type:he,error:e.message})}))}else n||r({type:pe})}),[e,t,s,u,i,a,f,r])}function lt(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ut(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?lt(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):lt(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function ft(){return{}}var pt=function(){var e=(0,o.useReducer)(ie,{},ft),t=(0,c.Z)(e,2),r=t[0],n=t[1];!function(e,t){var r=e||{},n=r.url,i=r.offsetsUrl,a=r.source;(0,o.useEffect)((function(){n&&(t({type:W}),function(){return fe.apply(this,arguments)}({url:n,offsetsUrl:i}).then((function(e){return t({type:$,source:e})})).catch((function(e){return t({type:K,error:e.message})})))}),[n,i,t])}(r,n);var i=function(e){var t=(0,o.useReducer)(Ae,{},je),r=(0,c.Z)(t,2),n=r[0],i=r[1],a=function(e){var t=e.imageIndex,r=void 0===t?0:t,n=e.metadata,o=void 0===n?[]:n;if(!(r<0||r>=o.length))return o[r]}(e),s=function(e){var t=e.imageIndex,r=void 0===t?0:t,n=e.loader,o=void 0===n?[]:n;if(!(r<0||r>=o.length))return o[r]}(e),l=e.imageTimePosition,u=void 0===l?0:l,f=e.imageZPosition,p=void 0===f?0:f,d=n.metadata,v=n.loader,h=n.selections,m=n.builtForSelections;return st(a,s,i,(0,o.useMemo)((function(){return{imageTimePosition:u,imageZPosition:p}}),[u,p])),st(d,v,i,(0,o.useMemo)((function(){return{selections:h,cache:m}}),[h,m])),{state:n,dispatch:i}}(r),a=i.state,s=i.dispatch,l=(0,o.useCallback)((function(e,t,r){n({url:e,offsetsUrl:t,callback:r,type:_})}),[n]),u=(0,o.useCallback)((function(e){n(ut({type:q},e))}),[n]),f=(0,o.useCallback)((function(e){n({type:Q,mesh:e})}),[n]),p=(0,o.useCallback)((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];n({type:X,overlayImages:e})}),[n]),d=(0,o.useCallback)((function(e){n(ut({type:J},e)),s({type:ve})}),[n,s]),v=(0,o.useCallback)((function(){s({type:de})}),[s]),h=(0,o.useCallback)((function(e,t){s({type:me,channel:e,properties:t})}),[s]),m=(0,o.useCallback)((function(e){s({type:ye,colorMap:e})}),[s]),y=(0,o.useCallback)((function(e){s({type:ge,lensEnabled:e})}),[s]),b=(0,o.useCallback)((function(e){s({type:be,lensChannel:e})}),[s]),g=(0,o.useCallback)((function(e){s({type:Oe,position:e})}),[s]),O=(0,o.useCallback)((function(e){s({type:we,lock:e})}),[s]);return{callbacks:(0,o.useMemo)((function(){return{setData:l,setImage:u,setImageViewportLoading:v,setImageViewportLoaded:d,setChannelProperties:h,setColorMap:m,setLensEnabled:y,setLensChannel:b,setGlobalPosition:g,setLockChannels:O,setMesh:f,setOverlayImages:p}}),[l,u,v,d,h,m,y,b,g,O,f,p]),dispatch:n,state:r,viewerState:a,viewerDispatch:s}};function dt(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=Array.isArray(e)?e[0]:e,o=Z(n);if(o&&t){var i=o.width,a=o.height;return Math.log2(Math.min(t.width/i,t.height/a))-r}return-1/0}function vt(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function ht(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?vt(Object(r),!0).forEach((function(t){(0,a.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):vt(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var mt=new u.$h,yt=new u.z6;function bt(e){var t=e.className,r=e.onStateChange,n=e.onRegisterStateActions,i=e.onViewerStateChanged,a=e.style,s=e.minZoomBackOff,l=void 0===s?0:s,f=e.maxZoomBackOff,p=void 0===f?void 0:f,d=e.defaultZoomBackOff,v=void 0===d?0:d,h=e.overview,m=e.onCellClick,y=pt(),b=y.state,g=y.viewerState,O=y.callbacks,w=b.mesh,j=b.overlayImages,P=(0,o.useRef)(),C=function(e){var t=(0,o.useState)({width:void 0,height:void 0}),r=(0,c.Z)(t,2),n=r[0],i=r[1];return(0,o.useEffect)((function(){var t,r,n;return function o(){var a,c,s=null==e||null===(a=e.current)||void 0===a?void 0:a.clientWidth,l=null==e||null===(c=e.current)||void 0===c?void 0:c.clientHeight;e&&e.current&&(s!==t||l!==r)&&i({width:t=s,height:r=l}),n=requestAnimationFrame(o)}(),function(){return cancelAnimationFrame(n)}}),[e,i]),n}(P);(0,o.useEffect)((function(){r&&r(b)}),[b,r]),(0,o.useEffect)((function(){i&&i(g)}),[g,i]),(0,o.useEffect)((function(){n&&n(O)}),[O,n]);var Z=O||{},k=Z.setImageViewportLoading,S=Z.setImageViewportLoaded,x=g.channelsVisibility,D=void 0===x?[]:x,E=g.contrastLimits,L=void 0===E?[]:E,R=g.colors,I=void 0===R?[]:R,z=g.selections,M=void 0===z?[]:z,A=g.ready,B=void 0!==A&&A,V=g.colorMap,T=g.loader,H=g.useLens,N=g.lensEnabled,F=g.lensChannel;(0,o.useEffect)((function(){"function"==typeof k&&k()}),[M,T,k]);var U=(0,o.useState)(void 0),_=(0,c.Z)(U,2),W=_[0],$=_[1];(0,o.useEffect)((function(){if(T&&T.length&&C.width&&C.height){var e=Array.isArray(T)?T:[T],t=(0,c.Z)(e,1)[0],r=Array.isArray(T)?T[T.length-1]:T,n=[ht(ht({},(0,u.TI)(T,C,v)),{},{id:u.ys,minZoom:void 0!==l?dt(t,C,l):-1/0,maxZoom:void 0!==p?dt(r,C,p):1/0})];$(n)}else $(void 0)}),[T,C,$,l,p,v]);var K=T&&B&&C.width&&C.height&&W;return o.createElement("div",{className:t,style:ht({position:"relative"},a||{}),ref:P},K&&o.createElement(G,{mesh:w,overlayImages:j,contrastLimits:L,colors:I,channelsVisible:D,loader:T,selections:M,height:C.height,width:C.width,extensions:V?[mt]:[yt],colormap:V||"viridis",onViewportLoad:S,viewStates:W,overviewOn:!!h,overview:h,lensSelection:H&&N?F:void 0,lensEnabled:H&&N,onCellClick:m,deckProps:{glOptions:{preserveDrawingBuffer:!0}}}))}bt.propTypes={className:l().string,onStateChange:l().func,onRegisterStateActions:l().func,onViewerStateChanged:l().func,style:l().object,minZoomBackOff:l().number,maxZoomBackOff:l().number,defaultZoomBackOff:l().number,overview:l().object,onCellClick:l().func},bt.defaultProps={className:void 0,onStateChange:void 0,onRegisterStateActions:void 0,onViewerStateChanged:void 0,style:void 0,minZoomBackOff:0,maxZoomBackOff:void 0,defaultZoomBackOff:0,overview:void 0,onCellClick:void 0};var gt=bt;function Ot(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=r.onStateChange,c=r.onRegisterStateActions,s=r.onViewerStateChanged,l=r.onCellClick;i.render(o.createElement(gt,(0,n.Z)({onRegisterStateActions:c,onStateChange:a,onViewerStateChanged:s,onCellClick:l},t)),e)}},802:function(){},2195:function(){},1998:function(){},9521:function(){},9214:function(){},3752:function(){},3640:function(){},2630:function(){}}]);