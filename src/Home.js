import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameCanvas from './components/GameCanvas'
import Leaderboard from './components/Leaderboard';
import SaveScore from './components/Savescore';

const SMALL_SELECT_AUDIO = new Audio(require('./audio/small_select.mp3'));
const BG_MUSIC = new Audio(require('./audio/music.mp3'));

function Home(props) {
    const [score, setScore] = useState(0);
    const [musicOn, setMusicOn] = useState(false);
    const [sfxOn, setSFXOn] = useState(()=>{
        const data = localStorage.getItem('sfx');
        return (data ? JSON.parse(data) : true);
    });
    const [windHeight, setWindHeight] = useState(0);
    const [saveScore, setSaveScore] = useState(false);
    const [gameStatus, setGameStatus] = useState(()=>{
        const searchParams = new URLSearchParams(window.location.search);
        const data = searchParams.get('gameStatus');
        if (data !== null) {
            return (data)
        } else {
            return ('home');
        }
    });
    BG_MUSIC.volume = 0.5;
    BG_MUSIC.loop = true;
  
    const gameOver = () => {
      setGameStatus('gameover');
    }

    const handleResize = () => {
        setWindHeight(window.innerHeight);
    }

    const toggleMusic = () => {
        if (musicOn) {
            BG_MUSIC.pause()
            setMusicOn(false);
        } else {
            setMusicOn(true);
            BG_MUSIC.play()
        }
    }

    const toggleSFX = () => {
        let s = !sfxOn;
        setSFXOn(s);
        localStorage.setItem('sfx', s);
    }

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
  
    return (
        <div className='w-screen h-screen flex justify-center items-center'>
        {
        gameStatus === 'gameover'
        && <div className='fixed left-auto top-auto max-w-[1680px] mx-auto px-[2rem] w-full h-full bg-dark text-white flex flex-col items-center overflow-auto'
            style={{justifyContent: windHeight < 768 ? 'start' : 'center'}}>
            <div className='min-h-[500px] w-full flex flex-col justify-start items-center'>
                <div className='relative w-full flex justify-center'>
                    <div className='nbtwotone coolbg flyin absolute z-10' style={{fontSize: 'min(12vw, 7rem)'}}>{'GAME OVER...'}</div>
                    <div className='nbtwotone flyin text-white -z-10 relative left-[-1px] top-[-1px]' style={{fontSize: 'min(12vw, 7rem)'}}>{'GAME OVER...'}</div>
                </div>
                <div className='w-full max-w-[40rem] flex justify-center'>
                    <div className='h-[0.1rem] bg-white w-full expand'></div>
                </div>
                {
                    !saveScore
                    && <div className='w-full lg:w-[50%] flex flex-col justify-center items-center'>
                        <div className='nbexpanded flex flex-row text-3xl my-[1rem]'>
                            <div>SCORE:</div>
                            <div className='ml-[0.5rem] blink'>{score}</div>
                        </div>
                        <Leaderboard slice={10}/>
                        <div className='nbexpanded button text-xl my-[2rem] cursor-pointer'
                        onClick={()=>{if (sfxOn) {SMALL_SELECT_AUDIO.play()}; setSaveScore(true)}}
                        >NEXT ►</div>
                    </div>
                }
                {
                    saveScore&&
                    <div className='w-full h-full flex justify-start items-center flex-col list-animation'>
                    <div className='text-xl my-[2rem] w-full lg:w-[50%] text-start cursor-pointer nbexpanded button'
                        onClick={()=>{if (sfxOn) {SMALL_SELECT_AUDIO.play()}; setSaveScore(false)}}>◄ BACK TO LEADERBOARD</div>
                    <SaveScore score={score}/>
                    <div className='relative flex flex-col items-center mt-[4rem] mb-[2rem]'>
                        <div className='flex flex-row w-[20vw] min-w-[20rem] justify-between items-center'>
                            <div className='cursor-pointer nbexpanded text-xl button' onClick={()=>{
                                if (sfxOn) {SMALL_SELECT_AUDIO.play()};
                                setTimeout(()=>{window.location.href = '/?gameStatus=playing'}, 500)
                            }}>PLAY AGAIN
                            </div>
                            <div className='nbexpanded text-xl button cursor-pointer' onClick={()=>{
                                if (sfxOn) {SMALL_SELECT_AUDIO.play()};
                                setTimeout(()=>{window.location.href = '/?gameStatus=home'}, 500)
                            }}
                            >EXIT</div>
                        </div>
                    </div>

                </div>

                }
            </div>
        </div>
        }
        {
        gameStatus === 'home'
        && <div className='fixed max-w-[1680px] mx-auto flex flex-col items-center left-auto top-0 w-full h-full bg-dark text-white p-[2rem] overflow-auto'
            style={{justifyContent: windHeight < 768 ? 'start' : 'center'}}>
            <img className='w-full max-w-[40rem] h-auto object-contain fadein relative z-0'src={require('./assets/title.png')} alt='spacebars'/>
            <img className='w-[4rem] h-auto object-contain flyup relative z-0' src={require('./assets/shipimg.png')} alt='ship'/>

            <div className='w-full max-w-[1680px] flex flex-col lg:flex-row justify-around items-around relative z-10'>
                <div className='w-full flex justify-center lg:hidden'>
                    <div className='cursor-pointer relative m-[1rem] flex justify-start' onClick={()=>{
                    if (sfxOn) {
                        let SELECT_AUDIO = new Audio(require('./audio/select.mp3'));
                        SELECT_AUDIO.play();
                    }
                    setTimeout(()=>{window.location.href = '/?gameStatus=playing'}, 600)
                    }}>
                        <div className='nbtwotone coolbg absolute z-10 whitespace-nowrap hover:hidden' style={{fontSize: 'min(6vw, 3rem)'}}>START.</div>
                        <div className='nbtwotone text-white -z-10 relative left-[-1px] top-[-1px] whitespace-nowrap' style={{fontSize: 'min(6vw, 3rem)'}}>START</div>
                    </div>
                </div>
                <div className='w-full flex justify-center'>
                    <div className='cursor-pointer relative m-[1rem] last:flex justify-start' onClick={()=>{
                    if (sfxOn) {
                        let SELECT_AUDIO = new Audio(require('./audio/select.mp3'));
                        SELECT_AUDIO.play();
                    }
                    setGameStatus('howtoplay');
                    }}>
                        <div className='nbtwotone coolbg absolute z-10 whitespace-nowrap hover:hidden' style={{fontSize: 'min(6vw, 3rem)'}}>HOW TO PLAY.</div>
                        <div className='nbtwotone text-white -z-10 relative left-[-1px] top-[-1px] whitespace-nowrap' style={{fontSize: 'min(6vw, 3rem)'}}>HOW TO PLAY</div>
                    </div>
                </div>
                <div className='w-full justify-center hidden lg:flex'>
                    <div className='cursor-pointer relative m-[1rem] flex justify-start' onClick={()=>{
                    if (sfxOn) {
                        let SELECT_AUDIO = new Audio(require('./audio/select.mp3'));
                        SELECT_AUDIO.play();
                    }
                    setTimeout(()=>{window.location.href = '/?gameStatus=playing'}, 600)
                    }}>
                        <div className='nbtwotone coolbg absolute z-10 whitespace-nowrap hover:hidden' style={{fontSize: 'min(6vw, 3rem)'}}>START.</div>
                        <div className='nbtwotone text-white -z-10 relative left-[-1px] top-[-1px] whitespace-nowrap' style={{fontSize: 'min(6vw, 3rem)'}}>START</div>
                    </div>
                </div>
                <div className='w-full flex justify-center'>
                    <div className='cursor-pointer relative m-[1rem] flex justify-start' onClick={()=>{
                    if (sfxOn) {
                        let SELECT_AUDIO = new Audio(require('./audio/select.mp3'));
                        SELECT_AUDIO.play();
                    }
                        setGameStatus('leaderboard');
                    }}>
                        <div className='nbtwotone coolbg absolute z-10 whitespace-nowrap hover:hidden' style={{fontSize: 'min(6vw, 3rem)'}}>LEADERBOARD.</div>
                        <div className='nbtwotone text-white -z-10 relative left-[-1px] top-[-1px] whitespace-nowrap' style={{fontSize: 'min(6vw, 3rem)'}}>LEADERBOARD</div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-center'>
                <div className='nbexpanded relative z-20 text-xl cursor-pointer button whitespace-nowrap m-[0.5rem]' onClick={()=>{if (sfxOn) {SMALL_SELECT_AUDIO.play()}; toggleMusic()}}>
                    {`MUSIC: ${musicOn ? 'ON' : 'OFF'}`}
                </div>
                <div className='nbexpanded relative z-20 text-xl cursor-pointer button whitespace-nowrap m-[0.5rem]' onClick={()=>{toggleSFX()}}>
                    {`SFX: ${sfxOn ? 'ON' : 'OFF'}`}
                </div>
            </div>

            <div className='flex flex-col justify-center items-center z-20 my-[4rem] relative'>
                <div className='orbitron'>
                    Designed & Built by Tom Choi (2023)
                </div>
                <div className='nbexpanded text-xl button'>LEARN MORE</div>
            </div>
        </div>
        }
        {
        gameStatus === 'leaderboard'
        &&
        <div className='fixed max-w-[1680px] mx-auto flex flex-col items-center left-auto top-0 w-full h-full bg-dark text-white p-[2rem] overflow-auto'
            style={{justifyContent: windHeight < 768 ? 'start' : 'center'}}>
            <div className='nbexpanded relative z-20 cursor-pointer w-full lg:w-[50%] justify-start'>
                <div className='w-fit flex text-xl button' onClick={()=>{if (sfxOn) {SMALL_SELECT_AUDIO.play()}; setGameStatus('home')}}>◄ BACK</div>
            </div>
            <div className='cursor-pointer relative m-[1rem] flex justify-start flyin'>
                <div className='nbtwotone coolbg absolute z-10 whitespace-nowrap' style={{fontSize: 'min(10vw, 6rem)'}}>LEADERBOARD.</div>
                <div className='nbtwotone text-white -z-10 relative left-[-1.5px] top-[-1.5px] whitespace-nowrap' style={{fontSize: 'min(10vw, 6rem)'}}>LEADERBOARD</div>
            </div>
            <div className='w-full lg:w-[50%]'>
                <Leaderboard/>
            </div>
        </div>
        }
        {
        gameStatus === 'howtoplay'
        &&
        <div className='fixed max-w-[1680px] mx-auto flex flex-col items-center left-auto top-0 w-full h-full bg-dark text-white p-[2rem] overflow-auto'
            style={{justifyContent: windHeight < 768 ? 'start' : 'center'}}>
            <div className='nbexpanded relative z-20 cursor-pointer w-full lg:w-[50%] justify-start'>
                <div className='w-fit flex text-xl button' onClick={()=>{if (sfxOn) {SMALL_SELECT_AUDIO.play()}; setGameStatus('home')}}>◄ BACK</div>
            </div>
            <div className='cursor-pointer relative m-[1rem] flex justify-start flyin'>
                <div className='nbtwotone coolbg absolute z-10 whitespace-nowrap' style={{fontSize: 'min(10vw, 6rem)'}}>HOW TO PLAY.</div>
                <div className='nbtwotone text-white -z-10 relative left-[-1.5px] top-[-1.5px] whitespace-nowrap' style={{fontSize: 'min(10vw, 6rem)'}}>HOW TO PLAY</div>
            </div>
            <div className='w-full lg:w-[50%] orbitron max-h-[50vh] overflow-auto'>
                <div className='text-3xl nbexpanded'>1. MOVEMENT</div>
                <img className='w-full md:w-2/3 mx-auto h-auto' src={require('./assets/htp1.png')} alt='movement'/>
                <div>Use WASD or Arrow Keys to move</div>
                <div className='mb-[2rem]'>{'<< WARNING! Mouse Move or Click causes UI bugs. >>'}</div>

                <div className='text-3xl nbexpanded'>2. LASERS</div>
                <img className='w-full md:w-2/3 mx-auto h-auto' src={require('./assets/htp2.png')} alt='lasers'/>
                <div>Avoid the lasers, they take away your energy!</div>
                <div>Dots that are close have a dim red line that becomes brighter as they get closer</div>
                <div className='mb-[2rem]'>If they get close enough, they connect with a laser</div>

                <div className='text-3xl nbexpanded'>3. ENERGY</div>
                <img className='w-full md:w-2/3 mx-auto h-auto' src={require('./assets/htp3.png')} alt='energy'/>
                <div className='mb-[2rem]'>Recharge lost energy using energy spheres</div>

                <div className='text-3xl nbexpanded'>4. COMBO</div>
                <img className='w-full md:w-2/3 mx-auto h-auto' src={require('./assets/htp4.png')} alt='combo'/>
                <div className='mb-[2rem]'>Build combo to get more health & points from energy spheres</div>
            </div>
        </div>
        }
        {
            gameStatus === 'playing'
            && <GameCanvas setScore={setScore} score={score} gameOver={gameOver}/>
        } 
        </div>
    );
}

export default Home;