import { randomInt, createRandomPicker } from './random.js';

function sentence(pick, replacer) {
  let res = pick();
  for (const key in replacer) {
    res = res.replace(new RegExp(`{{${key}}}`, 'g'), typeof replacer[key] === 'function' ? replacer[key]() : replacer[key]);
  }
  return res;
}
/**
 * 
 * @param {*} title 标题
 * @param {params} corpus 语料库 JSON文件 
 * @param {params} min 选取文章最少字数
 * @param {params} max 选取文章最多字数
 * - 规定每个段落的字数在 200~500 字之间。每个段落包含 20%的名人名言（famous），80% 的废话（bosh)。其中，废话里带前置从句（bosh_before）的废话占文章句子的 30%，不带前置从句的废话占文章句子的 50%；
 * - 规定文章的字数在用户设置的最小字数到最大字数之间。
 */
export function generate(title, { corpus, min = 6000, max = 10000 }) {
  // 将文章长度设置为 min 到 max之间的随机数
  const {famous, bosh_before, bosh, said, conclude} = corpus;
  const [pickFamous, pickBoshBefore, pickBosh, pickSaid, pickConclude] = [famous, bosh_before, bosh, said, conclude].map(item => createRandomPicker(item));
  // 生成文章
  const articleLength = randomInt(min, max);
  const article = [];
  let totalLength = 0;
  while (totalLength < articleLength) {
    // 如果文章内容的字数未超过文章总字数, 继续生成段落
    let section = '';
    const sectionLength = randomInt(200, 500); // 将段落长度设为200到500之间
    while (section.length < sectionLength || !/[。？]\n$/.test(section)) {
      // ? 段落字数小于段落长度, 或者当前段落不是以句号。和问号 ？结尾
      const n = randomInt(0, 100);
      if (n < 20) {
        // 名言
        section += sentence(pickFamous, { said: pickSaid, conclude: pickConclude });
      } else if (n < 50) {
        // 带前置从句的废话
        section += sentence(pickBoshBefore, { title }) + sentence(pickBosh, { title });
      } else {
        // 不带前置从句的废话
        section += sentence(pickBosh, { title })
      }
      section += '\n';
    }
    // 段落结束，更新总长度
    totalLength += section.length;
    // 将段落存放到文章列表中
    article.push(section);
  }
  return article;
}
