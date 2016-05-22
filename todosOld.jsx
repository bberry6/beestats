//https://egghead.io/lessons/javascript-redux-react-todo-list-example-adding-a-todo

const todo = {
   "ADD_TODO": (state, action) => { return {id: action.id, text: action.text, completed: false };},
  'TOGGLE_TODO': (state, action) => state.id === action.id ? {...state, completed: !state.completed } : state
}

// todos reducer (add, toggle, delete)
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo[action.type](undefined, action) || state
      ];
    case 'TOGGLE_TODO':
      return state.map(t =>
        todo[action.type](t, action) || state
      );
      default:
        return state;
  }
};

// visibility reducer
const visibilityFilter = (state = 'SHOW_ALL', action ) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

// build app from reducer functions
const { combineReducers } = Redux;
const todoApp = combineReducers({ todos, visibilityFilter });


const getVisibleTodos = (
   todos,
  filter
) => {
   switch(filter){
     case 'SHOW_ALL':
       return todos;
    case 'SHOW_COMPLETED':
       return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
       return todos.filter(t => !t.completed);
  }
}

// create todoApp component
let nextTodoId = 0;
const { Component } = React;


const Link = ({
  active, children, onClick
}) => {
  if(active){
    return <span> {children} </span>
  }
  return (
    <a href="#" onClick={e => {
      e.preventDefault();
      onClick();
    }}>
    {children}
    </a>
  )
};

class FilterLink extends Component {
  componentDidMount(){
      const {store} = this.context;
      this.unsubscribe = store.subscribe(() =>
          this.forceUpdate()
      );
  }

  componentWillUnmount(){
    this.unsubscribe();
  }
  render() {
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();
    return (
      <Link
        active = {
          props.filter === state.visibilityFilter
      }
      onClick = {() =>
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter: props.filter
        })
      }
    >{props.children}</Link>
    );
  }
}
FilterLink.contextTypes = {
  store: React.PropTypes.object
};

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
  onClick={onClick}
  style={{
    textDecoration: completed ? 'line-through' : 'none'
  }}>
    {text}
  </li>
)

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
     {todos.map(todo=>
       <Todo
          key={todo.id}
          {...todo}
          onClick={() => onTodoClick(todo.id)}
       />
     )}
  </ul>
)

const AddTodo = (props, {store}) => {
    let input;
    return (
      <div>

         <input ref={node => {
           input = node;
        }} />
        < button onClick = { () => {
            store.dispatch({
              type: "ADD_TODO",
              text: input.value,
              id: nextTodoId++
            })
            input.value = '';
         }}>
         Add Todo
         </button>
      </div>
  );
};

AddTodo.contextTypes = {
  store: React.PropTypes.object
};

const Footer = () => (

  <p>
  Show:
  {' '}
  <FilterLink filter="SHOW_ALL">
  All
  </FilterLink>
  {' '}
  <FilterLink filter="SHOW_ACTIVE">
  Active
  </FilterLink>
  {' '}
  <FilterLink filter="SHOW_COMPLETED">
  Completed
  </FilterLink>
  </p>


)

class VisibleTodoList extends Component {
  componentDidMount(){
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount(){
    this.unsubscribe();
  }
  render(){
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();

    return (
      <TodoList
        todos = {
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
      }
      onTodoClick = { id =>
         store.dispatch({
            type: 'TOGGLE_TODO',
            id
         })
      }
      />
    );
  }
}

VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
};

const TodoApp = ()=> (
      <div>
          <AddTodo />
         <VisibleTodoList />
         <Footer />
      </div>
    )

// create the todo store based on the app
const { Provider } = ReactRedux;
const { createStore } = Redux;

  ReactDOM.render( <Provider store = {createStore(todoApp)}>
    <TodoApp />
    </Provider>,
    document.getElementById('root')
  );
