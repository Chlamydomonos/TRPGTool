import type { Token } from './Token';

export class Tokenizer
{
    private tokens: Token[] = []
    constructor(expression: string)
    {
        const tokenRe = /([1-9][0-9]*)|[\+\-\*\/\(\)d]/g
        const legalRe = /(([1-9][0-9]*)|[\+\-\*\/\(\)d\s])*/

        if(!legalRe.test(expression))
            throw new Error('Illegal characters in expression!');
        let result = tokenRe.exec(expression);
    }
}

export class Parser
{

}