export interface Blog {
    id: string;
    author: string;
    title: string;
    description: string;
    content: string;
    createdTime: Date;
    updatedTime: Date;
    location: {
        lat: number;
        lng: number;
        addr: string;
    };
}
