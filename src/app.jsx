//try to make 2 separate components
//install globally modules?

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import tickets from '../dist/tickets.json'
var changeCur = 'stub';
var chI = 'stub';

const logoMap = { TK: 'tk.png'};

class App extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return(
            <div>
                <img id='logo' src='logo.png'></img>
                <Filters />
                <div id='tickets-container'>
                    <Ticket logo={logoMap[tickets.tickets[0].carrier]} ticket={tickets.tickets[0]} />
                </div>
            </div>
        );
    }

}


class Filters extends React.Component {
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
                                Все
                            </div>
                        </div>
                        <div>
                            <input name='transform' value='none' type='checkbox' onChange={changeCur} checked={chI} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                Без пересадок
                            </div>
                        </div>
                        <div>
                            <input name='transform' value='1' type='checkbox' onChange={changeCur} checked={chI} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                1 пересадка
                            </div>
                        </div>
                        <div>
                            <input name='transform' value='2' type='checkbox' onChange={changeCur} checked={chI} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                2 пересадки
                            </div>
                        </div>
                        <div>
                            <input name='transform' value='3' type='checkbox' onChange={changeCur} checked={chI} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                3 пересадки
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const Ticket = (props) => {
    const t = props.ticket;
    const price = t.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    const normalizeDate = (date) => {
        date = new Date(date);
        date = date.toLocaleDateString('ru-RU', {weekday: 'short', year: 'numeric', day: 'numeric', month: 'short'});
        return date.slice(4).replace(/\./g, '') + ', ' + date[0].toUpperCase() + date[1];
    }

    const dateDep = normalizeDate(props.ticket.departure_date);
    const dateArr = normalizeDate(props.ticket.arrival_date);

    const stopsMap = [, '1 пересадка', '2 пересадки', '3 пересадки'];

    return (
        <div className='ticket'>
            <div className='price'>
                <div><img src={props.logo} /></div>
                <div><p>Купить<br />за {price}<span>₽</span></p></div>
            </div>
            <div className='route'>
                <div className='time dep'>{t.departure_time}</div>
                <div className='time arr'>{t.arrival_time}</div>
                <div className='place dep'>
                    <p>{t.origin + ', ' + t.origin_name}</p>
                    <p>{dateDep}</p></div>
                <div className='place arr'>
                    <p>{t.destination_name + ', ' + t.destination}</p>
                    <p>{dateArr}</p>
                </div>
                <div className='arrow'>
                    <p>{stopsMap[t.stops]}</p>
                    <div></div>
                    <img src='plane.png' />
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#root'));