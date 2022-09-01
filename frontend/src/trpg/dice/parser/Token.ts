import { type } from 'os';
import type { TreeNode } from './TreeNode';
export enum TokenType
{
    NUM,
    NOD,
    NEG,
    ADD,
    SUB,
    MUL,
    DIV,
    DIC,
    LBR,
    RBR
}

type NotNum = Exclude<TokenType, TokenType.NUM | TokenType.NOD>

export type OperatorToken = Exclude<NotNum, TokenType.LBR | TokenType.RBR>

interface INumToken
{
    readonly type: TokenType.NUM
    readonly value: number
}

interface INodeToken
{
    readonly type: TokenType.NOD
    readonly value: TreeNode
}

type OPT = { readonly type: OperatorToken }

type LBRT = { readonly type: TokenType.LBR }
type RBRT = { readonly type: TokenType.RBR }

export type ValueToken = INumToken | INodeToken
export type OriginalToken = INumToken | OPT | LBRT | RBRT

export class NumToken implements INumToken
{
    readonly type: TokenType.NUM = TokenType.NUM
    constructor(
        readonly value: number
    )
    { }
}

export class NodeToken implements INodeToken
{
    readonly type: TokenType.NOD = TokenType.NOD
    constructor(
        readonly value: TreeNode
    )
    { }
}

export class OpToken
{
    constructor(
        readonly type: OperatorToken
    )
    { }
}

export class BrToken
{
    constructor(
        readonly type: TokenType.LBR | TokenType.RBR
    )
    { }
}
