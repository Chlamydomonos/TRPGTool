import GameObject from "../game/GameObject";
import Parser from "./parser/Parser"

export default class Dice extends GameObject
{
    private readonly parser: Parser
    public constructor(
        readonly source: string
    )
    {
        super();
        this.parser = new Parser(source);
    }

    get valid()
    {
        return this.parser.success;
    }

    get value()
    {
        return this.parser.result;
    }
}