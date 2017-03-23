require('normalize.css/normalize.css');
require('../styles/App.scss');
require('../styles/a.scss');

import React from 'react';


//获取图片相关数据URL = require('../images/' + singleImgData.filename);
      
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

//单个图片组件

class ImgFigure extends React.Component {
    render() {
        return ( 
        	<figure className="img-figure">
            	<img  src = { this.props.data.imgURL }
           			 alt = { this.props.data.title }/> 
            	<figcaption> 
            		<h2 > {this.props.data.title} </h2> 
            	</figcaption> 
            </figure>
        )
    }
}

class AppComponent extends React.Component {
    render() {
        var controllerUnit = [],
                imgfigures = [];
        imageData.forEach(function(value) {
            imgfigures.push( <ImgFigure data = {value}/>);
                        })

                    return (
                     <section className = "stage">
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
