import nspell from 'nspell';
import dictionary from 'dictionary-tr';

const dict = await new Promise((resolve, reject) => {
  dictionary((err, res) => {
    if (err) reject(err);
    else resolve(res);
  });
});

const spell = nspell(dict);

const words = ['mavigökkubbe', 'Mahkemesisorgu', 'beninezarete', 'isimlihükümlü', 'Neredeyseisyan', 'kitap', 'elma', 'gökkubbe'];

function trySplit(word) {
  if (spell.correct(word)) return word;
  
  // Try 2 splits
  for (let i = 3; i <= word.length - 3; i++) {
    const p1 = word.slice(0, i);
    const p2 = word.slice(i);
    if (spell.correct(p1) && spell.correct(p2)) {
      return p1 + ' ' + p2;
    }
  }
  
  // Try 3 splits
  for (let i = 3; i <= word.length - 6; i++) {
    for (let j = i + 3; j <= word.length - 3; j++) {
      const p1 = word.slice(0, i);
      const p2 = word.slice(i, j);
      const p3 = word.slice(j);
      if (spell.correct(p1) && spell.correct(p2) && spell.correct(p3)) {
        return p1 + ' ' + p2 + ' ' + p3;
      }
    }
  }
  return word;
}

words.forEach(w => {
  console.log(`${w} -> ${trySplit(w)}`);
});
