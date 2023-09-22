import React, { useState, useEffect, useRef } from 'react';

import db from './firebase';
import axios from 'axios'

const PROJECT_ID = 'space-bars'
const COLLECTION_NAME = 'leaderboard'
const FB_REST_LINK = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION_NAME}`
const SELECT_AUDIO = new Audio(require('../audio/select.mp3'));

function SaveScore(props) {
    const [input, setInput] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const formRef = useRef()
    const [userCount, setUserCount] = useState(0);
    const sfxOn = () => {
        const data = localStorage.getItem('sfx');
        return (data ? JSON.parse(data) : true);
    };

    function pad(number) {
        return number < 10 ? `0${number}` : number;
    }

    let getNow = new Date();

    const handleSubmit = (e) => {
        e.preventDefault();
        let data;

        if (input === '') {
            console.log('USING DEFAULT NAME');
            data = {
                name: `USER${userCount + 1}`,
                score: props.score,
                date: getNow,
            }
        } else {
            data = {
                name: input.toString(),
                score: props.score,
                date: getNow,
            }
        }

        db.collection(COLLECTION_NAME).add(data)
        .then((res) => {
            setSubmitted(true);
            console.log(res.data)
        })
        .catch((error) => {
            console.error('ERROR', error);
        });
    }

    useEffect(() => {
        axios.get(FB_REST_LINK)
        .then((res)=>{
            console.log(res.data.documents);
            let sortList = res.data.documents;
            setUserCount(sortList.length);
        })
        .catch((err)=>{
            console.log('ERROR:', err);
        })
    }, []);

    return (
        <div className='w-full h-full nbexpanded flex flex-col justify-center items-center'>
            <div className='flex flex-col lg:flex-row w-full lg:w-2/3'>
                <div className='flex lg:flex-col w-full lg:w-1/3 h-full items-center justify-between lg:justify-start'>
                    <div className='text-3xl'>SCORE</div>
                    <div className='text-5xl orbitron p-[2rem] text-center'>{props.score}</div>
                </div>
                <form className='flex lg:flex-col w-full lg:w-1/3 h-full justify-between lg:justify-start items-center' 
                    ref={formRef} onSubmit={handleSubmit}>
                    <div className='text-3xl'>NAME</div>
                    <input className='text-white text-5xl bg-dark p-[2rem] text-center w-[50%] lg:w-full orbitron'
                        type='text' placeholder={`USER${userCount+1}`} value={input} onChange={(e)=>{setInput(e.target.value)}}/>
                </form>
                <div className='flex lg:flex-col w-full lg:w-1/3 h-full items-center justify-between lg:justify-start'>
                    <div className='text-3xl'>DATE & TIME</div>
                    <div className='text-3xl text-center p-[2rem] orbitron'>
                    {`${getNow.getFullYear()}.${getNow.getMonth()}.${getNow.getDate()}--${pad(getNow.getHours())}:${pad(getNow.getMinutes())}`}
                    </div>
                </div>
            </div>
            {
                submitted ?
                <div className='my-[2rem] orbitron'>
                SCORE ADDED TO LEADERBOARD!
                </div>
                :
                <div className='button cursor-pointer text-xl my-[2rem]' onClick={()=>{if (sfxOn()) {SELECT_AUDIO.play()}; formRef.current.requestSubmit()}}>
                ADD SCORE TO LEADERBOARD
                </div>
            }
        </div>
    );
}

export default SaveScore;