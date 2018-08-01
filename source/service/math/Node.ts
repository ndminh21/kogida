export default class Node {
    constructor(public operation, public value, public focus, public parent, public children) {}

    getValue() {
        return this.value;
    }

    getFocus() {
        return this.focus;
    }

    getParent() {
        return this.parent;
    }

    getChild(position) {
        return this.children[position];
    }

    
    getChildren() {
        return this.children;
    }

    setValue(value) {
        this.value = value;
    }

    
    setParent(parent) {
        this.parent = parent;
    }

    setChild(position, child) {
        return this.children[position] = child;
    }

    

    setFocus(focus) {
        this.focus = focus;
    }

    addChild(child) {
        return this.children.push(child);
    }

    public isGreekVariable(){
        if (this.operation !== "Variable") {
            return false;
        }
        return this.value[0] === "\\" && this.value[this.value.length - 1] === " ";
    }
    
}
