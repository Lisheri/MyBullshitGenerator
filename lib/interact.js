// 交互式命令
/* 
  [
    {text: '请输入文章主题', value: title},
    {text: '请输入最小字数', value: 6000},
    {text: '请输入最大字数', value: 10000}
  ]

  这个问题最终凑成一个数组, 包含了三个问题对象
  属性 text 是问题的文字描述，value 表示问题的默认值
*/

export function interactOrigin(questions) {
  // questions 其实是一个数组, 内容如 { text, value }
  process.stdin.setEncoding('utf8');
  return new Promise((resolve) => {
    const answers = [];
    let i = 0;
    let { text, value } = questions[i++];
    console.info(text, value);
    // 输入
    process.stdin.on('readable', () => {
      const chunk = process.stdin.read().slice(0, -1);
      // 推入用户输入的值或默认值
      answers.push(chunk || value);
      // 问题往下
      const nextQuestion = questions[i++];
      if (nextQuestion) {
        //如果问题还未结束，继续监听用户输入
        process.stdin.read();
        text = nextQuestion.text;
        value = nextQuestion.value;
        console.log(`${text}(${value})`);
      } else {
        // 这里利用Promise来结束, 而不是主动使用process.stdin.emit('end');
        resolve(answers);
      }
    })
  })
}

// 其实还可以使用 process.stdout.write 向终端输出字符

// 由于process.stdin不太方便操作, 也不好读, 这里采用 readline 代替
import readline from 'readline';

// 提问
function question(rl, {text, value}) {
  const q = `${text}(${value})\n`;
  return new Promise((resolve) => {
    rl.question(q, (answer) => {
      // 这里提问, 并等待用户输入答案时触发回调
      resolve(answer || value);
    });
  });
}

export const interact = async (questions) => {
  // 通过readline.createInterface 直接创建一个命令行的交互式对象
  // createInterface 返回一个对象中有一个 question 方法, 
  // 它是个异步方法，接受一个问题描述和一个回调函数 —— 用于接受用户的输入。
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answers = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const answer = await question(rl, q); // 等待问题的输入
    answers.push(answer);
  }
  rl.close();
  return answers;
}
