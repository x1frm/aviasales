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
        this.state = {
            currency: 'rub',
            transfers: [true, true, false, false]
        }

        this.filterTransfers = this.filterTransfers.bind(this);
    }

    changeCur(e) {
        this.setState({
            currency: e.target.value
        });
    }

    filterTransfers(e) {
        const val = e.target.value;
        switch(val) {
            case '0':
            case '1':
            case '2':
            case '3':
                var transfers = [...this.state.transfers];
                transfers[val] = !transfers[val];
                this.setState({transfers});
                break;
            case 'all':
                this.setState(prevState => ({
                    transfers: prevState.transfers.fill(!prevState.transfers.every(el => el))
                }));
                break;
        }
    }

    render() {
        const filteredTickets = tickets.tickets
            .filter(el => this.state.transfers[el.stops])
            .map(el => <Ticket ticket={el} logo={logoMap[el.carrier]} />);

        return(
            <div>
                <img id='logo' src='logo.png'></img>
                <Filters cur={this.changeCur} transfers={this.state.transfers} transChange={this.filterTransfers} />
                <div id='tickets-container'>
                    {filteredTickets}
                </div>
            </div>
        );
    }

}


const Filters = (props) => {
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
                            <input name='transfers' value='all' type='checkbox' onChange={props.transChange} checked={props.transfers.every(el => el)} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                Все
                            </div>
                        </div>
                        <div>
                            <input name='transfers' value='0' type='checkbox' onChange={props.transChange} checked={props.transfers[0]} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                Без пересадок
                            </div>
                        </div>
                        <div>
                            <input name='transfers' value='1' type='checkbox' onChange={props.transChange} checked={props.transfers[1]} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                1 пересадка
                            </div>
                        </div>
                        <div>
                            <input name='transfers' value='2' type='checkbox' onChange={props.transChange} checked={props.transfers[2]} />
                            <div className='checkbox-layer'>
                                <div className='checkbox'><img src='Rectangle 32.svg' /></div>
                                2 пересадки
                            </div>
                        </div>
                        <div>
                            <input name='transfers' value='3' type='checkbox' onChange={props.transChange} checked={props.transfers[3]} />
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

const Ticket = (props) => {
    const t = props.ticket;
    const price = t.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    const normalizeDate = (date) => {
        date = new Date(date);
        date = date.toLocaleDateString('ru-RU', {weekday: 'short', year: 'numeric', day: 'numeric', month: 'short'});
        return date.slice(4).replace(/\./g, '') + ', ' + date[0].toUpperCase() + date[1];
    }

    const dateDep = normalizeDate(t.departure_date);
    const dateArr = normalizeDate(t.arrival_date);

    const normalizeTime = (time) => {
        time = new Date('01.01.2019 ' + time);
        return time.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
    }

    const timeDep = normalizeTime(t.departure_time);
    const timeArr = normalizeTime(t.arrival_time);

    const stopsMap = [, '1 ПЕРЕСАДКА', '2 ПЕРЕСАДКИ', '3 ПЕРЕСАДКИ'];

    return (
        <div className='ticket'>
            <div className='price'>
                <div><img src={props.logo} /></div>
                <div><p>Купить<br />за {price}<span>₽</span></p></div>
            </div>
            <div className='route'>
                <div className='time dep'>{timeDep}</div>
                <div className='time arr'>{timeArr}</div>
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