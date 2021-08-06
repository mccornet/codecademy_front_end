// solution to Animal Fun Facts

import { animals } from './animals';
import React from 'react'
import ReactDOM from 'react-dom'

const showBackground = true;

const displayFact = (e) => {
    const nameClicked = e.target.alt;
    const animalInfo = animals[nameClicked];
    const optionIndex = Math.floor(Math.random() * animalInfo.facts.length);
    const fact = animalInfo.facts[optionIndex];
    document.getElementById('fact').innerHTML = fact;
};

const title = "";
const background = <img className="background" alt="ocean" src="/images/ocean.jpg" />
const images = [];
for (const a in animals) {
    images.push(
        <img
            key={a}
            className='animal'
            alt={a}
            src={animals[a].image}
            aria-label={a}
            role='button'
            onClick={displayFact} />
    );
};

const content = (
<div>
    <h1>{ title === "" ? 'Click an animal for a fun fact' : title}</h1>
    <p id='fact'></p>
    {showBackground && background}
    <div className='animals'>{images}</div>
</div>
);


ReactDOM.render(content, document.getElementById('root'));