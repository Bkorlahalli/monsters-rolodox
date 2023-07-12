
import './card.styles.css';

const card =({monsters: {id,name,email }}) =>
(

    // const { }= monsters;
  
        <div className='card-container' key={id}>
        <img alt={`monster $(name)`} 
        src={`https://robohash.org/${id}2?set=set2&size=180x180`}
        />
        <h2>{name}</h2>
        <p>{email}</p>
       </div>
    
);



export default card;