import useToDoListStore from "../../stores/toDoListStore";

const TodoList = () => {
    const { todos, markCompleted } = useToDoListStore();

    return (
        <ul>
            {todos.map((todo, index) => (
                <li key={index}>
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => markCompleted(index)}
                    />
                    <span
                        style={{
                            textDecoration: todo.completed
                                ? "line-through"
                                : "none",
                        }}
                    >
                        {todo.text}
                    </span>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;
