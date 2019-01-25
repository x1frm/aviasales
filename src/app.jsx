import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const logoMap = { TK: 'tk.png', BA: 'ba.png', S7: 's7.png', SU: 'su.png' };
const curMap = { RUB: '₽', USD: '$', EUR: '€' };

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: [1, '₽'],
            transfers: [true, true, false, false]
        }

        this.tickets = [];

        this.changeCur = this.changeCur.bind(this);
        this.filterTransfers = this.filterTransfers.bind(this);
    }

    componentWillMount() {
        const _this = this;
        var request = new XMLHttpRequest();
        request.open('GET', 'tickets.json');
        request.responseType = 'json';
        request.onload = function() {
            _this.tickets = request.response.tickets;
            _this.forceUpdate();
        };
        request.send();
    }

    componentDidMount() {
        var filters = document.getElementById('filters-container');
        document.getElementById('filters-shower').addEventListener('click', function() {
            filters.classList.toggle('showed');
        });
    }

    changeCur(e) {
        const val = e.target.value.toUpperCase();

        if (val === 'RUB') {
            this.setState({currency: [1, '₽']});
            return;
        }

        const _this = this;
        var request = new XMLHttpRequest();
        request.open('GET', `https://api.exchangeratesapi.io/latest?base=RUB&symbols=${val}`);
        request.responseType = 'json';
        request.onload = function() {
            _this.setState({ currency: [request.response.rates[val], _this.props.curMap[val]] });        
        };
        request.send();        
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
        const filteredTickets = this.tickets
            .filter(el => this.state.transfers[el.stops])
            .sort((a,b) => a.price - b.price)
            .map((el,idx) => 
                <Ticket key={'ticket' + idx} ticket={el} logo={'img/' + this.props.logoMap[el.carrier]} 
                curInfo={this.state.currency} />);

        return (
            <div>
                <Filters changeCur={this.changeCur} transfers={this.state.transfers} changeTransfers={this.filterTransfers} />
                <div id='tickets-container'>
                    {filteredTickets}
                </div>
            </div>
        );
    }

}


const Filters = (props) => (
    <div id='filters-container'>
        <div id='filters'>
            <p>ВАЛЮТА</p>
            <div id='currency'>
                <div>
                    <input name='cur' value='rub' type='radio' onChange={props.changeCur} defaultChecked />
                    <div className='radio'>RUB</div>
                </div>
                <div>
                    <input name='cur' value='usd' type='radio' onChange={props.changeCur}  />
                    <div className='radio'>USD</div>
                </div>
                <div>
                    <input name='cur' value='eur' type='radio' onChange={props.changeCur}  />
                    <div className='radio'>EUR</div>
                </div>
            </div>
            <p>КОЛИЧЕСТВО ПЕРЕСАДОК</p>
            <div id='transfer'>
                <div>
                    <input name='transfers' value='all' type='checkbox' onChange={props.changeTransfers} checked={props.transfers.every(el => el)} />
                    <div className='checkbox-layer'>
                        <div className='checkbox'><img src='img/Rectangle 32.svg' /></div>
                        Все
                    </div>
                </div>
                <div>
                    <input name='transfers' value='0' type='checkbox' onChange={props.changeTransfers} checked={props.transfers[0]} />
                    <div className='checkbox-layer'>
                        <div className='checkbox'><img src='img/Rectangle 32.svg' /></div>
                        Без пересадок
                    </div>
                </div>
                <div>
                    <input name='transfers' value='1' type='checkbox' onChange={props.changeTransfers} checked={props.transfers[1]} />
                    <div className='checkbox-layer'>
                        <div className='checkbox'><img src='img/Rectangle 32.svg' /></div>
                        1 пересадка
                    </div>
                </div>
                <div>
                    <input name='transfers' value='2' type='checkbox' onChange={props.changeTransfers} checked={props.transfers[2]} />
                    <div className='checkbox-layer'>
                        <div className='checkbox'><img src='img/Rectangle 32.svg' /></div>
                        2 пересадки
                    </div>
                </div>
                <div>
                    <input name='transfers' value='3' type='checkbox' onChange={props.changeTransfers} checked={props.transfers[3]} />
                    <div className='checkbox-layer'>
                        <div className='checkbox'><img src='img/Rectangle 32.svg' /></div>
                        3 пересадки
                    </div>
                </div>
            </div>
        </div>
    </div>
);


const Ticket = (props) => {
    const t = props.ticket;
    var price = Math.round(t.price * props.curInfo[0]);
    price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    const normalizeDate = (date) => {
        date = date.split('.').map(el => Number(el));
        date = new Date(date[2] + 2000, date[1] - 1, date[0]);
        date = date.toLocaleDateString('ru-RU', {weekday: 'short', year: 'numeric', day: 'numeric', month: 'short'});
        return date.slice(4).replace(/\.| г/g, '') + ', ' + date[0].toUpperCase() + date[1];
    }

    const dateDep = normalizeDate(t.departure_date);
    const dateArr = normalizeDate(t.arrival_date);

    const normalizeTime = (time) => {
        return time.length === 4 ? '0' + time : time
    }

    const timeDep = normalizeTime(t.departure_time);
    const timeArr = normalizeTime(t.arrival_time);

    const stopsMap = [, '1 ПЕРЕСАДКА', '2 ПЕРЕСАДКИ', '3 ПЕРЕСАДКИ'];

    return (
        <div className='ticket'>
            <div className='price'>
                <div><img src={props.logo} /></div>
                <div><p>Купить<br />за {price}<span>{props.curInfo[1]}</span></p></div>
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
                    <img src='img/plane.png' />
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App logoMap={logoMap} curMap={curMap} />, 
    document.querySelector('#root'));