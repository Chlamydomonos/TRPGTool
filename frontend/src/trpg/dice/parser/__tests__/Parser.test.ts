import { Tokenizer } from './../Parser';
import { test } from 'vitest';

test('Tokenizer', () => {
    let tokenizer = new Tokenizer('1+2*3d(4-5)');
    while(!tokenizer.isEmpty())
        console.log(tokenizer.nextToken());
})