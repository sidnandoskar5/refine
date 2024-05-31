import React from "react";
import useToDoListStore from "../../stores/toDoListStore";

const AddTodoForm = () => {
    const { addTodo } = useToDoListStore();
    const [newTodo, setNewTodo] = React.useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (newTodo.trim()) {
            addTodo(newTodo);
            setNewTodo("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={newTodo}
                onChange={(event) => setNewTodo(event.target.value)}
            />
            <button type="submit">Add To-Do</button>
        </form>
    );
};

export default AddTodoForm;
