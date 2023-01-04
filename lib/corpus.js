import {
  existsSync, // 检索路径是否存在
  mkdirSync, // 创建文件夹
  readFileSync, // 同步读取
  writeFileSync // 同步写入文件
} from 'fs';
import moment from 'moment';
import { fileURLToPath } from 'url';
import { dirname, resolve } from "path";

const url = import.meta.url; // 获取当前脚本执行的url

const __dirname = dirname(fileURLToPath(url));

export function loadCorpus(src) {
  const path = resolve(__dirname, '..', src);
  const data = readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(data);
}

export function saveCorpus(title, article) {
  const outputDir = resolve(__dirname, '..', 'output');
  // 当前时间戳
  const time = moment().format('|YYYY-MM-DD|HH:mm:ss');
  const outputFile = resolve(outputDir, `${title}${time}.txt`);

  // 检查outputDir是否存在, 没有则创建一个
  if (!existsSync(outputDir)) {
    // 创建文件夹
    mkdirSync(outputDir);
  }

  // 生成文本字符串
  const text = `${title}\n\n    ${article.join('\n    ')}`;
  // 将文本写入文件中
  writeFileSync(outputFile, text);
  return outputFile;
}
