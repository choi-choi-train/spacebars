import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSpring, animated } from 'react-spring';
import Particle from './Particle.js'
import Spark from './Spark.js'
import Trail from './Trail.js'
import Ship from './Ship.js'
import UIText from './UIText.js'
import Collectable from './Collectable.js'

const HEALTH = 100;
const GAME_OVER_AUDIO = new Audio(require('../audio/gameover.mp3'))
const SELECT_AUDIO = new Audio(require('../audio/select.mp3'));
const WARNING_AUDIO = new Audio(require('../audio/warning.mp3'));
const BG_MUSIC = new Audio(require('../audio/gameplaymusic.mp3'));
let HIT_AUDIO = new Audio(require('../audio/hit.mp3'))

const YELLOW = 'rgba(249, 200, 14)';
const PINK = 'rgba(255, 67, 101)'

function GameCanvas(props) {
    const canvasRef = useRef(null);
    const shipRef = useRef(null);
    const [shipHealth, setShipHealth] = useState(HEALTH);
    var activationDist = 0;
    var shipData = {score:0, health:HEALTH, x:0, y:0};
    const particleArray = useMemo(()=>[], []);
    const sparkArray = useMemo(()=>[], []);
    const trailArray = useMemo(()=>[], []);
    const uitextArray = useMemo(()=>[], []);
    var str = 0;
    var timer = 0;
    const [streakTimer, setStreakTimer] = useState(0);
    const [streak, setStreak] = useState(0);
    const [double, setDouble] = useState(false);
    const [takingDamage, setTakingDamage] = useState(false);
    var takingDmg = false;
    const [healthBoost, setHealthBoost] = useState(false);
    const [danger, setDanger] = useState(false);
    const [mileStone, setMileStone] = useState(false);
    const sfxOn = () => {
        const data = localStorage.getItem('sfx');
        return (data ? JSON.parse(data) : true);
    };

    const sizeCanvas = (c) => {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        activationDist = 50 + (50 * (c.width / 1680 + c.height / 680)/2);
    }

    const screenSpring = useSpring({
        boxShadow: danger ? `inset 0 0 40px 5px ${PINK}` : `inset 0 0 0px 0px ${PINK}`,
        config: {
            mass: 1,
        }
    })

// CANVAS INITIALIZER UEF
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        sizeCanvas(canvas);

        for (let i = 0; i < (30 + 50*(canvas.width / 1680 + canvas.height / 680)/2); i++) {
            particleArray.push(new Particle(canvas.width, canvas.height, ctx));
        }
    }, [particleArray, activationDist]);

// LASERFIELD HANDLER UEF
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const handleDmg = () => {
            shipData.health = shipData.health - 0.2;
            if (takingDmg) {
                shipData.health--;
                if (sfxOn()) {
                    let HIT_AUDIO = new Audio(require('../audio/hit.mp3'))
                    HIT_AUDIO.volume = 0.03;
                    HIT_AUDIO.play();
                }
            }
            if (shipData.health <= HEALTH/3) {
                setDanger(true);
                if (sfxOn()) {
                    WARNING_AUDIO.volume = 0.4;
                    WARNING_AUDIO.play();
                }
            }
            if (shipData.health <= 0) {
                if (sfxOn()) {
                    HIT_AUDIO.volume = 0.03;
                    HIT_AUDIO.play();
                    GAME_OVER_AUDIO.play();    
                } 
                props.gameOver();
            }
            setShipHealth(shipData.health);
        }

        const handleParticles = () => {
            for (let i = 0; i < particleArray.length; i++) {
                particleArray[i].update();
                particleArray[i].draw();

                for (let j = i; j < particleArray.length; j++) {
                    let dx = particleArray[i].x - particleArray[j].x;
                    let dy = particleArray[i].y - particleArray[j].y;
                            
                    let hypotenuse = Math.sqrt(dx*dx + dy*dy);
        
                    if (hypotenuse < (1.5 * activationDist)) {
                        ctx.beginPath();
                        if (hypotenuse < activationDist) {
                            ctx.strokeStyle = '#FFA4B4'
                            ctx.lineWidth = 4;

                            let dist_i_ship = Math.sqrt((particleArray[i].y - shipData.y)*(particleArray[i].y - shipData.y) + (particleArray[i].x - shipData.x)*(particleArray[i].x - shipData.x));
                            let dist_j_ship = Math.sqrt((particleArray[j].y - shipData.y)*(particleArray[j].y - shipData.y) + (particleArray[j].x - shipData.x)*(particleArray[j].x - shipData.x));
                            const betweenCheck = Math.abs((dist_i_ship + dist_j_ship) - hypotenuse) < 10;

                            if (betweenCheck) {
                                ctx.strokeStyle = 'white'
                                ctx.lineWidth = 6;
                                ctx.shadowBlur = 6;
                                ctx.shadowColor = YELLOW;

                                for (let i = 0; i < 2; i++) {
                                    sparkArray.push(new Spark(shipData.x, shipData.y, ctx));
                                }

                                takingDmg = true;
                                setTakingDamage(takingDmg);
                                setTimeout(()=>{takingDmg = false; setTakingDamage(takingDmg)}, 200);
                            }
                        } else {
                            let percentage = ((hypotenuse - activationDist) / 50);
                            ctx.strokeStyle = `rgba(255, 67, 101, ${100 - percentage * 100}%)`
                            ctx.lineWidth = 1;
                            ctx.shadowBlur = 0;
                        }
                        ctx.moveTo(particleArray[i].x, particleArray[i].y);
                        setShipHealth(shipData.health);    
                        ctx.lineTo(particleArray[j].x, particleArray[j].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }

        const handleSparks = () => {
            for (let i = 0; i < sparkArray.length; i++) {
                sparkArray[i].update();
                sparkArray[i].draw();
                if (sparkArray[i].size <= 0.2) {
                    sparkArray.splice(i, 1);
                    i--;
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            handleDmg();
            handleParticles();
            handleSparks();
            if (shipData.health >= 0) {
                requestAnimationFrame(animate);
            }
        }

        animate();

        window.addEventListener('resize', ()=>sizeCanvas(canvas));

        return () => {
            window.removeEventListener('resize', ()=>sizeCanvas(canvas))
        }
    }, [shipData.x, shipData.y, activationDist]);

// SHIP HANDLER UEF
    useEffect(() => {
        const shipCanvas = shipRef.current;
        const ctx = shipCanvas.getContext('2d');

        sizeCanvas(shipCanvas);

        const ship = new Ship(shipCanvas.width/2, shipCanvas.height/2, ctx, shipCanvas.width, shipCanvas.height);
        const pickup = new Collectable(shipCanvas.width, shipCanvas.height, ctx, '+100');

        const handleUIText = () => {
            for (let i = 0; i < uitextArray.length; i++) {
                uitextArray[i].update();
                uitextArray[i].draw();
                if (uitextArray[i].getYChange() > 10) {
                    uitextArray.splice(i, 1);
                    i--;
                }
            }
        }

        const handleTrail = () => {
            for (let i = 0; i < trailArray.length; i++) {
                trailArray[i].update();
                trailArray[i].draw();
                if (trailArray[i].size <= 0.2) {
                    trailArray.splice(i, 1);
                    i--;
                }
            }
        }

        const handleStreakTimer = () => {
            let tick = 0.3 + (0.02 * str)
            timer -= tick;

            if (timer <= 0) {
                str = 0;
                setStreak(str);
            }

            setStreakTimer(timer);
            if (timer > 0) {
                ship.setStreak(timer / 100);
            } else {
                ship.setStreak(0);
            }
        }

        const handlePickups = () => {
            let pickup_dx = pickup.getPos().x - shipData.x;
            let pickup_dy = pickup.getPos().y - shipData.y;

            let pickup_hyp = Math.sqrt(pickup_dx*pickup_dx + pickup_dy*pickup_dy);
            if (pickup_hyp < 30) {
                pickup.relocate();
                if (sfxOn()) {
                    let PICKUP_AUDIO = new Audio(require('../audio/pickup.mp3'))
                    PICKUP_AUDIO.play();
                }
                if (timer > 0 || str === 0) {
                    str = str + 1;
                    setStreak(str);
                }
                timer = 100;
                setStreakTimer(timer);

                handleScore(pickup.value, streak);
                if (shipData.health < 80) {
                    shipData.health += 20 + (4 * str);
                    if (shipData.health > 100) {
                        shipData.health = 100
                    }
                } else {
                    shipData.health = 100;
                }
                setShipHealth(shipData.health);     
                setHealthBoost(true);
                setTimeout(()=>{setHealthBoost(false)}, 500);
                if (shipData.health >= HEALTH/3) {
                    setDanger(false);
                }    
            }

            pickup.update();
            pickup.draw();
        }

        const animate = () => {
            ctx.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
            ship.update();
            ship.accelerate(keysPressed);
            ship.handleSprites(keysPressed);
            shipData.x = ship.getPos().x;
            shipData.y = ship.getPos().y;

            for (let i = 0; i < 2; i++) {
                trailArray.push(new Trail(shipData.x, shipData.y, ctx));
            }
            handleTrail();
            handlePickups();
            handleUIText();
            handleStreakTimer();
            ship.draw();
            if (shipData.health >= 0) {
                requestAnimationFrame(animate);
            }
        }

        window.addEventListener('resize', ()=>sizeCanvas(shipCanvas));

        const keysPressed = {};

        const handleScore = (v) => {
            uitextArray.push(new UIText(shipData.x, shipData.y, 100, ctx))
            if (str > 1) {
                v += 50 * str;
                const int = setInterval(()=>{uitextArray.push(new UIText(shipData.x, shipData.y, 'combo', ctx));
                }, 50)
                setTimeout(()=>{clearInterval(int)}, 50 * str);
                setDouble(true);
                setTimeout(()=>{setDouble(false)}, 2000);
            }
            if ((Math.floor((shipData.score + v) / 1000) * 1000) - (Math.floor((shipData.score) / 1000) * 1000) >= 1000) {
                if (sfxOn()) {
                    SELECT_AUDIO.play();
                }
                setMileStone(true);
                setTimeout(()=>{setMileStone(false)}, 1000);
            }
            shipData.score += v;

            props.setScore(shipData.score);
        }

        window.addEventListener('keydown', (e) => {
            // BG_MUSIC.volume = 0.3;
            // BG_MUSIC.play()
            keysPressed[e.key] = true;
        })
        window.addEventListener('keyup', (e) => {
            keysPressed[e.key] = false;
        })

        animate();

    }, [activationDist]);

    return (
        <div className='locked w-full h-full absolute top-0 left-0 cursor-none'>
            <div className='text-white fixed w-screen h-screen left-0 top-0 z-50 p-[2rem] locked'>
                <div id='HEALTH BAR' className='flex flex-col items-start justify-start'>
                    <div className='nbexpanded mb-[0.5rem] text-xl'>ENERGY</div>
                    <div className='flex flex-row space-x-[1rem] w-full justify-start items-center h-[1rem]' style={{transform: 'skew(-10deg, 0deg)'}}>
                        <div className='h-[1rem] w-[50vw] md:w-[20vw] border-[2px] border-white p-[4px] flex flex-row justify-start items-center'>
                            <div className='h-full bg-[white]' style={{width: `${shipHealth/HEALTH * 100}%`, transition: 'ease-out 100ms',
                                boxShadow: takingDamage ? `0 0 5px 5px ${PINK}`: (healthBoost ? `0 0 10px 10px ${YELLOW}` :'none')}}/>
                            <div className='h-full w-[5px] ml-[3px] bg-white' style={{boxShadow: takingDamage ? `0 0 10px 10px white` : 'none'}}/>
                        </div>
                        <div>
                            {
                                danger && 
                                <div className='-mt-[0.8rem]'>
                                    <div className='absolute z-10'>
                                        <img className='object-contain w-[1.5rem] h-[1.5rem]' src={require('../assets/warning.png')} alt='warningicon'/>
                                    </div>
                                    <div className='animate-ping absolute z-0'>
                                        <img className='object-contain w-[1.5rem] h-[1.5rem]' src={require('../assets/warning.png')} alt='warningicon'/>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div id='SCORE' className='flex w-full items-start justify-end md:justify-center absolute top-[2rem] right-[2rem]'>
                    <div className='nbexpanded text-xl'>SCORE:</div>
                    {
                        mileStone
                        ? <div className='nbexpanded text-xl ml-[0.5rem] blink'>{props.score}</div>
                        : <div className='nbexpanded text-xl ml-[0.5rem]'>{props.score}</div>
                    }
                </div>
                <div id='COMBO' className='flex flex-col-reverse md:flex-col fixed bottom-[2rem] md:top-[2rem] right-[2rem] justify-start items-end'>
                    <div className='flex flex-row items-center mb-[1rem]'>
                        <div className='nbexpanded text-xl'>
                            COMBO:
                        </div>
                        <div className='nbexpanded text-sm ml-[0.5rem] mr-[0.2rem]'>x</div>
                        {
                            double ? <div className='nbexpanded text-xl blink'>{streak}</div> : <div className='nbexpanded text-xl'>{streak}</div>
                        }
                    </div>
                </div>
            </div>
            <animated.div className='locked w-full h-full absolute top-0 left-0 z-20 animate-pulse opacity-[25%]' style={screenSpring}/>
            <canvas className='locked w-full h-full absolute z-10 m-auto' ref={shipRef}/>
            <canvas className='locked w-full h-full bg-dark z-0 absolute top-0 left-0' ref={canvasRef}/>
        </div>
     );
}

export default GameCanvas;