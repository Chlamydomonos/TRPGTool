export enum TokenType
{
    NUM,
    NEG,
    ADD,
    SUB,
    MUL,
    DIV,
    DIC,
    LBR,
    RBR
}

type NotNum = Exclude<TokenType, TokenType.NUM>

interface INumToken
{
    readonly type: TokenType.NUM
    readonly value: number
}

interface IOpToken
{
    readonly type: NotNum
}

export type Token = INumToken | IOpToken

export class NumToken implements INumToken
{
    type: TokenType.NUM = TokenType.NUM
    constructor(
        readonly value: number
    )
    { }
}

export class OpToken implements IOpToken
{
    constructor(
        readonly type: NotNum
    )
    { }
}