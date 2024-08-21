export interface User {
    id: number;
    login: string;
    first_name: string;
    second_name: string;
    display_name: string | null;
    avatar: string | null;
    email: string;
    phone: string;
}

export interface Chat {
    id: number;
    title: string;
    avatar: string | null;
    unreadCount: number;
    lastMessage?: {
        content: string;
        time: string;
    };
}

export interface MessageProps {
    id: string;
    chat_id: number;
    time: string;
    type: 'message' | 'file' | 'sticker';
    user_id: string;
    content: string;
    file?: File;
}
