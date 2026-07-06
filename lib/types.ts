export type Patch =
    | {
        type: "state.patch";
        op: "set";
        path: string;
        value: unknown;
        seq?: number;
    }
    | {
        type: "state.patch";
        op: "delete";
        path: string;
        seq?: number;
    }
    | {
        type: "state.patch";
        op: "append";
        path: string;
        value: unknown;
        seq?: number;
    }

export type PendingMessage = {
    id: string;
    event: AppEvent;
    timeout: NodeJS.Timeout;
    cancelled: boolean;
};

export type ChatMessage = {
    id: string;
    user_id: string;
    message: string;
};

export type CursorState = {
    x: number;
    y: number;
};

export type UserPresence = {
    id: string;
    name?: string;
    username?: string;
    color?: string;
    page?: string;
};

export type ScrollState = {
    x: number;
    y: number;
};

export type ClickState = {
    x: number;
    y: number;
    timestamp: number;
};

export type PageState = {
    pathname: string;
};

export type HoverState = {
    selector: string;
};

export type AppState = {
    text: string;
    users: Record<string, UserPresence>;
    messages: ChatMessage[];
    cursors: Record<string, CursorState>;
    scrolls: Record<string, ScrollState>;
    clicks: Record<string, ClickState>;
    pages: Record<string, PageState>;
    hovers: Record<string, HoverState>;
};

export type AppEvent =
    | {
        id: string;
        seq?: number;
        type: "presence.join";
        room: string;
        payload: {
            user_id: string;
            name?: string;
            username?: string;
            color?: string;
            page?: string;
        };
    }
    | {
        id: string;
        seq?: number;
        type: "presence.leave";
        room: string;
        payload: { user_id: string };
    }
    | {
        id: string;
        seq?: number;
        type: "chat.message";
        room: string;
        payload: {
            id?: string;
            user_id: string;
            message: string;
        };
    }
    | {
        id: string;
        seq?: number;
        type: "cursor.move";
        room: string;
        payload: {
            user_id: string;
            x: number;
            y: number;
        };
    }
    | {
        id: string;
        seq?: number;
        type: "scroll.sync";
        room: string;
        payload: {
            user_id: string;
            x: number;
            y: number;
        };
    }
    | {
        id: string;
        seq?: number;
        type: "click.ping";
        room: string;
        payload: {
            user_id: string;
            x: number;
            y: number;
            timestamp: number;
        };
    }
    | {
        id: string;
        seq?: number;
        type: "page.change";
        room: string;
        payload: {
            user_id: string;
            pathname: string;
        };
    }
    | {
        id: string;
        seq?: number;
        type: "element.hover";
        room: string;
        payload: {
            user_id: string;
            selector: string;
        };
    }
