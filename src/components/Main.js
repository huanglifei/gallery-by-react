require('normalize.css/normalize.css');
require('../styles/App.scss');
require('../styles/a.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关数据

      
var imageData = require('../data/imageData.json');
// 用自执行函数将图片名信息转化成图片URL路径信息（自执行，函数只执行一次时使用）
imageData = (function getImageURL(imageDataArr) {

    for (var i = 0; i < imageDataArr.length; i++) {
        var singleImgData = imageDataArr[i];
        singleImgData.imgURL= require('../images/'+ singleImgData.filename);
        imageDataArr[i] = singleImgData;
    }
    return imageDataArr;
})(imageData);


function gerRangeRandom(low,high){
	return Math.ceil(Math.random()*(high - low) + low);
	
};

//获取随机角度（0到30之间振幅值）
function getrotate(){
	return (Math.random() > 0.5 ? '':'-'+ Math.ceil(Math.random()*30))
	
}

//单个图片组件
class ImgFigure extends React.Component {
 	
 	handleClick(e){ 
	 	if(this.props.arrange.isCenter){
	 		this.props.inverse();
	 	}else{
	 		this.props.center();
	 	}		
 		e.stopPropagation();
 		e.preventDefault();
 			
 	}
 	
 	//设置产量存储位置信息
    render() {
    	var styleObg = {};
	 	if(this.props.arrange.pos){
	 		styleObg = this.props.arrange.pos;
	 	}

	 	if(this.props.arrange.rotate){
	 		(['-moz-','-ms-','-webkit-','']).forEach( function(value) {
	 			styleObg[value+'transform'] = 'rotate('+this.props.arrange.rotate +'deg)';
	 		}.bind(this));
	 	}

	 	if(this.props.arrange.isCenter){
	 		styleObg.zIndex = 11
	 	}

	 	var imgFigureclassName = 'img-figure';
	 	imgFigureclassName += this.props.arrange.isInverse?' is-inverse': '';

        return ( 
        	<figure className={imgFigureclassName} style ={styleObg} onClick={ this.handleClick.bind(this)}>
            	<img src = { this.props.data.imgURL }
           			 alt = { this.props.data.title }/> 
            	<figcaption> 
            		<h2> {this.props.data.title} </h2> 
            		<div className="img-back" onClick={this.handleClick.bind(this)}>
	        			<p>{ this.props.data.description }</p>
            		</div>
            	</figcaption> 
            </figure>
        )
    }
};

//控制组件
class ControllerUnit extends React.Component {
	handleClick(e){
		e.stopPropagation();
 		e.preventDefault();
 		if(this.props.arrange.isCenter){
 			this.props.inverse();
 		}else{
 			this.props.center();
 		}
	}
	render(){
		var controlleClassName = 'controller-unit';
		if(this.props.arrange.isCenter){
			controlleClassName += " is-center";
			if(this.props.arrange.isInverse){
				controlleClassName += ' is-inverse'
			}
		}

		return(
				<span className={controlleClassName} onClick = {this.handleClick.bind(this)}></span>
			);
	}
};

class AppComponent extends React.Component {

	//
	center(index){
		return  function(){
			this.rearrange(index)
		}.bind(this);
	}

	//重新布局所有图片
	rearrange(centerIndex){
		var imgArrangeArr = this.state.imgArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRannge = Constant.hPosRannge,
			hPosRanngeleftSecX = hPosRannge.leftSecX,
			hPosRanngerightSecX = hPosRannge.rightSecX,
			hPosRanngeY =  hPosRannge.y,

			vPosRange = Constant.vPosRange,
			vPosRangeX = vPosRange.x,
			vPosRangetopY = vPosRange.topY,

			imgArrangeTopArr = [],
			topImgNum = Math.floor(Math.random()*2),

			topImgSpliceIndex = 0,

			imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);

			//位于正中央的图片不需要旋转
			imgArrangeCenterArr[0]={
				pos:centerPos,
				rotate:0,
				isCenter:true
			}
			

			//取出要布局上侧的图片信息
			topImgSpliceIndex = Math.ceil(Math.random()*(imgArrangeArr.length - topImgNum));
			imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);

			imgArrangeTopArr.forEach( function(value, index) {

				imgArrangeTopArr[index] = {
					pos:{
						left:gerRangeRandom(vPosRangeX[0],vPosRangeX[1]),
						top:gerRangeRandom(vPosRangetopY[0],vPosRangetopY[1])
					},
					rotate: getrotate(),
					isCenter:false
				}
			});

			//取出布局左右两侧的图片信息
			for(var i = 0, j = imgArrangeArr.length, k = j / 2 ; i < j; i++){
				var hPosRanngeLorR = null;
				if(i < k){
					hPosRanngeLorR = hPosRanngeleftSecX;
				}else{
					hPosRanngeLorR = hPosRanngerightSecX;
				}
				imgArrangeArr[i] = {
					pos :{
						top:gerRangeRandom(hPosRanngeY[0],hPosRanngeY[1]),
						left:gerRangeRandom(hPosRanngeLorR[0],hPosRanngeLorR[1])
					},
					rotate: getrotate(),
					isCenter:false
				}				

			}


			if(imgArrangeTopArr && imgArrangeTopArr[0]){
				imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
			}


			imgArrangeArr.splice(centerIndex,0,imgArrangeCenterArr[0]);

			this.setState({
				imgArrangeArr:imgArrangeArr
			});




	};
    //
	constructor(props) {
	    super(props);

	    this.state = {

		    	imgArrangeArr:[

		    	/*
		    		pos:{//图片位置信息
		    			left: 0,
		    			top: 0
		    		},
		    		rotate:0,//图片旋转角度
		    		isInverse:false ,//图片正反面
		    		isCenter:false //图片时候居中
		    		*/
		    	]
	 

	    };
	   
 	};

	Constant = {
		//中心位置图片坐标
		centerPos: {
			left: 0,
			top: 0
		},
		hPosRannge: { //水平方向取值范围
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]

		},
		vPosRange: { //垂直方向取值范围
			x:[0, 0],
			topY: [0, 0]
		}
	};

	/*
	*翻转图片
	*@param index 输入当前被执行inverse操作的图片对象的图片信息数组的index值
	*return{function}这是一个闭包函数，返回一个真正待被执行的函数
	*/


	inverse(index){
		return (function(){			
			var imgArrangeArr = this.state.imgArrangeArr;
			imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
			this.setState({
				imgArrangeArr:imgArrangeArr
			});
		}.bind(this))
	}

	//组件加载后，为每张图片计算其位置范围
	componentDidMount(){

	  	//获取舞台大小
		var stageDOM = this.refs.stage,
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfstageW = Math.ceil(stageW/2),
			halfstageH = Math.ceil(stageH/2);

		// 获取单个图片大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfimgW = Math.ceil(imgW/2),
			halfimgH = Math.ceil(imgH/2);
		
		
		// 计算中心图片位置点
		console.log(halfstageH - halfimgH);
		this.Constant.centerPos = {
			left: halfstageW - halfimgW,
			top: halfstageH - halfimgH
		}

		// 左侧区域取值范围


		this.Constant.hPosRannge.leftSecX[0] = -halfimgW;
		this.Constant.hPosRannge.leftSecX[1] = halfstageW - halfimgW*3;
		this.Constant.hPosRannge.rightSecX[0] = halfstageW + halfimgW;
		this.Constant.hPosRannge.rightSecX[1] = stageW - halfimgW;
		this.Constant.hPosRannge.y[0] = -halfimgH;
		this.Constant.hPosRannge.y[1] = stageH - halfimgH;

		//竖直方向取值范围
		this.Constant.vPosRange.x[0] = halfstageW - imgW;
		this.Constant.vPosRange.x[1] = halfstageW + halfimgW;
		this.Constant.vPosRange.topY[0] = -halfimgH;
		this.Constant.vPosRange.topY[1] = halfstageH -halfimgH*3;


		this.rearrange(0);

		
	}

	

    render() {
        var controllerUnit = [],
                imgfigures = [];
        imageData.forEach(function(value,index) {
        	if(!this.state.imgArrangeArr[index]){
        		this.state.imgArrangeArr[index] = {
        			pos:{
        				left: 0,
        				top: 0
        			},
        			rotate:0,
        			isInverse:false,//默认正面
        			isCenter:false
        		}
        	};
        	imgfigures.push(<ImgFigure data = {value} key= {index} ref={'imgFigure' + index} 
        		arrange = {this.state.imgArrangeArr[index]} 
        		center = {this.center(index).bind(this)}
        		inverse = {this.inverse(index).bind(this)} />);
        	controllerUnit.push(<ControllerUnit key= {index} 
        		    arrange = {this.state.imgArrangeArr[index]} 
        		    center = {this.center(index).bind(this)} 
        		    inverse = {this.inverse(index).bind(this)} />);
        }.bind(this));

        return (
         <section className = "stage" ref="stage">
            <section className = "imgsec"> 
            	{imgfigures} 
            </section> 
            <nav className = "controller-nav"> 
            	{ controllerUnit } 
            </nav > 
           </section>);

    }
}
AppComponent.defaultProps = {};

export default AppComponent;
