import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ZingTouch from 'zingtouch';

const logoMap = { TK: 'tk.png', BA: 'ba.png', S7: 's7.png', SU: 'su.png' };
const curMap = { 
    RUB: {
        rate: 1,
        symbol: '₽'
    },
    USD: {
        rate: 1/66, 
        symbol: '$'
    }, 
    EUR: {
        rate: 1/77, 
        symbol: '€'
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: 'RUB',
            transfers: [true, true, false, false]
        }

        this.tickets = [];

        this.curInfo = { rate: 1 }

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

        var touchReg = new ZingTouch.Region(document.getElementById('root'), false, false);
        touchReg.bind(filters, 'swipe', function(e) {
            var direction = e.detail.data[0].currentDirection;
            if (direction < 210 && direction > 150) {
                filters.classList.remove('showed');
            }
        });
        touchReg.bind(document.getElementById('touch-region'), 'swipe', function(e) {
            var direction = e.detail.data[0].currentDirection;
            if (direction > 330 || direction < 30) {
                filters.classList.add('showed');
            }
        });
    }

    changeCur(e) {
        const val = e.target.value;

        if (val === 'RUB') {
            this.curInfo.rate = 1;
            this.setState({ currency: 'RUB' });
            return;
        }

        const _this = this;

        var request = new XMLHttpRequest();
        request.open('GET', `https://api.exchangeratesapi.io/latest?base=RUB&symbols=${val}`);
        request.responseType = 'json';
        request.timeout = 3000;
    
        request.onload = function() {
            _this.curInfo.rate = request.response.rates[val];
            _this.setState({ currency: val });
            console.log('loaded');  
        };

        request.ontimeout = function() {
            _this.curInfo.rate = _this.props.curMap[val].rate;
            _this.setState({ currency: val });
            console.log(`XRates weren't received. Defaults are used`);
        }

        request.send();
        console.log('loading xRates...');
    }

    filterTransfers(e) {
        const isOnly = e.target.nodeName === 'SPAN';
        const val = isOnly ? e.target.getAttribute('data-value') : e.target.value;
        switch(val) {
            case '0':
            case '1':
            case '2':
            case '3':
                var transfers = [...this.state.transfers];
                isOnly ? transfers.fill(false) : true;
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
        this.curInfo.symbol = this.props.curMap[this.state.currency].symbol;

        const filteredTickets = this.tickets
            .filter(el => this.state.transfers[el.stops])
            .sort((a,b) => a.price - b.price)
            .map((el,idx) => 
                <Ticket key={'ticket' + idx} ticket={el} logo={'img/' + this.props.logoMap[el.carrier]} 
                curInfo={this.curInfo} />);

        return (
            <div>
                <div id='touch-region'>
                    <Filters currency={this.state.currency} changeCur={this.changeCur} 
                        transfers={this.state.transfers} changeTransfers={this.filterTransfers} />
                </div>
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
                    <input name='cur' value='RUB' type='radio' onChange={props.changeCur} checked={props.currency === 'RUB'} />
                    <div className='radio'>RUB</div>
                </div>
                <div>
                    <input name='cur' value='USD' type='radio' onChange={props.changeCur} checked={props.currency === 'USD'} />
                    <div className='radio'>USD</div>
                </div>
                <div>
                    <input name='cur' value='EUR' type='radio' onChange={props.changeCur} checked={props.currency === 'EUR'} />
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
                        <span data-value='0' onClick={props.changeTransfers}></span>
                    </div>
                </div>
                <div>
                    <input name='transfers' value='1' type='checkbox' onChange={props.changeTransfers} checked={props.transfers[1]} />
                    <div className='checkbox-layer'>
                        <div className='checkbox'><img src='img/Rectangle 32.svg' /></div>
                        1 пересадка
                        <span data-value='1' onClick={props.changeTransfers}></span>
                    </div>
                </div>
                <div>
                    <input name='transfers' value='2' type='checkbox' onChange={props.changeTransfers} checked={props.transfers[2]} />
                    <div className='checkbox-layer'>
                        <div className='checkbox'><img src='img/Rectangle 32.svg' /></div>
                        2 пересадки
                        <span data-value='2' onClick={props.changeTransfers}></span>
                    </div>
                </div>
                <div>
                    <input name='transfers' value='3' type='checkbox' onChange={props.changeTransfers} checked={props.transfers[3]} />
                    <div className='checkbox-layer'>
                        <div className='checkbox'><img src='img/Rectangle 32.svg' /></div>
                        3 пересадки
                        <span data-value='3' onClick={props.changeTransfers}></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


const Ticket = (props) => {
    const t = props.ticket;
    var price = Math.round(t.price * props.curInfo.rate);
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
                <div><p>Купить<br />за {price}<span>{props.curInfo.symbol}</span></p></div>
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