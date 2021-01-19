import superagent from 'superagent'; // 可以直接获取网页内容
import cheerio from 'cheerio'; // 可以类似jq一样操作网页

interface articleType {
  time: string;
  title: string;
}

class Demo {
  // 爬虫仅支持抓取静态页面的html，不支持单页面应用（所以这就是需要ssr服务端渲染的原因）
  private url = 'http://www.ruanyifeng.com/blog/';
  private articleList: articleType[] = [];
  constructor() {
    this.getHtml();
  }

  async getHtml() {
    const res = await superagent.get(this.url);
    this.getArticleList(res.text);
  }

  getArticleList(html: string) {
    const $ = cheerio.load(html);
    $('#homepage ul')
      .children()
      .each((index, element) => {
        if ($(element).children().length > 1) {
          this.articleList.push({
            time: $(element).children('span').text(),
            title: $(element).children('a').text(),
          });
        }
      });
    console.log('this.articleList', this.articleList);
  }
}

const demo = new Demo();
