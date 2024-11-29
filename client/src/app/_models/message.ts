export interface Message {
    id: number
    content: string
    createdAt: Date
    readAt?: Date
    senderUsername: string
    senderPhotoUrl: string
    senderId: number
    receiverUsername: string
    receiverPhotoUrl: string
    receiverId: number
}