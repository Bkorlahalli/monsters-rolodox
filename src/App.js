import { useState,useEffect } from 'react';
import CardList from './components/card-list/card-list.component';
import SearchBox from './components/search-box/search-box.component';
import './App.css';

const App = () =>{
  const [searchField, setSearchField] = useState('');
  const [MONSTER,setMONSTER]= useState([]);
  const [filteredMonsters,setFilteredMonsters]= useState([MONSTER]);
  console.log('render');
  useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
  .then((response) => response.json())
  .then((users) => setMONSTER(users));
  },[]);
  useEffect(()=>{
    const filteredMonstersnames = MONSTER.filter((monsters) => {
      return monsters.name.toLocaleLowerCase().includes(searchField);
    });
     setFilteredMonsters(filteredMonstersnames);
  },[MONSTER,searchField]);
  
  const onSearchChange = (event) => {
    const searchFieldString = event.target.value.toLocaleLowerCase();
      setSearchField(searchFieldString);
      };
      
  return(
    <div className="App">
    <h1 className='app-title'>Monsters Rolodex</h1>
    <SearchBox onChangeHandler={onSearchChange} 
    placeholder='search monsters' 
    className='monsters-search-box' 
  />
   <CardList MONSTER ={filteredMonsters }/>
</div> 
  );
}

/*class App extends Component{
  constructor(){
    super();


    this.state={
      MONSTER: [], 
      searchField: '',
      
    };
    
  }
  componentDidMount(){
   
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((users) => this.setState(
      ()=> {
        return{ MONSTER:users};
      }
      
    ));
  }

  onSearchChange = (event) => {
    console.log(event.target.value);
    const searchField = event.target.value.toLocaleLowerCase();
    this.setState(() => {
      return {searchField};
    } );
  }
  render(){
   
    const { MONSTER ,searchField } = this.state;
    const { onSearchChange } = this;
    const filteredMonsters = MONSTER.filter((monsters) => {
      return monsters.name.toLocaleLowerCase().includes(searchField);
    });
    
    return (
     

      <div className="App">
          <h1 className='app-title'>Monsters Rolodex</h1>
          <SearchBox onChangeHandler={onSearchChange} placeholder='search monsters' className='monsters-search-box' />
          <CardList MONSTER={filteredMonsters }/>
      </div> 
    );
  }
}*/


export default App;
