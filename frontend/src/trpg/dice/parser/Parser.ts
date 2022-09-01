import { Add, Dic, Div, Mul, Neg, Num, Sub, type TreeNode } from './TreeNode';
import { NumToken, OpToken, TokenType, BrToken, type OperatorToken, type ValueToken, type OriginalToken, NodeToken } from './Token';

export class Tokenizer
{
    private tokens: OriginalToken[] = []
    private index = 0

    constructor(expression: string)
    {
        const tokenRe = /([1-9][0-9]*)|[\+\-\*\/\(\)d]/g;
        const legalRe = /^(([1-9][0-9]*)|[\+\-\*\/\(\)d\s])+$/;
        const numRe = /[1-9][0-9]*/;

        if(!legalRe.test(expression))
            throw new Error('Illegal characters in expression!');
        let result = expression.match(tokenRe);
        if(result == null || result.length == 0)
            throw new Error('Empty expression!');

        for(let i of result)
        {
            if(numRe.test(i))
                this.tokens.push(new NumToken(parseInt(i)));
            else
            {
                switch(i)
                {
                    case '+':
                        this.tokens.push(new OpToken(TokenType.ADD));
                        break;
                    case '-':
                        if(this.tokens.length == 0)
                        {
                            this.tokens.push(new OpToken(TokenType.NEG));
                            return;
                        }
                        let lastToken = this.tokens[ this.tokens.length - 1 ];
                        if(lastToken.type == TokenType.NUM || lastToken.type == TokenType.RBR)
                            this.tokens.push(new OpToken(TokenType.SUB));
                        else
                            this.tokens.push(new OpToken(TokenType.NEG));
                        break;
                    case '*':
                        this.tokens.push(new OpToken(TokenType.MUL));
                        break;
                    case '/':
                        this.tokens.push(new OpToken(TokenType.DIV));
                        break;
                    case 'd':
                        this.tokens.push(new OpToken(TokenType.DIC));
                        break;
                    case '(':
                        this.tokens.push(new BrToken(TokenType.LBR));
                        break;
                    case ')':
                        this.tokens.push(new BrToken(TokenType.RBR));
                        break;
                }
            }
        }
    }

    isEmpty()
    {
        return this.index == this.tokens.length;
    }

    nextToken(): OriginalToken
    {
        if(this.isEmpty())
            throw new Error('Tokenizer is empty');
        let out = this.tokens[ this.index ];
        this.index++;
        return out;
    }
}

interface OpTokenDescriber
{
    children: number,
    priority: number
}

const operators = new Map<OperatorToken, OpTokenDescriber>()
    .set(TokenType.ADD, { children: 2, priority: 0 })
    .set(TokenType.SUB, { children: 2, priority: 0 })
    .set(TokenType.MUL, { children: 2, priority: 1 })
    .set(TokenType.DIV, { children: 2, priority: 1 })
    .set(TokenType.DIC, { children: 2, priority: 2 })
    .set(TokenType.NEG, { children: 1, priority: 3 })

export class TokenParser
{
    private readonly root: TreeNode
    constructor(tokenizer: Tokenizer)
    {
        this.root = this.parse(tokenizer);
        if(!tokenizer.isEmpty())
            throw new Error('Broken expression');
    }

    private parse(tokenizer: Tokenizer, inBracket?: boolean): TreeNode
    {
        if(inBracket == undefined)
            inBracket = false;

        let numStack: ValueToken[] = [];
        let opStack: OpToken[] = [];
        while(true)
        {
            if(tokenizer.isEmpty())
                break;
            let token = tokenizer.nextToken();
            if(token.type == TokenType.RBR)
            {
                if(inBracket)
                    break;
                else
                    throw new Error('Broken expression');
            }
            else if(token.type == TokenType.LBR)
            {
                numStack.push(new NodeToken(this.parse(tokenizer, true)));
            }
            else if(token.type == TokenType.NUM)
            {
                numStack.push(token);
            }
            else
            {
                if(opStack.length == 0)
                    opStack.push(token);
                else
                {
                    let stackTop = opStack[ opStack.length - 1 ];
                    if(this.priority(stackTop.type) < this.priority(token.type))
                        opStack.push(token);
                    else
                    {
                        this.popStacks(numStack, opStack);
                        opStack.push(token);
                    }
                }
            }
        }
        if(numStack.length == 1 && opStack.length == 0)
            return this.buildValueNode(numStack[ 0 ]);
        else if(opStack.length > 0)
            return this.popStacks(numStack, opStack);
        else
            throw new Error('Broken expression');
    }

    private popStacks(numStack: ValueToken[], opStack: OpToken[]): TreeNode
    {
        while(true)
        {
            if(opStack.length == 0)
                break;
            let lastOp = opStack.pop();
            if(lastOp == null)
                throw new Error('This is not possible');
            numStack.push(new NodeToken(this.buildNode(numStack, lastOp)));
        }
        if(numStack.length != 1)
            throw new Error('Broken expression');
        return this.buildValueNode(numStack[ 0 ]);
    }

    private buildNode(numStack: ValueToken[], operator: OpToken): TreeNode
    {
        let data = operators.get(operator.type);
        if(data == null)
            throw new Error('This is not possible');
        let childAmount = data.children;
        if(childAmount == 1)
        {
            let childToken = numStack.pop();
            if(childToken == null)
                throw new Error('Broken expression');
            let child = this.buildValueNode(childToken);

            switch(operator.type)
            {
                case TokenType.NEG:
                    return new Neg(child);
                default:
                    throw new Error('This is not possible');
            }
        }
        else if(childAmount == 2)
        {
            let rChildToken = numStack.pop();
            if(rChildToken == null)
                throw new Error('Broken expression');
            let rChild = this.buildValueNode(rChildToken);

            let lChildToken = numStack.pop();
            if(lChildToken == null)
                throw new Error('Broken expression');
            let lChild = this.buildValueNode(lChildToken);

            switch(operator.type)
            {
                case TokenType.ADD:
                    return new Add(lChild, rChild);
                case TokenType.SUB:
                    return new Sub(lChild, rChild);
                case TokenType.MUL:
                    return new Mul(lChild, rChild);
                case TokenType.DIV:
                    return new Div(lChild, rChild);
                case TokenType.DIC:
                    return new Dic(lChild, rChild);
                default:
                    throw new Error('This is not possible');
            }
        }
        else
            throw new Error('This is not possible');
    }

    private buildValueNode(token: ValueToken): TreeNode
    {
        switch(token.type)
        {
            case TokenType.NUM:
                return new Num(token.value);
            case TokenType.NOD:
                return token.value;
            default:
                throw new Error('This is not possible');
        }
    }

    private priority(token: OperatorToken)
    {
        let data = operators.get(token);
        if(data == null)
            throw new Error('This is not possible');
        return data.priority;
    }

    get value()
    {
        return this.root;
    }
}

export default class Parser
{
    private readonly root?: TreeNode
    constructor(input: string)
    {
        try
        {
            this.root = new TokenParser(new Tokenizer(input)).value;
        }
        catch(e)
        {
            this.root = undefined;
        }
    }

    get success()
    {
        return this.root != null;
    }

    get result()
    {
        if(this.root == null)
            throw new Error('Cannot get a broken parser');
        return this.root;
    }
}