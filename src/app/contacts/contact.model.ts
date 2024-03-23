export class Contact {

    constructor(
        public _id: string,
        public id: string,
        public name: string,
        public email: string,
        public phone: string,
        public imageUrl: string,
        public group?: Contact[] 
    ) {

    }
}