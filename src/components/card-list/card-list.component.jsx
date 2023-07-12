
import Card from "../card/card.component";
import './card-list.styles.css';

const CardList =({MONSTER})=> (
     
       // const { MONSTER } = this.props;
                <div className='card-list'>
                { MONSTER.map(monsters => {
                    
                    return (
                   <Card monsters={monsters} />
                )})}
            </div>
        );
export default CardList;
