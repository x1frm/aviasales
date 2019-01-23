//try to make 2 separate components
//install globally modules?

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

var changeCur = 'stub';
var chI = 'stub';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <div id='filters'>
                    <p>ВАЛЮТА</p>
                    <div id='currency'>
                        <div>
                            <input name='cur' value='rub' type='radio' onChange={changeCur} checked={chI} />
                            <div className='radio'>RUB</div>
                        </div>
                        <div>
                            <input name='cur' value='usd' type='radio' onChange={changeCur} checked={chI} />
                            <div className='radio'>USD</div>
                        </div>
                        <div>
                            <input name='cur' value='eur' type='radio' onChange={changeCur} checked={chI} />
                            <div className='radio'>EUR</div>
                        </div>
                    </div>
                    <p>КОЛИЧЕСТВО ПЕРЕСАДОК</p>
                    <div id='transfer'>
                        <div>
                            <input name='transform' value='all' type='checkbox' onChange={changeCur} checked={chI} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                <span>Все</span>
                                <span className='hover-text'></span>
                            </div>
                        </div>
                        <div>
                            <input name='transform' value='none' type='checkbox' onChange={changeCur} checked={chI} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                <span>Без пересадок</span>
                                <span className='hover-text'></span>
                            </div>
                        </div>
                        <div>
                            <input name='transform' value='1' type='checkbox' onChange={changeCur} checked={chI} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                <span>1 пересадка</span>
                                <span className='hover-text'></span>
                            </div>
                        </div>
                        <div>
                            <input name='transform' value='2' type='checkbox' onChange={changeCur} checked={chI} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                <span>2 пересадки</span>
                                <span className='hover-text'></span>
                            </div>
                        </div>
                        <div>
                            <input name='transform' value='3' type='checkbox' onChange={changeCur} checked={chI} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                <span>3 пересадки</span>
                                <span className='hover-text'></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#root'));