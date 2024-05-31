import { create } from "zustand";

const useToDoListStore = create((set) => ({
    todos: [],
    addTodo: (newTodo: any) =>
        set((state: any) => ({
            todos: [...state.todos, { text: newTodo, completed: false }],
        })),
    markCompleted: (todoIndex: any) =>
        set((state: any) => ({
            todos: state.todos.map((todo: any, index: number) =>
                index === todoIndex
                    ? { ...todo, completed: !todo.completed }
                    : todo
            ),
        })),
}));

export default useToDoListStore;