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

  async getHtml() {
    const res = await superagent.get(this.url);
    return res.text
  }

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

  // 把内容写入文件
  recordToFile(content: content) {
    if (fs.existsSync(this.filePath)) {
      // 判断是否有内容
      let fileText = fs.readFileSync(this.filePath, 'utf-8')
      console.log('fileText', fileText)
      let defaultData: fileContent = {}
      if (fileText) {
        // 已经有内容，先取出内容
        defaultData = JSON.parse(fileText)
      }
      // 无内容
      defaultData[content.time] = content.data
      fs.writeFileSync(this.filePath, JSON.stringify(defaultData))
    }
  }

  async initialize() {
    const html = await this.getHtml()
    const articleList = this.getArticleList(html)
    this.recordToFile(articleList)
  }
}

const base = new Base();
