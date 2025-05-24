function CompletedTodos(props) {
    let todoList = props.items.filter(item => item.completed);
    const toggleCompleted = (todo) => {
        props.toggleCompleted(todo);
    }

    return (
        <div>
            {
                todoList.map((item) => (
                    <div key={item.id}>
                        <h1>{item.title}</h1>
                        <p>{item.description}</p>
                        <p>Due Date: {item.due}</p>
                        <p>Completed: {item.completed? 'Yes':'No'}</p>
                        <button onClick={()=>toggleCompleted(item)}>Mark Incomplete</button>
                    </div>
                ))
            }
        </div>
    )
}

export default CompletedTodos;