//https://egghead.io/lessons/javascript-redux-react-todo-list-example-adding-a-todo

const todo = {
   "ADD_TODO": (state, action) => { return {id: action.id, text: action.text, completed: false };},
  'TOGGLE_TODO': (state, action) => state.id === action.id ? {...state, completed: !state.completed } : state
}


//actions
let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: "ADD_TODO",
    text,
    id: nextTodoId++
  };
};
const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
};
const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  };
};

const { connect } = ReactRedux;
// import { connect } from 'react-redux';

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

const mapStateToLinkProps = (
 state,
 ownProps  // container components own props!
) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}
const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}
const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

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


let AddTodo = ({ dispatch }) => {
    let input;
    return (
      <div>

         <input ref={node => {
           input = node;
        }} />
        <button onClick = { () => {
            dispatch(addTodo(input.value))
            input.value = '';
         }}>
         Add Todo
         </button>
      </div>
  );
};
// the first 2 arguments of connect can be tossed (since it doesnt need the store)
// and dispatch will automatically be passed
AddTodo = connect()(AddTodo);



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

// these would normally be more generically named
// but since we're in a single file, we made them specific
const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
  };
};
const mapDispatchToTodoListProps = (dispatch) => {
   return {
     onTodoClick: (id) => {
         dispatch(toggleTodo(id))
     }
   };
};
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);



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
