import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Header from "../component/header/index"
import "../style/index.less";

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconList: ["icon-bb", "icon-bgg", "icon-bg", "icon-bd", "icon-cm", "icon-dg", "icon-dhs", "icon-kxg", "icon-mkl"]
        }
    }

    render() {
        const { iconList } = this.state
        return (
            <React.Fragment>
                <Header title="雪碧图方案"></Header>
                <div className="index-page">
                    <div className="title">基于webpack-spritesmith的技术方案</div>
                    <div className="bkg-box">
                        {
                            iconList.map(classText => {
                                return <div key={classText} className={`${classText} icon`}></div>
                            })
                        }
                    </div>
                    <div className="info">
                        使用方案介绍：
                        1. 安装 webpack-spritesmith
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

ReactDOM.render(<Index></Index>, document.querySelector("#main"))
