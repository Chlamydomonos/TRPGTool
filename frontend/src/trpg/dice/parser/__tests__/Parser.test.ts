import Parser from './../Parser';
import { expect, test } from 'vitest';

test('Parser', () => {
    let parser = new Parser('(3d4)d(5+8d7*9)');
    expect(parser.success);
    console.log(JSON.stringify(parser.result));
    for(let i = 0; i < 100; i++)
        console.log(`${i + 1}: ${parser.result.exec()}`)
})