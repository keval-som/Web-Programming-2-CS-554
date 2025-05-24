import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
function AddTodos(props) {
    function checkString(str) {
        if(!str) {
            alert('Please enter a valid string');
            return false;
        }
        if(typeof str !== 'string') {
            alert('Please enter a valid string');
            return false;
        }
        str = str.trim();
        if(str.length === 0) {
            alert('Please enter a valid string');
            return false;
        }
        return true;
    }


    const addTodo = (e) => {
        e.preventDefault();

      
        let title = document.getElementById('title').value;
        if(!checkString(title)) {
            return;
        }
        title = title.trim();
        if(title.length < 5) {
            alert('Title must be at least 5 characters long');
            return;
        }
        let description = document.getElementById('description').value;
        if(!checkString(description)) {
            return;
        }
        description = description.trim();
        if(description.length < 25) {
            alert('Description must be at least 25 characters long');
            return;
        }

        let due = document.getElementById('due').value;
        if(!checkString(due)) {
            return;
        }
        if (moment(due).isBefore(moment(), 'day')) {
            alert('Due date cannot be in the past');
            return;
        }
        due = moment(due).format('MM/DD/YYYY');
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('due').value = '';
        props.addTodo({
            id: uuidv4(),
            title: title,
            description: description,
            due: due,
            completed: false
        });
    };

    return (
        <div>
            <form onSubmit={addTodo}>
                <label>Title:</label>
                <input type="text" id="title" required />
                <label>Description:</label>
                <input type="textarea" id="description" required />
                <label>Due Date:</label>
                <input type="date" id="due" min={new Date().toISOString().split('T')[0]} required />
                <button type="submit">Add Todo</button>
            </form>
        </div>
    )

}

export default AddTodos;