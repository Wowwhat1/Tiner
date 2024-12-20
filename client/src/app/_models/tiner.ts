import { Photo } from "./photo"

export interface Tiner {
    id: number
    userName: string
    age: number
    photoUrl: string
    knownAs: string
    createdOn: Date
    lastActive: Date
    gender: string
    introduction: string
    interests: string
    lookingFor: string
    city: string
    country: string
    photos: Photo[]
}