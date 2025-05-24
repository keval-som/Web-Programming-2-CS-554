function TodoList(props) {
    let todoList = props.items.filter(item => !item.completed);
    const deleteItem = (id) => {
        props.handleDelete(id);
    }
    const completeItem = (item) => { 
        props.handleComplete(item);
    }
    return (
        <div>
            {
                todoList.map((item) => {
                    const isPastDue = new Date(item.due) < new Date();
                    return (
                        <div key={item.id}>
                            <h1 className={isPastDue ? 'delayed' : ''}>{item.title}</h1>
                            <p>{item.description}</p>
                            <p className={isPastDue ? 'delayed' : ''}>Due Date: {item.due}</p>
                            <p>Completed: {item.completed ? 'Yes' : 'No'}</p>
                            <button onClick={() => deleteItem(item.id)}>Delete</button>
                            <button onClick={() => completeItem(item)}>Complete</button>
                        </div>
                    );
                })
            }
        </div>
    )
}

export default TodoList;