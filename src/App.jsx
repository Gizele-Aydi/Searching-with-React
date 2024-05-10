import * as React from "react"

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const List = ({ list, onRemoveItem }) => (
    <ul>
        {list.map((item)=> (
            <Item 
            key={item.objectID} 
            item={item}
            onRemoveItem={onRemoveItem} 
            />
        ))}
    </ul>
);

const Item = ({ item, onRemoveItem }) => {
    return (
    <li>
        <span>
            <a href={item.url}>{item.title}</a>
        </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
        <span>
            <button 
            type='button' 
            onClick={() => onRemoveItem(item)}>
                Dismiss
            </button>
        </span>
    </li>
    );
};

const initialStories = [
    {
      title: "React ",
      url: "https://reactjs.org/",
      author: "Jordan Walke ",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux ",
      url: "https://redux.js.org/",
      author: "Dan Abramovs, Andrew Clark ",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
];

const App = () => {

    const [searchTerm, setSearchTerm]= React.useState(localStorage.getItem('search')||'React')

    const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`); 
 
    const handleSearchSubmit = () => { 
      setUrl(`${API_ENDPOINT}${searchTerm}`); 
    };

    const[stories, setStories] = React.useState(initialStories);
    
    const [isLoading, setIsLoading] = React.useState(false);
    
    const [isError, setIsError] = React.useState(false);
  
    const handleRemoveStory = (item) => {
      const newStories = stories.filter(
        (story) => item.objectID !== story.objectID
      );
      setStories(newStories);
    };
    
    React.useEffect(() => { 
        setIsLoading(true); 
        fetch(url) 
            .then((response) => response.json()) 
            .then((result) => { 
                setStories(result.hits); 
                setIsLoading(false); 
            }) 
            .catch(() => { 
                setIsError(true); 
                setIsLoading(false); 
            }); 
    }, [url]);
  
    React.useEffect(()=> {
        localStorage.setItem('search', searchTerm);},[searchTerm]);
    
    const handleSearch = (event) =>{
      setSearchTerm(event.target.value);
    };
    
    return (
      <div>
        <h1>My hacker stories</h1>
        
        <InputWithLabel
          id="search"
          value={searchTerm}
          onInputChange={handleSearch}
          >
          <strong> Search: </strong>
        </InputWithLabel>
        
        <button 
        type="button" 
        disabled={!searchTerm} 
        onClick={handleSearchSubmit} 
        > 
            Submit 
        </button>
        
        <hr />
        
        {isError && <p>Something went wrong ...</p>}
        {isLoading ? (
          <p>Loading ...</p>
          ) : (
          <List list={stories} onRemoveItem={handleRemoveStory} />
          )}
      </div>
    );
};

const InputWithLabel = ({
    id,
    label,
    value,
    type ='text',
    onInputChange,
    children,
    }) => (
        <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            <input 
                id={id} 
                type={type}
                value={value}
                onChange={onInputChange} 
            />
        </>
);

export default App;
