import {
  createRandomPicker
} from './lib/random.js';
import { options } from './lib/cmd.js';

import { generate } from "./lib/generator.js";
import { loadCorpus, saveCorpus } from './lib/corpus.js';
import { interact } from './lib/interact.js';


// 解析命令行参数
const parseOptions = (options = {}) => {
  const argv = process.argv;
  for (let i = 2; i < argv.length; i++) {
    const cmd = argv[i - 1];
    const value = argv[i];
    if (cmd === '--title') {
      options.title = value;
    } else if (cmd === '--min') {
      options.min = Number(value);
    } else if (cmd === '--max') {
      options.max = Number(value);
    }
  }
  return options;
}

const createCorpus = async () => {
  const corpus = loadCorpus('./corpus/data.json');
  let title = options.title || createRandomPicker(corpus.title)();
  const answers = await interact([
    {text: '请输入文章主题', value: title},
    {text: '请输入最小字数', value: 6000},
    {text: '请输入最大字数', value: 10000},
  ]);
  title = answers[0];
  options.min = answers[1];
  options.max = answers[2];
  const article = generate(title, { corpus, ...parseOptions(options) });
  const output = saveCorpus(title, article);
  console.info(`生成成功！文章保存于：${output}`);
};

createCorpus();

/* const tstInput = () => {
  console.info('请输入一个要求和的整数, 以0结束输入');
  // 设置编码格式
  process.stdin.setEncoding('utf-8');
  let sum = 0;
  process.stdin.on("readable", () => {
    // 回车触发
    const chunk = process.stdin.read(); // 获取当前输入的字符, 包含回车
    const n = Number(chunk.slice(0, -1));
    sum += n;
    if (n === 0) process.stdin.emit('end');
    process.stdin.read(); // 再调试一次, 返回的是null, 并继续监听
  });

  process.stdin.on('end', () => {
    console.info(`求和结果为: ${sum}`);
  })
}
tstInput() */


