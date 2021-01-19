## 手写一个爬虫 demo

## 技术栈 ts + superagent + cheerio

## 开发流程

- 执行 npm init -y 生成一个 package.json
- 执行 npm i -D ts-node
- 执行 npm i -D typescript
- 执行 tsc --init 生成一个 tsconfig.json
- 更改 package.json 的配置，增加 script: "dev": "ts-node ./src/demo.ts"
- 执行 npm run dev 即可运行项目获取爬虫内容
