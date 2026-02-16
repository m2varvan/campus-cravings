import TodayDeal from './TodayDeal';
import WeekDeal from './WeekDeal';

const Promotion = ({uuid}) => {

    const loadTodayPromotions = async () => {
        return []
    };

    return(
        <div>
            <h2>Promotions Page</h2>
            <TodayDeal uuid={uuid} />

            <WeekDeal uuid={uuid}/>
        </div>
    )

};

export default Promotion;