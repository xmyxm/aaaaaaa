import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Header from "../component/header/index"
import "../style/index.less";

export default class Index extends Component {

    render() {
        const iconList  = ["icon-bb", "icon-bgg", "icon-bg", "icon-bd", "icon-cm", "icon-dg", "icon-dhs", "icon-kxg", "icon-mkl", "icon-rg", "icon-ms", "icon-nyg"]
        return (
            <React.Fragment>
                <Header title="雪碧图"></Header>
                <div className="index-page">
                    <div className="icon-max"></div>
                    <div className="describe">基于webpack-spritesmith的雪碧图方案</div>
                    <div className="bkg-box">
                        {
                            iconList.map(classText => {
                                return <div key={classText} className={`${classText} icon`}></div>
                            })
                        }
                    </div>
                    <div className="info">
                        使用方案介绍：
                        <p>1. 雪碧图合成支持热更新，文件夹新增图片会立刻合成并生成css</p>
                        <p>2. 合并的雪碧图和其它图片会在页面webpack.pro.config配置统一进行几乎无损的压缩</p>
                        <p>3. 合并雪碧图的icon使用2倍图在retina屏有更好的展示</p>
                        <p>4. 雪碧图并非是项目最终构建出文件，不建议放在dist目录，放在src目录更好</p>
                        <p>5. 如果全量打一个雪碧图较大时可以区分合并两个雪碧图</p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

ReactDOM.render(<Index></Index>, document.querySelector("#main"))
