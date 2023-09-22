import React, { useState, useEffect } from 'react';

function Row(props) {
    return (
        <div className='flex flex-row w-full orbitron' style={{backgroundColor: (props.rank % 2 === 0) ? 'rgba(255,255,255,0.05)' : 'none'}}>
            <div className='w-full h-full flex justify-center text-sm md:text-lg'>{props.rank}</div>
            <div className='w-full h-full flex justify-center text-sm md:text-lg'>{props.name}</div>
            <div className='w-full h-full flex justify-center text-sm md:text-lg'>{props.score}</div>
            <div className='w-full h-full flex justify-center text-center text-sm md:text-lg'>{props.date}</div>
        </div>
    );
}

export default Row;