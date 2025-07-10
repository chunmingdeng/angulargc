# acg README
> 一个angualr插件，支持组件、模块的一键创建（基于定制代码）

## config generate
> 通过项目根目录下`vueSourceCode`项目来生成配置参数，此项目用vuecli5创建，vue3编写，方便快捷

1. PathConfig.vue  
    项目中使用了`proxy?.vscode.postMessage`来实现和vscode的webview通信;    
    使用`window.addEventListener('message',() => {})`来实现初始化设置路径；    
    ```text
    vscode.commands.registerCommand 的参数解释如下：

    第一个参数（command: string）
    命令的唯一标识符（如 'acg.openConfig'），需在 package.json 的 contributes.commands 中声明。

    第二个参数（callback: (...args: any[]) => any）
    命令被触发时执行的回调函数。
    回调的第一个参数通常是命令触发时传递的上下文对象（如资源管理器右键菜单会传递 uri，命令面板触发时为 undefined）。
    你可以定义多个参数，VS Code 会按顺序传递。

    第三个参数（thisArg?: any，可选）
    指定回调函数内部 this 的指向。一般很少用，通常可以省略。
    ```

## 调试
1. 直接在项目下F5启动调试即可
2. 有些插件无法启动，可以尝试先运行`npm run watch`
    ```json
    <!-- package.json 文件中 -->
    "scripts": {
        "watch": "webpack --watch",
        "package": "webpack --mode production --devtool hidden-source-map",
    },
    ```

## 打包
1. `$ vsce package`
2. `.vscodeignore`文件中要添加`vueSourceCode/node_module`，否则会打包失败