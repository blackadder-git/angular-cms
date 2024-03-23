export class Document {

    constructor(
        public _id: string,
        public id: string,
        public name: string,
        public description: string,
        public url: string,
        public children?: Document[]
    ) {

    }
}