import React, { useState, useEffect } from 'react';
import axios from 'axios'

import Row from './Row'

const PROJECT_ID = 'space-bars'
const COLLECTION_NAME = 'leaderboard'
const FB_REST_LINK = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION_NAME}`  

function Leaderboard(props) {
    const [loading, setLoading] = useState(true);
    const [LBData, setLBData] = useState([])

    function pad(number) {
        return number < 10 ? `0${number}` : number;
    }

    useEffect(() => {
        axios.get(FB_REST_LINK)
        .then((res)=>{
            console.log(res.data.documents);
            let sortList = res.data.documents;
            sortList = sortList.sort((r1, r2)=>
                (r2.fields.score.integerValue - r1.fields.score.integerValue));
            console.log('SORTLIST', sortList);
            if (props.slice) {
                setLBData(sortList.slice(0, props.slice))
            } else {
                setLBData(sortList);
            }
            setLoading(false);
        })
        .catch((err)=>{
            console.log('ERROR:', err);
        })
    }, []);

    return ( 
        <div className='w-full h-full flex flex-col text-2xl  mb-[2rem]'>
            <div className='my-[1rem] text-3xl'>
                <div className='flex flex-row w-full nbexpanded'>
                    <div className='w-full h-full flex justify-center text-xl'>RANK</div>
                    <div className='w-full h-full flex justify-center text-xl'>NAME</div>
                    <div className='w-full h-full flex justify-center text-xl'>SCORE</div>
                    <div className='w-full h-full flex justify-center text-center text-xl'>DATE & TIME</div>
                </div>
            </div>
            {
            loading ?
                <div className='nbexpanded w-full flex justify-center items-center h-[20rem]'>
                    <div className='flex flex-row space-x-[0.5rem]'>
                        <div>LOADING</div>
                        <div className='retroloader w-[1.5rem] h-[1.5rem] flex items-end space-x-[0.25rem]'>
                            <div className='w-1/3 aspect-square bg-white'/>
                            <div className='w-1/3 aspect-square bg-white'/>
                            <div className='w-1/3 aspect-square bg-white'/>
                        </div>
                    </div>
                </div>
            :
                <div className='flex flex-col max-h-[50vh] overflow-y-auto overflow-x-hidden'>
                    {
                    LBData.map((item, index)=>{
                        let scoreDate = new Date(item.fields.date.timestampValue)
                        return(
                            <div className='list-animation' style={{animationDelay: `${0.1 * (index-1)}s`}}>
                                <Row rank={index + 1} 
                                name={item.fields.name.stringValue} 
                                score={item.fields.score.integerValue} 
                                date={`${scoreDate.getFullYear()}.${scoreDate.getMonth() + 1}.${scoreDate.getDate()}--${pad(scoreDate.getHours())}:${pad(scoreDate.getMinutes())}`}/>
                            </div>
                        )
                    })
                    }
                </div>
            }
        </div>
     );
}

export default Leaderboard;