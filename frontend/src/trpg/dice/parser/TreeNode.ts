export interface TreeNode
{
    exec(): number
}

export class Num implements TreeNode
{
    constructor(
        private readonly value: number
    )
    { }

    exec(): number
    {
        return this.value;
    }
}

export abstract class MoOp implements TreeNode
{
    constructor(
        protected readonly child: TreeNode
    )
    { }

    abstract exec(): number
}

export class Neg extends MoOp
{
    exec(): number
    {
        return -this.child.exec();
    }
}

export abstract class BiOp implements TreeNode
{
    constructor(
        protected readonly lChild: TreeNode,
        protected readonly rChild: TreeNode
    )
    { }
    abstract exec(): number
}

export class Add extends BiOp
{
    exec(): number
    {
        return this.lChild.exec() + this.rChild.exec();
    }
}

export class Sub extends BiOp
{
    exec(): number
    {
        return this.lChild.exec() - this.rChild.exec();
    }
}

export class Mul extends BiOp
{
    exec(): number
    {
        return this.lChild.exec() * this.rChild.exec();
    }
}

export class Div extends BiOp
{
    exec(): number
    {
        return Math.floor(this.lChild.exec() / this.rChild.exec());
    }
}

export class Dic extends BiOp
{
    exec(): number
    {
        let times = this.lChild.exec();
        let diceMax = this.rChild.exec();
        let out = 0;
        for(let i = 0; i < times; i++)
            out += Math.floor(Math.random() * diceMax + 1);
        return out;
    }
}