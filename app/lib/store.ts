import { Patch, AppState } from "@/lib/types";

type Listener = (state: AppState) => void;

export class Store {
    private state: AppState;
    private listeners: Listener[] = [];
    private followedUserId: string | null = null;

    constructor() {
        this.state = {
            text: "",
            users: {},
            messages: [],
            cursors: {},
            scrolls: {},
            clicks: {},
            pages: {},
            hovers: {}
        };
    }

    private notify() {
        this.listeners.forEach(fn => fn(this.state));
    }

    getState(): AppState {
        return this.state;
    }

    getFollowedUserId(): string | null {
        return this.followedUserId;
    }

    setFollowedUserId(id: string | null) {
        this.followedUserId = id;
        this.state = { ...this.state };
        this.notify();
    }

    subscribe(fn: Listener) {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }

    applyPatch(patch: Patch) {
        // Ensure the patch is valid and has a path before proceeding
        if (!patch || (typeof patch !== "object") || !("path" in patch) || !patch.path) {
            return;
        }

        const keys = patch.path.split(".");
        const newState = { ...this.state } as Record<string, unknown>;
        let obj = newState;

        // Go through the keys to reach the target object, 
        // creating new objects/arrays as needed
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            const currentVal = obj[key];

            if (Array.isArray(currentVal)) {
                obj[key] = [...currentVal];
            } else if (currentVal && (typeof currentVal === "object")) {
                obj[key] = { ...currentVal };
            } else {
                obj[key] = {};
            }

            obj = obj[key] as Record<string, unknown>;
        }

        const lastKey = keys[keys.length - 1];

        if (patch.op === "set") {
            obj[lastKey] = patch.value;
        } else if (patch.op === "delete") {
            if (Array.isArray(obj)) {
                obj.splice(Number(lastKey), 1);
            } else {
                delete obj[lastKey];
            }
        } else if (patch.op === "append") {
            // Ensure the target is an array before appending
            const currentArray = Array.isArray(obj[lastKey]) ? (obj[lastKey] as unknown[]) : [];

            // Ensure the value is appended to a new array to avoid mutating the original
            obj[lastKey] = [...currentArray, patch.value];
        }

        this.state = newState as unknown as AppState;

        // Viewport follow tracking hook logic
        if (patch.path.startsWith("scrolls.") && this.followedUserId) {
            const pathUserId = keys[1];
            if ((pathUserId === this.followedUserId) && (patch.op === "set")) {
                const val = patch.value as { x: number; y: number };
                if (val && (typeof val.y === "number")) {
                    window.scrollTo({
                        left: val.x,
                        top: val.y,
                        behavior: "smooth"
                    });
                }
            }
        }

        // Notify state subscribers to trigger a clean React layout re-render pass
        this.notify();
    }
}

export const store = new Store();
