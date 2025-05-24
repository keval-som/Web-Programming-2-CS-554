import { useState } from 'react'
import TodoList from './components/TodoList'
import CompletedTodos from './components/CompletedTodos'
import AddTodos from './components/AddTodos'
import './App.css'
import { v4 as uuidv4 } from 'uuid'

function App() {
  let items = [
    {
      id: uuidv4(),
      title: 'Pay Bill',
      description: 'Pay the electricity bill for the month of March',
      due: '03/14/2025',
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Go to the gym',
      description: 'Do some weight lifting and cardio exercises',
      due: '03/15/2025',
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Buy groceries',
      description: 'Buy groceries for the entire week including fruits and vegetables',
      due: '03/16/2025',
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Read a book',
      description: 'Read a book for at least 30 minutes to relax and unwind',
      due: '03/17/2025',
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Watch a movie',
      description: 'Watch a movie with friends or family',
      due: '03/18/2025',
      completed: false
    }, 
    {
      id: uuidv4(),
      title: 'Plan vacation',
      description: 'Research and plan for the upcoming vacation',
      due: '03/19/2025',
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Clean the house',
      description: 'Do a thorough cleaning of the house',
      due: '03/20/2025',
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Call parents',
      description: 'Have a phone call with parents to catch up',
      due: '03/21/2025',
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Prepare presentation',
      description: 'Work on the presentation for the upcoming meeting',
      due: '03/22/2025',
      completed: false
    },
    {
      id: uuidv4(),
      title: 'Organize workspace',
      description: 'Organize and declutter the workspace for better productivity',
      due: '03/23/2025',
      completed: false
    }
  ]
  const [todoList, setTodoList] = useState(items)
  const deleteTodo = (id) => {
    setTodoList(todoList.filter(item => item.id !== id))
  }

  const toggleCompleted = (todo) => {
    setTodoList(todoList.map(item => {
      if (item.id === todo.id) {
        return { ...item, completed: !item.completed }
      }
      return item
      })
    )
  }

  const addTodo = (todo) => {
    setTodoList([...todoList, todo])
  }

  return (
    <>
      <h1>Todo List</h1>
      <TodoList items={todoList} handleDelete = {deleteTodo} handleComplete = {toggleCompleted}/>

      <h1>Completed Todo List</h1>
      <CompletedTodos items={todoList} toggleCompleted = {toggleCompleted}/>

      <h1>Add Todo</h1>
      <AddTodos addTodo = {addTodo}/>
    </>
  )
}

export default App;
