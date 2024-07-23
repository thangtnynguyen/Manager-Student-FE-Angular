export interface Course {
    id?: number;
    certificateName?: string;
    content?: string;
    videoUrl?: string;
    typeVideo?: number;
    shortDescription?: string;
    description?: string;
    imageUrl?: string;
    title?: string;
    slug?: string;
    landingPage?: string;
    priority?: number;
    publishedAt?: Date;
    isPublished?: boolean;
    isDefault?: boolean;

    base64Image?: string;
    base64Video?: string;
    imageFile?: any;
}
  