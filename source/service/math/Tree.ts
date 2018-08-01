import Node from './Node'
export default class KogidaTree {
    variables: Array<Node>;
    texs: Array<any>;
    root: Node;

    constructor(raw) {
        this.variables = [];
        this.texs = [];
        this.root = raw != null ? this.buildTreeRecursive(raw, null) : null;
    }

    buildTree(raw) {
        this.variables = [];
        return this.root = this.buildTreeRecursive(raw, null);
    }

    buildTreeRecursive(raw, parent) {
        let node;
        if (raw.value != null) {
            if(raw.greek)
                raw.value = raw.value.substring(1).trim()
            node = new Node(raw.operation, raw.value, raw.focus, parent, null);
            if (raw.operation === "Variable") {
                raw.value = raw.value.trim().replace("\\", "").replace("subscript{", "").replace("}{", "_").replace("}", "")
                this.variables.push(node);
                this.texs.push({
                    tex : raw.tex,
                    variables : raw.value
                })
            }
            return node;
        } else {
            node = new Node(raw.operation, null, raw.focus, parent, []);
            for (let index = 0; index < raw.children.length; index++) {
                let child = raw.children[index];
                node.setChild(index, this.buildTreeRecursive(child, node));
            }
            return node;
        }
    }

    findOutVariables() {
        return this.variables;
    }
    findOutTexs() {
        return this.texs;
    }
    
   
    public getRootOperation(){
        return this.root.operation
    }
}
