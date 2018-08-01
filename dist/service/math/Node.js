"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(operation, value, focus, parent, children) {
        this.operation = operation;
        this.value = value;
        this.focus = focus;
        this.parent = parent;
        this.children = children;
    }
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
    isGreekVariable() {
        if (this.operation !== "Variable") {
            return false;
        }
        return this.value[0] === "\\" && this.value[this.value.length - 1] === " ";
    }
}
exports.default = Node;
