import { Course as ICourse } from "../interfaces/course/course.interface";

export class Course implements ICourse {
    constructor(
        public id?: number,
        public certificateName?: string,
        public content?: string,
        public shortDescription?: string,
        public description?: string,
        public imageUrl?: string,
        public title?: string,
        public slug?: string,
        public landingPage?: string,
        public priority?: number,
        public publishedAt?: Date,
        public isPublished?: boolean,
        public isDefault?: boolean,
        public base64Image?: string,
        public imageFile?: any
    ) {}
}
