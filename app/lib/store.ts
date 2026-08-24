import { Patch, AppState } from "../types/action";

type Listener = (state: AppState) => void;

export class Store {
    private state: AppState;
    private listeners: Listener[] = [];

    constructor() {
        this.state = this.getInitialState();
    }

    private notify() {
        this.listeners.forEach(fn => fn(this.state));
    }

    private getInitialState(): AppState {
        return {
            controller_id: null,
            users: {},
            messages: [],
            cursors: {},
            scrolls: {},
            clicks: {},
            pages: {},
            hovers: {}
        };
    }

    resetState() {
        this.state = this.getInitialState();
        this.notify();
    }

    getState(): AppState {
        return this.state;
    }

    subscribe(fn: Listener) {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }

    applyPatch(patch: Patch) {
        if (
            !patch ||
            (typeof patch !== "object") ||
            !("path" in patch) ||
            !patch.path
        ) {
            return; // ignore invalid patches with no path
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

        // Auto-follow controller's scroll movements
        if (patch.path.startsWith("scrolls.") && this.state.controller_id && (patch.op === "set")) {
            const pathUserId = keys[1];

            if (pathUserId === this.state.controller_id) {
                const val = patch.value as { x: number; y: number };

                if (val && (typeof val.y === "number")) {
                    window.scrollTo({
                        left: val.x ?? 0,
                        top: val.y ?? 0,
                        behavior: "smooth"
                    });
                }
            }
        }

        // Auto-follow controller's page navigation
        if (patch.path.startsWith("pages.") && this.state.controller_id && (patch.op === "set")) {
            const pathUserId = keys[1];

            if (pathUserId === this.state.controller_id) {
                const targetPage = patch.value as string;

                if (
                    targetPage &&
                    (typeof window !== "undefined") &&
                    (window.location.pathname !== targetPage)
                ) {
                    window.location.pathname = targetPage;
                }
            }
        }

        this.notify();
    }
}

export const store = new Store();
