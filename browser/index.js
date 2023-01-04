import { generate } from '../lib/generator.js';
import { createRandomPicker } from '../lib/random.js';

const defaultCorpus = require('../corpus/data.json');

async function loadCorpus(corpuspath) {
  if (corpuspath) {
    const corpus = await (await fetch(corpuspath)).json();
    return corpus;
  }
  return defaultCorpus;
}

window.bullshitGenerator = { generate, createRandomPicker, loadCorpus };

export { generate, createRandomPicker, loadCorpus };
