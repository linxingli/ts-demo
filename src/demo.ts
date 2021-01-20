import superagent from 'superagent'; // 可以直接获取网页内容
import cheerio from 'cheerio'; // 可以类似jq一样操作网页
import fs from 'fs';
import path from 'path';

interface articleType {
  time: string;
  title: string;
}

interface content {
  time: number;
  data: articleType[]
}

interface fileContent {
  [propName: number]: articleType[]
}

class Base {
  // 爬虫仅支持抓取静态页面的html，不支持单页面应用（所以这就是需要ssr服务端渲染的原因）
  private url = 'http://www.ruanyifeng.com/blog/';
  private filePath = path.resolve(__dirname, '../dist/data.json')
  constructor() {
    this.initialize();
  }

  // 爬网页html数据
  async getHtml() {
    const res = await superagent.get(this.url);
    return res.text
  }

  // 获取爬到的文章数据
  getArticleList(html: string) {
    const $ = cheerio.load(html);
    const articleList: articleType[] = []
    $('#homepage ul')
      .children()
      .each((index, element) => {
        if ($(element).children().length > 1) {
          articleList.push({
            time: $(element).children('span').text(),
            title: $(element).children('a').text(),
          });
        }
      });
    return {
      time: new Date().getTime(),
      data: articleList
    }
  }

  // 获取要写入文件的内容
  getFileData(content: content) {
    let fileData: fileContent = {}
    if (fs.existsSync(this.filePath)) {
      // 判断是否有内容
      let fileText = fs.readFileSync(this.filePath, 'utf-8')
      if (fileText) {
        // 已经有内容，先取出内容
        fileData = JSON.parse(fileText)
      }
    }
    fileData[content.time] = content.data
    return fileData
  }

  // 把内容写入文件
  writeToFile(fileData: string) {
    fs.writeFileSync(this.filePath, fileData)
  }

  async initialize() {
    const html = await this.getHtml()
    const articleList = this.getArticleList(html)
    const fileData = this.getFileData(articleList)
    this.writeToFile(JSON.stringify(fileData))
  }
}

const base = new Base();
